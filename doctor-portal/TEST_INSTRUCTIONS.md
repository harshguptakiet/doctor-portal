# 🎥 Video Call Testing Instructions

## 🚀 **Quick Setup**

### 1. Start the Signaling Server & Doctor Portal
```bash
npm run dev:full
```
This starts both:
- Signaling server on `http://localhost:3001`
- Doctor portal on `http://localhost:5173`

### 2. Open Patient Demo
Open a second browser window/tab and navigate to:
```
file:///C:/doctor-portal/doctor-portal/patient-demo.html
```
OR simply double-click the `patient-demo.html` file to open it in your browser.

## 🧪 **Testing Steps**

### Step 1: Setup Both Interfaces

1. **Doctor Portal (http://localhost:5173)**:
   - Should show debug indicator in bottom-left corner
   - Go to "Patient Queue" in sidebar
   - Click "Initialize Sample Data" if no patients visible

2. **Patient Demo (patient-demo.html)**:
   - Should auto-connect to signaling server
   - Status should show "Connected - Waiting for call"
   - Debug info in bottom-left shows connection status

### Step 2: Grant Permissions

**Important**: Both windows need camera/microphone permissions!

1. **Doctor Portal**: Grant permissions when prompted
2. **Patient Demo**: Grant permissions when call starts

### Step 3: Initiate Call

From the **Doctor Portal**:
- Click "Call Next Patient" button, OR
- Click phone icon (📞) next to a specific patient

### Step 4: Observe the Flow

You should see:

1. **Signaling Server Terminal**: Shows call routing messages
2. **Patient Demo**: 
   - Status changes to "Incoming call from Dr. Smith"
   - Automatically accepts after 2 seconds
   - Switches to full-screen video call interface
3. **Doctor Portal**: 
   - Shows full-screen video call interface
   - Both video streams should be visible

### Step 5: Test Features

**During the call, test**:
- 🎤 Microphone toggle (both sides)
- 📹 Camera toggle (both sides)  
- 💬 Chat sidebar (doctor side)
- ⏱️ Call timer
- 📞 End call (both sides)

## 🔍 **What You Should See**

### ✅ **Success Indicators**:
- Both video streams visible
- Audio working (if you have speakers/headphones)
- Call timer counting up
- Chat messages work (doctor to patient)
- Media controls respond correctly
- Call ends properly from both sides

### ❌ **Troubleshooting**:

**If video doesn't appear**:
1. Check browser permissions (🔒 icon in address bar)
2. Check browser console (F12) for errors
3. Ensure both browser windows have camera/mic access

**If call doesn't connect**:
1. Check signaling server is running
2. Look for "WebRTC Call Manager Status" debug info
3. Check browser console for connection errors

**If patient demo doesn't work**:
1. Make sure signaling server is running on port 3001
2. Check patient demo console (F12) for errors
3. Try refreshing the patient demo page

## 🎯 **Demo Features**

### Doctor Portal Features:
- Full-screen video call interface
- Professional sidebar with chat/notes/files tabs
- Media controls (mic, camera, screen share)
- Call timer and connection quality indicators
- Integration with patient queue system

### Patient Demo Features:
- Clean, simple patient interface
- Auto-accepts incoming calls
- Basic media controls
- Call timer
- Debug information panel

## 📋 **Test Scenarios**

1. **Basic Call**: Start call → verify video/audio → end call
2. **Media Controls**: Toggle mic/camera on both sides
3. **Chat**: Send messages from doctor side
4. **Multiple Calls**: End call, start another with different patient
5. **Connection Handling**: Close patient demo, see fallback simulation

## 🐛 **Debug Information**

Both interfaces show debug information:
- **Doctor Portal**: Bottom-left corner shows WebRTC manager status
- **Patient Demo**: Bottom-left panel shows connection details
- **Signaling Server**: Terminal shows all WebRTC traffic

## 🎉 **Success Criteria**

The system is working correctly when:
- ✅ Video appears on both sides
- ✅ Audio works (if tested with headphones)
- ✅ Media controls function properly  
- ✅ Call timer displays correctly
- ✅ Chat messages are delivered
- ✅ Calls can be ended from either side
- ✅ System handles multiple calls properly

---

**🎬 Ready to test your professional video calling system!**
