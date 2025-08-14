import { Link } from 'react-router-dom'

const VehicleCard = ({ vehicle }) => {
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Available
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Not Available
        </span>
      )
    }
  }

  return (
    <Link to={`/vehicle/${vehicle.id}`} className="block">
      <div className="card p-6 h-full">
        {/* Vehicle Image */}
        <div className="aspect-w-16 aspect-h-9 mb-4">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div 
            className={`w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center ${vehicle.imageUrl ? 'hidden' : 'flex'}`}
          >
            <span className="text-6xl">{getVehicleIcon(vehicle.type)}</span>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {vehicle.type?.toLowerCase()}
              </p>
            </div>
            {getAvailabilityBadge(vehicle.availability)}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ₹{vehicle.hourlyPrice}
              </span>
              <span className="text-sm text-gray-600 ml-1">/hour</span>
            </div>
            <div className="text-sm text-gray-500">
              ID: {vehicle.id}
            </div>
          </div>

          {/* Location (if available) */}
          {vehicle.latitude && vehicle.longitude && (
            <div className="text-sm text-gray-600">
              📍 Location: {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
            </div>
          )}

          {/* View Details Button */}
          <div className="pt-2">
            <span className="text-primary-600 font-medium text-sm hover:text-primary-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VehicleCard
