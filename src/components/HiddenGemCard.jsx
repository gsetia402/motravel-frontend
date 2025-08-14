import React from 'react';
import { Link } from 'react-router-dom';

// Temporary icon replacements until @heroicons/react is installed
const MapPinIcon = ({ className }) => <span className={className}>📍</span>
const CalendarIcon = ({ className }) => <span className={className}>📅</span>
const CurrencyRupeeIcon = ({ className }) => <span className={className}>💰</span>

const HiddenGemCard = ({ hiddenGem }) => {
  const {
    id,
    name,
    description,
    state,
    adventureTypes,
    latitude,
    longitude,
    nearestCity,
    bestTimeToVisit,
    difficultyLevel,
    costRange,
    imageUrls,
    createdAt
  } = hiddenGem

  // Get the first image or use a placeholder
  const imageUrl = imageUrls && imageUrls.length > 0 
    ? imageUrls[0] 
    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'

  // Get difficulty level color
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'moderate':
      case 'easy to moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'difficult':
      case 'moderate to difficult':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Truncate description
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }}
        />
        
        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficultyLevel)}`}>
            {difficultyLevel}
          </span>
        </div>

        {/* State Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {state?.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {truncateDescription(description)}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{nearestCity}</span>
        </div>

        {/* Best Time to Visit */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{bestTimeToVisit}</span>
        </div>

        {/* Cost Range */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
          <span>{costRange}</span>
        </div>

        {/* Adventure Types */}
        {adventureTypes && adventureTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {adventureTypes.slice(0, 3).map((type) => (
              <span
                key={type.id}
                className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs"
              >
                {type.name}
              </span>
            ))}
            {adventureTypes.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                +{adventureTypes.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/hidden-gems/${id}`}
          className="inline-block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default HiddenGemCard
