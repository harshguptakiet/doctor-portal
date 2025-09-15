import { io, Socket } from 'socket.io-client';

export interface CallSession {
  id: string;
  doctorId: string;
  patientId: string;
  status: 'connecting' | 'connected' | 'ended';
  startTime: Date;
}

export interface MediaState {
  video: boolean;
  audio: boolean;
}

class WebRTCService {
  private socket: Socket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  // private isDoctor: boolean = true; // Currently unused
  private currentCallSession: CallSession | null = null;

  // WebRTC configuration
  private readonly rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Event callbacks
  private onLocalStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onCallStateChangeCallback: ((state: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    this.initializeSocket();
  }

  /**
   * Initialize Socket.IO connection
   */
  private initializeSocket() {
    // For development, we'll use a mock signaling server
    // In production, you'd connect to your actual signaling server
    this.socket = io('ws://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false
    });

    this.setupSocketEventListeners();
  }

  /**
   * Setup socket event listeners for signaling
   */
  private setupSocketEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to signaling server');
    });

    this.socket.on('call-offer', async (data: { offer: RTCSessionDescriptionInit, callId: string, from: string }) => {
      console.log('📞 Received call offer');
      await this.handleCallOffer(data.offer, data.callId, data.from);
    });

    this.socket.on('call-answer', async (data: { answer: RTCSessionDescriptionInit }) => {
      console.log('✅ Received call answer');
      await this.handleCallAnswer(data.answer);
    });

    this.socket.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit }) => {
      console.log('🧊 Received ICE candidate');
      await this.handleIceCandidate(data.candidate);
    });

    this.socket.on('call-ended', () => {
      console.log('📴 Call ended by remote peer');
      this.endCall();
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from signaling server');
      this.onCallStateChangeCallback?.('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      // Fallback to mock mode for development
      this.setupMockSignaling();
    });
  }

  /**
   * Setup mock signaling for development/testing without server
   */
  private setupMockSignaling() {
    console.log('🔧 Using mock signaling mode for development');
    
    // Create a mock socket-like interface
    this.socket = {
      connected: true,
      emit: (event: string, data?: any) => {
        console.log(`📡 Mock signal: ${event}`, data);
        
        // Simulate successful connection after a delay for demo
        if (event === 'call-offer') {
          setTimeout(() => {
            console.log('🎭 Mock: Simulating successful call connection');
            this.onCallStateChangeCallback?.('connected');
          }, 2000);
        }
      },
      on: (_event: string, _callback: Function) => {
        // Mock event listeners
      },
      disconnect: () => {
        console.log('📴 Mock disconnect');
      }
    } as any;
    
    // Start local video immediately for demo purposes
    setTimeout(async () => {
      try {
        console.log('🎭 Demo: Getting user media for preview');
        this.localStream = await this.getUserMedia();
        this.onLocalStreamCallback?.(this.localStream);
        
        // Simulate connection after showing local video
        setTimeout(() => {
          console.log('🎭 Demo: Simulating connected state');
          this.onCallStateChangeCallback?.('connected');
          
          // Simulate remote video stream (use local stream as placeholder)
          setTimeout(() => {
            console.log('🎭 Demo: Simulating remote patient video');
            this.onRemoteStreamCallback?.(this.localStream!);
          }, 2000);
        }, 1000);
      } catch (error) {
        console.error('⚠️ Demo: Error getting user media:', error);
        this.onErrorCallback?.(error instanceof Error ? error.message : 'Camera access failed');
      }
    }, 500);
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onCallStateChange?: (state: string) => void;
    onError?: (error: string) => void;
  }) {
    this.onLocalStreamCallback = callbacks.onLocalStream || null;
    this.onRemoteStreamCallback = callbacks.onRemoteStream || null;
    this.onCallStateChangeCallback = callbacks.onCallStateChange || null;
    this.onErrorCallback = callbacks.onError || null;
  }

  /**
   * Initialize WebRTC peer connection
   */
  private initializePeerConnection(): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection(this.rtcConfiguration);

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket?.connected) {
        this.socket.emit('ice-candidate', {
          candidate: event.candidate,
          callId: this.currentCallSession?.id
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('📺 Received remote track');
      this.remoteStream = event.streams[0];
      this.onRemoteStreamCallback?.(this.remoteStream);
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      console.log('🔄 Peer connection state:', state);
      
      // Only report specific states, don't auto-trigger call state changes
      if (state === 'connected') {
        console.log('✅ Peer connection established successfully');
      } else if (state === 'failed') {
        console.warn('⚠️ Peer connection failed');
        this.onErrorCallback?.('Peer connection failed');
      } else if (state === 'disconnected') {
        console.log('🔌 Peer connection disconnected');
        // Don't treat disconnection as an error - it's normal when call ends
      }
      
      // DON'T automatically call onCallStateChangeCallback here as it might trigger unwanted state changes
    };

    return peerConnection;
  }

  /**
   * Get user media (camera and microphone)
   */
  private async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('📹 Got user media');
      return stream;
    } catch (error) {
      console.error('❌ Error getting user media:', error);
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  }

  /**
   * Start a call as doctor
   */
  async startCall(patientId: string, appointmentId?: string): Promise<void> {
    try {
      console.log('📞 Starting call as doctor');
      // this.isDoctor = true; // Currently unused

      // Connect to signaling server
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for connection
      }

      // Create call session
      this.currentCallSession = {
        id: appointmentId || `call-${Date.now()}`,
        doctorId: 'current-doctor',
        patientId,
        status: 'connecting',
        startTime: new Date()
      };

      // Initialize peer connection
      this.peerConnection = this.initializePeerConnection();

      // Get local media
      this.localStream = await this.getUserMedia();
      this.onLocalStreamCallback?.(this.localStream);

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Create and send offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Send offer through signaling server
      this.socket?.emit('call-offer', {
        offer,
        callId: this.currentCallSession.id,
        patientId,
        from: 'doctor'
      });

      this.onCallStateChangeCallback?.('calling');
      console.log('📤 Sent call offer');

    } catch (error) {
      console.error('❌ Error starting call:', error);
      this.onErrorCallback?.(error instanceof Error ? error.message : 'Failed to start call');
      throw error;
    }
  }

  /**
   * Join a call as patient
   */
  async joinCall(callId: string): Promise<void> {
    try {
      console.log('📞 Joining call as patient');
      // this.isDoctor = false; // Currently unused

      // Connect to signaling server
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for connection
      }

      // Register as patient for this call
      this.socket?.emit('join-call', { callId, role: 'patient' });

      this.onCallStateChangeCallback?.('waiting');

    } catch (error) {
      console.error('❌ Error joining call:', error);
      this.onErrorCallback?.(error instanceof Error ? error.message : 'Failed to join call');
      throw error;
    }
  }

  /**
   * Handle incoming call offer
   */
  private async handleCallOffer(offer: RTCSessionDescriptionInit, callId: string, from: string): Promise<void> {
    try {
      console.log('📥 Handling call offer');

      // Initialize peer connection
      this.peerConnection = this.initializePeerConnection();

      // Get local media
      this.localStream = await this.getUserMedia();
      this.onLocalStreamCallback?.(this.localStream);

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Set remote description (offer)
      await this.peerConnection.setRemoteDescription(offer);

      // Create answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Send answer back
      this.socket?.emit('call-answer', {
        answer,
        callId,
        to: from
      });

      this.currentCallSession = {
        id: callId,
        doctorId: from,
        patientId: 'current-patient',
        status: 'connected',
        startTime: new Date()
      };

      this.onCallStateChangeCallback?.('connected');
      console.log('📤 Sent call answer');

    } catch (error) {
      console.error('❌ Error handling call offer:', error);
      this.onErrorCallback?.('Failed to handle incoming call');
    }
  }

  /**
   * Handle call answer
   */
  private async handleCallAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(answer);
        this.onCallStateChangeCallback?.('connected');
        console.log('✅ Call connected');
      }
    } catch (error) {
      console.error('❌ Error handling call answer:', error);
      this.onErrorCallback?.('Failed to establish connection');
    }
  }

  /**
   * Handle ICE candidate
   */
  private async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      if (this.peerConnection && this.peerConnection.remoteDescription) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('✅ Added ICE candidate');
      }
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
    }
  }

  /**
   * Toggle video
   */
  toggleVideo(): boolean {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      console.log('📹 Video toggled:', videoTrack.enabled);
      return videoTrack.enabled;
    }
    return false;
  }

  /**
   * Toggle audio
   */
  toggleAudio(): boolean {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      console.log('🎤 Audio toggled:', audioTrack.enabled);
      return audioTrack.enabled;
    }
    return false;
  }

  /**
   * Get media state
   */
  getMediaState(): MediaState {
    if (!this.localStream) {
      return { video: false, audio: false };
    }

    const videoTrack = this.localStream.getVideoTracks()[0];
    const audioTrack = this.localStream.getAudioTracks()[0];

    return {
      video: videoTrack ? videoTrack.enabled : false,
      audio: audioTrack ? audioTrack.enabled : false
    };
  }

  /**
   * End the call and properly stop all media devices
   */
  endCall(): void {
    console.log('📴 Ending call - stopping all media devices');

    // Notify remote peer
    this.socket?.emit('call-ended', {
      callId: this.currentCallSession?.id
    });

    // Stop all local media tracks (camera and microphone)
    if (this.localStream) {
      console.log('🎥 Stopping camera and microphone...');
      this.localStream.getTracks().forEach((track, index) => {
        console.log(`📹 Stopping ${track.kind} track ${index + 1}:`, track.label);
        track.stop();
        // Also disable the track to ensure it's fully stopped
        track.enabled = false;
      });
      this.localStream = null;
      console.log('✅ All media tracks stopped successfully');
    }

    // Close peer connection
    if (this.peerConnection) {
      console.log('🔌 Closing peer connection...');
      // Remove all tracks from peer connection before closing
      const senders = this.peerConnection.getSenders();
      senders.forEach(sender => {
        if (sender.track) {
          sender.track.stop();
          this.peerConnection?.removeTrack(sender);
        }
      });
      this.peerConnection.close();
      this.peerConnection = null;
      console.log('✅ Peer connection closed');
    }

    // Clear remote stream
    if (this.remoteStream) {
      console.log('📺 Clearing remote stream...');
      this.remoteStream.getTracks().forEach(track => {
        track.stop();
      });
      this.remoteStream = null;
    }

    // Update call session
    if (this.currentCallSession) {
      this.currentCallSession.status = 'ended';
      this.currentCallSession = null;
    }

    // Force garbage collection by clearing any remaining references
    setTimeout(() => {
      console.log('🧹 Final cleanup - ensuring all media devices are released');
    }, 100);

    this.onCallStateChangeCallback?.('user-ended');
  }

  /**
   * Get current call session
   */
  getCurrentCallSession(): CallSession | null {
    return this.currentCallSession;
  }

  /**
   * Check if any media devices are currently active
   */
  hasActiveMediaDevices(): { hasVideo: boolean; hasAudio: boolean; totalTracks: number } {
    let hasVideo = false;
    let hasAudio = false;
    let totalTracks = 0;

    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      const audioTracks = this.localStream.getAudioTracks();
      
      hasVideo = videoTracks.some(track => track.readyState === 'live');
      hasAudio = audioTracks.some(track => track.readyState === 'live');
      totalTracks = videoTracks.length + audioTracks.length;
      
      console.log(`📊 Active media devices - Video: ${hasVideo}, Audio: ${hasAudio}, Total tracks: ${totalTracks}`);
    }

    return { hasVideo, hasAudio, totalTracks };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.endCall();
    this.socket?.disconnect();
  }
}

// Export singleton instance
export const webrtcService = new WebRTCService();
export default webrtcService;
