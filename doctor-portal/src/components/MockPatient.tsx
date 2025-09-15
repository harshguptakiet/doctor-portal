import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  User,
  Heart,
  Activity
} from 'lucide-react';
import webrtcService, { type MediaState } from '../services/webrtcService';

interface MockPatientProps {
  patientName: string;
  callId?: string;
  onCallEnd?: () => void;
}

const MockPatient: React.FC<MockPatientProps> = ({
  patientName = "John Doe",
  callId,
  onCallEnd
}) => {
  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // State
  const [callState, setCallState] = useState<string>('waiting');
  const [mediaState, setMediaState] = useState<MediaState>({ video: true, audio: true });
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);

  // Mock vital signs for demo
  const [vitalSigns] = useState({
    heartRate: 72 + Math.floor(Math.random() * 10),
    bloodPressure: `${120 + Math.floor(Math.random() * 20)}/${80 + Math.floor(Math.random() * 10)}`,
    temperature: (98.6 + (Math.random() - 0.5) * 2).toFixed(1),
    oxygenSat: 95 + Math.floor(Math.random() * 5)
  });

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

  // Initialize WebRTC service for patient
  useEffect(() => {
    // Set up callbacks for patient side
    webrtcService.setCallbacks({
      onLocalStream: (stream) => {
        console.log('📹 Patient: Setting local stream');
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      },
      onRemoteStream: (stream) => {
        console.log('📺 Patient: Setting remote stream (Doctor)');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
      onCallStateChange: (state) => {
        console.log('🔄 Patient: Call state changed:', state);
        setCallState(state);

        if (state === 'connected') {
          setIsInCall(true);
        } else if (state === 'ended') {
          setIsInCall(false);
          onCallEnd?.();
        }
      },
      onError: (errorMessage) => {
        console.error('❌ Patient WebRTC Error:', errorMessage);
        setError(errorMessage);
      }
    });

    // Auto-join call if callId is provided
    if (callId) {
      joinCall();
    }

    // Cleanup on unmount
    return () => {
      webrtcService.endCall();
    };
  }, [callId]);

  const joinCall = async () => {
    try {
      setCallState('joining');
      await webrtcService.joinCall(callId || 'default-call-id');
    } catch (error) {
      console.error('Failed to join call:', error);
      setError(error instanceof Error ? error.message : 'Failed to join call');
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
    webrtcService.endCall();
    setIsInCall(false);
    onCallEnd?.();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStateDisplay = () => {
    switch (callState) {
      case 'waiting': return 'Waiting for doctor...';
      case 'joining': return 'Joining call...';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected to doctor';
      case 'ended': return 'Call ended';
      case 'failed': return 'Connection failed';
      default: return callState;
    }
  };

  const getCallStateColor = () => {
    switch (callState) {
      case 'connected': return 'text-green-600';
      case 'waiting':
      case 'joining':
      case 'connecting': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isInCall && callState !== 'waiting' && callState !== 'joining') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-gray-200">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <User size={60} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Patient Portal</h1>
          <p className="text-xl text-gray-700 mb-4">Welcome, {patientName}</p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
            callState === 'waiting' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
            callState === 'failed' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <div className="w-3 h-3 rounded-full bg-current animate-pulse mr-3"></div>
            {getCallStateDisplay()}
          </div>

          {callState === 'waiting' && !callId && (
            <div>
              <p className="text-gray-600 mb-6 text-lg">
                👩‍⚕️ Waiting for doctor to initiate the video call...
              </p>
              <button
                onClick={() => joinCall()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Phone size={24} className="mr-3" />
                Join Video Call
              </button>
              
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-2">📹 Camera Test</p>
                <p className="text-xs text-green-600">Make sure your camera and microphone are working</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-semibold text-sm mb-2">⚠️ Connection Error</p>
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}
          
          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-2">📝 Test Instructions:</p>
            <p className="text-xs text-gray-500">
              This is a demo patient interface. To test connectivity, have the doctor start a video call from their dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Main Call Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Dr. Smith</h3>
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
            
            <div className="text-white text-right">
              <p className="text-sm font-medium">Patient: {patientName}</p>
              <p className="text-xs text-gray-300">Video Consultation</p>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative h-screen">
          {/* Remote Video (Doctor - Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-800"
          />
          
          {/* Remote Video Placeholder */}
          {callState !== 'connected' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold">DR</span>
                </div>
                <p className="text-xl font-medium">Dr. Smith</p>
                <p className="text-sm text-gray-300 mt-1">{getCallStateDisplay()}</p>
                {(callState === 'connecting' || callState === 'joining') && (
                  <div className="mt-4">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Local Video (Patient - Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {!mediaState.video && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User size={20} />
                  </div>
                  <p className="text-xs">Camera off</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="absolute top-20 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg">
              <p className="text-sm font-medium">Connection Error</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-4 flex items-center space-x-4">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                mediaState.audio 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
              title={mediaState.audio ? 'Mute microphone' : 'Unmute microphone'}
            >
              {mediaState.audio ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                mediaState.video 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
              title={mediaState.video ? 'Turn off camera' : 'Turn on camera'}
            >
              {mediaState.video ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Settings */}
            <button
              className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors text-white"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors text-white"
              title="End call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel - Patient Info */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Patient Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {patientName}</div>
              <div><span className="font-medium">Age:</span> 35</div>
              <div><span className="font-medium">Gender:</span> Male</div>
              <div><span className="font-medium">Phone:</span> +1-555-0123</div>
              <div><span className="font-medium">Email:</span> john.doe@email.com</div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Activity className="mr-2 text-yellow-600" size={16} />
              Current Vital Signs
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-medium text-gray-700 flex items-center">
                  <Heart className="mr-1 text-red-500" size={14} />
                  Heart Rate
                </div>
                <div className="text-gray-900">{vitalSigns.heartRate} BPM</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Blood Pressure</div>
                <div className="text-gray-900">{vitalSigns.bloodPressure}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Temperature</div>
                <div className="text-gray-900">{vitalSigns.temperature}°F</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Oxygen Sat</div>
                <div className="text-gray-900">{vitalSigns.oxygenSat}%</div>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Today's Visit</h4>
            <p className="text-sm text-gray-700">
              "I've been experiencing mild chest discomfort and shortness of breath for the past 2 days. 
              It gets worse with physical activity."
            </p>
          </div>

          {/* Medical History */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
            <div className="text-sm text-gray-700">
              <p><strong>Previous Conditions:</strong> Hypertension (controlled)</p>
              <p><strong>Allergies:</strong> No known allergies</p>
              <p><strong>Medications:</strong> Lisinopril 10mg daily</p>
              <p><strong>Last Visit:</strong> 6 months ago - Annual checkup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPatient;
