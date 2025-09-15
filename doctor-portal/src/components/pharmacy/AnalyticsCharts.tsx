import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Download
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  salesData: {
    labels: string[];
    datasets: any[];
  };
  inventoryData: {
    totalItems: number;
    lowStock: number;
    expiringSoon: number;
    totalValue: number;
  };
  topMedicines: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  categoryDistribution: {
    labels: string[];
    data: number[];
  };
  monthlyTrends: {
    sales: number[];
    orders: number[];
    labels: string[];
  };
}

const AnalyticsCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data generation - replace with real API calls
  useEffect(() => {
    const generateMockData = (): AnalyticsData => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const labels = Array.from({ length: days > 30 ? 12 : days }, (_, i) => {
        if (days > 30) {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          return date.toLocaleDateString('en-US', { month: 'short' });
        } else {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      });

      const salesValues = labels.map(() => Math.floor(Math.random() * 50000) + 10000);
      const orderValues = labels.map(() => Math.floor(Math.random() * 200) + 50);

      return {
        salesData: {
          labels,
          datasets: [
            {
              label: 'Daily Sales (₹)',
              data: salesValues,
              borderColor: 'rgb(251, 146, 60)',
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Orders',
              data: orderValues,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              fill: true,
              yAxisID: 'y1',
            }
          ]
        },
        inventoryData: {
          totalItems: 2847,
          lowStock: 23,
          expiringSoon: 15,
          totalValue: 1245670
        },
        topMedicines: [
          { name: 'Paracetamol 500mg', sales: 1250, revenue: 15625 },
          { name: 'Azithromycin 250mg', sales: 890, revenue: 111250 },
          { name: 'Metformin 500mg', sales: 760, revenue: 34390 },
          { name: 'Omeprazole 20mg', sales: 650, revenue: 21287 },
          { name: 'Cetirizine 10mg', sales: 580, revenue: 9048 }
        ],
        categoryDistribution: {
          labels: ['Analgesics', 'Antibiotics', 'Antidiabetics', 'Cardiovascular', 'Respiratory', 'Others'],
          data: [25, 20, 15, 18, 12, 10]
        },
        monthlyTrends: {
          sales: salesValues,
          orders: orderValues,
          labels
        }
      };
    };

    setLoading(true);
    setTimeout(() => {
      setAnalyticsData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-lg h-80"></div>
            <div className="bg-gray-200 rounded-lg h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sales & Orders Trend'
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Sales (₹)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Medicine Categories Distribution'
      },
    },
  };

  const categoryChartData = {
    labels: analyticsData.categoryDistribution.labels,
    datasets: [
      {
        data: analyticsData.categoryDistribution.data,
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const topMedicinesChartData = {
    labels: analyticsData.topMedicines.map(med => med.name),
    datasets: [
      {
        label: 'Sales Quantity',
        data: analyticsData.topMedicines.map(med => med.sales),
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderColor: 'rgba(251, 146, 60, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top Selling Medicines'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units Sold'
        }
      }
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${(analyticsData.monthlyTrends.sales.reduce((a, b) => a + b, 0)).toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        
        <StatCard
          title="Total Orders"
          value={analyticsData.monthlyTrends.orders.reduce((a, b) => a + b, 0).toString()}
          change="+8.2%"
          changeType="positive"
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        
        <StatCard
          title="Inventory Items"
          value={analyticsData.inventoryData.totalItems.toString()}
          change="-2.1%"
          changeType="negative"
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        
        <StatCard
          title="Low Stock Alerts"
          value={analyticsData.inventoryData.lowStock.toString()}
          change="+3 items"
          changeType="negative"
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Line data={analyticsData.salesData} options={lineChartOptions} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Doughnut data={categoryChartData} options={doughnutOptions} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Medicines Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Bar data={topMedicinesChartData} options={barChartOptions} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">In Stock</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {analyticsData.inventoryData.totalItems - analyticsData.inventoryData.lowStock}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Low Stock</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {analyticsData.inventoryData.lowStock}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Expiring Soon</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {analyticsData.inventoryData.expiringSoon}
              </span>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Inventory Value</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{analyticsData.inventoryData.totalValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Medicines Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Medicines</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.topMedicines.map((medicine, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{medicine.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medicine.sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{medicine.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${Math.max(20, (medicine.sales / analyticsData.topMedicines[0].sales) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((medicine.sales / analyticsData.topMedicines[0].sales) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
