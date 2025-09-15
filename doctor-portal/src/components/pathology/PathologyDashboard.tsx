import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  TestTube,
  Users,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  LogOut,
  ChevronDown,
  Plus,
  Download,
  Eye,
  Activity,
  DollarSign,
  Package,
  Home,
  Phone,
  Award,
  Shield,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, onAuthStateChange } from '../../services/authService';
import type { PathologyUser } from '../../types/auth';

// Mock data for the dashboard
const mockData = {
  stats: {
    todaysSamples: 156,
    testsCompleted: 89,
    pendingResults: 43,
    revenue: 78450
  },
  recentSamples: [
    { id: 'S001', patientName: 'Raj Kumar', tests: ['CBC', 'LFT'], status: 'processing', collectedAt: '2 hours ago', priority: 'normal' },
    { id: 'S002', patientName: 'Priya Sharma', tests: ['Thyroid Profile'], status: 'completed', collectedAt: '3 hours ago', priority: 'urgent' },
    { id: 'S003', patientName: 'Amit Singh', tests: ['Lipid Profile', 'HbA1c'], status: 'pending', collectedAt: '1 hour ago', priority: 'normal' },
    { id: 'S004', patientName: 'Sunita Devi', tests: ['Urine Culture'], status: 'processing', collectedAt: '4 hours ago', priority: 'stat' }
  ],
  pendingReports: [
    { id: 'R001', patientName: 'Vikash Kumar', testName: 'Complete Blood Count', technician: 'Dr. Ravi', dueTime: '2 hours', status: 'awaiting_approval' },
    { id: 'R002', patientName: 'Meera Joshi', testName: 'Liver Function Test', technician: 'Lab Tech 1', dueTime: '1 hour', status: 'in_review' },
    { id: 'R003', patientName: 'Rohit Gupta', testName: 'Thyroid Profile', technician: 'Dr. Ravi', dueTime: '30 min', status: 'ready_to_send' }
  ],
  criticalAlerts: [
    { id: 'A001', type: 'critical_result', message: 'Critical glucose level detected for Patient ID: P123', time: '5 min ago' },
    { id: 'A002', type: 'equipment', message: 'Hematology analyzer requires calibration', time: '15 min ago' },
    { id: 'A003', type: 'reagent', message: 'Low reagent levels for Biochemistry tests', time: '1 hour ago' }
  ]
};

