import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toursAPI } from '../services/api'

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading tours...</p>
    </div>
  </div>
)

const TourCard = ({ tour }) => {
  const image = (tour.imageUrls && Array.from(tour.imageUrls)[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
  return (
    <Link to={`/tours/${tour.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {tour.durationDays} days
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{tour.name}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{tour.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-gray-600 text-sm">
              <div>Start: {tour.startingLocation}</div>
              <div>End: {tour.endingLocation}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">₹{tour.basePricePerPerson}</div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform group-hover:scale-105 mt-4">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}

const TourList = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await toursAPI.getAll()
        setTours(data || [])
      } catch (e) {
        setError('Failed to load tours. Ensure backend is running on http://localhost:8080')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Tours</h2>
        <p className="text-gray-600 mb-6">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore Our <span className="text-blue-600">Tour Packages</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Curated itineraries with transparent pricing and easy booking.
        </p>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🧭</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No tours available</h3>
          <p className="text-gray-600 text-lg">Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {tours.map(t => <TourCard key={t.id} tour={t} />)}
        </div>
      )}
    </div>
  )
}

export default TourList
