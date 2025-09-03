import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Bath, Square, MapPin, Phone, MessageCircle, Heart } from 'lucide-react';
import type { Property } from '@shared/schema';

interface PropertyCardProps {
  property: Property;
  onCall?: (property: Property) => void;
  onWhatsApp?: (property: Property) => void;
  onFavorite?: (property: Property) => void;
  isFavorite?: boolean;
}

export default function PropertyCard({ 
  property, 
  onCall, 
  onWhatsApp, 
  onFavorite, 
  isFavorite = false 
}: PropertyCardProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M`;
    } else if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(0)}K`;
    }
    return numPrice.toLocaleString();
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

  const getListingTypeBadge = (listingType: string) => {
    return listingType === 'sale' 
      ? 'For Sale'
      : 'For Rent';
  };

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';

  return (
    <Card className="property-card overflow-hidden hover:shadow-lg transition-all duration-300" data-testid={`property-card-${property.id}`}>
      <div className="relative">
        <img 
          src={mainImage} 
          alt={property.title}
          className="w-full h-48 object-cover"
          data-testid="property-image"
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${getStatusColor(property.status || 'available')} font-medium`} data-testid="property-status">
            {getListingTypeBadge(property.listingType)}
          </Badge>
        </div>
        <button
          onClick={() => onFavorite?.(property)}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          data-testid="button-favorite"
        >
          <Heart 
            size={20} 
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
          />
        </button>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid="property-title">
          {property.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 flex items-center" data-testid="property-location">
          <MapPin size={16} className="mr-1" />
          {property.location}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center" data-testid="property-bedrooms">
              <Bed size={16} className="mr-1" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center" data-testid="property-bathrooms">
              <Bath size={16} className="mr-1" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center" data-testid="property-area">
              <Square size={16} className="mr-1" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-primary" data-testid="property-price">
            ETB {formatPrice(property.price)}
            {property.listingType === 'rent' && (
              <span className="text-sm font-normal">/month</span>
            )}
          </div>
          {property.pricePerSqm && (
            <div className="text-sm text-muted-foreground" data-testid="property-price-per-sqm">
              ETB {formatPrice(property.pricePerSqm)}/m²
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onCall?.(property)}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
            data-testid="button-call"
          >
            <Phone size={16} className="mr-1" />
            Call
          </Button>
          <Button 
            onClick={() => onWhatsApp?.(property)}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium transition-colors"
            data-testid="button-whatsapp"
          >
            <MessageCircle size={16} className="mr-1" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
