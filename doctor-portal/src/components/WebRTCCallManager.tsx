import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import VideoCall from './VideoCall';
import webRTCService from '../services/webrtc';
import type { CallSession, CallParticipant } from '../services/webrtc';
import type { Patient } from './PatientTable';

interface WebRTCCallManagerProps {
  patients: Patient[];
  onCallEnd?: (session: CallSession) => void;
}

interface CallState {
  isInCall: boolean;
  callSession: CallSession | null;
  localParticipant: CallParticipant | null;
  remoteParticipant: CallParticipant | null;
}

const WebRTCCallManager: React.FC<WebRTCCallManagerProps> = ({
  onCallEnd
}) => {
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    callSession: null,
    localParticipant: null,
    remoteParticipant: null
  });
  
  const [error, setError] = useState<string | null>(null);

  // Setup WebRTC service event listeners
  useEffect(() => {
    // Listen for incoming calls
    webRTCService.onCallStatusChange((status) => {
      if (status === 'ended') {
        handleCallEnd();
      }
    });

    // Listen for call end
    webRTCService.onCallEnd((session) => {
      handleCallEnd();
      onCallEnd?.(session);
    });

    return () => {
      // Cleanup is handled by the WebRTC service
    };
  }, [onCallEnd]);

  const createCallParticipants = (patient: Patient) => {
    const doctor: CallParticipant = {
      id: 'doctor_1', // In a real app, this would come from auth context
      name: 'Dr. Smith', // In a real app, this would come from auth context
      role: 'doctor'
    };

    const patientParticipant: CallParticipant = {
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      role: 'patient',
      phone: patient.phone
    };

    return { doctor, patient: patientParticipant };
  };

  const initiateCall = async (patient: Patient, appointmentId?: string) => {
    try {
      setError(null);
      
      const { doctor, patient: patientParticipant } = createCallParticipants(patient);
      
      // Check if already in a call
      if (callState.isInCall) {
        const switchCall = window.confirm(
          `You are already in a call. End current call and start new call with ${patientParticipant.name}?`
        );
        if (!switchCall) return;
        
        await webRTCService.endCall();
      }

      // Initiate WebRTC call
      const callSession = await webRTCService.initiateCall(
        doctor,
        patientParticipant,
        appointmentId
      );

      // Update call state
      setCallState({
        isInCall: true,
        callSession,
        localParticipant: doctor,
        remoteParticipant: patientParticipant
      });

      console.log('📞 WebRTC call initiated:', callSession);
      console.log('🎯 Call state updated:', {
        isInCall: true,
        callSession: callSession.id,
        doctor: doctor.name,
        patient: patientParticipant.name
      });
      
    } catch (error) {
      console.error('❌ Error initiating call:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate call');
    }
  };

  const handleCallEnd = () => {
    setCallState({
      isInCall: false,
      callSession: null,
      localParticipant: null,
      remoteParticipant: null
    });
    setError(null);
  };

  const toggleFullscreen = () => {
    // No longer needed - always full screen
  };

  // Expose the initiateCall function to parent components
  useEffect(() => {
    // Add to window for global access (for integration with existing calling system)
    (window as any).webrtcCallManager = {
      initiateCall,
      isInCall: callState.isInCall,
      endCall: () => webRTCService.endCall()
    };

    return () => {
      delete (window as any).webrtcCallManager;
    };
  }, [callState.isInCall]);

  // Handle camera/microphone permissions
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Test camera and microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        
      } catch (error) {
        console.warn('⚠️ Camera/microphone permissions not granted:', error);
        setError('Camera and microphone access required for video calls. Please grant permissions and refresh the page.');
      }
    };

    requestPermissions();
  }, []);

  // Error display component
  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">WebRTC Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setError(null)}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log current call state
  console.log('🔍 WebRTC Call Manager render state:', {
    isInCall: callState.isInCall,
    hasCallSession: !!callState.callSession,
    hasLocalParticipant: !!callState.localParticipant,
    hasRemoteParticipant: !!callState.remoteParticipant,
    error
  });

  // Full-screen call interface (always full-screen now)
  if (callState.isInCall && callState.callSession && callState.localParticipant && callState.remoteParticipant) {
    console.log('✅ Rendering VideoCall component');
    return (
      <VideoCall
        callSession={callState.callSession}
        localParticipant={callState.localParticipant}
        remoteParticipant={callState.remoteParticipant}
        onCallEnd={handleCallEnd}
        isFullscreen={true}
        onToggleFullscreen={toggleFullscreen}
      />
    );
  }

  console.log('❌ Not rendering VideoCall - conditions not met');
  
  // Show debug info in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-black text-white p-2 rounded text-xs font-mono opacity-70">
        <div>WebRTC Manager Status:</div>
        <div>In Call: {callState.isInCall ? 'Yes' : 'No'}</div>
        <div>Has Session: {callState.callSession ? 'Yes' : 'No'}</div>
        <div>Has Participants: {callState.localParticipant && callState.remoteParticipant ? 'Yes' : 'No'}</div>
        {error && <div className="text-red-300">Error: {error}</div>}
      </div>
    );
  }
  
  return null;
};

// Hook to use WebRTC calling functionality
export const useWebRTCCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [callStatus] = useState<CallSession['status']>('ended');

  useEffect(() => {
    const updateCallStatus = () => {
      const manager = (window as any).webrtcCallManager;
      if (manager) {
        setIsInCall(manager.isInCall);
      }
    };

    // Check initially
    updateCallStatus();
    
    // Set up periodic check (in a real app, you'd use events)
    const interval = setInterval(updateCallStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const initiateCall = (patient: Patient, appointmentId?: string) => {
    const manager = (window as any).webrtcCallManager;
    if (manager && typeof manager.initiateCall === 'function') {
      manager.initiateCall(patient, appointmentId);
    } else {
      console.error('❌ WebRTC Call Manager not available');
    }
  };

  const endCall = () => {
    const manager = (window as any).webrtcCallManager;
    if (manager && typeof manager.endCall === 'function') {
      manager.endCall();
    }
  };

  return {
    initiateCall,
    endCall,
    isInCall,
    callStatus
  };
};

export default WebRTCCallManager;
