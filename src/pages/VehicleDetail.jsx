import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { vehicleAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const VehicleDetail = () => {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchVehicleDetail()
  }, [id])

  const fetchVehicleDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await vehicleAPI.getVehicleById(id)
      setVehicle(data)
    } catch (err) {
      setError('Failed to fetch vehicle details. Please try again.')
      console.error('Error fetching vehicle detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const getVehicleIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'CAR':
        return '🚗'
      case 'MOTORCYCLE':
        return '🏍️'
      case 'SCOOTER':
        return '🛵'
      case 'BIKE':
        return '🚲'
      default:
        return '🚗'
    }
  }

  const getAvailabilityBadge = (availability) => {
    if (availability) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          ✅ Available for Rent
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          ❌ Currently Unavailable
        </span>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg font-medium mb-2">
            ⚠️ Error Loading Vehicle
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-x-4">
            <button onClick={fetchVehicleDetail} className="btn-primary">
              Try Again
            </button>
            <Link to="/" className="btn-secondary">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🚗</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Vehicle not found
        </h3>
        <p className="text-gray-600 mb-4">
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary">
          Back to Vehicle List
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          to="/" 
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Vehicles
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Image */}
          <div className="p-6">
            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div 
              className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${vehicle.imageUrl ? 'hidden' : 'flex'}`}
            >
              <span className="text-9xl">{getVehicleIcon(vehicle.type)}</span>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-lg text-gray-600 capitalize">
                    {vehicle.type?.toLowerCase()}
                  </span>
                  {getAvailabilityBadge(vehicle.availability)}
                </div>
              </div>

              {/* Price */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary-600">
                    ₹{vehicle.hourlyPrice}
                  </span>
                  <span className="text-lg text-gray-600 ml-2">/hour</span>
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Competitive hourly rates
                </p>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vehicle Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Vehicle ID</span>
                    <p className="text-gray-900">{vehicle.id}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Brand</span>
                    <p className="text-gray-900">{vehicle.brand}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Model</span>
                    <p className="text-gray-900">{vehicle.model}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <p className="text-gray-900 capitalize">{vehicle.type?.toLowerCase()}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              {vehicle.latitude && vehicle.longitude && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📍 Location
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Latitude: {vehicle.latitude.toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Longitude: {vehicle.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                {vehicle.availability ? (
                  <>
                    <button className="w-full btn-primary text-lg py-3">
                      Book Now
                    </button>
                    <button className="w-full btn-secondary">
                      Check Availability
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed" disabled>
                    Currently Unavailable
                  </button>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  * Booking requires user authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rental Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="text-center">
            <div className="text-primary-600 text-2xl mb-2">🛡️</div>
            <h4 className="font-medium text-gray-900">Insured</h4>
            <p className="text-gray-600">Full coverage included</p>
          </div>
          <div className="text-center">
            <div className="text-primary-600 text-2xl mb-2">⛽</div>
            <h4 className="font-medium text-gray-900">Fuel Included</h4>
            <p className="text-gray-600">Return with same fuel level</p>
          </div>
          <div className="text-center">
            <div className="text-primary-600 text-2xl mb-2">📞</div>
            <h4 className="font-medium text-gray-900">24/7 Support</h4>
            <p className="text-gray-600">Round-the-clock assistance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetail
