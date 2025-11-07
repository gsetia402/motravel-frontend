import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:8080/api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

// Vehicle API functions
export const vehicleAPI = {
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles')
      return response.data
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      throw error
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error)
      throw error
    }
  },

  getAvailableVehicles: async () => {
    try {
      const response = await api.get('/vehicles/available')
      return response.data
    } catch (error) {
      console.error('Error fetching available vehicles:', error)
      throw error
    }
  },

  findVehiclesNearLocation: async (latitude, longitude, radius = 5.0) => {
    try {
      const response = await api.get('/vehicles/nearby', {
        params: { latitude, longitude, radius }
      })
      return response.data
    } catch (error) {
      console.error('Error finding nearby vehicles:', error)
      throw error
    }
  }
}

// (moved vendorSignup into authAPI below)

// Booking API functions
export const bookingAPI = {
  checkAvailability: async (vehicleId, startTime, endTime) => {
    try {
      const response = await api.get('/bookings/check-availability', {
        params: { vehicleId, startTime, endTime }
      })
      return response.data
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }
}

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials)
      return response.data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData)
      return response.data
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  },

  vendorSignup: async ({ username, email, password, companyName, contactPhone, department }) => {
    const payload = { username, email, password, companyName, contactPhone, department }
    const response = await api.post('/auth/vendor-signup', payload)
    return response.data
  }
}

