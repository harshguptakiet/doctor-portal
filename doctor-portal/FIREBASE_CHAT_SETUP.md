# Firebase Chat Setup and Testing Guide

## Overview
This guide covers the complete setup and testing of the Firebase-based chat functionality integrated into the WebRTC video call system, supporting real-time messaging, file attachments, and voice messages between doctors and patients.

## Prerequisites
- Firebase project setup
- Node.js and npm installed
- React application running
- Signaling server operational

## Setup Steps

### 1. Firebase Configuration

#### A. Update Firebase Config
1. Replace the Firebase configuration in both files:
   - `src/config/firebase.ts` (React app)
   - `patient-demo.html` (line 18-26)

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

#### B. Deploy Security Rules
1. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

2. Deploy Storage rules:
```bash
firebase deploy --only storage
```

### 2. Install Dependencies
Ensure all required packages are installed:
```bash
npm install firebase
```

### 3. Start Services
1. Start the signaling server:
```bash
npm run signaling-server
```

2. Start the React development server:
```bash
npm start
```

3. Open patient demo in a separate browser tab:
```
http://localhost:3000/patient-demo.html
```

## Features Overview

### Real-time Chat Features
- ✅ **Text Messages**: Instant messaging between doctor and patient
- ✅ **File Attachments**: Images, PDFs, documents (10MB limit)
- ✅ **Voice Messages**: Record and send audio messages (25MB limit)
- ✅ **Message Status**: Delivery and read receipts
- ✅ **System Messages**: Call events and notifications
- ✅ **Cross-platform**: Works between React app (doctor) and HTML demo (patient)

### Security Features
- ✅ **Firebase Authentication**: Anonymous auth for demo, extensible to full auth
- ✅ **Firestore Rules**: Secure message access based on call participation
- ✅ **Storage Rules**: File type and size validation
- ✅ **Message Validation**: Server-side message structure validation

## Testing Instructions

### 1. Basic Chat Testing

#### Setup
1. Start signaling server and React app
2. Open patient demo in separate browser tab  
3. Connect patient demo to signaling server
4. From doctor portal, initiate call to patient

#### Test Text Messages
1. **Doctor → Patient**:
   - Open chat panel in doctor portal (💬 button)
   - Type message and press Enter or click Send
   - Verify message appears in both interfaces

2. **Patient → Doctor**:
   - Click chat button (💬) in patient demo
   - Type message and send
   - Verify message appears in doctor portal

#### Expected Results
- Messages appear instantly in both interfaces
- Messages show correct sender (Doctor/Patient)
- Timestamps are accurate
- Message status indicators work (sent/delivered/read)

### 2. File Attachment Testing

#### Test Image Upload
1. In doctor portal chat:
   - Click paperclip (📎) button
   - Select an image file (JPG, PNG, GIF)
   - Verify upload progress indicator
   - Check image appears as thumbnail in chat

2. In patient demo:
   - Click 📎 button in chat
   - Select image file
   - Verify image displays correctly

#### Test Document Upload  
1. Upload PDF, DOC, or TXT file
2. Verify file attachment shows:
   - File name
   - File size
   - Download button
3. Click download button to verify file opens

#### Expected Results
- Files upload successfully (under 10MB)
- File previews work correctly
- Download functionality works
- File type restrictions are enforced

### 3. Voice Message Testing

#### Record Voice Message
1. **Doctor Portal**:
   - Click microphone button (🎤) 
   - Speak message (red recording indicator appears)
   - Click stop button (⏹) to send

2. **Patient Demo**:
   - Click 🎤 button
   - Record voice message
   - Stop recording to send

#### Play Voice Message
1. Click play button (▶) on voice message
2. Verify audio plays correctly
3. Check duration display is accurate

#### Expected Results
- Recording indicator shows during recording
- Voice messages upload successfully
- Audio playback works in both interfaces
- Duration is displayed correctly

### 4. Cross-Platform Communication

#### Test Scenario
1. Doctor sends text message from React app
2. Patient receives and replies from HTML demo
3. Doctor sends image from React app
4. Patient sends voice message from demo
5. Verify all message types work bidirectionally

