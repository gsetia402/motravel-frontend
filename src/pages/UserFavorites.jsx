import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

// Temporary icon replacements until @heroicons/react is installed
const HeartIcon = ({ className }) => <span className={className}>❤️</span>
const HeartSolidIcon = ({ className }) => <span className={className}>❤️</span>
const StarIcon = ({ className }) => <span className={className}>⭐</span>
const TrashIcon = ({ className }) => <span className={className}>🗑️</span>
const UserIcon = ({ className }) => <span className={className}>👤</span>

const UserFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll simulate favorite vehicles since the backend endpoint may not exist yet
      // TODO: Replace with actual API call when backend is ready
      const response = await userAPI.getFavoriteVehicles();
      setFavorites(response.data || []);
    } catch (err) {
      // For demo purposes, we'll show empty state instead of error
      setFavorites([]);
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (vehicleId) => {
    try {
      await userAPI.removeFavoriteVehicle(vehicleId);
      // Remove from local state
      setFavorites(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      // TODO: Show error toast
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please sign in to view your favorites.</p>
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
            <HeartSolidIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">Your favorite vehicles for future trips</p>
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
              onClick={fetchFavorites}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-2 text-gray-500">
              Start exploring and add vehicles to your favorites!
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={vehicle.imageUrl || '/api/placeholder/400/225'}
                    alt={vehicle.make + ' ' + vehicle.model}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <button
                      onClick={() => removeFavorite(vehicle.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove from favorites"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">{vehicle.year}</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${vehicle.pricePerDay}/day
                    </span>
                  </div>

                  <div className="flex items-center mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.type === 'CAR' ? 'bg-blue-100 text-blue-800' :
                      vehicle.type === 'MOTORCYCLE' ? 'bg-green-100 text-green-800' :
                      vehicle.type === 'BICYCLE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.type}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.available ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">Capacity: {vehicle.capacity} people</span>
                  </div>

                  <Link
                    to={`/vehicle/${vehicle.id}`}
                    className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFavorites;