type ViewKey = 'dashboard' | 'samples' | 'tests' | 'reports' | 'patients' | 'analytics' | 'settings';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const PathologyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [currentLab, setCurrentLab] = useState<PathologyUser | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState([
    { id: '1', title: 'Critical result alert for Patient P123', time: '5 min ago', type: 'critical' },
    { id: '2', title: 'Equipment calibration due', time: '15 min ago', type: 'warning' },
    { id: '3', title: 'Monthly QC report ready', time: '1 hour ago', type: 'info' },
  ]);

  // Navigation items
  const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'samples', label: 'Sample Tracking', icon: <TestTube size={18} />, badge: 43 },
    { key: 'tests', label: 'Test Catalog', icon: <FlaskConical size={18} /> },
    { key: 'reports', label: 'Reports', icon: <FileText size={18} />, badge: 12 },
    { key: 'patients', label: 'Patients', icon: <Users size={18} /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  // Load lab profile
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authState) => {
      if (authState.user && authState.user.role === 'pathology') {
        setCurrentLab(authState.user as PathologyUser);
        setLoading(false);
      } else if (!authState.loading) {
        // Not a pathology lab or not authenticated, redirect to login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
      setShowNotifications(false);
    };
    
    if (showProfileDropdown || showNotifications) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showProfileDropdown, showNotifications]);

  // Get lab initials
  const getLabInitials = () => {
    if (!currentLab?.labName) return 'LAB';
    const words = currentLab.labName.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return currentLab.labName.substring(0, 2).toUpperCase();
  };

  // Stats Card Component
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    trendType?: 'positive' | 'negative';
  }> = ({ title, value, icon, color, trend, trendType }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center text-sm ${
              trendType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trendType === 'negative' ? 'rotate-180' : ''}`} />
              <span>{trend} from yesterday</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Header Component
  const LabHeader: React.FC = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {activeView === 'dashboard' ? 'Laboratory Dashboard' :
                 activeView === 'samples' ? 'Sample Tracking' :
                 activeView === 'tests' ? 'Test Catalog Management' :
                 activeView === 'reports' ? 'Reports & Results' :
                 activeView === 'patients' ? 'Patient Management' :
                 activeView === 'analytics' ? 'Analytics & Insights' :
                 activeView === 'settings' ? 'Settings' : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search samples, tests, patients..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'critical' ? 'bg-red-400' :
                            notification.type === 'warning' ? 'bg-yellow-400' :
                            notification.type === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lab Profile Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium text-sm">
                  {getLabInitials()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{currentLab?.labName}</p>
                  <p className="text-xs text-gray-500">Diagnostic Laboratory</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && currentLab && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {getLabInitials()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{currentLab.labName}</p>
                        <p className="text-xs text-gray-500">{currentLab.email}</p>
                        <div className="flex items-center mt-1">
                          <Award className="h-3 w-3 text-orange-500 mr-1" />
                          <span className="text-xs text-gray-600">License: {currentLab.licenseNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-orange-50 rounded-lg px-2 py-1">
                        <p className="text-xs font-semibold text-orange-600">{currentLab.rating}</p>
                        <p className="text-[10px] text-gray-500">Rating</p>
                      </div>
                      <div className="bg-green-50 rounded-lg px-2 py-1">
                        <p className="text-xs font-semibold text-green-600">{currentLab.totalTestsCompleted}</p>
                        <p className="text-[10px] text-gray-500">Tests</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg px-2 py-1">
                        <p className="text-xs font-semibold text-blue-600">{currentLab.averageTurnaroundTime}h</p>
                        <p className="text-[10px] text-gray-500">TAT</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setActiveView('settings');
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      Lab Profile
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      Settings
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      Support
                    </button>
                    
                    {currentLab.isNABLAccredited && (
                      <div className="flex items-center px-4 py-2 text-sm text-green-700">
                        <Shield className="h-4 w-4 mr-3 text-green-500" />
                        NABL Accredited
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Dashboard View Component
  const DashboardView: React.FC = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Welcome back!</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening in your laboratory today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
            <Plus size={16} className="mr-2" />
            New Sample
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Today's Samples" 
          value={mockData.stats.todaysSamples}
          icon={<TestTube className="text-white" size={20} />}
          color="bg-blue-600"
          trend="+12.5%"
          trendType="positive"
        />
        <StatCard 
          title="Tests Completed" 
          value={mockData.stats.testsCompleted}
          icon={<CheckCircle className="text-white" size={20} />}
          color="bg-green-600"
          trend="+8.2%"
          trendType="positive"
        />
        <StatCard 
          title="Pending Results" 
          value={mockData.stats.pendingResults}
          icon={<Clock className="text-white" size={20} />}
          color="bg-orange-600"
          trend="-5.3%"
          trendType="positive"
        />
        <StatCard 
          title="Today's Revenue" 
          value={`₹${mockData.stats.revenue.toLocaleString()}`}
          icon={<DollarSign className="text-white" size={20} />}
          color="bg-purple-600"
          trend="+15.8%"
          trendType="positive"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Samples */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Recent Samples</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.recentSamples.map((sample) => (
              <div key={sample.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <TestTube className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sample.patientName}</p>
                      <p className="text-sm text-gray-500">{sample.tests.join(', ')} • {sample.collectedAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 mb-1">{sample.id}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sample.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sample.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sample.status}
                      </span>
                      {sample.priority === 'urgent' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      {sample.priority === 'stat' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          STAT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Pending Reports</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Review all
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.pendingReports.map((report) => (
              <div key={report.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.patientName}</p>
                      <p className="text-sm text-gray-500">{report.testName}</p>
                      <p className="text-xs text-gray-400">By: {report.technician}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Due in {report.dueTime}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'ready_to_send' ? 'bg-green-100 text-green-800' :
                      report.status === 'awaiting_approval' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-medium text-gray-800 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Critical Alerts
          </h2>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            View all
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {mockData.criticalAlerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4 hover:bg-red-50">
              <div className="flex items-start space-x-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                  alert.type === 'critical_result' ? 'bg-red-100' :
                  alert.type === 'equipment' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {alert.type === 'critical_result' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                   alert.type === 'equipment' ? <Activity className="h-4 w-4 text-yellow-600" /> :
                   <Package className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <button className="text-orange-600 hover:text-orange-700">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render different views based on activeView
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'samples':
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <TestTube className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sample Tracking System</h3>
            <p className="text-gray-600 mb-6">Advanced barcode-based sample tracking from collection to result delivery</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔬 Sample Management</h4>
                <p className="text-sm text-gray-600">Track samples through every stage of processing</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📊 Real-time Updates</h4>
                <p className="text-sm text-gray-600">Live status updates and notifications</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🏠 Home Collection</h4>
                <p className="text-sm text-gray-600">Integrated home collection service management</p>
              </div>
            </div>
          </div>
        );
      case 'tests':
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <FlaskConical className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Catalog Management</h3>
            <p className="text-gray-600 mb-6">Manage your comprehensive test catalog with 70+ pre-loaded tests</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🧪 Test Database</h4>
                <p className="text-sm text-gray-600">70+ tests across all major categories</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">💰 Pricing Management</h4>
                <p className="text-sm text-gray-600">Flexible pricing and package options</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">⏱️ TAT Tracking</h4>
                <p className="text-sm text-gray-600">Turnaround time monitoring and optimization</p>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Management</h3>
            <p className="text-gray-600 mb-6">Advanced report generation and delivery system</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📝 Report Templates</h4>
                <p className="text-sm text-gray-600">Professional report templates with digital signatures</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📱 Multi-channel Delivery</h4>
                <p className="text-sm text-gray-600">Email, SMS, WhatsApp, and portal delivery</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">✅ Quality Assurance</h4>
                <p className="text-sm text-gray-600">Multi-level approval and QC workflows</p>
              </div>
            </div>
          </div>
        );
      case 'patients':
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <Users className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Management</h3>
            <p className="text-gray-600 mb-6">Comprehensive patient database and communication system</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">👥 Patient Database</h4>
                <p className="text-sm text-gray-600">Complete patient history and demographics</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📞 Communication</h4>
                <p className="text-sm text-gray-600">Automated notifications and reminders</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📅 Appointment Booking</h4>
                <p className="text-sm text-gray-600">Online booking and home collection scheduling</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <BarChart3 className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
            <p className="text-gray-600 mb-6">Comprehensive business intelligence and performance metrics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📈 Revenue Analytics</h4>
                <p className="text-sm text-gray-600">Revenue tracking and forecasting</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">⏱️ Performance Metrics</h4>
                <p className="text-sm text-gray-600">TAT analysis and efficiency tracking</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔬 Test Volume Analysis</h4>
                <p className="text-sm text-gray-600">Test volume trends and capacity planning</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg p-8">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Laboratory Settings</h3>
              
              {currentLab && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Name</label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {currentLab.labName}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {currentLab.licenseNumber}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {currentLab.contactPersonName} - {currentLab.contactPersonDesignation}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {currentLab.phoneNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Address</label>
                    <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {currentLab.address}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                        {currentLab.services.join(', ')}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accreditations</label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {currentLab.accreditation.length > 0 ? currentLab.accreditation.join(', ') : 'None'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-gray-700">
                        Home Collection: {currentLab.homeCollection ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-gray-700">
                        Emergency Services: {currentLab.emergencyServices ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  // Loading state
  if (loading || !currentLab) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your laboratory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 px-5 flex items-center gap-2 border-b border-gray-100">
          <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
            <FlaskConical size={20} />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-gray-800">Pathology Portal</p>
            <p className="text-[10px] uppercase font-medium text-orange-600 tracking-wide">GarudX</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => (
              <li key={item.key}>
                <button 
                  onClick={() => setActiveView(item.key)} 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
                    activeView === item.key ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      activeView === item.key 
                        ? 'bg-orange-700 text-orange-100' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium text-[10px]">
              {getLabInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {currentLab?.labName}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                Diagnostic Laboratory
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition flex-shrink-0"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <LabHeader />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PathologyDashboard;
