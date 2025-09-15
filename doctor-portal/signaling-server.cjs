// Simple WebRTC Signaling Server for Doctor-Patient Video Calls
// This is a basic implementation for development/testing purposes
// For production, you should use a more robust solution

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"],
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store active connections and call sessions
const activeConnections = new Map();
const callSessions = new Map();

io.on('connection', (socket) => {
  console.log(`👋 Client connected: ${socket.id}`);

  // Store connection info
  socket.on('register', (data) => {
    console.log(`📝 Client registered:`, data);
    activeConnections.set(socket.id, {
      ...data,
      socketId: socket.id,
      connectedAt: new Date()
    });
  });

  // Handle call requests (from doctor to patient)
  socket.on('call-request', (data) => {
    console.log(`📞 Call request from ${data.from.name} to patient ${data.to}`);
    
    // Store call session
    callSessions.set(data.callSession.id, {
      ...data.callSession,
      doctorSocketId: socket.id,
      patientSocketId: null,
      offer: data.offer
    });

    // Look for connected patient clients
    const patientConnections = Array.from(activeConnections.entries())
      .filter(([socketId, conn]) => conn.role === 'patient');
    
    if (patientConnections.length > 0) {
      // Send call request to the first available patient
      const [patientSocketId, patientInfo] = patientConnections[0];
      console.log(`📞 Routing call to connected patient: ${patientInfo.name}`);
      
      // Update call session with patient socket ID
      const callSession = callSessions.get(data.callSession.id);
      if (callSession) {
        callSession.patientSocketId = patientSocketId;
      }
      
      // Forward call request to patient
      io.to(patientSocketId).emit('call-request', {
        from: data.from,
        callSession: data.callSession,
        offer: data.offer
      });
    } else {
      // No patient connected - simulate for demo
      console.log(`🔄 No patient connected, simulating patient acceptance for demo`);
      
      setTimeout(() => {
        const callSession = callSessions.get(data.callSession.id);
        if (callSession) {
          callSession.patientSocketId = 'simulated_patient';
          callSession.status = 'connected';
          
          socket.emit('call-accepted', {
            callSession: callSession,
            patientInfo: {
              id: data.to,
              name: 'Patient (Simulated)',
              role: 'patient'
            }
          });

          setTimeout(() => {
            const mockAnswer = {
              type: 'answer',
              sdp: 'Mock SDP answer for development'
            };
            
            socket.emit('call-answer', { answer: mockAnswer });
          }, 1000);
        }
      }, 2000);
    }
  });

  // Handle call answers
  socket.on('call-answer', (data) => {
    console.log(`✅ Call answer received`);
    
    // Forward answer to the caller
    const callSession = Array.from(callSessions.values()).find(session => 
      session.patientSocketId === socket.id
    );
    
    if (callSession && callSession.doctorSocketId) {
      io.to(callSession.doctorSocketId).emit('call-answer', data);
    }
  });

  // Handle ICE candidates
  socket.on('ice-candidate', (data) => {
    console.log(`🧊 ICE candidate from ${socket.id}`);
    
    // Find the call session and forward to the other participant
    const callSession = Array.from(callSessions.values()).find(session => 
      session.doctorSocketId === socket.id || session.patientSocketId === socket.id
    );
    
    if (callSession) {
      const targetSocketId = callSession.doctorSocketId === socket.id 
        ? callSession.patientSocketId 
        : callSession.doctorSocketId;
      
      if (targetSocketId && targetSocketId !== 'simulated_patient') {
        io.to(targetSocketId).emit('ice-candidate', data);
      }
    }
  });

  // Handle call end
  socket.on('call-ended', (data) => {
    console.log(`📞 Call ended: ${data.callSessionId}`);
    
    const callSession = callSessions.get(data.callSessionId);
    if (callSession) {
      callSession.status = 'ended';
      callSession.endTime = new Date();
      
      // Notify other participant
      const targetSocketId = callSession.doctorSocketId === socket.id 
        ? callSession.patientSocketId 
        : callSession.doctorSocketId;
      
      if (targetSocketId && targetSocketId !== 'simulated_patient') {
        io.to(targetSocketId).emit('call-ended', { callSession });
      }
      
      // Clean up
      callSessions.delete(data.callSessionId);
    }
  });

  // Handle data messages (chat, file sharing, etc.)
  socket.on('data-message', (data) => {
    console.log(`💬 Data message in call ${data.callSessionId}`);
    
    const callSession = callSessions.get(data.callSessionId);
    if (callSession) {
      const targetSocketId = callSession.doctorSocketId === socket.id 
        ? callSession.patientSocketId 
        : callSession.doctorSocketId;
      
      if (targetSocketId && targetSocketId !== 'simulated_patient') {
        io.to(targetSocketId).emit('data-message', {
          message: data.message,
          from: socket.id
        });
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`👋 Client disconnected: ${socket.id}, reason: ${reason}`);
    
    // Clean up active connections
    activeConnections.delete(socket.id);
    
    // Clean up any active calls
    const activeCalls = Array.from(callSessions.entries()).filter(([id, session]) => 
      session.doctorSocketId === socket.id || session.patientSocketId === socket.id
    );
    
    activeCalls.forEach(([callId, session]) => {
      console.log(`🧹 Cleaning up call session: ${callId}`);
      session.status = 'ended';
      session.endTime = new Date();
      
      // Notify other participant
      const targetSocketId = session.doctorSocketId === socket.id 
        ? session.patientSocketId 
        : session.doctorSocketId;
      
      if (targetSocketId && targetSocketId !== 'simulated_patient' && targetSocketId !== socket.id) {
        io.to(targetSocketId).emit('call-ended', { callSession: session });
      }
      
      callSessions.delete(callId);
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error from ${socket.id}:`, error);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeConnections: activeConnections.size,
    activeCalls: callSessions.size,
    uptime: process.uptime()
  });
});

// Get active connections (for debugging)
app.get('/debug/connections', (req, res) => {
  res.json({
    activeConnections: Array.from(activeConnections.entries()),
    activeCalls: Array.from(callSessions.entries())
  });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`🚀 WebRTC Signaling Server running on port ${PORT}`);
  console.log(`📡 Accepting connections from:`);
  console.log(`   - http://localhost:5173 (Vite dev server)`);
  console.log(`   - http://localhost:3000 (CRA dev server)`);
  console.log(`   - http://localhost:4173 (Vite preview)`);
  console.log(`🏥 Doctor Portal WebRTC Ready!`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🐛 Debug info: http://localhost:${PORT}/debug/connections`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down signaling server...');
  server.close(() => {
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down signaling server...');
  server.close(() => {
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});
