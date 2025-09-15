import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Pill,
  DollarSign,
  Activity,
  Plus,
  Download,
  Shield,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, onAuthStateChange } from '../../services/authService';
import type { PharmacyUser } from '../../types/auth';
import AnalyticsCharts from './AnalyticsCharts';
import InventoryManagement from './InventoryManagement';

// Mock data - replace with real API calls
const mockData = {
  stats: {
    todaysSales: 45670,
    prescriptionsFilled: 128,
    medicinesSold: 456,
    activeCustomers: 89
  },
  recentOrders: [
    { id: '1', patientName: 'Raj Kumar', medicines: 3, amount: 1250, status: 'completed', time: '2 hrs ago' },
    { id: '2', patientName: 'Priya Sharma', medicines: 1, amount: 450, status: 'processing', time: '3 hrs ago' },
    { id: '3', patientName: 'Amit Singh', medicines: 5, amount: 2100, status: 'pending', time: '4 hrs ago' },
  ],
  lowStock: [
    { name: 'Paracetamol 500mg', quantity: 12, minRequired: 50, status: 'critical' },
    { name: 'Crocin 650mg', quantity: 25, minRequired: 100, status: 'low' },
    { name: 'Azithromycin 250mg', quantity: 8, minRequired: 30, status: 'critical' },
  ]
};

type ViewKey = 'dashboard' | 'inventory' | 'orders' | 'customers' | 'reports' | 'settings';

interface NavItem { 
  key: ViewKey; 
  label: string; 
  icon: React.ReactNode;
}

const PharmacyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [currentPharmacy, setCurrentPharmacy] = useState<PharmacyUser | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState([
    { id: '1', title: 'Low stock alert for Paracetamol', time: '5 min ago', type: 'warning' },
    { id: '2', title: 'New prescription received', time: '10 min ago', type: 'info' },
    { id: '3', title: 'Monthly report ready', time: '1 hour ago', type: 'success' },
  ]);

  // Navigation items
  const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { key: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { key: 'reports', label: 'Reports', icon: <TrendingUp size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  // Load pharmacy profile
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authState) => {
      if (authState.user && authState.user.role === 'pharmacy') {
        setCurrentPharmacy(authState.user as PharmacyUser);
        setLoading(false);
      } else if (!authState.loading) {
        // Not a pharmacy or not authenticated, redirect to login
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

  // Get pharmacy initials
  const getPharmacyInitials = () => {
    if (!currentPharmacy?.pharmacyName) return 'PH';
    const words = currentPharmacy.pharmacyName.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return currentPharmacy.pharmacyName.substring(0, 2).toUpperCase();
  };

  // Stats Card Component
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend} from yesterday
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Header Component
  const PharmacyHeader: React.FC = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {activeView === 'dashboard' ? 'Dashboard' :
                 activeView === 'inventory' ? 'Inventory Management' :
                 activeView === 'orders' ? 'Order Management' :
                 activeView === 'customers' ? 'Customer Management' :
                 activeView === 'reports' ? 'Reports & Analytics' :
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
                placeholder="Search medicines, orders..."
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
                            notification.type === 'info' ? 'bg-blue-400' :
                            notification.type === 'warning' ? 'bg-yellow-400' :
                            notification.type === 'success' ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pharmacy Profile Dropdown */}
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
                  {getPharmacyInitials()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{currentPharmacy?.pharmacyName}</p>
                  <p className="text-xs text-gray-500">Pharmacy Owner</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && currentPharmacy && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {getPharmacyInitials()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{currentPharmacy.pharmacyName}</p>
                        <p className="text-xs text-gray-500">{currentPharmacy.email}</p>
                        <div className="flex items-center mt-1">
                          <Pill className="h-3 w-3 text-orange-500 mr-1" />
                          <span className="text-xs text-gray-600">License: {currentPharmacy.licenseNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-orange-50 rounded-lg px-2 py-1">
                        <p className="text-xs font-semibold text-orange-600">4.8</p>
                        <p className="text-[10px] text-gray-500">Rating</p>
                      </div>
                      <div className="bg-green-50 rounded-lg px-2 py-1">
                        <p className="text-xs font-semibold text-green-600">456</p>
                        <p className="text-[10px] text-gray-500">Orders</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg px-2 py-1">
                        <p className="text-xs font-semibold text-blue-600">89</p>
                        <p className="text-[10px] text-gray-500">Customers</p>
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
                      View Profile
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      Account Settings
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <CreditCard className="h-4 w-4 mr-3 text-gray-400" />
                      Billing & Payments
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                      Help & Support
                    </button>
                    
                    <div className="flex items-center px-4 py-2 text-sm text-green-700">
                      <Shield className="h-4 w-4 mr-3 text-green-500" />
                      Licensed Pharmacy
                    </div>
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
          <p className="text-sm text-gray-500 mt-1">Here's what's happening at your pharmacy today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
            <Plus size={16} className="mr-2" />
            New Order
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Today's Sales" 
          value={`₹${mockData.stats.todaysSales.toLocaleString()}`}
          icon={<DollarSign className="text-white" size={20} />}
          color="bg-green-600"
          trend="+12.5%"
        />
        <StatCard 
          title="Prescriptions Filled" 
          value={mockData.stats.prescriptionsFilled}
          icon={<Activity className="text-white" size={20} />}
          color="bg-orange-600"
          trend="+8.2%"
        />
        <StatCard 
          title="Medicines Sold" 
          value={mockData.stats.medicinesSold}
          icon={<Pill className="text-white" size={20} />}
          color="bg-blue-600"
          trend="+15.3%"
        />
        <StatCard 
          title="Active Customers" 
          value={mockData.stats.activeCustomers}
          icon={<Users className="text-white" size={20} />}
          color="bg-purple-600"
          trend="+5.1%"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Recent Orders</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.patientName}</p>
                      <p className="text-sm text-gray-500">{order.medicines} medicines • {order.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{order.amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Low Stock Alerts</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Restock
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.lowStock.map((item, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.status === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <AlertTriangle className={`h-5 w-5 ${
                        item.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} left • Min: {item.minRequired}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render different views based on activeView
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return <div className="text-center py-12"><p className="text-gray-500">Order Management - Coming Soon</p></div>;
      case 'customers':
        return <div className="text-center py-12"><p className="text-gray-500">Customer Management - Coming Soon</p></div>;
      case 'reports':
        return <AnalyticsCharts />;
      case 'settings':
        return <div className="text-center py-12"><p className="text-gray-500">Settings - Coming Soon</p></div>;
      default:
        return <DashboardView />;
    }
  };

  // Loading state
  if (loading || !currentPharmacy) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your pharmacy...</p>
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
            <Pill size={20} />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-gray-800">Pharmacy Portal</p>
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
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium text-[10px]">
              {getPharmacyInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {currentPharmacy?.pharmacyName}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                Licensed Pharmacy
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
        <PharmacyHeader />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