#### Expected Results
- All message types work between platforms
- Real-time updates occur instantly
- Message formatting consistent
- No message loss or duplication

### 5. Connection Reliability Testing

#### Network Interruption Test
1. Disconnect/reconnect network during call
2. Send messages after reconnection
3. Verify message sync works correctly

#### Browser Refresh Test  
1. Refresh browser during active call
2. Verify chat history loads correctly
3. Send new messages to confirm functionality

## Troubleshooting

### Common Issues

#### 1. Messages Not Appearing
**Symptoms**: Messages sent but not received
**Solutions**:
- Check Firebase project configuration
- Verify Firestore security rules deployed
- Check browser console for authentication errors
- Ensure call session ID matches between doctor and patient

#### 2. File Upload Failures
**Symptoms**: Files fail to upload or don't appear
**Solutions**:
- Check file size (must be under 10MB)
- Verify file type is allowed
- Check Firebase Storage rules are deployed
- Verify Storage bucket configuration

#### 3. Voice Messages Not Working
**Symptoms**: Cannot record or play voice messages
**Solutions**:
- Grant microphone permissions in browser
- Check if MediaRecorder API is supported
- Verify audio codec support (WebM/Opus)
- Check Firebase Storage rules for voice_messages path

#### 4. Authentication Issues
**Symptoms**: "Permission denied" errors
**Solutions**:
- Check Firebase Authentication is enabled
- Verify anonymous auth is allowed
- Check Firestore rules allow authenticated users
- Ensure user is properly signed in

### Debug Information

#### Browser Console Logs
Monitor for these key log messages:
```
🔥 Firebase initialized for doctor: [userId]
💬 Setting up Firebase chat for session: [sessionId]
💬 Message sent successfully
📎 File sent successfully  
🎤 Voice message sent successfully
```

#### Network Tab
Check for Firebase API calls:
- `firestore.googleapis.com` - Message operations
- `storage.googleapis.com` - File uploads
- WebSocket connections for real-time updates

## Performance Considerations

### Message Limits
- **Text messages**: 1MB per message
- **File attachments**: 10MB per file
- **Voice messages**: 25MB per file (≈5 minutes)
- **Message history**: Unlimited (consider pagination for production)

### Optimization Tips
1. **File Compression**: Compress images before upload
2. **Voice Quality**: Balance quality vs file size
3. **Message Pagination**: Implement for large message histories
4. **Cleanup**: Remove old files periodically
5. **Caching**: Cache recent messages locally

## Production Considerations

### Security Enhancements
1. **User Authentication**: Replace anonymous auth with proper user accounts
2. **Message Encryption**: Add end-to-end encryption for sensitive data
3. **Access Control**: Implement role-based access control
4. **Audit Logging**: Track message access and modifications

### Scalability
1. **Database Sharding**: Partition messages by date or call session
2. **CDN Integration**: Use Firebase CDN for file delivery
3. **Real-time Optimization**: Implement connection pooling
4. **Message Archiving**: Archive old conversations

### Monitoring
1. **Firebase Analytics**: Track usage patterns
2. **Performance Monitoring**: Monitor upload/download speeds
3. **Error Tracking**: Implement comprehensive error logging
4. **Usage Metrics**: Monitor storage and bandwidth usage

## Success Criteria

✅ **Chat Functionality**
- [x] Real-time text messaging works bidirectionally
- [x] Message timestamps and status indicators function
- [x] Chat history persists across browser refreshes

✅ **File Attachments**
- [x] Images display as thumbnails with preview
- [x] Documents show file info with download option
- [x] File size and type validation works

✅ **Voice Messages**
- [x] Recording functionality works in both interfaces
- [x] Audio playback functions correctly
- [x] Voice message duration is calculated and displayed

✅ **Cross-Platform**
- [x] Doctor (React) ↔ Patient (HTML) communication works
- [x] Message formatting consistent between platforms
- [x] Real-time updates function properly

✅ **Security & Performance**
- [x] Firebase security rules prevent unauthorized access
- [x] File uploads respect size and type limits
- [x] System handles network interruptions gracefully

The Firebase chat integration is now complete and ready for production use with proper configuration and testing!
