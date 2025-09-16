import { useState, useEffect } from 'react'
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign
} from 'lucide-react'

export default function PropertyManagement() {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    status: '',
    priceRange: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    filterProperties()
  }, [properties, searchTerm, filters])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
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

  const filterProperties = () => {
    let filtered = properties

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType)
    }

    // Listing type filter
    if (filters.listingType) {
      filtered = filtered.filter(property => property.listingType === filters.listingType)
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status)
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(property => {
        const price = property.price
        if (max) {
          return price >= min && price <= max
        } else {
          return price >= min
        }
      })
    }

    setFilteredProperties(filtered)
  }

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await fetch(`/api/admin/properties/${id}`, {
          method: 'DELETE'
        })
        fetchProperties()
      } catch (error) {
        console.error('Error deleting property:', error)
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(price)
  }

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="relative">
        <img
          src={property.images?.[0] || '/api/placeholder/400/250'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.status === 'available' ? 'bg-green-100 text-green-800' :
            property.status === 'sold' ? 'bg-red-100 text-red-800' :
            property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full">
            {property.listingType}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-lg font-bold text-green-600">
              {formatPrice(property.price)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full">
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDeleteProperty(property.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600">Manage your property listings and track performance</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Property Type */}
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>

          {/* Listing Type */}
          <select
            value={filters.listingType}
            onChange={(e) => setFilters({...filters, listingType: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Listings</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="pending">Pending</option>
          </select>

          {/* Price Range */}
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Prices</option>
            <option value="0-1000000">Under 1M ETB</option>
            <option value="1000000-5000000">1M - 5M ETB</option>
            <option value="5000000-10000000">5M - 10M ETB</option>
            <option value="10000000">Over 10M ETB</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold">
                {properties.filter(p => p.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-2xl font-bold">
                {properties.filter(p => p.status === 'sold').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold">{filteredProperties.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add a new property.</p>
        </div>
      )}
    </div>
  )
}