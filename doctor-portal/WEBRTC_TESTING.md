# WebRTC Video Call Testing Guide

## How to Test the Video Call Feature

### 🩺 **Doctor Side Testing:**

1. **Start the Application:**
   ```bash
   npm run dev
   ```

2. **Access Doctor Portal:**
   - Open `http://localhost:5173/` in your browser
   - Login to the doctor dashboard using the existing auth system

3. **Initiate a Video Call:**
   - Go to the **Patient Queue** section
   - Find a patient and click the **📞 Phone icon** to start a video call
   - Or add sample data and call patients from the queue

4. **Video Call Interface:**
   - Your camera will activate automatically
   - Full video call interface with patient EHR, chat, and create EHR tabs
   - Professional controls for mute/unmute, video on/off, settings, and end call

---

### 👨‍⚕️ **Patient Side Testing:**

1. **Access Patient Mock Interface:**
   - Open a new browser tab/window
   - Go to `http://localhost:5173/mock-patient`

2. **Patient Interface Features:**
   - Clean, patient-friendly interface
   - Waiting room experience
   - Camera and microphone test prompts
   - Connection status indicators

3. **Testing Connectivity:**
   - Keep both doctor and patient tabs open
   - Start a call from doctor side
   - Patient interface should show call connection status
   - Both sides can test audio/video controls

---

### 🧪 **Full Connectivity Test:**

1. **Setup:**
   - Doctor tab: `http://localhost:5173/`
   - Patient tab: `http://localhost:5173/mock-patient`

2. **Test Sequence:**
   - Login as doctor and initialize sample data
   - From patient tab, observe waiting status
   - From doctor queue, click call patient
   - Both interfaces should show connected status
   - Test media controls (mute, video toggle) on both sides
   - Use EHR tabs on doctor side during call
   - End call from either side

---

### 🎯 **Key Features to Test:**

#### Doctor Interface:
- ✅ Video call initiation from patient queue
- ✅ Camera/microphone access and display
- ✅ EHR integration during calls
- ✅ Chat functionality during calls
- ✅ Create EHR during/after calls
- ✅ Call duration tracking
- ✅ Professional call controls
- ✅ Appointment status updates

#### Patient Interface:
- ✅ Clean waiting room experience
- ✅ Connection status updates
- ✅ Camera/microphone testing
- ✅ Call acceptance flow
- ✅ Media controls during call
- ✅ Call termination handling

---

### 📱 **Multi-Device Testing:**

- Test on different browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Test with different camera/microphone setups
- Test network connectivity scenarios

---

### 🔧 **Technical Notes:**

- The system uses WebRTC for real-time communication
- Falls back to mock mode if no signaling server is available
- Camera/microphone permissions are required
- Works in development mode without external servers
- Professional medical UI/UX design
- Integrated with existing patient management system

---

### 🚨 **Troubleshooting:**

- **Camera not working**: Check browser permissions
- **Interface disappears**: Fixed in current version with improved state management
- **No patient data**: Use "Initialize Sample Data" button first
- **Connection issues**: System automatically falls back to demo mode

---

### 💡 **Production Deployment:**

For production use, you'll need:
- WebRTC signaling server (Socket.IO)
- TURN servers for NAT traversal
- SSL/TLS certificates for HTTPS
- Professional video/audio optimization
