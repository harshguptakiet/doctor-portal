# WebRTC Video Call Feature - Doctor Portal

This document provides instructions on how to set up and test the WebRTC-based video calling feature for patient-doctor consultations.

## 🎥 Features

- **Real-time video/audio calls** between doctor and patients
- **Screen sharing** capability
- **In-call chat** with real-time messaging
- **Call recording** metadata stored in Firebase
- **Media controls** (mute/unmute, camera on/off, screen share)
- **Call quality indicators** and connection monitoring
- **Integrated with patient queue system**
- **Call history and session management**

## 🏗️ Architecture

### Components
- **WebRTC Service** (`src/services/webrtc.ts`) - Core WebRTC functionality
- **Video Call Component** (`src/components/VideoCall.tsx`) - UI for video calls
- **WebRTC Call Manager** (`src/components/WebRTCCallManager.tsx`) - Integration layer
- **Call Session Manager** (`src/services/callSessionManager.ts`) - Firebase integration
- **Signaling Server** (`signaling-server.js`) - WebRTC signaling

### Data Flow
1. Doctor clicks "Call Patient" in queue
2. WebRTC service initiates call through signaling server
3. Patient simulation auto-accepts (for demo)
4. Video call UI opens with controls
5. Call data saved to Firebase collections
6. Appointment marked as completed when call ends

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase project** configured
3. **Camera and microphone** permissions in browser
4. **Modern browser** with WebRTC support

## ⚙️ Setup Instructions

### 1. Start the Signaling Server

The signaling server handles WebRTC negotiation between peers.

```bash
# Start the signaling server (runs on port 3001)
npm run signaling-server

# Or manually:
node signaling-server.js
```

Expected output:
```
🚀 WebRTC Signaling Server running on port 3001
📡 Accepting connections from:
   - http://localhost:5173 (Vite dev server)
   - http://localhost:3000 (CRA dev server)
   - http://localhost:4173 (Vite preview)
🏥 Doctor Portal WebRTC Ready!
📋 Health check: http://localhost:3001/health
🐛 Debug info: http://localhost:3001/debug/connections
```

### 2. Start the Doctor Portal App

```bash
# Start both signaling server and main app
npm run dev:full

# Or start just the app (if signaling server is already running)
npm run dev
```

### 3. Grant Browser Permissions

When you first load the app, your browser will request:
- **Camera access** 📹
- **Microphone access** 🎤
- **Screen sharing access** (when used) 🖥️

**Important:** Grant these permissions for video calling to work properly.

## 🧪 Testing the Video Call Feature

### Basic Testing Steps

1. **Load the Application**
   ```
   http://localhost:5173
   ```

2. **Initialize Sample Data** (if needed)
   - Click "Initialize Sample Data" button on dashboard
   - This creates sample patients and appointments

3. **Navigate to Patient Queue**
   - Click "Patient Queue" in sidebar
   - You should see scheduled appointments

4. **Start a Video Call**
   - Click "Call Next Patient" button
   - Or click the phone icon next to a specific patient
   - WebRTC call should initiate

5. **Video Call Interface**
   - Small window appears in bottom-right corner
   - Click "Fullscreen" button to expand
   - Test media controls (mute, camera, screen share)
   - Try the chat feature
   - End call when done

### Advanced Testing

#### Test Different Call Scenarios

1. **Queue-based calling**:
   ```
   1. Go to Patient Queue
   2. Click "Call Next Patient"
   3. Verify call starts with correct patient
   ```

2. **Direct patient calling**:
   ```
   1. Go to Patient Queue
   2. Click phone icon next to specific patient
   3. Verify call starts with that patient
   ```

3. **Fullscreen mode**:
   ```
   1. Start any call
   2. Click maximize button
   3. Test all controls in fullscreen
   4. Exit fullscreen
   ```

4. **Chat during call**:
   ```
   1. Start a call
   2. Click chat button
   3. Send messages
   4. Verify real-time delivery
   ```

5. **Screen sharing**:
   ```
   1. During a call, click screen share button
   2. Select screen/window to share
   3. Verify screen sharing works
   4. Stop screen sharing
   ```

#### Monitor Call Quality

- **Connection status**: Green dot = connected, Yellow = good, Red = poor
- **Call timer**: Shows duration of active call
- **Audio/video indicators**: Show mute/unmute status

