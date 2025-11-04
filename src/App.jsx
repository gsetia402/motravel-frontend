import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Import the modern components
import Header from './components/Header'
import VehicleList from './pages/VehicleList'

// Import auth components
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'

// Import user pages
import UserProfile from './pages/UserProfile'
import UserBookmarks from './pages/UserBookmarks'
import UserFavorites from './pages/UserFavorites'
import UserBookings from './pages/UserBookings'

// Import other pages
import HiddenGemsList from './pages/HiddenGemsList'
import VehicleDetail from './pages/VehicleDetail'
import HiddenGemDetail from './pages/HiddenGemDetail'
import TourList from './pages/TourList'
import TourDetail from './pages/TourDetail'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please refresh the page to try again.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<VehicleList />} />
                <Route path="/vehicle/:id" element={<VehicleDetail />} />
                <Route path="/hidden-gems" element={<HiddenGemsList />} />
                <Route path="/hidden-gems/:id" element={<HiddenGemDetail />} />
                <Route path="/tours" element={<TourList />} />
                <Route path="/tours/:id" element={<TourDetail />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/bookmarks" element={
                  <ProtectedRoute>
                    <UserBookmarks />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <UserFavorites />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <UserBookings />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}

export default App