// Hidden Gems API functions
export const hiddenGemsAPI = {
  getAllHiddenGems: async (params = {}) => {
    try {
      const response = await api.get('/hidden-gems', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching hidden gems:', error)
      throw error
    }
  },

  getHiddenGemById: async (id) => {
    try {
      const response = await api.get(`/hidden-gems/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching hidden gem ${id}:`, error)
      throw error
    }
  },

  getAllStates: async () => {
    try {
      const response = await api.get('/states')
      return response.data
    } catch (error) {
      console.error('Error fetching states:', error)
      throw error
    }
  },

  getAllAdventureTypes: async () => {
    try {
      const response = await api.get('/adventure-types')
      return response.data
    } catch (error) {
      console.error('Error fetching adventure types:', error)
      throw error
    }
  },

  getHiddenGemsByState: async (stateId) => {
    try {
      const response = await api.get('/hidden-gems', {
        params: { stateId }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching hidden gems for state ${stateId}:`, error)
      throw error
    }
  },

  searchHiddenGems: async (searchTerm, params = {}) => {
    try {
      const response = await api.get('/hidden-gems', {
        params: { search: searchTerm, ...params }
      })
      return response.data
    } catch (error) {
      console.error('Error searching hidden gems:', error)
      throw error
    }
  }
}

// Tours API functions
export const toursAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/tours')
      return response.data
    } catch (error) {
      console.error('Error fetching tours:', error)
      throw error
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/tours/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching tour ${id}:`, error)
      throw error
    }
  },

  checkAvailability: async (id, date, guests) => {
    try {
      const response = await api.get(`/tours/${id}/availability`, { params: { date, guests } })
      return response.data
    } catch (error) {
      console.error('Error checking tour availability:', error)
      throw error
    }
  },

  book: async (id, { date, adults, children = 0, contactName, contactEmail, contactPhone }) => {
    try {
      const response = await api.post(`/tours/${id}/book`, null, {
        params: { date, adults, children, contactName, contactEmail, contactPhone }
      })
      return response.data
    } catch (error) {
      console.error('Error booking tour:', error)
      throw error
    }
  }
}

// User API functions
export const userAPI = {
  // Hidden Gem bookmarks
  bookmarkHiddenGem: (hiddenGemId) => api.post(`/hidden-gems/${hiddenGemId}/bookmark`),
  removeHiddenGemBookmark: (hiddenGemId) => api.delete(`/hidden-gems/${hiddenGemId}/bookmark`),
  getHiddenGemBookmarks: () => api.get('/users/bookmarks/hidden-gems'),
  
  // Vehicle favorites
  favoriteVehicle: (vehicleId) => api.post(`/vehicles/${vehicleId}/favorite`),
  removeFavoriteVehicle: (vehicleId) => api.delete(`/vehicles/${vehicleId}/favorite`),
  getFavoriteVehicles: () => api.get('/users/favorites/vehicles'),
  
  // User bookings history (vehicle bookings)
  getBookingHistory: () => api.get('/bookings/user').then(r => r.data),

  // User tour bookings
  getTourBookings: () => api.get('/tours/my-bookings').then(r => r.data),
  
  // User profile
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData)
}

export default api

// Admin APIs
export const adminToursAPI = {
  listTours: () => api.get('/admin/tours').then(r => r.data),
  createTour: (tour) => api.post('/admin/tours', tour).then(r => r.data),
  updateTour: (id, tour) => api.put(`/admin/tours/${id}`, tour).then(r => r.data),
  deleteTour: (id) => api.delete(`/admin/tours/${id}`).then(r => r.data)
}

export const adminTourBookingsAPI = {
  list: () => api.get('/admin/tour-bookings').then(r => r.data),
  get: (id) => api.get(`/admin/tour-bookings/${id}`).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/admin/tour-bookings/${id}/status`, null, { params: { status } }).then(r => r.data),
  cancel: (id) => api.post(`/admin/tour-bookings/${id}/cancel`).then(r => r.data)
}

export const adminVehicleAPI = {
  createVehicle: (vehicle) => api.post('/vehicles', vehicle).then(r => r.data)
}

export const adminVehicleBookingsAPI = {
  list: () => api.get('/bookings').then(r => r.data),
  cancel: (id) => api.post(`/bookings/${id}/cancel`).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, null, { params: { status } }).then(r => r.data)
}

export const adminHiddenGemsAPI = {
  list: (params = {}) => api.get('/admin/hidden-gems', { params }).then(r => r.data),
  get: (id) => api.get(`/admin/hidden-gems/${id}`).then(r => r.data),
  create: (gem) => api.post('/admin/hidden-gems', gem).then(r => r.data),
  update: (id, gem) => api.put(`/admin/hidden-gems/${id}`, gem).then(r => r.data),
  delete: (id) => api.delete(`/admin/hidden-gems/${id}`).then(r => r.data)
}

// Admin Vendors (approvals) API
export const adminVendorsAPI = {
  listRegistrationRequests: (status = 'PENDING') => api.get('/admin/vendors/registration-requests', { params: { status } }).then(r => r.data),
  approve: (id) => api.post(`/admin/vendors/${id}/approve`).then(r => r.data),
  reject: (id, reason) => api.post(`/admin/vendors/${id}/reject`, reason ? { reason } : {}).then(r => r.data)
}

// Vendor Dashboard API
export const vendorDashboardAPI = {
  summary: () => api.get('/vendor/dashboard/summary').then(r => r.data),
  bookings: () => api.get('/vendor/dashboard/bookings').then(r => r.data)
}

// Vendor assets APIs
export const vendorToursAPI = {
  list: () => api.get('/vendor/tours').then(r => r.data),
  create: (tour) => api.post('/vendor/tours', tour).then(r => r.data),
  update: (id, tour) => api.put(`/vendor/tours/${id}`, tour).then(r => r.data),
  remove: (id) => api.delete(`/vendor/tours/${id}`).then(r => r.data)
}

export const vendorVehiclesAPI = {
  list: () => api.get('/vendor/vehicles').then(r => r.data),
  create: (vehicle) => api.post('/vendor/vehicles', vehicle).then(r => r.data),
  update: (id, vehicle) => api.put(`/vendor/vehicles/${id}`, vehicle).then(r => r.data),
  remove: (id) => api.delete(`/vendor/vehicles/${id}`).then(r => r.data)
}
