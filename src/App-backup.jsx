import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import VehicleList from './pages/VehicleList'
import VehicleDetail from './pages/VehicleDetail'
import HiddenGemsList from './pages/HiddenGemsList'
import HiddenGemDetail from './pages/HiddenGemDetail'
import UserProfile from './pages/UserProfile'
import UserBookmarks from './pages/UserBookmarks'
import UserFavorites from './pages/UserFavorites'
import UserBookings from './pages/UserBookings'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8">
                <VehicleList />
              </main>
            </>
          } />
          <Route path="/vehicle/:id" element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8">
                <VehicleDetail />
              </main>
            </>
          } />
          <Route path="/hidden-gems" element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8">
                <HiddenGemsList />
              </main>
            </>
          } />
          <Route path="/hidden-gems/:id" element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8">
                <HiddenGemDetail />
              </main>
            </>
          } />

          {/* Auth routes (only for non-authenticated users) */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <LoginForm />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <SignupForm />
            </ProtectedRoute>
          } />

          {/* Protected routes (only for authenticated users) */}
          <Route path="/profile" element={
            <ProtectedRoute requireAuth={true}>
              <Header />
              <main>
                <UserProfile />
              </main>
            </ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute requireAuth={true}>
              <Header />
              <main>
                <UserBookmarks />
              </main>
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute requireAuth={true}>
              <Header />
              <main>
                <UserFavorites />
              </main>
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute requireAuth={true}>
              <Header />
              <main>
                <UserBookings />
              </main>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
