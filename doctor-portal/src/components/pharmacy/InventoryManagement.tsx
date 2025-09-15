import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Download,
  Upload,
  Edit3,
  Trash2,
  AlertTriangle,
  MapPin,
  Eye,
  FileText,
  TrendingDown,
  TrendingUp,
  Clock,
  X
} from 'lucide-react';
import CSVUpload from './CSVUpload';

interface Medicine {
  id?: string;
  'Medicine Name': string;
  'Generic Name': string;
  'Category': string;
  'Manufacturer': string;
  'Batch Number': string;
  'Stock Quantity': number;
  'Unit Price': number;
  'Expiry Date': string;
  'Minimum Stock Level': number;
  'Rack Location': string;
  'Prescription Required': string;
  'Description': string;
}

type ViewMode = 'grid' | 'table' | 'upload';
type FilterType = 'all' | 'low-stock' | 'expiring' | 'out-of-stock';

const InventoryManagement: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Load demo data on mount
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/demo-medicines.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const parsedMedicines: Medicine[] = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const medicine: any = { id: `med-${index + 1}` };
          
          headers.forEach((header, headerIndex) => {
            medicine[header] = values[headerIndex];
          });
          
          // Type conversion
          medicine['Stock Quantity'] = parseInt(medicine['Stock Quantity']) || 0;
          medicine['Unit Price'] = parseFloat(medicine['Unit Price']) || 0;
          medicine['Minimum Stock Level'] = parseInt(medicine['Minimum Stock Level']) || 0;
          
          return medicine as Medicine;
        });
        
        setMedicines(parsedMedicines);
        setFilteredMedicines(parsedMedicines);
      } catch (error) {
        console.error('Failed to load demo data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  // Filter and search medicines
  useEffect(() => {
    let filtered = medicines;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine['Medicine Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine['Generic Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.Manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(medicine => medicine.Category === selectedCategory);
    }

    // Apply filter type
    switch (filterType) {
      case 'low-stock':
        filtered = filtered.filter(medicine => 
          medicine['Stock Quantity'] <= medicine['Minimum Stock Level'] && medicine['Stock Quantity'] > 0
        );
        break;
      case 'out-of-stock':
        filtered = filtered.filter(medicine => medicine['Stock Quantity'] === 0);
        break;
      case 'expiring':
        filtered = filtered.filter(medicine => {
          const expiryDate = new Date(medicine['Expiry Date']);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
        });
        break;
    }

    setFilteredMedicines(filtered);
  }, [medicines, searchTerm, selectedCategory, filterType]);

  const handleCSVUpload = (uploadedMedicines: Medicine[]) => {
    const medicinesWithIds = uploadedMedicines.map((med, index) => ({
      ...med,
      id: `upload-${Date.now()}-${index}`
    }));
    
    setMedicines(prev => [...prev, ...medicinesWithIds]);
    setViewMode('table');
  };

  const exportToCSV = () => {
    const headers = [
      'Medicine Name', 'Generic Name', 'Category', 'Manufacturer',
      'Batch Number', 'Stock Quantity', 'Unit Price', 'Expiry Date',
      'Minimum Stock Level', 'Rack Location', 'Prescription Required', 'Description'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredMedicines.map(medicine =>
        headers.map(header => medicine[header as keyof Medicine]).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine['Stock Quantity'] === 0) return 'out-of-stock';
    if (medicine['Stock Quantity'] <= medicine['Minimum Stock Level']) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'Out of Stock';
      case 'low-stock': return 'Low Stock';
      default: return 'In Stock';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow && expiry > new Date();
  };

  const categories = Array.from(new Set(medicines.map(m => m.Category))).sort();
  
  const stats = {
    total: medicines.length,
    lowStock: medicines.filter(m => m['Stock Quantity'] <= m['Minimum Stock Level'] && m['Stock Quantity'] > 0).length,
    outOfStock: medicines.filter(m => m['Stock Quantity'] === 0).length,
    expiring: medicines.filter(m => isExpiringSoon(m['Expiry Date'])).length,
    totalValue: medicines.reduce((sum, m) => sum + (m['Stock Quantity'] * m['Unit Price']), 0)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>)}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your medicine stock and track inventory levels</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('upload')}
            className="flex items-center space-x-2 px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => console.log('Add medicine modal coming soon')}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiring}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-xl font-bold text-green-600">₹{stats.totalValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* CSV Upload View */}
      {viewMode === 'upload' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Import Inventory Data</h3>
            <button
              onClick={() => setViewMode('table')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back to Inventory
            </button>
          </div>
          
          <CSVUpload 
            onDataUploaded={handleCSVUpload} 
            existingCount={medicines.length}
          />
        </div>
      )}

      {/* Inventory Table/Grid View */}
      {viewMode !== 'upload' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-80"
                  />
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                >
                  <Package className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              {[
                { key: 'all', label: 'All Items', count: stats.total },
                { key: 'low-stock', label: 'Low Stock', count: stats.lowStock },
                { key: 'out-of-stock', label: 'Out of Stock', count: stats.outOfStock },
                { key: 'expiring', label: 'Expiring Soon', count: stats.expiring }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setFilterType(filter.key as FilterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === filter.key
                      ? 'bg-orange-100 text-orange-600 border border-orange-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => {
                    const status = getStockStatus(medicine);
                    const expiring = isExpiringSoon(medicine['Expiry Date']);
                    
                    return (
                      <tr key={medicine.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {medicine['Medicine Name']}
                            </div>
                            <div className="text-sm text-gray-500">
                              {medicine['Generic Name']}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {medicine.Category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{medicine['Stock Quantity']}</span>
                            <span className="text-gray-500">/ {medicine['Minimum Stock Level']}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{medicine['Unit Price'].toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(status)}`}>
                            {getStockStatusText(status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className={`${expiring ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                            {medicine['Expiry Date']}
                            {expiring && (
                              <div className="text-xs text-orange-500">Expiring soon!</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            {medicine['Rack Location']}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedMedicine(medicine)}
                              className="text-orange-600 hover:text-orange-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedicines.map((medicine) => {
                  const status = getStockStatus(medicine);
                  const expiring = isExpiringSoon(medicine['Expiry Date']);
                  
                  return (
                    <div key={medicine.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {medicine['Medicine Name']}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">{medicine['Generic Name']}</p>
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {medicine.Category}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(status)}`}>
                            {getStockStatusText(status)}
                          </span>
                          {expiring && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              Expiring
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Stock:</span>
                          <span className="font-medium">{medicine['Stock Quantity']}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">₹{medicine['Unit Price'].toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-xs">{medicine['Rack Location']}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Expiry:</span>
                          <span className={`text-xs ${expiring ? 'text-orange-600 font-medium' : ''}`}>
                            {medicine['Expiry Date']}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedMedicine(medicine)}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* No results */}
          {filteredMedicines.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setFilterType('all');
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Medicine Detail Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Medicine Details</h3>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Medicine Name</label>
                  <p className="text-gray-900">{selectedMedicine['Medicine Name']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Generic Name</label>
                  <p className="text-gray-900">{selectedMedicine['Generic Name']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-900">{selectedMedicine.Category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                  <p className="text-gray-900">{selectedMedicine.Manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Batch Number</label>
                  <p className="text-gray-900">{selectedMedicine['Batch Number']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Stock Quantity</label>
                  <p className="text-gray-900">{selectedMedicine['Stock Quantity']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Unit Price</label>
                  <p className="text-gray-900">₹{selectedMedicine['Unit Price'].toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Minimum Stock Level</label>
                  <p className="text-gray-900">{selectedMedicine['Minimum Stock Level']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                  <p className="text-gray-900">{selectedMedicine['Expiry Date']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rack Location</label>
                  <p className="text-gray-900">{selectedMedicine['Rack Location']}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prescription Required</label>
                  <p className="text-gray-900">{selectedMedicine['Prescription Required']}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{selectedMedicine.Description}</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Edit Medicine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
