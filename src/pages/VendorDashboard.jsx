import React, { useEffect, useState } from 'react'
import { vendorDashboardAPI, vendorToursAPI, vendorVehiclesAPI } from '../services/api'

const Section = ({ title, children }) => (
  <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
    {children}
  </section>
)

const VendorDashboard = () => {
  const [summary, setSummary] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assets, setAssets] = useState([])

  // Forms
  const [tourForm, setTourForm] = useState({
    name: '', description: '', durationDays: 1, startingLocation: '', endingLocation: '', basePricePerPerson: 0, maxGroupSize: 10,
    highlights: [], imageUrls: [], availableDates: [], itinerary: []
  })
  const [vehicleForm, setVehicleForm] = useState({
    model: '', brand: '', type: 'car', latitude: 0, longitude: 0, hourlyPrice: 0, imageUrl: '', availability: true
  })
  const [creating, setCreating] = useState(false)
  const [tourDateInput, setTourDateInput] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const [s, b] = await Promise.all([
        vendorDashboardAPI.summary(),
        vendorDashboardAPI.bookings()
      ])
      setSummary(s)
      setBookings(b || [])
      // Load assets based on department
      if (s?.department === 'VEHICLE') {
        const list = await vendorVehiclesAPI.list()
        setAssets(list || [])
      } else {
        const list = await vendorToursAPI.list()
        setAssets(list || [])
      }
    } catch (e) {
      console.error(e)
      setError('Failed to load vendor dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <Section title="Summary">
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-500 text-sm">Department</div>
                  <div className="text-2xl font-semibold text-gray-900">{summary.department}</div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-500 text-sm">Vehicles</div>
                  <div className="text-2xl font-semibold text-gray-900">{summary.vehiclesCount}</div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-500 text-sm">Tours</div>
                  <div className="text-2xl font-semibold text-gray-900">{summary.toursCount}</div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="text-gray-500 text-sm">Total Bookings</div>
                  <div className="text-2xl font-semibold text-gray-900">{(summary.vehicleBookingsCount||0) + (summary.tourBookingsCount||0)}</div>
                </div>
              </div>
            )}
          </Section>

          <Section title="Manage Assets">
            {summary?.department === 'VEHICLE' ? (
              <div className="space-y-6">
                <form onSubmit={async (e)=>{ e.preventDefault(); setCreating(true); try { const payload = { ...vehicleForm, latitude: Number(vehicleForm.latitude), longitude: Number(vehicleForm.longitude), hourlyPrice: Number(vehicleForm.hourlyPrice) }; await vendorVehiclesAPI.create(payload); setVehicleForm({ model: '', brand: '', type: 'car', latitude: 0, longitude: 0, hourlyPrice: 0, imageUrl: '', availability: true }); await load(); } finally { setCreating(false); } }} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">Model</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.model} onChange={e=>setVehicleForm({...vehicleForm,model:e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Brand</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.brand} onChange={e=>setVehicleForm({...vehicleForm,brand:e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Type</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.type} onChange={e=>setVehicleForm({...vehicleForm,type:e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Hourly Price</label>
                      <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.hourlyPrice} onChange={e=>setVehicleForm({...vehicleForm,hourlyPrice:e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Latitude</label>
                      <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.latitude} onChange={e=>setVehicleForm({...vehicleForm,latitude:e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Longitude</label>
                      <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.longitude} onChange={e=>setVehicleForm({...vehicleForm,longitude:e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-700">Image URL</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={vehicleForm.imageUrl} onChange={e=>setVehicleForm({...vehicleForm,imageUrl:e.target.value})} />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <input id="veh-avl" type="checkbox" checked={vehicleForm.availability} onChange={e=>setVehicleForm({...vehicleForm,availability:e.target.checked})} />
                      <label htmlFor="veh-avl" className="text-sm text-gray-700">Available</label>
                    </div>
                  </div>
                  <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{creating?'Creating...':'Add Vehicle'}</button>
                </form>
                <div className="space-y-3">
                  {assets.length === 0 ? <div className="text-gray-500">No vehicles yet.</div> : assets.map(v => (
                    <div key={v.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{v.brand} {v.model}</div>
                        <div className="text-sm text-gray-600">Type: {v.type} • Price: {v.hourlyPrice}</div>
                      </div>
                      <button onClick={async()=>{ await vendorVehiclesAPI.remove(v.id); await load(); }} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={async (e)=>{ e.preventDefault(); if (!tourForm.availableDates || tourForm.availableDates.length === 0) { alert('Please add at least one available date (max 5).'); return; } setCreating(true); try { const payload = { ...tourForm, durationDays: Number(tourForm.durationDays)||1, basePricePerPerson: Number(tourForm.basePricePerPerson)||0, maxGroupSize: Number(tourForm.maxGroupSize)||1, availableDates: tourForm.availableDates }; await vendorToursAPI.create(payload); setTourForm({ name: '', description: '', durationDays: 1, startingLocation: '', endingLocation: '', basePricePerPerson: 0, maxGroupSize: 10, highlights: [], imageUrls: [], availableDates: [], itinerary: [] }); setTourDateInput(''); await load(); } finally { setCreating(false); } }} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">Name</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.name} onChange={e=>setTourForm({...tourForm,name:e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Duration (days)</label>
                      <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.durationDays} onChange={e=>setTourForm({...tourForm,durationDays:e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-700">Description</label>
                      <textarea rows={3} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.description} onChange={e=>setTourForm({...tourForm,description:e.target.value})} required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Starting Location</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.startingLocation} onChange={e=>setTourForm({...tourForm,startingLocation:e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Ending Location</label>
                      <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.endingLocation} onChange={e=>setTourForm({...tourForm,endingLocation:e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Base Price (per person)</label>
                      <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.basePricePerPerson} onChange={e=>setTourForm({...tourForm,basePricePerPerson:e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Max Group Size</label>
                      <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm" value={tourForm.maxGroupSize} onChange={e=>setTourForm({...tourForm,maxGroupSize:e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800">Available Dates (max 5)</label>
                    <div className="flex items-center space-x-2">
                      <input type="date" value={tourDateInput} onChange={e=>setTourDateInput(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" />
                      <button type="button" className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50" disabled={!tourDateInput || (tourForm.availableDates?.length||0) >= 5 || (tourForm.availableDates||[]).includes(tourDateInput)} onClick={()=>{ if (!tourForm.availableDates) { setTourForm({...tourForm, availableDates: [tourDateInput]}); } else if (tourForm.availableDates.length < 5 && !tourForm.availableDates.includes(tourDateInput)) { setTourForm({...tourForm, availableDates: [...tourForm.availableDates, tourDateInput]}); } setTourDateInput(''); }}>Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(tourForm.availableDates||[]).map(d => (
                        <span key={d} className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          <span>{d}</span>
                          <button type="button" className="text-blue-700 hover:text-blue-900" onClick={()=>{ setTourForm({...tourForm, availableDates: tourForm.availableDates.filter(x=>x!==d)}); }}>✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{creating?'Creating...':'Add Tour Package'}</button>
                </form>
                <div className="space-y-3">
                  {assets.length === 0 ? <div className="text-gray-500">No tour packages yet.</div> : assets.map(t => (
                    <div key={t.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-sm text-gray-600">{t.durationDays} days • From {t.startingLocation} to {t.endingLocation}</div>
                      </div>
                      <button onClick={async()=>{ await vendorToursAPI.remove(t.id); await load(); }} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          <Section title="Bookings">
            {bookings.length === 0 ? (
              <div className="text-gray-500">No bookings found.</div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => {
                  const isVehicle = !!b.startTime // vehicle booking shape
                  const isTour = !!b.bookingId // tour booking shape
                  return (
                    <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900">
                        {isTour ? `#${b.bookingId}` : `#${b.id}`}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        <div>Status: {b.status}</div>
                        {isVehicle && (
                          <>
                            <div>Vehicle: {b.vehicleId}</div>
                            <div>Start: {b.startTime}</div>
                            <div>End: {b.endTime}</div>
                            <div>Total Price: {b.totalPrice}</div>
                          </>
                        )}
                        {isTour && (
                          <>
                            <div>Date: {b.date}</div>
                            <div>Adults: {b.adults} • Children: {b.children}</div>
                            <div>Contact: {b.contactName} ({b.contactEmail}, {b.contactPhone})</div>
                            <div>Total Price: {b.totalPrice}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  )
}

export default VendorDashboard
