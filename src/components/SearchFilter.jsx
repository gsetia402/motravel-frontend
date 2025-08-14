import { useState } from 'react'

const SearchFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { type: '', minPrice: '', maxPrice: '', search: '' }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Vehicles
          </label>
          <input
            type="text"
            placeholder="Search by brand, model..."
            className="input-field"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Vehicle Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            className="input-field"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="CAR">Car</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="SCOOTER">Scooter</option>
            <option value="BIKE">Bike</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price (₹/hour)
          </label>
          <input
            type="number"
            placeholder="0"
            className="input-field"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price (₹/hour)
          </label>
          <input
            type="number"
            placeholder="1000"
            className="input-field"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="btn-secondary text-sm"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default SearchFilter
