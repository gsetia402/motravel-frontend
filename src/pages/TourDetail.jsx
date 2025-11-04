import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toursAPI } from '../services/api'

const Loading = () => (
  <div className="flex justify-center items-center min-h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading tour details...</p>
    </div>
  </div>
)

const TourDetail = () => {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })

  const [availability, setAvailability] = useState(null)
  const [booking, setBooking] = useState(null)
  const [bookingError, setBookingError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await toursAPI.getById(id)
        setTour(data)
        const dates = data?.availableDates ? Array.from(data.availableDates) : []
        const firstDate = dates.length ? dates[0] : ''
        setDate(firstDate)
      } catch (e) {
        console.error(e)
        setError('Failed to load tour details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const highlights = useMemo(() => tour?.highlights ? Array.from(tour.highlights) : [], [tour])
  const images = useMemo(() => tour?.imageUrls ? Array.from(tour.imageUrls) : [], [tour])
  const dates = useMemo(() => tour?.availableDates ? Array.from(tour.availableDates) : [], [tour])
  const itinerary = useMemo(() => tour?.itinerary || [], [tour])

  const totalGuests = (adults || 0) + (children || 0)

  const checkAvailability = async () => {
    try {
      setAvailability(null)
      const res = await toursAPI.checkAvailability(id, date, totalGuests)
      setAvailability(res?.available)
    } catch (e) {
      setAvailability(false)
    }
  }

  const bookNow = async () => {
    try {
      setBookingError(null)
      setBooking(null)
      const res = await toursAPI.book(id, {
        date,
        adults: Number(adults),
        children: Number(children),
        contactName: contact.name,
        contactEmail: contact.email,
        contactPhone: contact.phone
      })
      setBooking(res)
    } catch (e) {
      const msg = e?.response?.data?.error || 'Booking failed. Please adjust details and try again.'
      setBookingError(msg)
    }
  }

  if (loading) return <Loading />
  if (error) return (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-red-600 text-lg font-medium mb-2">⚠️ Error Loading Tour</div>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="space-x-4">
          <Link to="/tours" className="btn-secondary">Back to Tours</Link>
        </div>
      </div>
    </div>
  )
  if (!tour) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <Link to="/tours" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Tours</Link>
      </nav>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Gallery */}
          <div className="lg:col-span-2">
            <div className="h-80 md:h-[28rem] overflow-hidden">
              <img src={images[0] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'} alt={tour.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50">
                {images.slice(1, 4).map((src, i) => (
                  <img key={i} src={src} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          {/* Booking panel */}
          <div className="p-6 border-l border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">{tour.name}</h2>
            <p className="text-gray-600 mt-2">{tour.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div><span className="font-medium">Duration:</span> {tour.durationDays} days</div>
              <div><span className="font-medium">Group size:</span> up to {tour.maxGroupSize}</div>
              <div><span className="font-medium">Start:</span> {tour.startingLocation}</div>
              <div><span className="font-medium">End:</span> {tour.endingLocation}</div>
            </div>

            {highlights.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((h, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Booking form */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <select value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded px-3 py-2">
                    {dates.map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Adults</label>
                  <input type="number" min="1" value={adults} onChange={e => setAdults(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Children</label>
                  <input type="number" min="0" value={children} onChange={e => setChildren(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Name</label>
                  <input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone</label>
                  <input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={checkAvailability} className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Check Availability</button>
                <button onClick={bookNow} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Book Now</button>
              </div>

              {availability !== null && (
                <div className={`mt-3 text-sm ${availability ? 'text-green-700' : 'text-red-700'}`}>
                  {availability ? 'Selected date is available' : 'Selected date is not available for the selected group size'}
                </div>
              )}

              {bookingError && (
                <div className="mt-3 text-sm text-red-700">{bookingError}</div>
              )}

              {booking && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <div className="text-green-800 font-semibold">Booking Confirmed!</div>
                  <div className="text-green-800 text-sm mt-1">Booking ID: {booking.bookingId}</div>
                  <div className="text-green-800 text-sm">Total Price: ₹{booking.totalPrice}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Itinerary</h3>
          {itinerary.length === 0 ? (
            <div className="text-gray-500">Itinerary details will be added soon.</div>
          ) : (
            <div className="space-y-3">
              {itinerary.map(item => (
                <div key={item.id || item.dayNumber} className="p-4 rounded border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Day {item.dayNumber}</div>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-gray-700 text-sm mt-1">{item.description}</div>
                  {item.mealPlan && <div className="text-gray-500 text-xs mt-1">Meal: {item.mealPlan}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TourDetail
