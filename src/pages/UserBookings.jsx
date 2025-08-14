import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

// Temporary icon replacements until @heroicons/react is installed
const ClockIcon = ({ className }) => <span className={className}>🕐</span>
const CalendarIcon = ({ className }) => <span className={className}>📅</span>
const CheckCircleIcon = ({ className }) => <span className={className}>✅</span>
const XCircleIcon = ({ className }) => <span className={className}>❌</span>
const ExclamationTriangleIcon = ({ className }) => <span className={className}>⚠️</span>

const UserBookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, cancelled

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userAPI.getBookingHistory();
      setBookings(response.data || []);
    } catch (err) {
      // For demo purposes, we'll show empty state instead of error
      setBookings([]);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['CONFIRMED', 'ACTIVE', 'PENDING'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'COMPLETED';
    if (filter === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please sign in to view your bookings.</p>
          <Link
            to="/login"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ClockIcon className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">Track your past and current vehicle bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchBookings}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="mt-2 text-gray-500">
              {filter === 'all' 
                ? 'Start exploring and book your first vehicle!'
                : `You don't have any ${filter} bookings at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Vehicles
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(booking.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.vehicle?.make} {booking.vehicle?.model}
                      </h3>
                      <p className="text-sm text-gray-600">Booking #{booking.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start Date</p>
                      <p className="text-sm text-gray-600">
                        {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">End Date</p>
                      <p className="text-sm text-gray-600">
                        {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Cost</p>
                    <p className="text-lg font-bold text-primary-600">
                      ${booking.totalCost || 'N/A'}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                    <p className="text-sm text-gray-600">{booking.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Booked on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="flex space-x-3">
                    {booking.vehicle && (
                      <Link
                        to={`/vehicle/${booking.vehicle.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Vehicle
                      </Link>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
