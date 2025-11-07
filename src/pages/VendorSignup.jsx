import React, { useState } from 'react'
import { authAPI } from '../services/api'

const Input = (props) => (
  <input {...props} className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className||''}`} />
)

const VendorSignup = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', companyName: '', contactPhone: '', department: 'TOUR'
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      if (!form.username || !form.email || !form.password || !form.companyName || !form.department) {
        setError('Please fill all required fields.')
        setSubmitting(false)
        return
      }
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        companyName: form.companyName.trim(),
        contactPhone: (form.contactPhone||'').trim(),
        department: (form.department||'TOUR').toUpperCase()
      }
      await authAPI.vendorSignup(payload)
      setMessage('Vendor registered successfully! Awaiting admin approval.')
      setForm({ username: '', email: '', password: '', companyName: '', contactPhone: '', department: 'TOUR' })
    } catch (e) {
      // Log full error for debugging
      console.log('Vendor signup error:', e?.response || e)
      const resp = e?.response
      let serverMsg = resp?.data?.message || (typeof resp?.data === 'string' ? resp.data : null)
      // Try common Spring validation shapes
      if (!serverMsg && resp?.data) {
        const d = resp.data
        if (Array.isArray(d?.errors) && d.errors.length > 0) {
          serverMsg = d.errors.map(err => err.defaultMessage || err.message || JSON.stringify(err)).join('; ')
        } else if (d?.error) {
          serverMsg = d.error
        } else if (d?.details) {
          serverMsg = d.details
        }
      }
      const status = resp?.status
      setError(serverMsg ? `${serverMsg}${status ? ` (HTTP ${status})` : ''}` : 'Failed to register vendor')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Sign Up</h1>
        <p className="text-sm text-gray-600 mb-4">Create a vendor account. Your registration will be reviewed by an administrator.</p>
        {message && <div className="mb-3 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">{message}</div>}
        {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Username</label>
            <Input required value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <Input type="password" required value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Company Name</label>
            <Input required value={form.companyName} onChange={e=>setForm({...form, companyName:e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Contact Phone</label>
            <Input required value={form.contactPhone} onChange={e=>setForm({...form, contactPhone:e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Department</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={form.department} onChange={e=>setForm({...form, department:e.target.value})}>
              <option value="TOUR">TOUR</option>
              <option value="VEHICLE">VEHICLE</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{submitting ? 'Submitting...' : 'Sign Up as Vendor'}</button>
        </form>
      </div>
    </div>
  )
}

export default VendorSignup
