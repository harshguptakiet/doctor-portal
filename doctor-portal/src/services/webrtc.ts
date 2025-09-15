import io, { Socket } from 'socket.io-client';

export interface CallParticipant {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  phone?: string;
}

export interface CallSession {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentId?: string;
  status: 'initiating' | 'ringing' | 'connected' | 'ended';
  startTime?: Date;
  endTime?: Date;
}

export interface MediaControls {
  video: boolean;
  audio: boolean;
  screen: boolean;
}

class WebRTCService {
  private socket: Socket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private currentCallSession: CallSession | null = null;
  private mediaControls: MediaControls = { video: true, audio: true, screen: false };
  private dataChannel: RTCDataChannel | null = null;
  
  // Event callbacks
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onCallEndCallback?: (session: CallSession) => void;
  private onCallStatusChangeCallback?: (status: CallSession['status']) => void;
  private onParticipantJoinedCallback?: (participant: CallParticipant) => void;
  private onDataMessageCallback?: (message: any) => void;
  
  // ICE servers configuration
  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Add TURN servers for production
    // { 
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'password'
    // }
  ];

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    // For development, we'll use a local signaling server
    // In production, this should be your deployed signaling server
    this.socket = io('http://localhost:3001', {
      autoConnect: false,
      transports: ['websocket']
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('📡 Connected to signaling server');
    });

    this.socket.on('disconnect', () => {
      console.log('📡 Disconnected from signaling server');
    });

    this.socket.on('call-request', async (data: { from: CallParticipant; callSession: CallSession }) => {
      console.log('📞 Incoming call from:', data.from);
      this.currentCallSession = data.callSession;
      this.onCallStatusChangeCallback?.('ringing');
      
      // Auto-answer for now (in production, you'd show a UI to accept/decline)
      await this.answerCall();
    });

    this.socket.on('call-answer', async (data: { answer: RTCSessionDescriptionInit }) => {
      console.log('✅ Call answered, processing answer');
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    this.socket.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit }) => {
      console.log('🧊 Received ICE candidate');
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    this.socket.on('call-ended', (data: { callSession: CallSession }) => {
      console.log('📞 Call ended by remote peer');
      this.handleCallEnd(data.callSession);
    });

    this.socket.on('participant-joined', (data: { participant: CallParticipant }) => {
      console.log('👤 Participant joined:', data.participant);
      this.onParticipantJoinedCallback?.(data.participant);
    });

    this.socket.on('data-message', (data: { message: any; from: string }) => {
      console.log('💬 Received data message from', data.from, ':', data.message);
      this.onDataMessageCallback?.(data.message);
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
    });
  }

  private async createPeerConnection(): Promise<RTCPeerConnection> {
    if (this.peerConnection) {
      this.peerConnection.close();
    }

    this.peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers
    });

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket && this.currentCallSession) {
        this.socket.emit('ice-candidate', {
          candidate: event.candidate,
          callSessionId: this.currentCallSession.id
        });
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('🎥 Received remote stream');
      this.remoteStream = event.streams[0];
      this.onRemoteStreamCallback?.(this.remoteStream);
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('🔗 Connection state:', this.peerConnection?.connectionState);
      
      if (this.peerConnection?.connectionState === 'connected') {
        this.onCallStatusChangeCallback?.('connected');
        if (this.currentCallSession) {
          this.currentCallSession.status = 'connected';
          this.currentCallSession.startTime = new Date();
        }
      } else if (this.peerConnection?.connectionState === 'disconnected' || 
                 this.peerConnection?.connectionState === 'failed') {
        this.endCall();
      }
    };

    // Create data channel for chat/file sharing
    this.dataChannel = this.peerConnection.createDataChannel('chat', {
      ordered: true
    });

    this.dataChannel.onopen = () => {
      console.log('💬 Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.onDataMessageCallback?.(message);
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    // Handle incoming data channels
    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.onDataMessageCallback?.(message);
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      };
    };

    return this.peerConnection;
  }

  async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('🎥 Got local media stream');
      return this.localStream;
    } catch (error) {
      console.error('❌ Error getting user media:', error);
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  }

  async getDisplayMedia(): Promise<MediaStream> {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      console.log('🖥️ Got screen share stream');
      return displayStream;
    } catch (error) {
      console.error('❌ Error getting display media:', error);
      throw new Error('Failed to access screen sharing. Please check permissions.');
    }
  }

  async initiateCall(
    doctor: CallParticipant, 
    patient: CallParticipant, 
    appointmentId?: string
  ): Promise<CallSession> {
    console.log('📞 Starting call initiation:', { doctor: doctor.name, patient: patient.name });
    
    if (!this.socket) {
      console.error('❌ No socket available');
      throw new Error('Signaling server not connected');
    }

    // Connect to signaling server if not connected
    if (!this.socket.connected) {
      console.log('🔌 Connecting to signaling server...');
      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 5000);
          
          this.socket!.connect();
          this.socket!.on('connect', () => {
            clearTimeout(timeout);
            console.log('✅ Connected to signaling server');
            resolve();
          });
          this.socket!.on('connect_error', (error) => {
            clearTimeout(timeout);
            console.error('❌ Connection error:', error);
            reject(error);
          });
        });
      } catch (error) {
        console.error('❌ Failed to connect to signaling server:', error);
        throw new Error('Failed to connect to signaling server. Please make sure the signaling server is running on port 3001.');
      }
    }

    // Create call session
    const callSession: CallSession = {
      id: `call_${Date.now()}`,
      doctorId: doctor.id,
      patientId: patient.id,
      appointmentId,
      status: 'initiating'
    };

    this.currentCallSession = callSession;

    // Get user media
    await this.getUserMedia();

    // Create peer connection
    await this.createPeerConnection();

    // Add local stream to peer connection
    if (this.localStream && this.peerConnection) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Create offer
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);

    // Send call request through signaling server
    this.socket.emit('call-request', {
      to: patient.id,
      from: doctor,
      callSession,
      offer
    });

    console.log('📞 Call initiated to patient:', patient.name);
    this.onCallStatusChangeCallback?.('ringing');

    return callSession;
  }

  async answerCall(): Promise<void> {
    if (!this.socket || !this.currentCallSession) {
      throw new Error('No active call to answer');
    }

    // Get user media
    await this.getUserMedia();

    // Create peer connection
    await this.createPeerConnection();

    // Add local stream to peer connection
    if (this.localStream && this.peerConnection) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // We should have received the offer through the call-request event
    // In a real implementation, you'd store the offer and use it here
    console.log('✅ Call answered');
    this.onCallStatusChangeCallback?.('connected');
  }

  async endCall(): Promise<void> {
    if (this.currentCallSession) {
      this.currentCallSession.status = 'ended';
      this.currentCallSession.endTime = new Date();

      // Notify other participants
      if (this.socket && this.socket.connected) {
        this.socket.emit('call-ended', {
          callSessionId: this.currentCallSession.id
        });
      }

      this.handleCallEnd(this.currentCallSession);
    }
  }

  private handleCallEnd(session: CallSession): void {
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Clear remote stream
    this.remoteStream = null;

    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    // Reset media controls
    this.mediaControls = { video: true, audio: true, screen: false };

    // Notify callback
    this.onCallEndCallback?.(session);

    // Clear current session
    this.currentCallSession = null;

    console.log('📞 Call ended and cleaned up');
  }

  // Media control methods
  async toggleVideo(): Promise<boolean> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.mediaControls.video = videoTrack.enabled;
        
        // Notify other participants about video toggle
        this.sendDataMessage({
          type: 'media-control',
          control: 'video',
          enabled: videoTrack.enabled
        });
        
        return videoTrack.enabled;
      }
    }
    return false;
  }

  async toggleAudio(): Promise<boolean> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.mediaControls.audio = audioTrack.enabled;
        
        // Notify other participants about audio toggle
        this.sendDataMessage({
          type: 'media-control',
          control: 'audio',
          enabled: audioTrack.enabled
        });
        
        return audioTrack.enabled;
      }
    }
    return false;
  }

  async startScreenShare(): Promise<MediaStream | null> {
    try {
      const displayStream = await this.getDisplayMedia();
      
      if (this.peerConnection && this.localStream) {
        // Replace video track with screen share
        const videoTrack = displayStream.getVideoTracks()[0];
        const sender = this.peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        
        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare();
        };
        
        this.mediaControls.screen = true;
        
        // Notify other participants
        this.sendDataMessage({
          type: 'media-control',
          control: 'screen',
          enabled: true
        });
      }
      
      return displayStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return null;
    }
  }

  async stopScreenShare(): Promise<void> {
    if (this.peerConnection && this.localStream) {
      // Replace screen share track with camera
      const videoTrack = this.localStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }
      
      this.mediaControls.screen = false;
      
      // Notify other participants
      this.sendDataMessage({
        type: 'media-control',
        control: 'screen',
        enabled: false
      });
    }
  }

  sendDataMessage(message: any): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(message));
    } else if (this.socket && this.socket.connected && this.currentCallSession) {
      // Fallback to socket if data channel not available
      this.socket.emit('data-message', {
        message,
        callSessionId: this.currentCallSession.id
      });
    }
  }

  // Getters
  get localMediaStream(): MediaStream | null {
    return this.localStream;
  }

  get remoteMediaStream(): MediaStream | null {
    return this.remoteStream;
  }

  get currentSession(): CallSession | null {
    return this.currentCallSession;
  }

  get controls(): MediaControls {
    return { ...this.mediaControls };
  }

  get isConnected(): boolean {
    return this.peerConnection?.connectionState === 'connected';
  }

  // Event listeners
  onRemoteStream(callback: (stream: MediaStream) => void): void {
    this.onRemoteStreamCallback = callback;
  }

  onCallEnd(callback: (session: CallSession) => void): void {
    this.onCallEndCallback = callback;
  }

  onCallStatusChange(callback: (status: CallSession['status']) => void): void {
    this.onCallStatusChangeCallback = callback;
  }

  onParticipantJoined(callback: (participant: CallParticipant) => void): void {
    this.onParticipantJoinedCallback = callback;
  }

  onDataMessage(callback: (message: any) => void): void {
    this.onDataMessageCallback = callback;
  }

  // Cleanup
  disconnect(): void {
    this.endCall();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Singleton instance
const webRTCService = new WebRTCService();

export default webRTCService;
export { WebRTCService };
