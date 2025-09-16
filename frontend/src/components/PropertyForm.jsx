import { useState, useEffect } from 'react'
import { adminApi } from '../utils/api'
import { X, Upload, Plus, Trash2 } from 'lucide-react'

export default function PropertyForm({ mode = 'add', property = null, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'sale',
    status: 'available',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    features: '',
    featured: false
  })
  
  const [imageFiles, setImageFiles] = useState([])
  const [imageUrls, setImageUrls] = useState([''])
  const [existingImages, setExistingImages] = useState([])
  const [imagesToKeep, setImagesToKeep] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        propertyType: property.propertyType || 'apartment',
        listingType: property.listingType || 'sale',
        status: property.status || 'available',
        price: property.price?.toString() || '',
        location: property.location || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        features: property.features?.join(', ') || '',
        featured: property.featured || false
      })
      
      if (property.images && property.images.length > 0) {
        setExistingImages(property.images)
        setImagesToKeep(property.images)
      }
    }
  }, [mode, property])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(prev => [...prev, ...files])
  }

  const removeFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUrlChange = (index, value) => {
    setImageUrls(prev => {
      const newUrls = [...prev]
      newUrls[index] = value
      return newUrls
    })
  }

  const addUrlField = () => {
    setImageUrls(prev => [...prev, ''])
  }

  const removeUrlField = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (imageUrl) => {
    setImagesToKeep(prev => prev.filter(img => img !== imageUrl))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          // Split features by comma and clean up
          const featuresArray = formData[key]
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0)
          formDataToSend.append('features', JSON.stringify(featuresArray))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })
      
      // Add image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file)
      })
      
      // Add image URLs (filter out empty ones)
      const validUrls = imageUrls.filter(url => url.trim())
      validUrls.forEach(url => {
        formDataToSend.append('imagesUrls', url.trim())
      })
      
      // For edit mode, add images to keep
      if (mode === 'edit') {
        imagesToKeep.forEach(img => {
          formDataToSend.append('imagesToKeep', img)
        })
      }

      let result
      if (mode === 'add') {
        result = await adminApi.postMultipart('/properties', formDataToSend)
      } else {
        result = await adminApi.putMultipart(`/properties/${property.id}`, formDataToSend)
      }
      
      onSave(result)
    } catch (error) {
      setError(error.message || 'Failed to save property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {mode === 'add' ? 'Add New Property' : 'Edit Property'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            data-testid="button-close-form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" data-testid="text-error">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-description"
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="select-property-type"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type *
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="select-listing-type"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="select-status"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Numeric Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (ETB) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-bedrooms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-bathrooms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (m²)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-area"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              placeholder="e.g., Parking, Garden, Swimming Pool"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-features"
            />
          </div>

          {/* Featured Property */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              data-testid="checkbox-featured"
            />
            <label className="ml-2 text-sm text-gray-700">
              Featured Property
            </label>
          </div>

          {/* Existing Images (Edit Mode) */}
          {mode === 'edit' && existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                      data-testid={`img-existing-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      data-testid={`button-remove-existing-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {!imagesToKeep.includes(img) && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">REMOVED</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                data-testid="input-file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload images or drag and drop
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB each
                </span>
              </label>
            </div>

            {/* File Previews */}
            {imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                      data-testid={`img-upload-preview-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      data-testid={`button-remove-file-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs
            </label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid={`input-image-url-${index}`}
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    data-testid={`button-remove-url-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addUrlField}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              data-testid="button-add-url"
            >
              <Plus className="h-4 w-4" />
              <span>Add another URL</span>
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-save"
            >
              {loading ? 'Saving...' : mode === 'add' ? 'Add Property' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}