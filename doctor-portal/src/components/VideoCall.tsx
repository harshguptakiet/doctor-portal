import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  StopCircle,
  Send,
  Paperclip,
  Smile,
  Play,
  Download,
  File,
  Eye
} from 'lucide-react';
import webRTCService from '../services/webrtc';
import chatService, { type ChatMessage } from '../services/chatService';
import type { CallSession, CallParticipant, MediaControls } from '../services/webrtc';

interface VideoCallProps {
  callSession: CallSession;
  localParticipant: CallParticipant;
  remoteParticipant: CallParticipant;
  onCallEnd: (session: CallSession) => void;
  onToggleChat?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}


const VideoCall: React.FC<VideoCallProps> = ({
  callSession,
  localParticipant,
  remoteParticipant,
  onCallEnd,
  onToggleChat,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [callStatus, setCallStatus] = useState<CallSession['status']>('initiating');
  const [callDuration, setCallDuration] = useState('00:00');
  const [mediaControls, setMediaControls] = useState<MediaControls>({ video: true, audio: true, screen: false });
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingTime, setVoiceRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Call timer effect
  useEffect(() => {
    if (callStatus === 'connected' && callSession.startTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - callSession.startTime!.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        setCallDuration(`${minutes}:${seconds}`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callStatus, callSession.startTime]);

  // Firebase chat integration
  useEffect(() => {
    let unsubscribeChat: (() => void) | null = null;
    
    const setupChat = async () => {
      try {
        // Setup Firebase chat listener
        unsubscribeChat = chatService.listenToChatMessages(
          callSession.id,
          (messages) => {
            setChatMessages(messages);
            
            // Count unread messages if chat is closed
            if (!showChat) {
              const unreadCount = messages.filter(
                msg => msg.senderId !== localParticipant.id && msg.status !== 'read'
              ).length;
              setUnreadMessages(unreadCount);
            }
          }
        );

        // Send system message when call starts
        if (callStatus === 'connected') {
          await chatService.sendSystemMessage(
            callSession.id,
            'call_started',
            `Call started between Dr. ${localParticipant.name} and ${remoteParticipant.name}`
          );
        }
      } catch (error) {
        console.warn('Firebase chat setup failed, chat will work via WebRTC only:', error);
      }
    };
    
    setupChat();

    return () => {
      if (unsubscribeChat) {
        unsubscribeChat();
      }
    };
  }, [callSession.id, localParticipant.id, localParticipant.name, remoteParticipant.name, showChat, callStatus]);

  // Setup WebRTC service event listeners
  useEffect(() => {
    webRTCService.onRemoteStream((stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    webRTCService.onCallStatusChange((status) => {
      setCallStatus(status);
    });

    // Setup local video stream
    const setupLocalVideo = async () => {
      try {
        const stream = webRTCService.localMediaStream;
        if (stream && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error setting up local video:', error);
      }
    };

    setupLocalVideo();

    return () => {
      // Cleanup is handled by the WebRTC service
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingVoice]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleToggleVideo = async () => {
    try {
      const enabled = await webRTCService.toggleVideo();
      setMediaControls(prev => ({ ...prev, video: enabled }));
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const handleToggleAudio = async () => {
    try {
      const enabled = await webRTCService.toggleAudio();
      setMediaControls(prev => ({ ...prev, audio: enabled }));
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const handleToggleScreenShare = async () => {
    try {
      if (mediaControls.screen) {
        await webRTCService.stopScreenShare();
        setMediaControls(prev => ({ ...prev, screen: false }));
      } else {
        const stream = await webRTCService.startScreenShare();
        if (stream) {
          setMediaControls(prev => ({ ...prev, screen: true }));
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const handleEndCall = async () => {
    const confirmed = window.confirm('Are you sure you want to end this call?');
    if (confirmed) {
      try {
        await webRTCService.endCall();
        onCallEnd(callSession);
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) {
      setUnreadMessages(0);
    }
    onToggleChat?.();
  };

  // Firebase chat handlers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isUploading) {
      try {
        // Use fallback WebRTC if Firebase fails
        try {
          await chatService.sendTextMessage(
            callSession.id,
            localParticipant.id,
            localParticipant.name,
            'doctor',
            newMessage.trim()
          );
          console.log('✅ Message sent via Firebase');
        } catch (firebaseError) {
          console.warn('Firebase chat failed, using WebRTC fallback:', firebaseError);
          // Fallback to WebRTC data channel
          webRTCService.sendDataMessage({
            type: 'chat',
            text: newMessage.trim()
          });
          
          // Add message to local state for immediate display
          const message: ChatMessage = {
            id: `msg_${Date.now()}`,
            callSessionId: callSession.id,
            senderId: localParticipant.id,
            senderName: localParticipant.name,
            senderRole: 'doctor',
            message: newMessage.trim(),
            timestamp: new Date(),
            type: 'text',
            status: 'sent'
          };
          setChatMessages(prev => [...prev, message]);
        }
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        // Don't show alert to prevent screen blanking, just log error
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isUploading) return;

    setIsUploading(true);
    console.log('📤 Starting file upload:', file.name, file.size);
    
    try {
      // Check if file is reasonable size first
      if (file.size > 10 * 1024 * 1024) {
        console.error('❌ File too large:', file.size);
        alert('File size exceeds 10MB limit');
        return;
      }

      console.log('📤 Calling chatService.sendFileMessage...');
      const messageId = await chatService.sendFileMessage(
        callSession.id,
        localParticipant.id,
        localParticipant.name,
        'doctor',
        file
      );
      console.log('✅ File uploaded successfully, messageId:', messageId);
      
      // Show success feedback
      const successMessage = `✅ File "${file.name}" uploaded successfully`;
      console.log(successMessage);
      
    } catch (error: any) {
      console.error('❌ Error uploading file:', error);
      
      // Show user-friendly error message
      let errorMessage = 'File upload failed';
      if (error.message?.includes('Firebase Storage not available')) {
        errorMessage = 'File upload failed - Firebase Storage not configured';
      } else if (error.message?.includes('File size exceeds')) {
        errorMessage = error.message;
      }
      
      // Fallback: Show file name in chat as text message
      try {
        const fallbackMessage = `📎 File: ${file.name} (${(file.size / 1024).toFixed(1)}KB) - ${errorMessage}`;
        await chatService.sendTextMessage(
          callSession.id,
          localParticipant.id,
          localParticipant.name,
          'doctor',
          fallbackMessage
        );
        console.log('📤 Sent fallback message for failed upload');
      } catch (fallbackError) {
        console.error('❌ Fallback message also failed:', fallbackError);
        alert(`File upload failed: ${errorMessage}`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      console.log('📤 File upload process completed');
    }
  };

  const handleStartVoiceRecording = async () => {
    if (isRecordingVoice) return;

    try {
      await chatService.startVoiceRecording();
      setIsRecordingVoice(true);
      setVoiceRecordingTime(0);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      // Don't show alert, just log error
    }
  };

  const handleStopVoiceRecording = async () => {
    if (!isRecordingVoice) return;

    try {
      setIsRecordingVoice(false);
      console.log('🎤 Stopping voice recording...');
      
      const voiceBlob = await chatService.stopVoiceRecording();
      const duration = voiceRecordingTime;
      console.log('🎤 Voice recording stopped, blob size:', voiceBlob.size, 'duration:', duration);
      
      const messageId = await chatService.sendVoiceMessage(
        callSession.id,
        localParticipant.id,
        localParticipant.name,
        'doctor',
        voiceBlob,
        duration
      );
      
      setVoiceRecordingTime(0);
      console.log('✅ Voice message sent successfully, messageId:', messageId);
    } catch (error: any) {
      console.error('❌ Error sending voice message:', error);
      setVoiceRecordingTime(0);
      
      // Send fallback text message
      try {
        const fallbackMessage = `🎤 Voice message recording failed: ${error.message || 'Unknown error'}`;
        await chatService.sendTextMessage(
          callSession.id,
          localParticipant.id,
          localParticipant.name,
          'doctor',
          fallbackMessage
        );
        console.log('🎤 Sent voice recording failure message');
      } catch (fallbackError) {
        console.error('❌ Fallback voice message also failed:', fallbackError);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !isMuted;
    }
  };

  const getStatusIndicator = () => {
    switch (callStatus) {
      case 'initiating':
        return { color: 'bg-yellow-500', text: 'Initiating...' };
      case 'ringing':
        return { color: 'bg-blue-500', text: 'Ringing...' };
      case 'connected':
        return { color: 'bg-green-500', text: 'Connected' };
      case 'ended':
        return { color: 'bg-gray-500', text: 'Call Ended' };
      default:
        return { color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  const statusIndicator = getStatusIndicator();

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex" onMouseMove={handleMouseMove}>
      {/* Main Video Area */}
      <div className={`${showChat ? 'flex-1' : 'w-full'} relative overflow-hidden transition-all duration-300`}>
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
        
        {/* Remote participant overlay when video is off */}
        {!remoteVideoRef.current?.srcObject && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-6xl mb-6 mx-auto">
                {remoteParticipant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-4xl font-semibold text-white mb-3">{remoteParticipant.name}</h3>
              <p className="text-white/80 text-xl">Camera is off</p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-56 h-42 rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-800 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!mediaControls.video && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                  {localParticipant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-white text-sm">You</p>
              </div>
            </div>
          )}
        </div>

        {/* Call Info Overlay */}
        <div className={`absolute top-4 left-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-3">
            <div className={`w-3 h-3 ${statusIndicator.color} rounded-full animate-pulse`}></div>
            <div className="text-white">
              <div className="font-semibold">{remoteParticipant.name}</div>
              <div className="text-sm opacity-80">{statusIndicator.text} • {callDuration}</div>
            </div>
          </div>
        </div>

        {/* Connection Quality Indicator */}
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2 text-white text-sm">
              <div className={`w-2 h-2 rounded-full ${
                connectionQuality === 'excellent' ? 'bg-green-400' :
                connectionQuality === 'good' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="capitalize">{connectionQuality}</span>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className={`absolute top-52 right-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-2">
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 accent-blue-500"
            />
          </div>
        </div>

        {/* Call Controls */}
        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-4 flex items-center space-x-4">
            {/* Microphone */}
            <button
              onClick={handleToggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                mediaControls.audio 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
              title={mediaControls.audio ? 'Mute microphone' : 'Unmute microphone'}
            >
              {mediaControls.audio ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Video */}
            <button
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                mediaControls.video 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
              title={mediaControls.video ? 'Turn off camera' : 'Turn on camera'}
            >
              {mediaControls.video ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Screen Share */}
            <button
              onClick={handleToggleScreenShare}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                mediaControls.screen 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title={mediaControls.screen ? 'Stop screen sharing' : 'Start screen sharing'}
            >
              {mediaControls.screen ? <MonitorOff size={20} /> : <Monitor size={20} />}
            </button>

            {/* Chat */}
            <button
              onClick={handleToggleChat}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                showChat 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Toggle chat"
            >
              <MessageSquare size={20} />
              {unreadMessages > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </div>
              )}
            </button>

            {/* Fullscreen Toggle */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            )}

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
              title="End call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Close Button (for fullscreen) */}
        {isFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className={`absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all ${showControls ? 'opacity-100' : 'opacity-0'}`}
            title="Close fullscreen"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Right Sidebar - Chat & Info */}
      {showChat && (
        <div className="w-96 h-full bg-white border-l border-gray-200 flex flex-col shadow-xl">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {remoteParticipant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{remoteParticipant.name}</h3>
                <p className="text-sm text-gray-500">Patient Consultation</p>
              </div>
            </div>
            <button
              onClick={handleToggleChat}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              title="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              <button className="flex-1 px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-white">
                Chat
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Notes
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Files
              </button>
            </nav>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs text-gray-400">Start a conversation with {remoteParticipant.name}</p>
              </div>
            ) : (
              chatMessages.map((message) => {
                const isOwnMessage = message.senderId === localParticipant.id;
                let messageTime: Date;
                try {
                  if (message.timestamp instanceof Date) {
                    messageTime = message.timestamp;
                  } else if (message.timestamp?.toDate) {
                    messageTime = message.timestamp.toDate();
                  } else {
                    messageTime = new Date();
                  }
                } catch (error) {
                  console.warn('Error parsing message timestamp:', error);
                  messageTime = new Date();
                }

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'system' ? (
                      <div className="w-full text-center">
                        <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded-full inline-block">
                          {message.message}
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-xs ${isOwnMessage ? 'ml-12' : 'mr-12'}`}>
                        <div
                          className={`px-4 py-2 rounded-lg shadow-sm ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                          }`}
                        >
                          {/* Message content based on type */}
                          {message.type === 'text' && (
                            <div className="text-sm">{message.message}</div>
                          )}
                          
                          {message.type === 'image' && (
                            <div className="space-y-2">
                              {message.message && (
                                <div className="text-sm">{message.message}</div>
                              )}
                              <div className="relative group">
                                <img 
                                  src={message.fileUrl} 
                                  alt={message.fileName}
                                  className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition"
                                  onClick={() => window.open(message.fileUrl, '_blank')}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition rounded flex items-center justify-center">
                                  <Eye className="text-white opacity-0 group-hover:opacity-100 transition" size={20} />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {message.type === 'file' && (
                            <div className="space-y-2">
                              {message.message && (
                                <div className="text-sm">{message.message}</div>
                              )}
                              <div className="flex items-center space-x-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <File size={16} className="text-gray-500" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">{message.fileName}</p>
                                  <p className="text-xs text-gray-500">
                                    {chatService.formatFileSize(message.fileSize || 0)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => window.open(message.fileUrl, '_blank')}
                                  className="text-blue-600 hover:text-blue-800 transition"
                                >
                                  <Download size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {message.type === 'voice' && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <button className="text-blue-600 hover:text-blue-800 transition">
                                  <Play size={16} />
                                </button>
                                <div className="flex-1">
                                  <div className="h-1 bg-gray-300 rounded overflow-hidden">
                                    <div className="h-full bg-blue-600 w-0" />
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {chatService.formatVoiceDuration(message.voiceDuration || 0)}
                                </span>
                              </div>
                              <audio src={message.fileUrl} className="hidden" />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-1">
                            <div
                              className={`text-xs ${
                                isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                              }`}
                            >
                              {messageTime.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {isOwnMessage && (
                              <div className={`text-xs ${
                                message.status === 'read' ? 'text-blue-200' : 
                                message.status === 'delivered' ? 'text-blue-300' : 'text-blue-400'
                              }`}>
                                {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : '○'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-sm text-blue-700">Uploading file...</span>
                </div>
              </div>
            )}

            {/* Voice Recording Indicator */}
            {isRecordingVoice && (
              <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm text-red-700">Recording voice message...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-600 font-mono">
                      {Math.floor(voiceRecordingTime / 60)}:{(voiceRecordingTime % 60).toString().padStart(2, '0')}
                    </span>
                    <button
                      onClick={handleStopVoiceRecording}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                      <StopCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2">Quick actions:</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
                  Send prescription
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
                  Schedule follow-up
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isRecordingVoice ? "Recording voice message..." : "Type your message..."}
                  disabled={isRecordingVoice || isUploading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isRecordingVoice || isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm flex items-center space-x-1"
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isRecordingVoice || isUploading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Attach file (images, PDFs, documents)"
                  >
                    <Paperclip size={16} />
                  </button>
                  
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    title="Send emoji"
                  >
                    <Smile size={16} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={isRecordingVoice ? handleStopVoiceRecording : handleStartVoiceRecording}
                    disabled={isUploading}
                    className={`p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRecordingVoice 
                        ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isRecordingVoice ? 'Stop recording' : 'Record voice message'}
                  >
                    {isRecordingVoice ? <StopCircle size={16} /> : <Mic size={16} />}
                  </button>
                </div>
                
                <div className="text-xs text-gray-400">
                  {isRecordingVoice ? 'Click stop to send' : 'Press Enter to send'}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
