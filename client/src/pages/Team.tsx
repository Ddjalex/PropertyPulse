import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TeamMemberCard from '@/components/TeamMember';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  Mail, 
  Users,
  Award,
  Star,
  MapPin
} from 'lucide-react';
import type { TeamMember } from '@shared/models';

export default function Team() {
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team', { active: true }],
  });

  const handleCall = (phone: string = '+251911123456') => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string = '+251911123456', message: string = '') => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (email: string = 'info@gifirealestate.com', subject?: string) => {
    window.location.href = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
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
                <h1 className="text-3xl font-bold" data-testid="page-title">Meet Our Team</h1>
                <p className="text-primary-foreground/80">Expert professionals dedicated to your property success</p>
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
        {/* Team Overview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Our Team</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              With over 30 years of combined experience in Ethiopian real estate, our team brings deep local knowledge, 
              professional expertise, and unwavering commitment to helping you find the perfect property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">30+ Years Experience</h3>
                <p className="text-muted-foreground text-sm">
                  Decades of expertise in Ethiopian property market and investment opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-8 w-8 text-secondary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Service</h3>
                <p className="text-muted-foreground text-sm">
                  Personalized attention and professional guidance throughout your property journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Local Expertise</h3>
                <p className="text-muted-foreground text-sm">
                  Deep knowledge of Addis Ababa neighborhoods and emerging development areas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Professional Team</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
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
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onCall={(member) => handleCall(member.phone || '+251911123456')}
                  onWhatsApp={(member) => handleWhatsApp(
                    member.whatsapp || '+251911123456', 
                    `Hi ${member.name}, I'd like to discuss my property requirements.`
                  )}
                  onEmail={(member) => handleEmail(
                    member.email || 'info@gifirealestate.com',
                    `Property Inquiry - ${member.name}`
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Information Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                We're updating our team profiles. In the meantime, please contact us directly for immediate assistance.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => handleCall('+251911123456')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-testid="button-call-team"
                >
                  <Phone size={16} className="mr-2" />
                  Call Main Office
                </Button>
                <Button 
                  onClick={() => handleWhatsApp('+251911123456', 'Hi, I need assistance with property services')}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  data-testid="button-whatsapp-team"
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp Us
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Team Specializations */}
        {teamMembers && teamMembers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Expertise Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Residential Sales',
                'Commercial Properties',
                'Investment Consulting',
                'Property Valuation',
                'Legal Documentation',
                'Market Analysis',
                'Project Development',
                'Property Management'
              ].map((expertise, index) => (
                <Card key={index} className="text-center p-4">
                  <p className="font-medium text-sm">{expertise}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Team Contact Section */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Work with Us?</h3>
          <p className="text-muted-foreground mb-6">
            Our team is here to help you navigate the Ethiopian real estate market with confidence and expertise.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="text-primary-foreground" size={20} />
              </div>
              <h4 className="font-semibold mb-1">Call Us</h4>
              <p className="text-sm text-muted-foreground">+251-911-123-456</p>
              <p className="text-xs text-muted-foreground">Available 8AM - 8PM</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="text-secondary-foreground" size={20} />
              </div>
              <h4 className="font-semibold mb-1">WhatsApp</h4>
              <p className="text-sm text-muted-foreground">Instant Response</p>
              <p className="text-xs text-muted-foreground">Quick property queries</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-primary-foreground" size={20} />
              </div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-sm text-muted-foreground">info@gifirealestate.com</p>
              <p className="text-xs text-muted-foreground">Detailed inquiries</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleCall('+251911123456')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-call-main"
            >
              <Phone size={16} className="mr-2" />
              Call Our Team
            </Button>
            <Button 
              onClick={() => handleWhatsApp('+251911123456', 'Hi, I\'d like to speak with your property team')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              data-testid="button-whatsapp-main"
            >
              <MessageCircle size={16} className="mr-2" />
              WhatsApp Team
            </Button>
            <Link href="/contact">
              <Button variant="outline" data-testid="button-contact-team">
                <Mail size={16} className="mr-2" />
                Send Message
              </Button>
            </Link>
          </div>
        </div>

        {/* Office Information */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Visit Our Office</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-medium">Main Office</p>
                        <p className="text-muted-foreground">
                          Bole Sub City, Addis Ababa<br />
                          Near Edna Mall, 2nd Floor<br />
                          Ethiopia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="text-primary mt-1" size={20} />
                      <div>
                        <p className="font-medium">Office Hours</p>
                        <p className="text-muted-foreground">
                          Monday - Friday: 8:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 4:00 PM<br />
                          Sunday: By appointment only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Why Visit Our Office?</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>View detailed property portfolios and floor plans</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Meet with senior property consultants</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Access exclusive off-market listings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Discuss financing and investment strategies</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Get market analysis and area reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
