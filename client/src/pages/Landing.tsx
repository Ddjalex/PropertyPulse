import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroSlider from '@/components/HeroSlider';
import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import TeamMemberCard from '@/components/TeamMember';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Award, 
  Handshake, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  Heart
} from 'lucide-react';
import { useState } from 'react';
import type { Property, TeamMember, Project } from '@shared/models';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePropertyFilter, setActivePropertyFilter] = useState('all');

  // Fetch featured properties
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties', { featured: true }],
  });

  // Fetch team members
  const { data: teamMembers, isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team', { active: true }],
  });

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // Navigate to properties page with filters
    window.location.href = '/properties?' + new URLSearchParams(filters).toString();
  };

  const handleCall = (phone: string = '+251911123456') => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string = '+251911123456', message: string = '') => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (email: string = 'info@giftrealestate.com', subject?: string) => {
    window.location.href = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  };

  const filteredProperties = properties?.filter(property => {
    if (activePropertyFilter === 'all') return true;
    return property.listingType === activePropertyFilter;
  }) || [];

  return (
    <div className="bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-secondary-foreground">G</span>
              </div>
              <div>
                <span className="text-xl font-bold">Gift</span>
                <span className="text-sm block text-primary-foreground/80">Real Estate</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-secondary transition-colors">Home</a>
              <a href="#properties" className="hover:text-secondary transition-colors">Properties</a>
              <a href="#projects" className="hover:text-secondary transition-colors">Projects</a>
              <a href="#team" className="hover:text-secondary transition-colors">Our Team</a>
              <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <Phone size={16} />
                <span>+251-911-123-456</span>
              </div>
              <Link href="/api/login">
                <Button variant="secondary" size="sm" data-testid="button-admin-login">
                  Admin
                </Button>
              </Link>
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-primary z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-primary-foreground">
            <a href="#home" className="text-2xl hover:text-secondary transition-colors">Home</a>
            <a href="#properties" className="text-2xl hover:text-secondary transition-colors">Properties</a>
            <a href="#projects" className="text-2xl hover:text-secondary transition-colors">Projects</a>
            <a href="#team" className="text-2xl hover:text-secondary transition-colors">Our Team</a>
            <a href="#contact" className="text-2xl hover:text-secondary transition-colors">Contact</a>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="mt-16">
        <div className="relative">
          <HeroSlider />
          <div className="absolute inset-x-0 bottom-20 px-4">
            <div className="max-w-4xl mx-auto">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground">Discover our handpicked selection of premium properties</p>
          </div>
          
          {/* Property Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => setActivePropertyFilter('all')}
              className={activePropertyFilter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
              }
              data-testid="filter-all"
            >
              All
            </Button>
            <Button 
              onClick={() => setActivePropertyFilter('sale')}
              className={activePropertyFilter === 'sale' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
              }
              data-testid="filter-sale"
            >
              For Sale
            </Button>
            <Button 
              onClick={() => setActivePropertyFilter('rent')}
              className={activePropertyFilter === 'rent' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
              }
              data-testid="filter-rent"
            >
              For Rent
            </Button>
          </div>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertiesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
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
              ))
            ) : filteredProperties.length > 0 ? (
              filteredProperties.slice(0, 6).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onCall={(prop) => handleCall('+251911123456')}
                  onWhatsApp={(prop) => handleWhatsApp('+251911123456', `Hi, I'm interested in ${prop.title}`)}
                  onFavorite={(prop) => console.log('Add to favorites:', prop)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No featured properties available at the moment.</p>
                <p className="text-muted-foreground">Please check back later for updates.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/properties">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-medium text-lg"
                data-testid="button-view-all-properties"
              >
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Gift Real Estate</h2>
            <p className="text-xl text-muted-foreground">Over 30 years of excellence in Ethiopian real estate</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-2xl text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted Since 1990</h3>
              <p className="text-muted-foreground">Three decades of expertise and thousands of satisfied clients across Ethiopia.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="text-2xl text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Service</h3>
              <p className="text-muted-foreground">Personalized attention and professional guidance throughout your property journey.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-2xl text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
              <p className="text-muted-foreground">Deep knowledge of Ethiopian property markets and investment opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Construction Updates/Projects */}
      <section id="projects" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Construction Updates</h2>
            <p className="text-xl text-muted-foreground">Track the progress of our ongoing development projects</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projectsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 mb-3" />
                    <Skeleton className="h-16 mb-4" />
                    <Skeleton className="h-2 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : projects && projects.length > 0 ? (
              projects.slice(0, 2).map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <img 
                    src={project.images?.[0] || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'} 
                    alt={project.name}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-secondary text-secondary-foreground font-medium">
                        {project.progress}% Complete
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Updated recently
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">{project.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Expected: {project.expectedCompletion 
                          ? new Date(project.expectedCompletion).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : 'TBD'
                        }
                      </span>
                      <span>{project.availableUnits || 0} units available</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No active construction projects at the moment.</p>
                <p className="text-muted-foreground">Stay tuned for exciting new developments!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section id="team" className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">Expert professionals dedicated to your property success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden text-center">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 mb-1 mx-auto w-32" />
                    <Skeleton className="h-4 mb-3 mx-auto w-24" />
                    <Skeleton className="h-16 mb-4" />
                    <div className="flex justify-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : teamMembers && teamMembers.length > 0 ? (
              teamMembers.slice(0, 3).map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onCall={(member) => handleCall(member.phone || '+251911123456')}
                  onWhatsApp={(member) => handleWhatsApp(member.whatsapp || '+251911123456')}
                  onEmail={(member) => handleEmail(member.email || 'info@giftrealestate.com')}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">Team information will be available soon.</p>
                <p className="text-muted-foreground">Contact us for immediate assistance.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground">Ready to find your perfect property? Contact us today</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Our Office</h3>
                    <p className="text-muted-foreground">
                      Bole Sub City, Addis Ababa<br />
                      Near Edna Mall, 2nd Floor<br />
                      Ethiopia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Phone & WhatsApp</h3>
                    <p className="text-muted-foreground">
                      +251-911-123-456<br />
                      +251-911-789-012<br />
                      Available 8AM - 8PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      info@giftrealestate.com<br />
                      sales@giftrealestate.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  // Handle form submission
                  console.log('Contact form submitted');
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background" 
                        placeholder="Your first name"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background" 
                        placeholder="Your last name"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background" 
                      placeholder="your.email@example.com"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background" 
                      placeholder="+251-911-123-456"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Property Interest</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background" data-testid="select-property-interest">
                      <option value="">Select property type</option>
                      <option value="apartment">Residential Apartment</option>
                      <option value="villa">Villa/House</option>
                      <option value="office">Commercial Office</option>
                      <option value="land">Land/Plot</option>
                      <option value="investment">Investment Property</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea 
                      rows={4} 
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-background" 
                      placeholder="Tell us about your property requirements..."
                      data-testid="textarea-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
                    data-testid="button-send-message"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-secondary-foreground">G</span>
                </div>
                <div>
                  <span className="text-xl font-bold">Gift</span>
                  <span className="text-sm block text-primary-foreground/80">Real Estate</span>
                </div>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Your trusted partner in Ethiopian real estate since 1990. Building dreams, creating communities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-foreground/80 hover:text-secondary">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#properties" className="hover:text-secondary">Properties</a></li>
                <li><a href="#projects" className="hover:text-secondary">Projects</a></li>
                <li><a href="#team" className="hover:text-secondary">Our Team</a></li>
                <li><a href="#contact" className="hover:text-secondary">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Types</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-secondary">Residential</a></li>
                <li><a href="#" className="hover:text-secondary">Commercial</a></li>
                <li><a href="#" className="hover:text-secondary">Villas</a></li>
                <li><a href="#" className="hover:text-secondary">Apartments</a></li>
                <li><a href="#" className="hover:text-secondary">Land</a></li>
                <li><a href="#" className="hover:text-secondary">Investment</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-primary-foreground/80">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Bole Sub City, Addis Ababa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+251-911-123-456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>info@giftrealestate.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <span>WhatsApp Available</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Gift Real Estate. All rights reserved. | Trusted since 1990</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
