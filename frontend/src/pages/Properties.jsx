import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    listingType: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  })
  const [viewMode, setViewMode] = useState('grid') // grid or list

  useEffect(() => {
    fetchProperties()
  }, [filters])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })

      const response = await fetch(`/api/properties?${params.toString()}`)
      const data = await response.json()
      // Map _id to id for frontend compatibility
      const mappedData = data.map(property => ({
        ...property,
        id: property._id
      }))
      setProperties(mappedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      listingType: '',
      location: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  const handleCall = (property) => {
    window.location.href = 'tel:+251911123456'
  }

  const handleWhatsApp = (property) => {
    const message = `Hi, I'm interested in ${property.title} - ${property.location}`
    const whatsappUrl = `https://wa.me/251911123456?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Properties</h1>
          <p className="text-xl text-gray-600">
            Find your perfect property from our extensive collection
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Type
                  </label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sale & Rent</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (ETB)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                {loading ? 'Loading...' : `${properties.length} properties found`}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card animate-pulse">
                    <div className="bg-gray-300 h-48 w-full"></div>
                    <div className="p-6 space-y-3">
                      <div className="bg-gray-300 h-6 w-3/4"></div>
                      <div className="bg-gray-300 h-4 w-1/2"></div>
                      <div className="bg-gray-300 h-8 w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Properties Grid */}
            {!loading && properties.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onCall={handleCall}
                    onWhatsApp={handleWhatsApp}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && properties.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}