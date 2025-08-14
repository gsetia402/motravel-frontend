import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

// Temporary icon replacements until @heroicons/react is installed
const BookmarkIcon = ({ className }) => <span className={className}>🔖</span>
const BookmarkSolidIcon = ({ className }) => <span className={className}>🔖</span>
const MapPinIcon = ({ className }) => <span className={className}>📍</span>
const StarIcon = ({ className }) => <span className={className}>⭐</span>
const TrashIcon = ({ className }) => <span className={className}>🗑️</span>

const UserBookmarks = () => {
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hidden-gems');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, activeTab]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'hidden-gems') {
        const response = await userAPI.getHiddenGemBookmarks();
        setBookmarks(response.data || []);
      }
      // TODO: Add vehicle bookmarks when backend is ready
    } catch (err) {
      setError('Failed to load bookmarks');
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (itemId) => {
    try {
      if (activeTab === 'hidden-gems') {
        await userAPI.removeHiddenGemBookmark(itemId);
      }
      // Remove from local state
      setBookmarks(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      // TODO: Show error toast
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please sign in to view your bookmarks.</p>
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
            <BookmarkSolidIcon className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          </div>
          <p className="text-gray-600">Keep track of your favorite places and vehicles</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('hidden-gems')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hidden-gems'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hidden Gems
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vehicles'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vehicles
              </button>
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
              onClick={fetchBookmarks}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookmarks yet</h3>
            <p className="mt-2 text-gray-500">
              Start exploring and bookmark your favorite {activeTab === 'hidden-gems' ? 'hidden gems' : 'vehicles'}!
            </p>
            <Link
              to={activeTab === 'hidden-gems' ? '/hidden-gems' : '/'}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              {activeTab === 'hidden-gems' ? 'Explore Hidden Gems' : 'Browse Vehicles'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.imageUrls?.[0] || '/api/placeholder/400/225'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeBookmark(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove bookmark"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {activeTab === 'hidden-gems' && (
                    <>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {item.nearestCity}, {item.state?.name}
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.difficultyLevel === 'EASY' ? 'bg-green-100 text-green-800' :
                          item.difficultyLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.difficultyLevel}
                        </span>
                        <span className="text-sm text-gray-500">{item.costRange}</span>
                      </div>
                    </>
                  )}

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <Link
                    to={activeTab === 'hidden-gems' ? `/hidden-gems/${item.id}` : `/vehicle/${item.id}`}
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

export default UserBookmarks;
