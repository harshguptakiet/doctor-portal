import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  ListChecks,
  UserCircle2,
  ClipboardList,
  Download,
  Edit3,
  X,
  Clock,
  Save,
  Phone,
  MoreHorizontal,
  UserCheck,
  Calendar,
  Settings,
  Database,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import PatientManager from './components/PatientManager';
import type { Patient } from './components/PatientTable';
import WebRTCCallManager from './components/WebRTCCallManager';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Firebase imports - Now enabled for real-time functionality
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { Firestore, DocumentData, QuerySnapshot } from 'firebase/firestore';

// Firebase config - Your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4cHeV25PvdgAgKttpoq3iBMMrtREH9iM",
  authDomain: "medibot-b2bf7.firebaseapp.com",
  projectId: "medibot-b2bf7",
  storageBucket: "medibot-b2bf7.firebasestorage.app",
  messagingSenderId: "735267785437",
  appId: "1:735267785437:web:db7c4275659f328f46a934",
  measurementId: "G-6LB717MSN1"
};

// Initialize Firebase
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

function ensureFirebase() {
  if (!firebaseApp) {
    try {
      // Check if Firebase app already exists
      const existingApps = getApps();
      if (existingApps.length > 0) {
        console.log('🔄 Using existing Firebase app');
        firebaseApp = getApp(); // Use the existing default app
      } else {
        console.log('🆕 Initializing new Firebase app');
        firebaseApp = initializeApp(firebaseConfig);
      }
      
      db = getFirestore(firebaseApp);
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      throw error;
    }
  }
  return { app: firebaseApp!, db: db! };
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'in-queue' | 'rescheduling';
export interface Appointment {
  id: string;
  patientId: string;
  scheduledFor: string;
  status: AppointmentStatus;
  reason?: string;
  createdAt?: string;
  followUpTime?: string;
}

type ViewKey = 'dashboard' | 'queue' | 'patients' | 'settings';
interface NavItem { key: ViewKey; label: string; icon: React.ReactNode }
const cx = (...c: (string | null | undefined | false)[]) => c.filter(Boolean).join(' ');
const isToday = (iso: string) => { const d=new Date(iso); const t=new Date(); return d.getDate()===t.getDate()&&d.getMonth()===t.getMonth()&&d.getFullYear()===t.getFullYear(); };

const App: React.FC = () => {
  // Temporarily remove Firebase to debug white page - use mock data
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  

  const [queueAppointments, setQueueAppointments] = useState<Appointment[]>([]);
  
  // Edit appointment state
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    patientId: '',
    scheduledFor: '',
    reason: '',
    status: 'scheduled' as AppointmentStatus,
    followUpTime: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Call session state
  const [activeCall, setActiveCall] = useState<{
    patientId: string;
    patientName: string;
    patientPhone: string;
    appointmentId?: string;
    startTime: Date;
  } | null>(null);
  const [callTimer, setCallTimer] = useState('00:00');
  const [activeTab, setActiveTab] = useState<'ehr' | 'chat' | 'notes'>('ehr');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'doctor' | 'patient';
    message: string;
    timestamp: Date;
    type: 'text' | 'file';
    fileName?: string;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');

  // Call timer effect
  React.useEffect(() => {
    if (activeCall) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - activeCall.startTime.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        setCallTimer(`${minutes}:${seconds}`);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activeCall]);

  // Real-time Firebase data loading
  React.useEffect(() => {
    console.log('🔄 Initializing Firebase connection...');
    
    try {
      const { db } = ensureFirebase();
      console.log('📡 Setting up Firebase listeners...');
      
      // Real-time patients listener
      const patientsQuery = query(collection(db, 'patients'), orderBy('firstName'));
      const unsubscribePatients = onSnapshot(patientsQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
        console.log(`📊 Received ${querySnapshot.size} patients from Firebase`);
        const patientsData: Patient[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          patientsData.push({
            id: doc.id,
            patientId: data.patientId || doc.id,
            firstName: data.firstName || '',
          lastName: data.lastName || '',
          age: data.age || 0,
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
        });
      });
      setPatients(patientsData);
    }, (error) => {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients data');
    });

    // Real-time appointments listener
    const appointmentsQuery = query(collection(db, 'appointments'), orderBy('scheduledFor'));
    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const appointmentsData: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsData.push({
          id: doc.id,
          patientId: data.patientId || '',
          scheduledFor: data.scheduledFor?.toDate?.()?.toISOString() || data.scheduledFor || '',
          status: data.status || 'scheduled',
          reason: data.reason || '',
          followUpTime: data.followUpTime?.toDate?.()?.toISOString() || data.followUpTime || '',
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
        });
      });
      setQueueAppointments(appointmentsData);
      setAppointments(appointmentsData);
    }, (error) => {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments data');
    });

    // Real-time chat messages listener
    const chatQuery = query(collection(db, 'chatMessages'), orderBy('timestamp'));
    const unsubscribeChat = onSnapshot(chatQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const messagesData: typeof chatMessages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          sender: data.sender || 'doctor',
          message: data.message || '',
          timestamp: data.timestamp?.toDate?.() || new Date(),
          type: data.type || 'text',
          fileName: data.fileName || '',
        });
      });
      setChatMessages(messagesData);
    });

    setLoading(false);

    // Cleanup subscriptions
    return () => {
      unsubscribePatients();
      unsubscribeAppointments();
      unsubscribeChat();
    };
    
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
      setError('Failed to connect to Firebase. Please check your internet connection and Firebase configuration.');
      setLoading(false);
    }
  }, []);

  // Firebase CRUD operations
  const initializeSampleData = async () => {
    console.log('🚀 Starting sample data initialization...');
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('🔧 Getting Firebase instance...');
      const { db } = ensureFirebase();
      console.log('✅ Firebase instance obtained successfully');
      
      // Test Firebase connection first
      console.log('🧪 Testing Firebase connection...');
      collection(db, 'test');
      console.log('✅ Firebase connection test passed');
      
      console.log('👥 Preparing sample patients data...');
      const samplePatients = [
        {
          firstName: 'Rajesh',
          lastName: 'Kumar',
          patientId: 'P001',
          age: 45,
          gender: 'Male',
          dateOfBirth: '1978-05-15',
          phone: '+91-9876543210',
          email: 'rajesh.kumar@gmail.com',
          location: 'Mumbai, MH',
          address: '123 Andheri West, Mumbai, Maharashtra 400058',
          registrationType: 'online' as const,
          lastVisitDate: '2025-09-10',
          lastVisitTime: '10:30 AM',
          lastVisitReason: 'Regular health checkup'
        },
        {
          firstName: 'Priya',
          lastName: 'Sharma',
          patientId: 'P002',
          age: 32,
          gender: 'Female',
          dateOfBirth: '1991-08-22',
          phone: '+91-8765432109',
          email: 'priya.sharma@yahoo.com',
          location: 'Delhi, DL',
          address: '456 Connaught Place, New Delhi, Delhi 110001',
          registrationType: 'walk-in' as const,
          lastVisitDate: '2025-09-11',
          lastVisitTime: '2:15 PM',
          lastVisitReason: 'Follow-up consultation'
        },
        {
          firstName: 'Arjun',
          lastName: 'Patel',
          patientId: 'P003',
          age: 28,
          gender: 'Male',
          dateOfBirth: '1995-12-03',
          phone: '+91-7654321098',
          email: 'arjun.patel@outlook.com',
          location: 'Ahmedabad, GJ',
          address: '789 Satellite Road, Ahmedabad, Gujarat 380015',
          registrationType: 'online' as const,
          lastVisitDate: '2025-09-09',
          lastVisitTime: '11:45 AM',
          lastVisitReason: 'Blood pressure monitoring'
        },
        {
          firstName: 'Sneha',
          lastName: 'Reddy',
          patientId: 'P004',
          age: 38,
          gender: 'Female',
          dateOfBirth: '1985-03-20',
          phone: '+91-6543210987',
          email: 'sneha.reddy@hotmail.com',
          location: 'Hyderabad, TS',
          address: '321 Banjara Hills, Hyderabad, Telangana 500034',
          registrationType: 'walk-in' as const,
          lastVisitDate: '2025-09-12',
          lastVisitTime: '4:30 PM',
          lastVisitReason: 'Diabetes management consultation'
        },
        {
          firstName: 'Vikram',
          lastName: 'Singh',
          patientId: 'P005',
          age: 52,
          gender: 'Male',
          dateOfBirth: '1971-07-08',
          phone: '+91-5432109876',
          email: 'vikram.singh@gmail.com',
          location: 'Jaipur, RJ',
          address: '654 Pink City, Jaipur, Rajasthan 302001',
          registrationType: 'online' as const,
          lastVisitDate: '2025-09-08',
          lastVisitTime: '9:15 AM',
          lastVisitReason: 'Annual physical examination'
        }
      ];

      // Add patients to Firebase
      console.log(`📝 Adding ${samplePatients.length} patients to Firebase...`);
      const patientIds: string[] = [];
      for (let i = 0; i < samplePatients.length; i++) {
        const patient = samplePatients[i];
        console.log(`👤 Adding patient ${i + 1}/${samplePatients.length}: ${patient.firstName} ${patient.lastName}`);
        
        try {
          const docRef = await addDoc(collection(db, 'patients'), {
            ...patient,
            createdAt: serverTimestamp(),
          });
          patientIds.push(docRef.id);
          console.log(`✅ Patient added with ID: ${docRef.id}`);
        } catch (patientError) {
          console.error(`❌ Failed to add patient ${patient.firstName}:`, patientError);
          throw patientError;
        }
      }
      console.log(`🎉 Successfully added all ${patientIds.length} patients!`);

      // Generate realistic appointments for today and coming days
      const generateTimeSlot = (daysFromNow: number, hour: number, minute: number = 0) => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        date.setHours(hour, minute, 0, 0);
        return date.toISOString();
      };

      const appointmentReasons = [
        'Regular health checkup',
        'Follow-up consultation',
        'Blood pressure monitoring',
        'Diabetes management',
        'Annual physical examination',
        'Prescription renewal',
        'Lab result review',
        'Specialist consultation',
        'Routine examination',
        'Health screening'
      ];


      // Create appointments for today and next few days
      const sampleAppointments = [];
      for (let day = 0; day < 3; day++) {
        for (let i = 0; i < patientIds.length; i++) {
          const hour = 9 + (i * 2); // Spread appointments throughout the day
          if (hour < 18) { // Only create appointments during working hours
            sampleAppointments.push({
              patientId: patientIds[i],
              scheduledFor: generateTimeSlot(day, hour, i * 15), // 15 min intervals
              status: day === 0 && i < 2 ? 'completed' : 'scheduled', // Only mark some as completed, rest as scheduled
              reason: appointmentReasons[i % appointmentReasons.length],
              createdAt: serverTimestamp(),
            });
          }
        }
      }

      // Add appointments to Firebase
      for (const appointment of sampleAppointments) {
        await addDoc(collection(db, 'appointments'), appointment);
      }

      // Add some sample chat messages
      const sampleChatMessages = [
        {
          appointmentId: 'demo-appointment-1',
          sender: 'doctor' as const,
          message: 'Hello! How are you feeling today?',
          timestamp: serverTimestamp(),
          type: 'text' as const,
        },
        {
          appointmentId: 'demo-appointment-1',
          sender: 'patient' as const,
          message: 'I am feeling much better, thank you doctor.',
          timestamp: serverTimestamp(),
          type: 'text' as const,
        },
        {
          appointmentId: 'demo-appointment-1',
          sender: 'doctor' as const,
          message: 'That\'s great to hear! Let\'s review your latest test results.',
          timestamp: serverTimestamp(),
          type: 'text' as const,
        }
      ];

      // Add chat messages to Firebase
      console.log(`💬 Adding ${sampleChatMessages.length} sample chat messages...`);
      for (const message of sampleChatMessages) {
        await addDoc(collection(db, 'chatMessages'), message);
      }
      console.log('✅ Sample chat messages added successfully!');

      console.log('🎉 Sample data initialization completed successfully!');
      console.log('📊 Summary:');
      console.log(`   - ${samplePatients.length} patients added`);
      console.log(`   - Multiple appointments created`);
      console.log(`   - ${sampleChatMessages.length} chat messages added`);
      console.log('🔍 Check your Firebase Console to see the data!');
      
      setLoading(false);
      
    } catch (error: any) {
      console.error('❌ Error initializing sample data:', error);
      console.error('📋 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code || 'unknown',
      });
      
      // Provide specific error messages
      let errorMessage = 'Failed to initialize sample data. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Please check your Firestore security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Firebase service is currently unavailable. Please try again later.';
      } else if (error.message?.includes('network')) {
        errorMessage += 'Please check your internet connection.';
      } else {
        errorMessage += 'Please check your Firebase configuration and console for details.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Simple Firebase connection test
  const testFirebaseConnection = async () => {
    console.log('🔍 Testing Firebase connection...');
    try {
      setLoading(true);
      setError(null);
      
      const { db } = ensureFirebase();
      console.log('✅ Firebase initialized');
      
      // Try to read from a collection (this will create it if it doesn't exist)
      const testCollection = collection(db, 'connection-test');
      console.log('✅ Collection reference created');
      
      // Try to add a test document
      const testDoc = await addDoc(testCollection, {
        test: true,
        timestamp: serverTimestamp(),
        message: 'Connection test successful'
      });
      console.log('✅ Test document added with ID:', testDoc.id);
      
      // Try to delete the test document
      await deleteDoc(doc(db, 'connection-test', testDoc.id));
      console.log('✅ Test document deleted');
      
      console.log('🎉 Firebase connection test completed successfully!');
      alert('✅ Firebase connection test successful! Check the console for details.');
      
    } catch (error: any) {
      console.error('❌ Firebase connection test failed:', error);
      setError(`Connection test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const updateAppointmentInFirebase = async (appointmentId: string, updates: Partial<Appointment>) => {
    const { db } = ensureFirebase();
    try {
      const firebaseUpdates: any = { ...updates };
      if (updates.scheduledFor) {
        firebaseUpdates.scheduledFor = Timestamp.fromDate(new Date(updates.scheduledFor));
      }
      if (updates.followUpTime) {
        firebaseUpdates.followUpTime = Timestamp.fromDate(new Date(updates.followUpTime));
      }
      await updateDoc(doc(db, 'appointments', appointmentId), firebaseUpdates);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment');
    }
  };

  const deleteAppointmentFromFirebase = async (appointmentId: string) => {
    const { db } = ensureFirebase();
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to delete appointment');
    }
  };

  const addChatMessageToFirebase = async (message: Omit<typeof chatMessages[0], 'id'>) => {
    const { db } = ensureFirebase();
    try {
      await addDoc(collection(db, 'chatMessages'), {
        ...message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding chat message:', error);
    }
  };

  const navItems: NavItem[] = useMemo(()=>[
    { key:'dashboard', label:'Dashboard', icon:<LayoutDashboard size={18} /> },
    { key:'queue', label:'Patient Queue', icon:<ListChecks size={18} /> },
    { key:'patients', label:'Patients', icon:<Users size={18} /> },
    { key:'settings', label:'Settings', icon:<Settings size={18} /> },
  ],[]);

  const stats = useMemo(()=>{
    const completed = appointments.filter(a=>a.status==='completed').length;
    const cancelled = appointments.filter(a=>a.status==='cancelled').length;
    const totalPatients = patients.length;
    const inQueue = queueAppointments.length;
    return {completed, cancelled, totalPatients, inQueue};
  },[appointments, patients, queueAppointments]);

  const todaysAppointments = useMemo(()=> appointments.filter(a=>isToday(a.scheduledFor)), [appointments]);
  const patientMap = useMemo(()=>{ const m:Record<string,Patient>={}; patients.forEach(p=>m[p.id]=p); return m; },[patients]);

  // Chart data for Patients Log (Bar Chart)
  const patientsLogData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Patients added over the Year',
        data: [400, 450, 500, 550, 600, 650, 700, 800, 850, 950, 1150, 1200],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const patientsLogOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 200,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Chart data for Appointment Booking Through (Line Chart)
  const appointmentBookingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Online',
        data: [20, 25, 35, 45, 50, 55, 60, 65, 70, 75, 80, 85],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Walk-in',
        data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
        borderColor: 'rgba(249, 115, 22, 1)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(249, 115, 22, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'On-line',
        data: [30, 35, 40, 35, 30, 35, 40, 45, 50, 45, 40, 35],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Phone-in',
        data: [25, 30, 28, 25, 30, 35, 40, 45, 50, 55, 60, 65],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const appointmentBookingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 20,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const StatCard: React.FC<{title:string; value:number; icon:React.ReactNode}> = ({title,value,icon}) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview and today's activity.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Firebase Status Indicator */}
          <div className="text-sm">
            <span className="text-gray-500">Patients: </span>
            <span className="font-medium">{patients.length}</span>
            {loading && <span className="text-blue-600 ml-2">Loading...</span>}
          </div>
          
          {/* Test Connection Button */}
          <button
            onClick={testFirebaseConnection}
            disabled={loading}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="Test Firebase connection"
          >
            🔍 Test Connection
          </button>
          
          {/* Always show the button for testing, but change text based on state */}
          <button
            onClick={initializeSampleData}
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : patients.length === 0 
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-green-600 hover:bg-green-700'
            }`}
            title={patients.length === 0 ? "Load sample data to test the Firebase integration" : "Add more sample data"}
          >
            <Database size={16} className="mr-2" />
            {loading 
              ? 'Initializing...' 
              : patients.length === 0 
                ? 'Initialize Sample Data' 
                : 'Add More Sample Data'
            }
          </button>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
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
      )}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Completed Appointments" value={stats.completed} icon={<Activity className="text-emerald-600" size={20} />} />
        <StatCard title="Total Patients" value={stats.totalPatients} icon={<Users className="text-sky-600" size={20} />} />
        <StatCard title="Cancelled Appointments" value={stats.cancelled} icon={<ClipboardList className="text-rose-600" size={20} />} />
        <StatCard title="Patients in Queue" value={stats.inQueue} icon={<ListChecks className="text-amber-600" size={20} />} />
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patients Log Chart */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Patients Log</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Patients added over the Year</span>
              <Download size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Bar data={patientsLogData} options={patientsLogOptions} />
            </div>
          </div>
        </div>

        {/* Appointment Booking Through Chart */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Appointment Booking Through</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Appointment trends over the Year</span>
              <Download size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Line data={appointmentBookingData} options={appointmentBookingOptions} />
            </div>
          </div>
        </div>
      </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-medium text-gray-800">Today's Patients</h2>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium">{todaysAppointments.length}</span>
            </div>
            <div className="p-6">
              {todaysAppointments.length === 0 && (
                <div className="text-sm text-gray-500">No appointments scheduled for today.</div>
              )}
              {todaysAppointments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {todaysAppointments.slice(0, 5).map(appt => {
                    const patient = patientMap[appt.patientId];
                    return (
                      <div key={appt.id} className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                        {/* Patient logo placeholder (replace src with patient.profileImage later) */}
                        <div className="h-16 w-16 rounded-lg bg-sky-100 flex items-center justify-center mb-2">
                          {/* Replace with <img src={patient.profileImage} ... /> when available */}
                          <span className="text-sky-700 font-bold text-xl">
                            {patient ? patient.firstName.charAt(0) + patient.lastName.charAt(0) : 'PT'}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-800 truncate">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
    </div>
  );

  // Queue management functions
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const startEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment.id);
    setEditForm({
      patientId: appointment.patientId,
      scheduledFor: appointment.scheduledFor,
      reason: appointment.reason || '',
      status: appointment.status,
      followUpTime: appointment.followUpTime || ''
    });
  };

  const saveAppointmentEdit = async () => {
    if (!editingAppointment) return;
    
    try {
      await updateAppointmentInFirebase(editingAppointment, editForm);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const cancelAppointmentEdit = () => {
    setEditingAppointment(null);
    setEditForm({
      patientId: '',
      scheduledFor: '',
      reason: '',
      status: 'scheduled',
      followUpTime: ''
    });
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteAppointmentFromFirebase(appointmentId);
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  // Remove all old patient search/filter state and SearchInput component as they're now handled by PatientManager
  
  const QueueView = () => {
    // Sort appointments by time
    const sortedAppointments = [...queueAppointments].sort((a, b) => 
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );

    const handleCallNext = async () => {
      const nextPatient = sortedAppointments.find(appt => appt.status === 'scheduled');
      if (nextPatient) {
        const patientData = patientMap[nextPatient.patientId];
        if (!patientData) {
          alert('Patient data not found');
          return;
        }

        // Use WebRTC calling system
        const manager = (window as any).webrtcCallManager;
        if (manager && typeof manager.initiateCall === 'function') {
          try {
            await manager.initiateCall(patientData, nextPatient.id);
            console.log('📞 WebRTC call initiated for next patient');
          } catch (error) {
            console.error('❌ Error initiating WebRTC call:', error);
            alert('Failed to start video call. Please check your camera and microphone permissions.');
          }
        } else {
          // Fallback to old system if WebRTC not available
          const patientName = `${patientData.firstName} ${patientData.lastName}`;
          const confirmed = window.confirm(`WebRTC not available. Use audio-only call for ${patientName}?`);
          if (confirmed) {
            setActiveCall({
              patientId: patientData.id,
              patientName,
              patientPhone: patientData.phone || '',
              appointmentId: nextPatient.id,
              startTime: new Date()
            });
          }
        }
      }
    };

    const handleCallPatient = async (patientPhone: string, patientName: string, appointmentId?: string) => {
      // Find patient details
      const patient = patients.find(p => `${p.firstName} ${p.lastName}` === patientName);
      
      if (!patient) {
        alert('Patient details not found.');
        return;
      }

      // Use WebRTC calling system
      const manager = (window as any).webrtcCallManager;
      if (manager && typeof manager.initiateCall === 'function') {
        try {
          await manager.initiateCall(patient, appointmentId);
          console.log('📞 WebRTC call initiated for patient:', patientName);
        } catch (error) {
          console.error('❌ Error initiating WebRTC call:', error);
          alert('Failed to start video call. Please check your camera and microphone permissions.');
        }
      } else {
        // Fallback to old system if WebRTC not available
        if (patientPhone) {
          const confirmed = window.confirm(`WebRTC not available. Use audio-only call for ${patientName}?`);
          if (confirmed) {
            setActiveCall({
              patientId: patient.id,
              patientName,
              patientPhone,
              appointmentId,
              startTime: new Date()
            });
          }
        } else {
          alert('No phone number available for this patient.');
        }
      }
    };

    const handleRescheduleAppointment = (appointmentId: string) => {
      // Get current appointment details
      const currentAppt = queueAppointments.find(appt => appt.id === appointmentId);
      if (!currentAppt) return;

      // Create a default new time (current time + 1 hour)
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      const defaultTimeString = defaultTime.toISOString().slice(0, 16);

      const newTimeString = prompt(
        `Reschedule appointment for ${patientMap[currentAppt.patientId]?.firstName || 'patient'}?\n\nEnter new date and time (YYYY-MM-DDTHH:MM):`,
        defaultTimeString
      );
      
      if (newTimeString) {
        try {
          const newTime = new Date(newTimeString);
          if (isNaN(newTime.getTime())) {
            throw new Error('Invalid date');
          }
          
          setQueueAppointments(prev => 
            prev.map(appt => 
              appt.id === appointmentId 
                ? { ...appt, status: 'rescheduling' as AppointmentStatus, scheduledFor: newTime.toISOString() }
                : appt
            )
          );
          
          alert(`Appointment rescheduled to ${newTime.toLocaleString()}`);
        } catch (error) {
          alert('Invalid date format. Please use the format: YYYY-MM-DDTHH:MM (e.g., 2025-09-13T14:30)');
        }
      }
    };

    const handleConfirmReschedule = (appointmentId: string) => {
      const confirmed = window.confirm('Confirm this rescheduled appointment?');
      if (confirmed) {
        setQueueAppointments(prev => 
          prev.map(appt => 
            appt.id === appointmentId 
              ? { ...appt, status: 'scheduled' as AppointmentStatus }
              : appt
          )
        );
      }
    };

    const handleSetFollowUp = (appointmentId: string) => {
      const currentAppt = queueAppointments.find(appt => appt.id === appointmentId);
      if (!currentAppt || currentAppt.status !== 'completed') {
        alert('Follow-up can only be set for completed appointments.');
        return;
      }

      // Create a default follow-up time (current time + 1 week)
      const defaultFollowUp = new Date();
      defaultFollowUp.setDate(defaultFollowUp.getDate() + 7);
      const defaultTimeString = defaultFollowUp.toISOString().slice(0, 16);

      const followUpTimeString = prompt(
        `Set follow-up time for ${patientMap[currentAppt.patientId]?.firstName || 'patient'}?\n\nEnter follow-up date and time (YYYY-MM-DDTHH:MM):`,
        defaultTimeString
      );
      
      if (followUpTimeString) {
        try {
          const followUpTime = new Date(followUpTimeString);
          if (isNaN(followUpTime.getTime())) {
            throw new Error('Invalid date');
          }
          
          setQueueAppointments(prev => 
            prev.map(appt => 
              appt.id === appointmentId 
                ? { ...appt, followUpTime: followUpTime.toISOString() }
                : appt
            )
          );
          
          alert(`Follow-up scheduled for ${followUpTime.toLocaleString()}`);
        } catch (error) {
          alert('Invalid date format. Please use the format: YYYY-MM-DDTHH:MM (e.g., 2025-09-20T14:30)');
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Patient Queue</h1>
            <p className="text-sm text-gray-500 mt-1">24-hour appointment schedule with edit capabilities</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-gray-400" />
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
              {queueAppointments.length} appointments today
            </span>
          </div>
        </div>

        {/* Active Patient Section - Only show when there's an active call */}
        {activeCall && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800">Active Call Session</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Patient Avatar */}
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {activeCall.patientName.charAt(0)}
                    </div>
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {activeCall.patientName}
                      </h3>
                      <span className="text-sm text-gray-500">📞</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Call Duration:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-mono">
                          {callTimer}
                        </span>
                      </span>
                      <span>|</span>
                      <span>{activeCall.patientPhone}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Call Type • </span>
                      <span className="text-sm font-medium text-gray-700">
                        {activeCall.appointmentId ? 'Scheduled Appointment' : 'Manual Call'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{callTimer}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      const confirmed = window.confirm(`End call with ${activeCall.patientName}?`);
                      if (confirmed) {
                        // If this was a scheduled appointment call, mark it as completed
                        if (activeCall.appointmentId) {
                          try {
                            await updateAppointmentInFirebase(activeCall.appointmentId, { status: 'completed' });
                            console.log('✅ Appointment marked as completed');
                          } catch (error) {
                            console.error('❌ Error updating appointment status:', error);
                          }
                        }
                        
                        // End the call
                        setActiveCall(null);
                        setCallTimer('00:00');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2 font-medium"
                  >
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                    End Call
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="More options"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call Next Patient Button - Only show when no active call */}
        {!activeCall && sortedAppointments.some(appt => appt.status === 'scheduled') && (
          <div className="mb-6">
            <button 
              onClick={handleCallNext}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <UserCheck className="w-5 h-5" />
              <span>Call Next Patient</span>
            </button>
          </div>
        )}
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Today's Schedule</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {queueAppointments.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500">No appointments scheduled for today.</div>
            )}
            
            {sortedAppointments.slice(0, 10).map(appt => {
              const p = patientMap[appt.patientId];
              const isEditing = editingAppointment === appt.id;
              const statusColor = {
                'completed': 'bg-green-100 text-green-700',
                'in-queue': 'bg-amber-100 text-amber-700',
                'scheduled': 'bg-blue-100 text-blue-700',
                'cancelled': 'bg-red-100 text-red-700',
                'rescheduling': 'bg-purple-100 text-purple-700'
              };

              return (
                <div key={appt.id} className={`px-6 py-4 ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'} transition`}>
                  {!isEditing ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-bold text-gray-900">
                            {formatTime(appt.scheduledFor)}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[appt.status]}`}>
                            {appt.status}
                          </div>
                        </div>
                        
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          appt.status === 'completed' ? 'bg-green-500' :
                          appt.status === 'in-queue' ? 'bg-amber-500' :
                          appt.status === 'cancelled' ? 'bg-red-500' :
                          appt.status === 'rescheduling' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {p ? p.firstName.charAt(0) + p.lastName.charAt(0) : 'PT'}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {p ? `${p.firstName} ${p.lastName}` : 'Unknown Patient'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {appt.reason || 'General Consultation'}
                            {appt.status === 'rescheduling' && (
                              <span className="ml-2 text-purple-600 font-medium">
                                • Rescheduled to {formatTime(appt.scheduledFor)}
                              </span>
                            )}
                          </p>
                          {p?.phone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone size={12} />
                              {p.phone}
                              {appt.status === 'completed' && (
                                <span className="text-green-600 font-medium">• Available to call</span>
                              )}
                            </p>
                          )}
                          {appt.followUpTime && appt.status === 'completed' && (
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                              <Clock size={12} />
                              <span className="font-medium">Follow-up: {new Date(appt.followUpTime).toLocaleString()}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {/* Call button for all appointments */}
                        {p?.phone && (
                          <button
                            onClick={() => handleCallPatient(p.phone!, `${p.firstName} ${p.lastName}`, appt.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                            title={`Call ${p.firstName} ${p.lastName}`}
                          >
                            <Phone size={16} />
                          </button>
                        )}
                        {/* Reschedule button for scheduled/cancelled appointments */}
                        {(appt.status === 'scheduled' || appt.status === 'cancelled') && (
                          <button
                            onClick={() => handleRescheduleAppointment(appt.id)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition"
                            title="Reschedule appointment"
                          >
                            <Calendar size={16} />
                          </button>
                        )}
                        {/* Confirm reschedule button for rescheduling appointments */}
                        {appt.status === 'rescheduling' && (
                          <button
                            onClick={() => handleConfirmReschedule(appt.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                            title="Confirm rescheduled time"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {/* Follow-up button for completed appointments */}
                        {appt.status === 'completed' && (
                          <button
                            onClick={() => handleSetFollowUp(appt.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            title={appt.followUpTime ? "Update follow-up time" : "Set follow-up time"}
                          >
                            <Clock size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => startEditAppointment(appt)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Edit appointment"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteAppointment(appt.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Cancel appointment"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                          <select
                            value={editForm.patientId}
                            onChange={(e) => setEditForm(prev => ({ ...prev, patientId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            title="Select patient"
                          >
                            {patients.map(patient => (
                              <option key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <input
                            type="datetime-local"
                            value={editForm.scheduledFor.slice(0, 16)}
                            onChange={(e) => setEditForm(prev => ({ ...prev, scheduledFor: new Date(e.target.value).toISOString() }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            title="Select appointment time"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as AppointmentStatus }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            title="Select appointment status"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in-queue">In Queue</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rescheduling">Rescheduling</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <input
                          type="text"
                          value={editForm.reason}
                          onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Appointment reason"
                          title="Enter appointment reason"
                        />
                      </div>
                      
                      {editForm.status === 'completed' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Time (Optional)</label>
                          <input
                            type="datetime-local"
                            value={editForm.followUpTime ? editForm.followUpTime.slice(0, 16) : ''}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              followUpTime: e.target.value ? new Date(e.target.value).toISOString() : ''
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Select follow-up time"
                            title="Enter follow-up time"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={cancelAppointmentEdit}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveAppointmentEdit}
                          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const PatientsView = () => {
    return <PatientManager initialPatients={patients} />;
  };

  const SettingsView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">System configuration and preferences.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Application Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Select theme"
            >
              <option>Light Mode</option>
              <option>Dark Mode</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Appointment reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">New patient alerts</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'queue': return <QueueView />;
      case 'patients': return <PatientsView />;
      case 'settings': return <SettingsView />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 text-gray-800">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 px-5 flex items-center gap-2 border-b border-gray-100">
          <div className="h-10 w-10 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-lg">DP</div>
          <div>
            <p className="font-semibold tracking-tight text-gray-800">Doctor Portal</p>
            <p className="text-[10px] uppercase font-medium text-sky-600 tracking-wide">v1.0</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => (
              <li key={item.key}>
                <button onClick={()=>setActiveView(item.key)} className={cx('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500/50', activeView===item.key ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100')}>
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mini Calendar Component */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Schedule Overview</h3>
              <div className="text-xs text-blue-600 font-medium">
                {new Date().getFullYear()}
              </div>
            </div>
            
            {/* Current Month Mini Calendar */}
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-700 mb-2 text-center">
                {new Date().toLocaleDateString('en-US', { month: 'long' })}
              </div>
              <div className="grid grid-cols-7 gap-1 text-[10px]">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-gray-500 font-medium p-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date();
                  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay());
                  const currentDate = new Date(startDate);
                  currentDate.setDate(currentDate.getDate() + i);
                  
                  const isCurrentMonth = currentDate.getMonth() === date.getMonth();
                  const isToday = currentDate.toDateString() === date.toDateString();
                  const hasAppointments = queueAppointments.some(appt => 
                    new Date(appt.scheduledFor).toDateString() === currentDate.toDateString()
                  );
                  
                  return (
                    <div
                      key={i}
                      className={`
                        relative text-center p-1 rounded transition-colors cursor-pointer
                        ${isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}
                        ${isToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-blue-100'}
                        ${hasAppointments ? 'ring-1 ring-green-400' : ''}
                      `}
                    >
                      <span className="text-[9px]">{currentDate.getDate()}</span>
                      {hasAppointments && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-blue-600">
                  {queueAppointments.filter(appt => {
                    const apptDate = new Date(appt.scheduledFor);
                    const today = new Date();
                    return apptDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <div className="text-gray-600">Today</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-bold text-green-600">
                  {queueAppointments.filter(appt => {
                    const apptDate = new Date(appt.scheduledFor);
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    const today = new Date();
                    return apptDate >= today && apptDate <= nextWeek;
                  }).length}
                </div>
                <div className="text-gray-600">This Week</div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-3 flex items-center justify-center space-x-3 text-[10px]">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Appointments</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
          <UserCircle2 size={16} className="text-gray-400" />
          <span>Signed in as Doctor</span>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {loading && <div className="mb-6 rounded-lg bg-white border border-gray-200 p-4 text-sm text-gray-500">Loading data...</div>}
          {error && <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">{error}</div>}
          {renderView()}
        </div>
      </main>

      {/* Full Call Interface */}
      {activeCall && (
        <div className="fixed inset-0 bg-gray-900 z-50 flex">
          {/* Main Call Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {activeCall.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{activeCall.patientName}</h2>
                    <p className="text-sm text-gray-500">
                      {activeCall.appointmentId ? 'Queue Patient Call' : 'Manual Call'} • {activeCall.patientPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">{callTimer}</span>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  const confirmed = window.confirm('End call and close interface?');
                  if (confirmed) {
                    // If this was a scheduled appointment call, mark it as completed
                    if (activeCall.appointmentId) {
                      try {
                        await updateAppointmentInFirebase(activeCall.appointmentId, { status: 'completed' });
                        console.log('✅ Appointment marked as completed');
                      } catch (error) {
                        console.error('❌ Error updating appointment status:', error);
                      }
                    }
                    
                    // End the call
                    setActiveCall(null);
                    setCallTimer('00:00');
                  }
                }}
                className="text-gray-400 hover:text-gray-600 p-2"
                title="End call and close interface"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video/Voice Call Area */}
            <div className="flex-1 bg-gray-900 relative overflow-hidden">
              {/* Video Call Simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mb-4 mx-auto">
                    {activeCall.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{activeCall.patientName}</h3>
                  <p className="text-gray-300">Connected • {callTimer}</p>
                </div>
              </div>

              {/* Doctor's Video (Small Window) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                      DR
                    </div>
                    <p className="text-white text-sm">Dr. Smith</p>
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-4 flex items-center space-x-4">
                  <button className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white text-xl">🎥</span>
                  </button>
                  <button 
                    className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                    title="Toggle mute"
                  >
                    <span className="text-white text-xl">🔇</span>
                  </button>
                  <button 
                    className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                    title="Open chat"
                  >
                    <span className="text-white text-xl">💬</span>
                  </button>
                  <button 
                    onClick={async () => {
                      const confirmed = window.confirm('End call with ' + activeCall.patientName + '?');
                      if (confirmed) {
                        // If this was a scheduled appointment call, mark it as completed
                        if (activeCall.appointmentId) {
                          try {
                            await updateAppointmentInFirebase(activeCall.appointmentId, { status: 'completed' });
                            console.log('✅ Appointment marked as completed');
                          } catch (error) {
                            console.error('❌ Error updating appointment status:', error);
                          }
                        }
                        
                        // End the call
                        setActiveCall(null);
                        setCallTimer('00:00');
                      }
                    }}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    title="End call"
                  >
                    <Phone size={20} className="text-white rotate-135" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - EHR & Chat */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button 
                  onClick={() => setActiveTab('ehr')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'ehr' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  EHR
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'chat' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Chat
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'notes' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notes
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'ehr' && (
                <div className="p-4 space-y-4">
              {(() => {
                const patient = patients.find(p => p.id === activeCall.patientId);
                const appointment = activeCall.appointmentId ? 
                  queueAppointments.find(appt => appt.id === activeCall.appointmentId) : null;
                
                return (
                  <div className="space-y-4">
                    {/* Patient Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                      {patient ? (
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Name:</span> {patient.firstName} {patient.lastName}</div>
                          <div><span className="font-medium">Age:</span> {patient.age}</div>
                          <div><span className="font-medium">Gender:</span> {patient.gender}</div>
                          <div><span className="font-medium">DOB:</span> {patient.dateOfBirth}</div>
                          <div><span className="font-medium">Phone:</span> {patient.phone}</div>
                          <div><span className="font-medium">Email:</span> {patient.email}</div>
                          <div><span className="font-medium">Address:</span> {patient.address}</div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Patient details not available</p>
                      )}
                    </div>

                    {/* Current Appointment */}
                    {appointment && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Current Appointment</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Time:</span> {new Date(appointment.scheduledFor).toLocaleString()}</div>
                          <div><span className="font-medium">Reason:</span> {appointment.reason || 'General Consultation'}</div>
                          <div><span className="font-medium">Status:</span> 
                            <span className="ml-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical History */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Medical History</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Previous Visits</div>
                          <div className="text-gray-600">Last visit: March 15, 2025</div>
                          <div className="text-gray-600">Diagnosis: Routine checkup</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Allergies</div>
                          <div className="text-gray-600">No known allergies</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Current Medications</div>
                          <div className="text-gray-600">None reported</div>
                        </div>
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Latest Vital Signs</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Blood Pressure</div>
                          <div className="text-gray-900">120/80</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Heart Rate</div>
                          <div className="text-gray-900">72 bpm</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Temperature</div>
                          <div className="text-gray-900">98.6°F</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Weight</div>
                          <div className="text-gray-900">150 lbs</div>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Scheduling */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Schedule Follow-up</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date & Time</label>
                          <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                            aria-label="Follow-up Date & Time"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                          <input
                            type="text"
                            placeholder="Follow-up reason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          />
                        </div>
                        <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                          Schedule Follow-up
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="flex flex-col h-full">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No messages yet. Start a conversation with the patient.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'doctor' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        onKeyPress={async (e) => {
                          if (e.key === 'Enter' && newMessage.trim()) {
                            await addChatMessageToFirebase({
                              sender: 'doctor',
                              message: newMessage,
                              timestamp: new Date(),
                              type: 'text'
                            });
                            setNewMessage('');
                          }
                        }}
                      />
                      <button 
                        onClick={async () => {
                          if (newMessage.trim()) {
                            await addChatMessageToFirebase({
                              sender: 'doctor',
                              message: newMessage,
                              timestamp: new Date(),
                              type: 'text'
                            });
                            setNewMessage('');
                          }
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                    <div className="flex items-center mt-2 space-x-2">
                      <button className="text-gray-500 hover:text-gray-700 p-1">
                        📎
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 p-1">
                        📷
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 p-1">
                        🎤
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="p-4 h-full">
                  <div className="h-full flex flex-col space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Session Notes</h3>
                      <textarea
                        placeholder="Enter your notes about this consultation..."
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
                      <input
                        type="text"
                        placeholder="Enter diagnosis..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Prescription</h3>
                      <textarea
                        placeholder="Enter prescription details..."
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Save Notes
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* WebRTC Call Manager */}
      <WebRTCCallManager 
        patients={patients}
        onCallEnd={async (session) => {
          console.log('📞 WebRTC call ended:', session);
          // Mark appointment as completed if it was a scheduled call
          if (session.appointmentId) {
            try {
              await updateAppointmentInFirebase(session.appointmentId, { status: 'completed' });
              console.log('✅ Appointment marked as completed after WebRTC call');
            } catch (error) {
              console.error('❌ Error updating appointment status after call:', error);
            }
          }
          // Also end any legacy active call state
          setActiveCall(null);
          setCallTimer('00:00');
        }}
      />
    </div>
  );
};

export default App;
