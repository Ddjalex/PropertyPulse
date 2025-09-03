import { useState } from 'react';
import { Link } from 'wouter';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Save,
  X,
  Building
} from 'lucide-react';
import type { Property, InsertProperty } from '@shared/models';
import { insertPropertySchema } from '@shared/models';
import { z } from 'zod';

const propertyFormSchema = insertPropertySchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.string().min(1, 'Price is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

export default function PropertyManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'sale',
    price: '',
    location: '',
    address: '',
    bedrooms: undefined,
    bathrooms: undefined,
    area: '',
    features: [],
    images: [],
    featured: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return false;
      }
      return failureCount < 3;
    },
  });

  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const propertyData = {
        ...data,
        price: data.price,
        area: data.area ? data.area : undefined,
        pricePerSqm: data.area && data.price ? 
          (parseFloat(data.price) / parseFloat(data.area)).toString() : undefined,
      };
      return await apiRequest('POST', '/api/admin/properties', propertyData);
    },
    onSuccess: () => {
      toast({
        title: "Property Created",
        description: "The property has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      resetForm();
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error Creating Property",
        description: "There was a problem creating the property. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => {
      const propertyData = {
        ...data,
        pricePerSqm: data.area && data.price ? 
          (parseFloat(data.price) / parseFloat(data.area)).toString() : undefined,
      };
      return await apiRequest('PATCH', `/api/admin/properties/${id}`, propertyData);
    },
    onSuccess: () => {
      toast({
        title: "Property Updated",
        description: "The property has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      resetForm();
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error Updating Property",
        description: "There was a problem updating the property. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/properties/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error Deleting Property",
        description: "There was a problem deleting the property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProperties = properties?.filter(property => {
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filterStatus || property.status === filterStatus;
    const matchesType = !filterType || property.propertyType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      propertyType: 'apartment',
      listingType: 'sale',
      price: '',
      location: '',
      address: '',
      bedrooms: undefined,
      bathrooms: undefined,
      area: '',
      features: [],
      images: [],
      featured: false,
    });
    setErrors({});
    setShowAddForm(false);
    setEditingProperty(null);
    setNewFeature('');
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !(formData.features || []).includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter(feature => feature !== featureToRemove)
    }));
  };

  const validateForm = (): boolean => {
    try {
      propertyFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editingProperty) {
        updatePropertyMutation.mutate({ id: editingProperty.id, data: formData });
      } else {
        createPropertyMutation.mutate(formData);
      }
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      propertyType: property.propertyType,
      listingType: property.listingType,
      price: property.price.toString(),
      location: property.location,
      address: property.address || '',
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms || undefined,
      area: property.area?.toString() || '',
      features: property.features || [],
      images: property.images || [],
      featured: property.featured || false,
    });
    setShowAddForm(true);
  };

  const handleDelete = (property: Property) => {
    if (confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)) {
      deletePropertyMutation.mutate(property.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Property Management</h1>
            <p className="text-muted-foreground">
              Manage your property listings and inventory
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid="button-add-property"
          >
            <Plus size={16} className="mr-2" />
            Add Property
          </Button>
        </div>

        {/* Add/Edit Property Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetForm}
                  data-testid="button-close-form"
                >
                  <X size={20} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Luxury Apartment in Bole"
                      className={errors.title ? 'border-red-500' : ''}
                      data-testid="input-title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Bole Sub City, Addis Ababa"
                      className={errors.location ? 'border-red-500' : ''}
                      data-testid="input-location"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type *</label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger data-testid="select-property-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Listing Type *</label>
                    <Select value={formData.listingType} onValueChange={(value) => handleInputChange('listingType', value)}>
                      <SelectTrigger data-testid="select-listing-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price (ETB) *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 8500000"
                      className={errors.price ? 'border-red-500' : ''}
                      data-testid="input-price"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Area (m²)</label>
                    <Input
                      type="number"
                      value={formData.area || ''}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="e.g., 120"
                      data-testid="input-area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.bedrooms || ''}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="e.g., 3"
                      data-testid="input-bedrooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.bathrooms || ''}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="e.g., 2"
                      data-testid="input-bathrooms"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Detailed address"
                    data-testid="input-address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the property..."
                    data-testid="textarea-description"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add feature (e.g., Swimming Pool)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      data-testid="input-new-feature"
                    />
                    <Button type="button" onClick={addFeature} variant="outline" data-testid="button-add-feature">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.features || []).map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                        data-testid={`feature-${index}`}
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Featured Property */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    data-testid="checkbox-featured"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Feature this property on homepage
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-testid="button-save-property"
                  >
                    {(createPropertyMutation.isPending || updatePropertyMutation.isPending) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingProperty ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        {editingProperty ? 'Update Property' : 'Create Property'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search properties by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-properties"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40" data-testid="filter-status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40" data-testid="filter-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Properties ({filteredProperties.length})
              <Badge variant="outline" className="text-sm">
                {properties?.filter(p => p.featured).length || 0} Featured
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    data-testid={`property-item-${property.id}`}
                  >
                    <div className="h-16 w-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      <Building size={24} className="text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{property.title}</h3>
                        {property.featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin size={14} className="mr-1" />
                        {property.location}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="font-medium text-foreground">ETB {formatPrice(property.price)}</span>
                          {property.listingType === 'rent' && <span className="ml-1">/month</span>}
                        </div>
                        
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <Bed size={14} className="mr-1" />
                            {property.bedrooms}
                          </div>
                        )}
                        
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath size={14} className="mr-1" />
                            {property.bathrooms}
                          </div>
                        )}
                        
                        {property.area && (
                          <div className="flex items-center">
                            <Square size={14} className="mr-1" />
                            {property.area}m²
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(property.status || 'available')}>
                        {property.status || 'available'}
                      </Badge>
                      
                      <div className="flex space-x-1">
                        <Link href={`/property/${property.id}`} target="_blank">
                          <Button variant="ghost" size="sm" data-testid={`button-view-${property.id}`}>
                            <Eye size={16} />
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(property)}
                          data-testid={`button-edit-${property.id}`}
                        >
                          <Edit size={16} />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(property)}
                          disabled={deletePropertyMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`button-delete-${property.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || filterStatus || filterType
                    ? 'No properties match your current filters.'
                    : 'You haven\'t added any properties yet.'}
                </p>
                {!searchQuery && !filterStatus && !filterType && (
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Your First Property
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
