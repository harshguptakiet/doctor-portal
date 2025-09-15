import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  serverTimestamp, 
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
} from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';

export interface ChatMessage {
  id?: string;
  callSessionId: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'patient';
  message?: string;
  type: 'text' | 'file' | 'voice' | 'image' | 'system';
  timestamp: Timestamp | Date | any;
  
  // File/attachment specific fields
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  
  // Voice message specific fields
  voiceDuration?: number; // in seconds
  
  // System message fields
  systemType?: 'call_started' | 'call_ended' | 'participant_joined' | 'media_toggle';
  
  // Status fields
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  readBy?: string[]; // Array of user IDs who have read this message
  
  // Edit/Delete fields
  isEdited?: boolean;
  isDeleted?: boolean;
  editedAt?: Timestamp | Date | any;
  deletedAt?: Timestamp | Date | any;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  avatar?: string;
  isOnline: boolean;
  lastSeen: Timestamp | Date | any;
}

export interface VoiceRecordingConfig {
  maxDuration: number; // in seconds
  audioFormat: string;
  sampleRate: number;
}

class ChatService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordingChunks: Blob[] = [];
  private voiceRecordingConfig: VoiceRecordingConfig = {
    maxDuration: 300, // 5 minutes
    audioFormat: 'audio/webm;codecs=opus',
    sampleRate: 44100
  };

  /**
   * Ensure user is authenticated
   */
  private async ensureAuth(): Promise<void> {
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
        console.log('✅ Firebase: Signed in anonymously');
      }
    } catch (error: any) {
      console.warn('⚠️ Firebase auth warning:', error);
      
      // If anonymous auth is disabled, continue without authentication
      // Note: This may cause Firestore operations to fail if rules require auth
      if (error.code === 'auth/admin-restricted-operation') {
        console.log('⚠️ Anonymous authentication disabled - continuing without auth');
        console.log('📝 Note: Update Firestore rules to allow unauthenticated access or enable anonymous auth');
        return; // Continue without throwing error
      }
      
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Send a text message
   */
  async sendTextMessage(
    callSessionId: string,
    senderId: string,
    senderName: string,
    senderRole: 'doctor' | 'patient',
    message: string
  ): Promise<string> {
    try {
      await this.ensureAuth();
      
      const chatMessage: Omit<ChatMessage, 'id'> = {
        callSessionId,
        senderId,
        senderName,
        senderRole,
        message: message.trim(),
        type: 'text',
        timestamp: serverTimestamp(),
        status: 'sending'
      };

      const docRef = await addDoc(collection(db, 'chat_messages'), chatMessage);
      
      // Update status to sent
      await updateDoc(doc(db, 'chat_messages', docRef.id), {
        status: 'sent'
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending text message:', error);
      throw error;
    }
  }

  /**
   * Send a file attachment
   */
  async sendFileMessage(
    callSessionId: string,
    senderId: string,
    senderName: string,
    senderRole: 'doctor' | 'patient',
    file: File,
    message?: string
  ): Promise<string> {
    try {
      await this.ensureAuth();
      
      // Validate file
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size exceeds 10MB limit');
      }

      console.log('📎 Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Determine message type based on file type
      let messageType: ChatMessage['type'] = 'file';
      if (file.type.startsWith('image/')) {
        messageType = 'image';
      }

      // Check if storage is available
      if (!storage) {
        throw new Error('Firebase Storage not initialized');
      }

      // Upload file to Firebase Storage
      const fileRef = ref(storage, `chat_files/${callSessionId}/${Date.now()}_${file.name}`);
      console.log('📎 Starting upload to Firebase Storage...');
      const uploadResult = await uploadBytes(fileRef, file);
      console.log('📎 Upload completed, getting download URL...');
      const fileUrl = await getDownloadURL(uploadResult.ref);
      console.log('📎 Got download URL:', fileUrl);

      // Create chat message
      const chatMessage: Omit<ChatMessage, 'id'> = {
        callSessionId,
        senderId,
        senderName,
        senderRole,
        message: message?.trim(),
        type: messageType,
        timestamp: serverTimestamp(),
        status: 'sending',
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type
      };

      const docRef = await addDoc(collection(db, 'chat_messages'), chatMessage);
      
      // Update status to sent
      await updateDoc(doc(db, 'chat_messages', docRef.id), {
        status: 'sent'
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Error sending file message:', error);
      
      // If the error is storage-related, throw a specific error
      if (error.message?.includes('Firebase Storage') || error.code === 'storage/unknown') {
        throw new Error('File upload failed - Firebase Storage not available. Please enable Firebase Storage in your project.');
      }
      
      throw error;
    }
  }

  /**
   * Start voice recording
   */
  async startVoiceRecording(): Promise<void> {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        throw new Error('Recording already in progress');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: this.voiceRecordingConfig.sampleRate,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.voiceRecordingConfig.audioFormat
      });

      this.recordingChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.recordingChunks.push(event.data);
        }
      });

      this.mediaRecorder.start();

      // Auto-stop after max duration
      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.stopVoiceRecording();
        }
      }, this.voiceRecordingConfig.maxDuration * 1000);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      throw error;
    }
  }

  /**
   * Stop voice recording and return the blob
   */
  async stopVoiceRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording found'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', () => {
        const voiceBlob = new Blob(this.recordingChunks, { 
          type: this.voiceRecordingConfig.audioFormat 
        });
        
        // Clean up media stream
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        resolve(voiceBlob);
      });

      this.mediaRecorder.stop();
    });
  }

  /**
   * Send a voice message
   */
  async sendVoiceMessage(
    callSessionId: string,
    senderId: string,
    senderName: string,
    senderRole: 'doctor' | 'patient',
    voiceBlob: Blob,
    duration: number
  ): Promise<string> {
    try {
      await this.ensureAuth();
      
      // Check if storage is available
      if (!storage) {
        throw new Error('Firebase Storage not initialized');
      }
      
      console.log('🎤 Uploading voice message, size:', voiceBlob.size);
      
      // Upload voice file to Firebase Storage
      const fileName = `voice_${Date.now()}.webm`;
      const voiceRef = ref(storage, `voice_messages/${callSessionId}/${fileName}`);
      const uploadResult = await uploadBytes(voiceRef, voiceBlob);
      const voiceUrl = await getDownloadURL(uploadResult.ref);

      // Create chat message
      const chatMessage: Omit<ChatMessage, 'id'> = {
        callSessionId,
        senderId,
        senderName,
        senderRole,
        type: 'voice',
        timestamp: serverTimestamp(),
        status: 'sending',
        fileUrl: voiceUrl,
        fileName,
        fileSize: voiceBlob.size,
        fileMimeType: voiceBlob.type,
        voiceDuration: duration
      };

      const docRef = await addDoc(collection(db, 'chat_messages'), chatMessage);
      
      // Update status to sent
      await updateDoc(doc(db, 'chat_messages', docRef.id), {
        status: 'sent'
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending voice message:', error);
      throw error;
    }
  }

  /**
   * Send a system message (call events, etc.)
   */
  async sendSystemMessage(
    callSessionId: string,
    systemType: ChatMessage['systemType'],
    message: string
  ): Promise<string> {
    try {
      const chatMessage: Omit<ChatMessage, 'id'> = {
        callSessionId,
        senderId: 'system',
        senderName: 'System',
        senderRole: 'doctor', // Default role for system messages
        message,
        type: 'system',
        systemType,
        timestamp: serverTimestamp(),
        status: 'sent'
      };

      const docRef = await addDoc(collection(db, 'chat_messages'), chatMessage);
      return docRef.id;
    } catch (error) {
      console.error('Error sending system message:', error);
      throw error;
    }
  }

  /**
   * Listen to chat messages for a call session
   */
  listenToChatMessages(
    callSessionId: string,
    callback: (messages: ChatMessage[]) => void
  ): () => void {
    // Try to authenticate, but don't block if it fails
    this.ensureAuth().catch(error => {
      console.warn('Chat authentication failed, messages may not load:', error);
    });
    
    const messagesRef = collection(db, 'chat_messages');
    const q = query(
      messagesRef,
      where('callSessionId', '==', callSessionId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data
        } as ChatMessage);
      });
      callback(messages);
    });

    return unsubscribe;
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'chat_messages', messageId);
      
      // Note: In a real implementation, you'd want to use arrayUnion
      // This is a simplified version
      await updateDoc(messageRef, {
        status: 'read',
        readBy: [userId] // In real implementation, use arrayUnion to append to existing array
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string, _userId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'chat_messages', messageId);
      await updateDoc(messageRef, {
        isDeleted: true,
        deletedAt: serverTimestamp()
      });
      
      // Note: In a production app, you might want to also delete associated files
      // from Firebase Storage if it's a file/voice message
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Edit a text message
   */
  async editMessage(messageId: string, newMessage: string, _userId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'chat_messages', messageId);
      await updateDoc(messageRef, {
        message: newMessage.trim(),
        isEdited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  /**
   * Get unread message count for a user in a call session
   */
  getUnreadMessageCount(
    callSessionId: string,
    userId: string,
    callback: (count: number) => void
  ): () => void {
    const messagesRef = collection(db, 'chat_messages');
    const q = query(
      messagesRef,
      where('callSessionId', '==', callSessionId),
      where('senderId', '!=', userId), // Messages not from current user
      where('status', 'in', ['sent', 'delivered']) // Not read yet
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });

    return unsubscribe;
  }

  /**
   * Get message statistics for a call session
   */
  async getMessageStats(callSessionId: string): Promise<{
    totalMessages: number;
    textMessages: number;
    fileMessages: number;
    voiceMessages: number;
    imageMessages: number;
  }> {
    try {
      // This is a simplified version - in a real app you might want to use
      // Cloud Functions to aggregate this data efficiently
      const messagesRef = collection(db, 'chat_messages');
      const q = query(messagesRef, where('callSessionId', '==', callSessionId));

      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          let totalMessages = 0;
          let textMessages = 0;
          let fileMessages = 0;
          let voiceMessages = 0;
          let imageMessages = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            totalMessages++;
            
            switch (data.type) {
              case 'text':
                textMessages++;
                break;
              case 'file':
                fileMessages++;
                break;
              case 'voice':
                voiceMessages++;
                break;
              case 'image':
                imageMessages++;
                break;
            }
          });

          resolve({
            totalMessages,
            textMessages,
            fileMessages,
            voiceMessages,
            imageMessages
          });
        });
      });
    } catch (error) {
      console.error('Error getting message stats:', error);
      throw error;
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format voice duration for display
   */
  formatVoiceDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Check if user can record voice messages
   */
  async checkVoiceRecordingSupport(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return MediaRecorder.isTypeSupported(this.voiceRecordingConfig.audioFormat);
    } catch {
      return false;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
