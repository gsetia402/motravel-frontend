import React, { useState, useEffect } from 'react';

// Temporary icon replacements until @heroicons/react is installed
const MagnifyingGlassIcon = ({ className }) => <span className={className}>🔍</span>
const FunnelIcon = ({ className }) => <span className={className}>🔽</span>

const HiddenGemsFilter = ({ 
  onSearch, 
  onStateFilter, 
  onAdventureTypeFilter,
  onDifficultyFilter,
  states = [], 
  adventureTypes = [],
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedAdventureType, setSelectedAdventureType] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const difficultyLevels = [
    'Easy',
    'Easy to Moderate', 
    'Moderate',
    'Moderate to Difficult',
    'Difficult'
  ]

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, onSearch])

  // Handle filter changes
  const handleStateChange = (e) => {
    const stateId = e.target.value
    setSelectedState(stateId)
    onStateFilter(stateId)
  }

  const handleAdventureTypeChange = (e) => {
    const adventureTypeId = e.target.value
    setSelectedAdventureType(adventureTypeId)
    onAdventureTypeFilter(adventureTypeId)
  }

  const handleDifficultyChange = (e) => {
    const difficulty = e.target.value
    setSelectedDifficulty(difficulty)
    onDifficultyFilter(difficulty)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedState('')
    setSelectedAdventureType('')
    setSelectedDifficulty('')
    onSearch('')
    onStateFilter('')
    onAdventureTypeFilter('')
    onDifficultyFilter('')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search hidden gems by name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
        </div>
        
        {/* Toggle Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          Filters
          {(selectedState || selectedAdventureType || selectedDifficulty) && (
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Filter */}
            <div>
              <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={handleStateChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={loading}
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Adventure Type Filter */}
            <div>
              <label htmlFor="adventure-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Adventure Type
              </label>
              <select
                id="adventure-type-filter"
                value={selectedAdventureType}
                onChange={handleAdventureTypeChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={loading}
              >
                <option value="">All Types</option>
                {adventureTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                id="difficulty-filter"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={loading}
              >
                <option value="">All Levels</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedState || selectedAdventureType || selectedDifficulty || searchTerm) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HiddenGemsFilter
