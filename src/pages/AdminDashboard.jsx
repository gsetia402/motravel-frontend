import React, { useEffect, useState } from 'react'
import { adminToursAPI, adminTourBookingsAPI, adminVehicleAPI, adminVehicleBookingsAPI, adminHiddenGemsAPI, adminVendorsAPI } from '../services/api'

const Section = ({ title, children }) => (
  <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
    {children}
  </section>
)

const Input = (props) => (
  <input {...props} className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className||''}`} />
)

const AdminDashboard = () => {
  // Create Tour form state
  const [tourForm, setTourForm] = useState({
    name: '', description: '', durationDays: 1, startingLocation: '', endingLocation: '', basePricePerPerson: 0, maxGroupSize: 10
  })
  const [creatingTour, setCreatingTour] = useState(false)

  // Create Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    model: '', brand: '', type: 'car', latitude: 0, longitude: 0, hourlyPrice: 0, imageUrl: '', availability: true
  })
  const [creatingVehicle, setCreatingVehicle] = useState(false)

  // Create Hidden Gem form state (minimal)
  const [gemForm, setGemForm] = useState({
    name: '', description: '', stateId: '', latitude: 0, longitude: 0
  })
  const [creatingGem, setCreatingGem] = useState(false)

  // Bookings lists
  const [tourBookings, setTourBookings] = useState([])
  const [vehicleBookings, setVehicleBookings] = useState([])
  const [loadingLists, setLoadingLists] = useState(true)
  const [error, setError] = useState(null)

  // Vendor approvals
  const [pendingVendors, setPendingVendors] = useState([])
  const [loadingApprovals, setLoadingApprovals] = useState(true)
  const [approvalsError, setApprovalsError] = useState(null)

  const loadLists = async () => {
    try {
      setLoadingLists(true)
      const [tb, vb] = await Promise.all([
        adminTourBookingsAPI.list(),
        adminVehicleBookingsAPI.list()
      ])
      setTourBookings(tb || [])
      setVehicleBookings(vb || [])
    } catch (e) {
      console.error(e)
      setError('Failed to load bookings')
    } finally {
      setLoadingLists(false)
    }
  }

  const loadApprovals = async () => {
    try {
      setLoadingApprovals(true)
      const list = await adminVendorsAPI.listRegistrationRequests('PENDING')
      setPendingVendors(list || [])
    } catch (e) {
      console.error(e)
      setApprovalsError('Failed to load vendor approvals')
    } finally {
      setLoadingApprovals(false)
    }
  }

  useEffect(() => { loadLists(); loadApprovals() }, [])

  const approveVendor = async (id) => {
    await adminVendorsAPI.approve(id)
    loadApprovals()
  }

  const rejectVendor = async (id) => {
    const reason = window.prompt('Optional rejection reason:')
    await adminVendorsAPI.reject(id, reason)
    loadApprovals()
  }

  const handleCreateTour = async (e) => {
    e.preventDefault()
    setCreatingTour(true)
    try {
      const payload = {
        ...tourForm,
        durationDays: Number(tourForm.durationDays) || 1,
        basePricePerPerson: Number(tourForm.basePricePerPerson) || 0,
        maxGroupSize: Number(tourForm.maxGroupSize) || 1,
        highlights: [], imageUrls: [], availableDates: [], itinerary: []
      }
      await adminToursAPI.createTour(payload)
      setTourForm({ name: '', description: '', durationDays: 1, startingLocation: '', endingLocation: '', basePricePerPerson: 0, maxGroupSize: 10 })
      alert('Tour created')
    } catch (e) {
      alert('Failed to create tour')
    } finally {
      setCreatingTour(false)
    }
  }

  const handleCreateVehicle = async (e) => {
    e.preventDefault()
    setCreatingVehicle(true)
    try {
      const payload = { ...vehicleForm, latitude: Number(vehicleForm.latitude), longitude: Number(vehicleForm.longitude), hourlyPrice: Number(vehicleForm.hourlyPrice) }
      await adminVehicleAPI.createVehicle(payload)
      setVehicleForm({ model: '', brand: '', type: 'car', latitude: 0, longitude: 0, hourlyPrice: 0, imageUrl: '', availability: true })
      alert('Vehicle created')
    } catch (e) {
      alert('Failed to create vehicle')
    } finally {
      setCreatingVehicle(false)
    }
  }

  const handleCreateGem = async (e) => {
    e.preventDefault()
    setCreatingGem(true)
    try {
      const payload = {
        name: gemForm.name,
        description: gemForm.description,
        state: { id: Number(gemForm.stateId) },
        latitude: Number(gemForm.latitude),
        longitude: Number(gemForm.longitude),
        adventureTypes: [], imageUrls: []
      }
      await adminHiddenGemsAPI.create(payload)
      setGemForm({ name: '', description: '', stateId: '', latitude: 0, longitude: 0 })
      alert('Hidden Gem created')
    } catch (e) {
      alert('Failed to create hidden gem (ensure a valid stateId)')
    } finally {
      setCreatingGem(false)
    }
  }

  const cancelTourBooking = async (id) => {
    await adminTourBookingsAPI.cancel(id)
    loadLists()
  }

  const cancelVehicleBooking = async (id) => {
    await adminVehicleBookingsAPI.cancel(id)
    loadLists()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Awaiting Vendor Approvals */}
      <Section title="Awaiting Vendor Approvals">
        {loadingApprovals ? (
          <div className="text-gray-600">Loading...</div>
        ) : approvalsError ? (
          <div className="text-red-600">{approvalsError}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Department</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.length === 0 && (
                  <tr><td className="py-3 text-gray-500" colSpan={6}>No pending vendor requests</td></tr>
                )}
                {pendingVendors.map(v => (
                  <tr key={v.id} className="border-t border-gray-100">
                    <td className="py-2 pr-4">{v.username || '-'}</td>
                    <td className="py-2 pr-4">{v.companyName || v.name}</td>
                    <td className="py-2 pr-4">{v.department || '-'}</td>
                    <td className="py-2 pr-4">{v.email}</td>
                    <td className="py-2 pr-4">{v.contactPhone || '-'}</td>
                    <td className="py-2 pr-4 space-x-2">
                      <button onClick={() => approveVendor(v.id)} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                      <button onClick={() => rejectVendor(v.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Create forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Section title="Add Tour Package">
          <form onSubmit={handleCreateTour} className="space-y-3">
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <Input value={tourForm.name} onChange={e=>setTourForm({...tourForm,name:e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Description</label>
              <textarea value={tourForm.description} onChange={e=>setTourForm({...tourForm,description:e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Duration (days)</label>
                <Input type="number" min="1" value={tourForm.durationDays} onChange={e=>setTourForm({...tourForm,durationDays:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Max Group Size</label>
                <Input type="number" min="1" value={tourForm.maxGroupSize} onChange={e=>setTourForm({...tourForm,maxGroupSize:e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Starting Location</label>
                <Input value={tourForm.startingLocation} onChange={e=>setTourForm({...tourForm,startingLocation:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Ending Location</label>
                <Input value={tourForm.endingLocation} onChange={e=>setTourForm({...tourForm,endingLocation:e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700">Base Price (per person)</label>
              <Input type="number" min="0" step="0.01" value={tourForm.basePricePerPerson} onChange={e=>setTourForm({...tourForm,basePricePerPerson:e.target.value})} />
            </div>
            <button type="submit" disabled={creatingTour} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{creatingTour?'Creating...':'Create Tour'}</button>
          </form>
        </Section>

        <Section title="Add Vehicle">
          <form onSubmit={handleCreateVehicle} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Model</label>
                <Input value={vehicleForm.model} onChange={e=>setVehicleForm({...vehicleForm,model:e.target.value})} required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Brand</label>
                <Input value={vehicleForm.brand} onChange={e=>setVehicleForm({...vehicleForm,brand:e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700">Type</label>
              <Input value={vehicleForm.type} onChange={e=>setVehicleForm({...vehicleForm,type:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Latitude</label>
                <Input type="number" value={vehicleForm.latitude} onChange={e=>setVehicleForm({...vehicleForm,latitude:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Longitude</label>
                <Input type="number" value={vehicleForm.longitude} onChange={e=>setVehicleForm({...vehicleForm,longitude:e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700">Hourly Price</label>
              <Input type="number" min="0" step="0.01" value={vehicleForm.hourlyPrice} onChange={e=>setVehicleForm({...vehicleForm,hourlyPrice:e.target.value})} />
            </div>
            <div>
              <label className="text-sm text-gray-700">Image URL</label>
              <Input value={vehicleForm.imageUrl} onChange={e=>setVehicleForm({...vehicleForm,imageUrl:e.target.value})} />
            </div>
            <div className="flex items-center space-x-2">
              <input id="veh-availability" type="checkbox" checked={vehicleForm.availability} onChange={e=>setVehicleForm({...vehicleForm,availability:e.target.checked})} />
              <label htmlFor="veh-availability" className="text-sm text-gray-700">Available</label>
            </div>
            <button type="submit" disabled={creatingVehicle} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{creatingVehicle?'Creating...':'Create Vehicle'}</button>
          </form>
        </Section>

        <Section title="Add Hidden Gem (basic)">
          <form onSubmit={handleCreateGem} className="space-y-3">
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <Input value={gemForm.name} onChange={e=>setGemForm({...gemForm,name:e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Description</label>
              <textarea value={gemForm.description} onChange={e=>setGemForm({...gemForm,description:e.target.value})} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>
            <div>
              <label className="text-sm text-gray-700">State ID</label>
              <Input value={gemForm.stateId} onChange={e=>setGemForm({...gemForm,stateId:e.target.value})} placeholder="Existing State ID" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Latitude</label>
                <Input type="number" value={gemForm.latitude} onChange={e=>setGemForm({...gemForm,latitude:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Longitude</label>
                <Input type="number" value={gemForm.longitude} onChange={e=>setGemForm({...gemForm,longitude:e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={creatingGem} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{creatingGem?'Creating...':'Create Hidden Gem'}</button>
          </form>
        </Section>
      </div>

      {/* Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Tour Bookings">
          {loadingLists ? (
            <div className="text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="space-y-3">
              {tourBookings.length === 0 && <div className="text-gray-500">No tour bookings</div>}
              {tourBookings.map(b => (
                <div key={b.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{b.bookingId} • {b.tourPackage?.name}</div>
                    <div className="text-sm text-gray-600">{b.date} • Status: {b.status}</div>
                  </div>
                  <div className="space-x-2">
                    {b.status !== 'CANCELLED' && (
                      <button onClick={() => cancelTourBooking(b.id)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Vehicle Bookings">
          {loadingLists ? (
            <div className="text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="space-y-3">
              {vehicleBookings.length === 0 && <div className="text-gray-500">No vehicle bookings</div>}
              {vehicleBookings.map(b => (
                <div key={b.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Booking #{b.id} • Vehicle #{b.vehicleId}</div>
                    <div className="text-sm text-gray-600">{b.startTime} → {b.endTime} • Status: {b.status}</div>
                  </div>
                  <div className="space-x-2">
                    {b.status !== 'CANCELLED' && (
                      <button onClick={() => cancelVehicleBooking(b.id)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

export default AdminDashboard
