import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Modern icon components with better styling
const UserIcon = ({ className }) => <span className={`${className} text-lg`}>👤</span>
const ChevronDownIcon = ({ className }) => <span className={`${className} text-sm`}>▼</span>
const LogoutIcon = ({ className }) => <span className={`${className} text-sm`}>🚪</span>

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActiveTab = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname.startsWith('/vehicle'))) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="hidden sm:block font-serif">Motravel</span>
          </Link>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`relative px-6 py-2 font-medium transition-all duration-200 rounded-full ${
                isActiveTab('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🚗</span>
                <span>Vehicles</span>
              </span>
              {isActiveTab('/') && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
            <Link 
              to="/hidden-gems" 
              className={`relative px-6 py-2 font-medium transition-all duration-200 rounded-full ${
                isActiveTab('/hidden-gems') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🗺️</span>
                <span>Hidden Gems</span>
              </span>
              {isActiveTab('/hidden-gems') && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              <span className="text-xl">☰</span>
            </button>
          </div>

          {/* Right Side Authentication */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 rounded-full hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <UserIcon className="text-white text-sm" />
                  </div>
                  <span className="font-medium">{user?.username || 'User'}</span>
                  <ChevronDownIcon className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-3">👤</span>
                      Profile
                    </Link>
                    <Link
                      to="/bookmarks"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-3">🔖</span>
                      Bookmarks
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-3">❤️</span>
                      Favorites
                    </Link>
                    <Link
                      to="/bookings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-3">📋</span>
                      Bookings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-full hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Hidden by default, can be toggled */}
      <div className="md:hidden border-t border-gray-100 bg-white">
        <div className="px-4 py-3 space-y-2">
          <Link 
            to="/" 
            className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
              isActiveTab('/') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            🚗 Vehicles
          </Link>
          <Link 
            to="/hidden-gems" 
            className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
              isActiveTab('/hidden-gems') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            🗺️ Hidden Gems
          </Link>
          {!isAuthenticated && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header
