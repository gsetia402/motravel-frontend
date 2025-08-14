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
  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles')
      return response.data
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      throw error
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error)
      throw error
    }
  },

  // Get available vehicles
  getAvailableVehicles: async () => {
    try {
      const response = await api.get('/vehicles/available')
      return response.data
    } catch (error) {
      console.error('Error fetching available vehicles:', error)
      throw error
    }
  },

  // Find vehicles near location
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

// Booking API functions (for future use)
export const bookingAPI = {
  // Check vehicle availability
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

  // Create booking (requires authentication)
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
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials)
      return response.data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  },

  // Register new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData)
      return response.data
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }
}

// Hidden Gems API functions
export const hiddenGemsAPI = {
  // Get all hidden gems with optional filtering and pagination
  getAllHiddenGems: async (params = {}) => {
    try {
      const response = await api.get('/hidden-gems', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching hidden gems:', error)
      throw error
    }
  },

  // Get hidden gem by ID
  getHiddenGemById: async (id) => {
    try {
      const response = await api.get(`/hidden-gems/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching hidden gem ${id}:`, error)
      throw error
    }
  },

  // Get all states
  getAllStates: async () => {
    try {
      const response = await api.get('/states')
      return response.data
    } catch (error) {
      console.error('Error fetching states:', error)
      throw error
    }
  },

  // Get all adventure types
  getAllAdventureTypes: async () => {
    try {
      const response = await api.get('/adventure-types')
      return response.data
    } catch (error) {
      console.error('Error fetching adventure types:', error)
      throw error
    }
  },

  // Get hidden gems by state
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

  // Search hidden gems
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



// User bookmarks and favorites API
export const userAPI = {
  // Hidden Gem bookmarks
  bookmarkHiddenGem: (hiddenGemId) => api.post(`/hidden-gems/${hiddenGemId}/bookmark`),
  removeHiddenGemBookmark: (hiddenGemId) => api.delete(`/hidden-gems/${hiddenGemId}/bookmark`),
  getHiddenGemBookmarks: () => api.get('/users/bookmarks/hidden-gems'),
  
  // Vehicle favorites (assuming similar structure)
  favoriteVehicle: (vehicleId) => api.post(`/vehicles/${vehicleId}/favorite`),
  removeFavoriteVehicle: (vehicleId) => api.delete(`/vehicles/${vehicleId}/favorite`),
  getFavoriteVehicles: () => api.get('/users/favorites/vehicles'),
  
  // User bookings history
  getBookingHistory: () => api.get('/users/bookings'),
  
  // User profile
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData)
};

export { vehicleAPI, bookingAPI, hiddenGemsAPI, authAPI, userAPI }
export default api
