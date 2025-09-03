import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Heart,
  Share2,
  ChevronRight,
  Eye,
  Car,
  Wifi,
  Dumbbell,
  ShieldCheck
} from 'lucide-react';
import type { Property } from '@shared/models';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['/api/properties', id],
  });

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'];

  const handleCall = (phone: string = '+251911123456') => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string = '+251911123456', message: string = '') => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    const subject = `Inquiry about ${property.title}`;
    const body = `Hi, I'm interested in learning more about the property: ${property.title} located in ${property.location}.`;
    window.location.href = `mailto:info@giftrealestate.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Could show a toast here
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/properties">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-back">
                <ChevronLeft size={20} className="mr-1" />
                Back to Properties
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className="text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-favorite"
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-share"
              >
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  data-testid="property-main-image"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      data-testid="button-next-image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-md overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="property-title">
                    {property.title}
                  </h1>
                  <p className="text-muted-foreground flex items-center" data-testid="property-location">
                    <MapPin size={16} className="mr-1" />
                    {property.location}
                  </p>
                </div>
                <Badge className={`${getStatusColor(property.status || 'available')}`} data-testid="property-status">
                  {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="flex items-center space-x-2" data-testid="property-bedrooms">
                    <Bed size={20} className="text-muted-foreground" />
                    <span className="font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center space-x-2" data-testid="property-bathrooms">
                    <Bath size={20} className="text-muted-foreground" />
                    <span className="font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center space-x-2" data-testid="property-area">
                    <Square size={20} className="text-muted-foreground" />
                    <span className="font-medium">{property.area} m²</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-muted-foreground" />
                  <span className="font-medium">Available Now</span>
                </div>
              </div>

              {property.description && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid="property-description">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2" data-testid={`feature-${index}`}>
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Virtual Tour */}
            {property.virtualTourUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Virtual Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" data-testid="button-virtual-tour">
                    <Eye size={16} className="mr-2" />
                    Take Virtual Tour
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Contact */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-2" data-testid="property-price">
                    ETB {formatPrice(property.price)}
                    {property.listingType === 'rent' && (
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    )}
                  </div>
                  {property.pricePerSqm && (
                    <p className="text-muted-foreground" data-testid="property-price-per-sqm">
                      ETB {formatPrice(property.pricePerSqm)}/m²
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => handleCall('+251911123456')}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-testid="button-call"
                  >
                    <Phone size={16} className="mr-2" />
                    Call Agent
                  </Button>
                  
                  <Button 
                    onClick={() => handleWhatsApp('+251911123456', `Hi, I'm interested in ${property.title}`)}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    data-testid="button-whatsapp"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={handleEmail}
                    variant="outline"
                    className="w-full"
                    data-testid="button-email"
                  >
                    <Mail size={16} className="mr-2" />
                    Send Email
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Listed by Gift Real Estate</p>
                    <p className="font-medium text-foreground">Professional Property Consultants</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing Type</span>
                    <span className="font-medium capitalize">{property.listingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{property.status}</span>
                  </div>
                  {property.area && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-medium">{property.area} m²</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency</span>
                    <span className="font-medium">{property.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Request More Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Contact form submitted');
                }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background"
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background"
                      data-testid="input-contact-phone"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder={`I'm interested in ${property.title}...`}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background"
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-send-inquiry">
                    Send Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="aspect-video rounded-lg" />
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-32 mx-auto mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
