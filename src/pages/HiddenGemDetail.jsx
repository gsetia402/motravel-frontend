import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hiddenGemsAPI } from '../services/api';

// Temporary icon replacements until @heroicons/react is installed
const MapPinIcon = ({ className }) => <span className={className}>📍</span>
const CalendarIcon = ({ className }) => <span className={className}>📅</span>
const CurrencyDollarIcon = ({ className }) => <span className={className}>💰</span>
const CurrencyRupeeIcon = ({ className }) => <span className={className}>₹</span>
const ClockIcon = ({ className }) => <span className={className}>🕐</span>
const StarIcon = ({ className }) => <span className={className}>⭐</span>
const ChevronLeftIcon = ({ className }) => <span className={className}>◀</span>
const ChevronRightIcon = ({ className }) => <span className={className}>▶</span>
const ArrowLeftIcon = ({ className }) => <span className={className}>◀</span>
const ShareIcon = ({ className }) => <span className={className}>🤝</span>

import LoadingSpinner from '../components/LoadingSpinner'

const HiddenGemDetail = () => {
  const { id } = useParams()
  const [hiddenGem, setHiddenGem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchHiddenGem = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await hiddenGemsAPI.getHiddenGemById(id)
        setHiddenGem(response)
      } catch (err) {
        console.error('Error fetching hidden gem:', err)
        setError('Failed to load hidden gem details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchHiddenGem()
    }
  }, [id])

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate':
      case 'easy to moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'difficult':
      case 'moderate to difficult':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hiddenGem.name,
          text: hiddenGem.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <Link
          to="/hidden-gems"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Hidden Gems
        </Link>
      </div>
    )
  }

  if (!hiddenGem) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-lg mb-4">Hidden gem not found</div>
        <Link
          to="/hidden-gems"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Hidden Gems
        </Link>
      </div>
    )
  }

  const images = hiddenGem.imageUrls && hiddenGem.imageUrls.length > 0 
    ? hiddenGem.imageUrls 
    : ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80']

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/hidden-gems"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Hidden Gems
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {hiddenGem.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{hiddenGem.nearestCity}, {hiddenGem.state?.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(hiddenGem.difficultyLevel)}`}>
              {hiddenGem.difficultyLevel}
            </span>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              title="Share"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4">
          <img
            src={images[selectedImageIndex]}
            alt={hiddenGem.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            }}
          />
        </div>
        
        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index 
                    ? 'border-indigo-500' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${hiddenGem.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Place</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {hiddenGem.description}
            </p>
          </div>

          {/* Adventure Types */}
          {hiddenGem.adventureTypes && hiddenGem.adventureTypes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Adventure Types</h2>
              <div className="flex flex-wrap gap-2">
                {hiddenGem.adventureTypes.map((type) => (
                  <span
                    key={type.id}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location & Coordinates</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-5 w-5 mr-3 text-gray-500" />
                <span>Nearest City: {hiddenGem.nearestCity}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-5 h-5 mr-3 text-gray-500 text-sm">📍</span>
                <span>
                  Coordinates: {hiddenGem.latitude.toFixed(4)}, {hiddenGem.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Best Time to Visit</div>
                  <div className="text-gray-600 text-sm">{hiddenGem.bestTimeToVisit}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CurrencyRupeeIcon className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Cost Range</div>
                  <div className="text-gray-600 text-sm">{hiddenGem.costRange}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Difficulty Level</div>
                  <div className="text-gray-600 text-sm">{hiddenGem.difficultyLevel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* State Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">State Information</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {hiddenGem.state?.name}
              </div>
              <Link
                to={`/hidden-gems?state=${hiddenGem.state?.name}`}
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View more gems in {hiddenGem.state?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HiddenGemDetail
