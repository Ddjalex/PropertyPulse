import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyCard from '@/components/PropertyCard';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronLeft,
  Filter
} from 'lucide-react';
import type { Property } from '@shared/models';

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    listingType: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.listingType) queryParams.append('listingType', filters.listingType);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
  if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties', Object.fromEntries(queryParams)],
  });

  const filteredProperties = properties?.filter(property => {
    if (!searchQuery) return true;
    return property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
           property.description?.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const handleCall = (phone: string = '+251911123456') => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string = '+251911123456', message: string = '') => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      listingType: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-back-home">
                  <ChevronLeft size={20} className="mr-1" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold" data-testid="page-title">Properties</h1>
                <p className="text-primary-foreground/80">Find your perfect property in Ethiopia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <Phone size={16} />
                <span>+251-911-123-456</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search properties by title, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="lg:w-auto"
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger data-testid="filter-property-type">
                        <SelectValue placeholder="Any Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Type</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Listing Type</label>
                    <Select value={filters.listingType} onValueChange={(value) => setFilters(prev => ({ ...prev, listingType: value }))}>
                      <SelectTrigger data-testid="filter-listing-type">
                        <SelectValue placeholder="Sale & Rent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Sale & Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger data-testid="filter-location">
                        <SelectValue placeholder="Any Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Location</SelectItem>
                        <SelectItem value="Bole">Bole</SelectItem>
                        <SelectItem value="Kazanchis">Kazanchis</SelectItem>
                        <SelectItem value="CMC">CMC</SelectItem>
                        <SelectItem value="Sarbet">Sarbet</SelectItem>
                        <SelectItem value="4 Kilo">4 Kilo</SelectItem>
                        <SelectItem value="Mexico">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Min Price (ETB)</label>
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      data-testid="input-min-price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Price (ETB)</label>
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      data-testid="input-max-price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
                      <SelectTrigger data-testid="filter-bedrooms">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}>
                      <SelectTrigger data-testid="filter-bathrooms">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={resetFilters} variant="outline" className="w-full" data-testid="button-reset-filters">
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-foreground font-medium" data-testid="results-count">
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                `${filteredProperties.length} properties found`
              )}
            </p>
            <p className="text-muted-foreground text-sm">
              Premium real estate in Ethiopia
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40" data-testid="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="size-large">Size: Largest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 mb-4" />
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                  <Skeleton className="h-8 mb-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <PropertyCard
                  property={property}
                  onCall={(prop) => handleCall('+251911123456')}
                  onWhatsApp={(prop) => handleWhatsApp('+251911123456', `Hi, I'm interested in ${prop.title}`)}
                  onFavorite={(prop) => console.log('Add to favorites:', prop)}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Filter size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={resetFilters} data-testid="button-clear-search">
                Clear Search & Filters
              </Button>
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Can't find what you're looking for?</h3>
          <p className="text-muted-foreground mb-6">
            Our expert team can help you find the perfect property that matches your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleCall('+251911123456')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-call-expert"
            >
              <Phone size={16} className="mr-2" />
              Call Our Experts
            </Button>
            <Button 
              onClick={() => handleWhatsApp('+251911123456', 'Hi, I need help finding a property')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              data-testid="button-whatsapp-expert"
            >
              <MessageCircle size={16} className="mr-2" />
              WhatsApp Us
            </Button>
            <Link href="/contact">
              <Button variant="outline" data-testid="button-contact-form">
                <Mail size={16} className="mr-2" />
                Contact Form
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
