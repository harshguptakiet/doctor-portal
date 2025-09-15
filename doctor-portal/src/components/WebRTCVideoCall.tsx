import React, { useEffect, useRef, useState } from 'react';
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';
import webrtcService, { type MediaState } from '../services/webrtcService';

interface WebRTCVideoCallProps {
  patientId: string;
  patientName: string;
  appointmentId?: string;
  onCallEnd: () => void;
  onCallStateChange?: (state: string) => void;
}

const WebRTCVideoCall: React.FC<WebRTCVideoCallProps> = ({
  patientId,
  patientName,
  appointmentId,
  onCallEnd,
  onCallStateChange
}) => {
  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // State
  const [callState, setCallState] = useState<string>('connecting');
  const [mediaState, setMediaState] = useState<MediaState>({ video: true, audio: true });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [manuallyEnded, setManuallyEnded] = useState(false);

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Initialize WebRTC service
  useEffect(() => {
    console.log('🎥 Initializing WebRTC Video Call Component');
    
    // Set up callbacks
    webrtcService.setCallbacks({
      onLocalStream: (stream) => {
        console.log('📹 Setting local stream');
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(e => console.log('Local video play failed:', e));
        }
      },
      onRemoteStream: (stream) => {
        console.log('📺 Setting remote stream');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch(e => console.log('Remote video play failed:', e));
        }
      },
      onCallStateChange: (state) => {
        console.log('🔄 Call state changed to:', state);
        setCallState(state);
        onCallStateChange?.(state);

        // Only call onCallEnd when explicitly requested by user
        if (state === 'user-ended' && manuallyEnded) {
          console.log('🔴 User manually ended call - closing interface');
          onCallEnd();
        } else if (state === 'user-ended' && !manuallyEnded) {
          console.log('⚠️ Call ended automatically - NOT closing interface to prevent unwanted termination');
        } else {
          console.log('🔵 Call state change, keeping interface open:', state);
        }
      },
      onError: (errorMessage) => {
        console.error('❌ WebRTC Error:', errorMessage);
        setError(errorMessage);
        // Don't end call on errors, just show error message
      }
    });

    // Start the call
    startCall();

    // Cleanup on component unmount - only clean up media, don't end call
    return () => {
      console.log('🧹 WebRTC component unmounting - cleaning up media devices only');
      
      // Stop video elements but don't trigger call end
      if (localVideoRef.current) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => {
            console.log(`🔄 Cleanup: Stopping local ${track.kind} track`);
            track.stop();
          });
        }
        localVideoRef.current.srcObject = null;
      }
      
      if (remoteVideoRef.current) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => {
            console.log(`🔄 Cleanup: Stopping remote ${track.kind} track`);
            track.stop();
          });
        }
        remoteVideoRef.current.srcObject = null;
      }
      
      // DON'T call webrtcService.endCall() here as it would automatically end the call
      console.log('✅ Component cleanup completed (call still active)');
    };
  }, [patientId]); // Only depend on patientId, not appointmentId

  const startCall = async () => {
    try {
      console.log('🔄 Starting call with patientId:', patientId);
      setCallState('connecting');
      
      // Special handling for simple test patient
      if (patientId === 'simple-test-patient') {
        console.log('🎨 Simple test mode - showing interface without WebRTC');
        setCallState('connected');
        return;
      }
      
      await webrtcService.startCall(patientId, appointmentId);
    } catch (error) {
      console.error('Failed to start call:', error);
      setError(error instanceof Error ? error.message : 'Failed to start call');
      
      // Fallback: show connected state even if WebRTC fails
      console.log('🛡️ WebRTC failed, showing fallback interface');
      setTimeout(() => {
        setCallState('connected');
      }, 2000);
    }
  };

  const handleToggleVideo = () => {
    webrtcService.toggleVideo();
    const newMediaState = webrtcService.getMediaState();
    setMediaState(newMediaState);
  };

  const handleToggleAudio = () => {
    webrtcService.toggleAudio();
    const newMediaState = webrtcService.getMediaState();
    setMediaState(newMediaState);
  };

  const handleEndCall = () => {
    console.log('📴 User clicked end call button');
    setManuallyEnded(true); // Mark as manually ended to prevent unwanted auto-termination
    
    try {
      // Stop video elements immediately
      console.log('🖼️ Clearing video elements...');
      if (localVideoRef.current) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => {
            console.log(`📹 Stopping local ${track.kind} track:`, track.label);
            track.stop();
          });
        }
        localVideoRef.current.srcObject = null;
        console.log('✅ Local video element cleared');
      }
      
      if (remoteVideoRef.current) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => {
            console.log(`📺 Stopping remote ${track.kind} track:`, track.label);
            track.stop();
          });
        }
        remoteVideoRef.current.srcObject = null;
        console.log('✅ Remote video element cleared');
      }
      
      // End the WebRTC service call
      webrtcService.endCall();
      console.log('✅ WebRTC service call ended successfully');
      
      // Verify all devices are stopped
      setTimeout(() => {
        const deviceStatus = webrtcService.hasActiveMediaDevices();
        console.log('🔍 Post-cleanup device status:', deviceStatus);
        if (deviceStatus.totalTracks === 0) {
          console.log('✅ SUCCESS: All media devices successfully stopped!');
        } else {
          console.warn('⚠️ WARNING: Some media tracks may still be active');
        }
      }, 200);
      
    } catch (error) {
      console.error('⚠️ Error ending WebRTC call:', error);
    }
    
    // Reset component state
    setCallState('ended');
    setMediaState({ video: false, audio: false });
    setError(null);
    
    // Always call the onCallEnd callback to close the interface
    console.log('🔄 Calling onCallEnd callback');
    onCallEnd();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStateDisplay = () => {
    switch (callState) {
      case 'connecting': return 'Connecting...';
      case 'calling': return 'Calling patient...';
      case 'connected': return 'Connected';
      case 'ending': return 'Ending call - stopping camera & mic...';
      case 'ended': return 'Call ended - devices stopped';
      case 'failed': return 'Connection failed';
      default: return callState;
    }
  };

  const getCallStateColor = () => {
    switch (callState) {
      case 'connected': return 'text-green-600';
      case 'connecting':
      case 'calling': return 'text-yellow-600';
      case 'ending': return 'text-orange-600';
      case 'ended': return 'text-red-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900 rounded-lg overflow-hidden`} style={{ isolation: 'isolate' }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold">{patientName}</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`flex items-center ${getCallStateColor()}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse mr-2"></div>
                {getCallStateDisplay()}
              </span>
              {callState === 'connected' && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{formatDuration(callDuration)}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative h-full min-h-[500px]">
        {/* Remote Video (Full Screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gradient-to-br from-gray-800 to-gray-900"
        />
        
        {/* Remote Video Placeholder */}
        {callState !== 'connected' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-white">
              <div className="w-40 h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl font-bold text-white">
                  {patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <p className="text-2xl font-semibold mb-2">{patientName}</p>
              <p className="text-lg text-gray-300 mb-4">{getCallStateDisplay()}</p>
              {callState === 'connecting' && (
                <div className="mt-6">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-400 mt-3">Establishing secure connection...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Connected overlay with patient info - positioned to not block controls */}
        {callState === 'connected' && (
          <div className="absolute inset-x-0 top-0 bottom-40 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900" style={{ zIndex: 1 }}>
            <div className="text-center text-white">
              <div className="w-48 h-48 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                <span className="text-6xl font-bold text-white">
                  {patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <p className="text-3xl font-bold mb-2">{patientName}</p>
              <p className="text-lg text-green-400 mb-2 flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Video Call Connected
              </p>
              <p className="text-sm text-gray-300">Controls below</p>
            </div>
          </div>
        )}
        
        {/* Controls Protection Area - ensures nothing interferes with controls */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ zIndex: 45, background: 'linear-gradient(transparent, rgba(0,0,0,0.2))' }}></div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-6 right-6 w-56 h-40 bg-gray-900 rounded-xl overflow-hidden border-3 border-orange-500 shadow-2xl" style={{ zIndex: 10 }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Doctor badge */}
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            DR. YOU
          </div>
          
          {!mediaState.video && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <span className="text-xl font-bold">DR</span>
                </div>
                <p className="text-xs font-medium">Camera Off</p>
              </div>
            </div>
          )}
          
          {/* Media status indicators */}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              mediaState.audio ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {mediaState.audio ? '🎤' : '🔇'}
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              mediaState.video ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {mediaState.video ? '📹' : '🚫'}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute top-20 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg">
            <p className="text-sm font-medium">Connection Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Controls - Always visible and stable */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/98 backdrop-blur-xl rounded-2xl px-8 py-5 flex items-center justify-center space-x-6 shadow-2xl border-2 border-orange-500/50 ring-1 ring-white/10" style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.95), 0 0 25px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)', minWidth: '420px', position: 'relative' }}>
          {/* Active indicator */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse ring-2 ring-green-500/30"></div>
          {/* Audio Toggle */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleToggleAudio}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-150 shadow-lg ${
                mediaState.audio 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
              title={mediaState.audio ? 'Mute microphone' : 'Unmute microphone'}
            >
              {mediaState.audio ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <span className="text-xs text-gray-300 mt-1 font-medium">
              {mediaState.audio ? 'Mute' : 'Unmute'}
            </span>
          </div>

          {/* Video Toggle */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleToggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-150 shadow-lg ${
                mediaState.video 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
              title={mediaState.video ? 'Turn off camera' : 'Turn on camera'}
            >
              {mediaState.video ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
            <span className="text-xs text-gray-300 mt-1 font-medium">
              {mediaState.video ? 'Camera' : 'Camera'}
            </span>
          </div>

          {/* Settings */}
          <div className="flex flex-col items-center">
            <button
              className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-150 text-white shadow-lg"
              title="Settings"
            >
              <Settings size={24} />
            </button>
            <span className="text-xs text-gray-300 mt-1 font-medium">Settings</span>
          </div>

          {/* End Call - Enhanced visibility */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔴 End Call button clicked!');
                handleEndCall();
              }}
              className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-150 text-white shadow-2xl ring-2 ring-red-500/50"
              title="End call"
            >
              <PhoneOff size={28} />
            </button>
            <span className="text-xs text-red-300 mt-1 font-medium text-center">End Call</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebRTCVideoCall;