#### Check Firebase Integration

1. **Call Sessions Collection**:
   ```
   Firebase Console > Firestore > callSessions
   ```
   - Verify call sessions are created
   - Check call status updates

2. **Call History Collection**:
   ```
   Firebase Console > Firestore > callHistory  
   ```
   - Verify completed calls are logged
   - Check duration and quality metrics

3. **Updated Appointments**:
   ```
   Firebase Console > Firestore > appointments
   ```
   - Verify appointment status changes to "completed"

## 🐛 Troubleshooting

### Common Issues

#### 1. "Signaling server not connected"
```bash
# Ensure signaling server is running
npm run signaling-server

# Check if port 3001 is available
netstat -an | find "3001"
```

#### 2. "Failed to access camera/microphone"
- Check browser permissions in address bar
- Go to browser Settings > Privacy > Camera/Microphone
- Ensure localhost is allowed

#### 3. "WebRTC not available"
- Check browser console for errors
- Ensure you're using HTTPS or localhost
- Try a different browser (Chrome recommended)

#### 4. Video not showing
- Check camera permissions
- Verify camera is not used by another app
- Check browser console for MediaStream errors

#### 5. No audio during call
- Check microphone permissions
- Verify system audio settings
- Try muting/unmuting

### Debug Tools

#### 1. Signaling Server Health Check
```bash
curl http://localhost:3001/health
```

#### 2. Active Connections Debug
```bash
curl http://localhost:3001/debug/connections
```

#### 3. Browser Developer Tools
- Open F12 Developer Tools
- Check Console tab for WebRTC errors
- Check Network tab for WebSocket connections

#### 4. WebRTC Internals (Chrome)
```
chrome://webrtc-internals/
```

## 🔧 Configuration

### Environment Variables

Create `.env` file for production deployment:
```env
# Signaling Server
SIGNALING_SERVER_URL=wss://your-signaling-server.com

# TURN Servers (for production)
TURN_SERVER_URL=turn:your-turn-server.com:3478
TURN_USERNAME=your-username
TURN_CREDENTIAL=your-password

# Firebase (already configured in app)
REACT_APP_FIREBASE_API_KEY=your-api-key
# ... other Firebase config
```

### Production Deployment

For production deployment, you'll need:

1. **Deployed Signaling Server** (on Heroku, AWS, etc.)
2. **TURN Servers** for NAT traversal
3. **HTTPS** for WebRTC to work
4. **Firestore Security Rules** properly configured

### Firebase Security Rules

Add these rules to Firestore:
```javascript
// Allow read/write access to call sessions for authenticated users
match /callSessions/{sessionId} {
  allow read, write: if request.auth != null;
}

match /callHistory/{historyId} {
  allow read, write: if request.auth != null;
}
```

## 📱 Mobile Testing

The video call system works on mobile browsers:

1. **iOS Safari** (iOS 11+)
2. **Android Chrome** (Android 5+)
3. **Samsung Internet**

Mobile considerations:
- Touch-friendly controls
- Responsive video layout
- Battery usage optimization
- Network bandwidth adaptation

## 🚀 Next Steps

### Potential Enhancements

1. **Multi-party calls** (group consultations)
2. **Call recording** (with patient consent)
3. **File sharing** during calls
4. **Virtual backgrounds**
5. **Call scheduling** and reminders
6. **Patient-side application**
7. **Call analytics** and reporting
8. **Integration with EHR systems**

### Performance Optimizations

1. **Bandwidth adaptation**
2. **Codec optimization**
3. **Connection quality monitoring**
4. **Fallback to audio-only**
5. **Edge server deployment**

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify signaling server is running
3. Test with different browsers
4. Check Firebase configuration
5. Review network connectivity
6. Test camera/microphone permissions

---

## 🎉 Success Criteria

The WebRTC video call feature is working correctly when:

- ✅ Signaling server connects successfully
- ✅ Camera and microphone permissions granted
- ✅ Video call initiates from patient queue
- ✅ Both local and remote video streams display
- ✅ Audio/video controls work properly
- ✅ Screen sharing functions correctly
- ✅ In-call chat works in real-time
- ✅ Call ends properly and updates appointment status
- ✅ Call session data saves to Firebase
- ✅ No console errors or connection issues

Happy testing! 🎥📞
