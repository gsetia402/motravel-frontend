import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { vehicleAPI } from '../services/api'

// Modern Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading vehicles...</p>
    </div>
  </div>
)

// Modern Vehicle Card Component
const VehicleCard = ({ vehicle }) => {
  const fallbackImage = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  
  return (
    <Link to={`/vehicle/${vehicle.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        {/* Vehicle Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={vehicle.imageUrl || fallbackImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = fallbackImage
            }}
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              vehicle.availability 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {vehicle.availability ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ₹{vehicle.hourlyPrice}
              </div>
              <div className="text-sm text-gray-500">per hour</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <span className="mr-1">🚗</span>
              {vehicle.type}
            </span>
            <span className="flex items-center">
              <span className="mr-1">📍</span>
              Nearby
            </span>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform group-hover:scale-105">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}

// Modern Filter Component
const VehicleFilters = ({ onFilterChange, vehicleCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    availability: ''
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      availability: ''
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search vehicles..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="lg:w-48">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Types</option>
            <option value="car">Cars</option>
            <option value="bike">Bikes</option>
            <option value="Motor Cycle">Motorcycles</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="flex space-x-2 lg:w-64">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-1/2 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-1/2 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Availability Filter */}
        <div className="lg:w-40">
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="px-6 py-3 text-gray-600 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
        >
          Clear All
        </button>
      </div>

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{vehicleCount}</span> vehicles
        </p>
      </div>
    </div>
  )
}

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await vehicleAPI.getAllVehicles()
      setVehicles(data)
      setFilteredVehicles(data)
    } catch (err) {
      setError('Failed to fetch vehicles. Please make sure your backend is running on http://localhost:8080')
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (filters) => {
    let filtered = [...vehicles]

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(vehicle =>
        vehicle.brand?.toLowerCase().includes(searchTerm) ||
        vehicle.model?.toLowerCase().includes(searchTerm) ||
        vehicle.type?.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by vehicle type
    if (filters.type) {
      filtered = filtered.filter(vehicle =>
        vehicle.type?.toLowerCase() === filters.type.toLowerCase()
      )
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(vehicle =>
        vehicle.hourlyPrice >= parseFloat(filters.minPrice)
      )
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(vehicle =>
        vehicle.hourlyPrice <= parseFloat(filters.maxPrice)
      )
    }

    // Filter by availability
    if (filters.availability) {
      const isAvailable = filters.availability === 'available'
      filtered = filtered.filter(vehicle => vehicle.availability === isAvailable)
    }

    setFilteredVehicles(filtered)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Vehicles</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchVehicles}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Perfect <span className="text-blue-600">Vehicle</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing vehicles for your next adventure. From city cars to mountain bikes, we have everything you need.
        </p>
      </div>

      {/* Filters */}
      <VehicleFilters 
        onFilterChange={applyFilters} 
        vehicleCount={filteredVehicles.length}
      />

      {/* Vehicle Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🚗</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No vehicles found
          </h3>
          <p className="text-gray-600 text-lg">
            Try adjusting your filters or search terms to find more options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleList
