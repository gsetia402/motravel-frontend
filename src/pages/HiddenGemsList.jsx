import { useState, useEffect, useCallback } from 'react'
import { hiddenGemsAPI } from '../services/api'
import HiddenGemCard from '../components/HiddenGemCard'
import HiddenGemsFilter from '../components/HiddenGemsFilter'
import LoadingSpinner from '../components/LoadingSpinner'

const HiddenGemsList = () => {
  const [hiddenGems, setHiddenGems] = useState([])
  const [states, setStates] = useState([])
  const [adventureTypes, setAdventureTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    stateId: '',
    adventureTypeId: '',
    difficulty: ''
  })

  // Fetch hidden gems with current filters
  const fetchHiddenGems = useCallback(async (page = 0) => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = {
        page,
        size: pagination.size,
        sort: 'createdAt,desc'
      }

      // Add filters if they exist
      if (filters.search) params.search = filters.search
      if (filters.stateId) params.stateId = filters.stateId
      if (filters.adventureTypeId) params.adventureTypeId = filters.adventureTypeId
      if (filters.difficulty) params.difficulty = filters.difficulty

      const response = await hiddenGemsAPI.getAllHiddenGems(params)
      
      setHiddenGems(response.content || [])
      setPagination({
        page: response.number || 0,
        size: response.size || 12,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      })
    } catch (err) {
      console.error('Error fetching hidden gems:', err)
      setError('Failed to load hidden gems. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.size])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch states and adventure types for filters
        const [statesResponse, adventureTypesResponse] = await Promise.all([
          hiddenGemsAPI.getAllStates(),
          hiddenGemsAPI.getAllAdventureTypes()
        ])

        setStates(statesResponse || [])
        setAdventureTypes(adventureTypesResponse || [])
      } catch (err) {
        console.error('Error fetching filter data:', err)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch hidden gems when filters change
  useEffect(() => {
    fetchHiddenGems(0)
  }, [fetchHiddenGems])

  // Filter handlers
  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
  }, [])

  const handleStateFilter = useCallback((stateId) => {
    setFilters(prev => ({ ...prev, stateId }))
  }, [])

  const handleAdventureTypeFilter = useCallback((adventureTypeId) => {
    setFilters(prev => ({ ...prev, adventureTypeId }))
  }, [])

  const handleDifficultyFilter = useCallback((difficulty) => {
    setFilters(prev => ({ ...prev, difficulty }))
  }, [])

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchHiddenGems(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button
          onClick={() => fetchHiddenGems(0)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hidden Gems</h1>
        <p className="text-gray-600">
          Discover amazing off-the-beaten-path destinations for your next adventure
        </p>
      </div>

      {/* Search and Filters */}
      <HiddenGemsFilter
        onSearch={handleSearch}
        onStateFilter={handleStateFilter}
        onAdventureTypeFilter={handleAdventureTypeFilter}
        onDifficultyFilter={handleDifficultyFilter}
        states={states}
        adventureTypes={adventureTypes}
        loading={loading}
      />

      {/* Results Summary */}
      {!loading && (
        <div className="mb-6">
          <p className="text-gray-600">
            {pagination.totalElements > 0 
              ? `Showing ${hiddenGems.length} of ${pagination.totalElements} hidden gems`
              : 'No hidden gems found'
            }
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Hidden Gems Grid */}
      {!loading && hiddenGems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {hiddenGems.map((hiddenGem) => (
            <HiddenGemCard key={hiddenGem.id} hiddenGem={hiddenGem} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hiddenGems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No hidden gems found matching your criteria
          </div>
          <p className="text-gray-400 mb-6">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = Math.max(0, Math.min(
              pagination.totalPages - 5,
              pagination.page - 2
            )) + i
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pageNum === pagination.page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum + 1}
              </button>
            )
          })}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default HiddenGemsList
