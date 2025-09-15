import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import type { CallSession } from './webrtc';

// Firebase call session interface - extends the WebRTC CallSession
export interface FirebaseCallSession extends CallSession {
  firebaseId?: string;
  callType: 'video' | 'audio' | 'screen-share';
  callQuality?: 'excellent' | 'good' | 'poor';
  callDuration?: number; // in seconds
  createdAt: any; // Firebase timestamp
  updatedAt: any; // Firebase timestamp
  notes?: string;
  patientName?: string;
  doctorName?: string;
}

export interface CallHistory {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  callType: 'video' | 'audio' | 'screen-share';
  status: 'completed' | 'failed' | 'cancelled';
  quality: 'excellent' | 'good' | 'poor';
  notes?: string;
  patientName: string;
  doctorName: string;
}

class CallSessionManager {
  private db: any = null;

  constructor() {
    this.initializeFirestore();
  }

  private async initializeFirestore() {
    try {
      this.db = getFirestore();
      console.log('📞 Call Session Manager initialized with Firestore');
    } catch (error) {
      console.error('❌ Error initializing Call Session Manager:', error);
    }
  }

  // Create a new call session in Firebase
  async createCallSession(session: CallSession, callType: 'video' | 'audio' | 'screen-share' = 'video'): Promise<string | null> {
    if (!this.db) {
      console.error('❌ Firestore not initialized');
      return null;
    }

    try {
      const firebaseSession: Partial<FirebaseCallSession> = {
        ...session,
        callType,
        callQuality: 'excellent',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: session.status || 'initiating'
      };

      const docRef = await addDoc(collection(this.db, 'callSessions'), firebaseSession);
      console.log('📞 Call session created in Firebase:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating call session in Firebase:', error);
      return null;
    }
  }

  // Update an existing call session
  async updateCallSession(firebaseId: string, updates: Partial<FirebaseCallSession>): Promise<boolean> {
    if (!this.db) {
      console.error('❌ Firestore not initialized');
      return false;
    }

    try {
      const sessionRef = doc(this.db, 'callSessions', firebaseId);
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('📞 Call session updated in Firebase:', firebaseId);
      return true;
    } catch (error) {
      console.error('❌ Error updating call session:', error);
      return false;
    }
  }

  // End a call session and create call history record
  async endCallSession(firebaseId: string, endData: {
    endTime: Date;
    duration: number;
    status: 'completed' | 'failed' | 'cancelled';
    quality?: 'excellent' | 'good' | 'poor';
    notes?: string;
  }): Promise<boolean> {
    if (!this.db) {
      console.error('❌ Firestore not initialized');
      return false;
    }

    try {
      // Update the call session
      const sessionRef = doc(this.db, 'callSessions', firebaseId);
      await updateDoc(sessionRef, {
        status: 'ended',
        endTime: endData.endTime,
        callDuration: endData.duration,
        callQuality: endData.quality || 'excellent',
        notes: endData.notes,
        updatedAt: serverTimestamp()
      });

      // Create call history record
      const historyData = {
        callSessionId: firebaseId,
        endTime: endData.endTime,
        duration: endData.duration,
        status: endData.status,
        quality: endData.quality || 'excellent',
        notes: endData.notes,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(this.db, 'callHistory'), historyData);
      console.log('📞 Call session ended and history created');
      return true;
    } catch (error) {
      console.error('❌ Error ending call session:', error);
      return false;
    }
  }

  // Get active call sessions
  onActiveCallSessions(callback: (sessions: FirebaseCallSession[]) => void): () => void {
    if (!this.db) {
      console.error('❌ Firestore not initialized');
      return () => {};
    }

    const activeSessionsQuery = query(
      collection(this.db, 'callSessions'),
      where('status', 'in', ['initiating', 'ringing', 'connected']),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(activeSessionsQuery, (querySnapshot) => {
      const sessions: FirebaseCallSession[] = [];
      querySnapshot.forEach((doc) => {
        sessions.push({
          firebaseId: doc.id,
          ...doc.data()
        } as FirebaseCallSession);
      });
      callback(sessions);
    });
  }

  // Get call history for a patient
  onPatientCallHistory(patientId: string, callback: (history: CallHistory[]) => void, limitCount: number = 10): () => void {
    if (!this.db) {
      console.error('❌ Firestore not initialized');
      return () => {};
    }

    const historyQuery = query(
      collection(this.db, 'callHistory'),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(historyQuery, (querySnapshot) => {
      const history: CallHistory[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate?.() || new Date(),
          endTime: data.endTime?.toDate?.() || new Date(),
        } as CallHistory);
      });
      callback(history);
    });
  }

  // Get call history for a doctor
  onDoctorCallHistory(doctorId: string, callback: (history: CallHistory[]) => void, limitCount: number = 20): () => void {
    if (!this.db) {
      console.error('❌ Firestore not initialized');
      return () => {};
    }

    const historyQuery = query(
      collection(this.db, 'callHistory'),
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(historyQuery, (querySnapshot) => {
      const history: CallHistory[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate?.() || new Date(),
          endTime: data.endTime?.toDate?.() || new Date(),
        } as CallHistory);
      });
      callback(history);
    });
  }

  // Get statistics
  async getCallStatistics(_doctorId: string): Promise<{
    totalCalls: number;
    completedCalls: number;
    averageDuration: number;
    averageQuality: string;
  }> {
    // This would require additional Firebase queries
    // For now, return mock data
    return {
      totalCalls: 0,
      completedCalls: 0,
      averageDuration: 0,
      averageQuality: 'excellent'
    };
  }
}

// Singleton instance
const callSessionManager = new CallSessionManager();

export default callSessionManager;
export { CallSessionManager };
