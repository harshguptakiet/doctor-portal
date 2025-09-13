import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface PatientSearchProps {
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filter: 'all' | 'online' | 'walk-in') => void;
  initialSearchTerm?: string;
  initialFilter?: 'all' | 'online' | 'walk-in';
}

const PatientSearch: React.FC<PatientSearchProps> = ({
  onSearchChange,
  onFilterChange,
  initialSearchTerm = '',
  initialFilter = 'all'
}) => {
  const [searchValue, setSearchValue] = useState(initialSearchTerm);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  // Handle search input changes
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  // Handle filter changes
  const handleFilterClick = (filter: 'all' | 'online' | 'walk-in') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  // Sync with external changes if needed
  useEffect(() => {
    setSearchValue(initialSearchTerm);
  }, [initialSearchTerm]);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100">
      {/* Filter tabs */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => handleFilterClick('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeFilter === 'all' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => handleFilterClick('online')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeFilter === 'online' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Online
        </button>
        <button 
          onClick={() => handleFilterClick('walk-in')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeFilter === 'walk-in' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Walk-in
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchValue}
            onChange={handleSearchInput}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <button 
          className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          title="More filters"
        >
          <Filter size={16} />
        </button>
      </div>
    </div>
  );
};

export default PatientSearch;