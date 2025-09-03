import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { insertLeadSchema } from '@shared/models';
import { z } from 'zod';

const contactFormSchema = insertLeadSchema.extend({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyInterest: '',
    message: '',
    source: 'website',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest('POST', '/api/leads', data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your inquiry. Our team will contact you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyInterest: '',
        message: '',
        source: 'website',
      });
      setErrors({});
      
      // Invalidate leads cache for admin
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
    },
    onError: (error: any) => {
      console.error('Contact form error:', error);
      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleCall = (phone: string = '+251911123456') => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string = '+251911123456', message: string = '') => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (email: string = 'info@gifirealestate.com') => {
    window.location.href = `mailto:${email}`;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
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
      contactMutation.mutate(formData);
    }
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
                <h1 className="text-3xl font-bold" data-testid="page-title">Contact Us</h1>
                <p className="text-primary-foreground/80">Get in touch with our property experts</p>
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
        {/* Quick Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCall('+251911123456')}>
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-primary-foreground" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us Now</h3>
              <p className="text-muted-foreground mb-2">Speak directly with our team</p>
              <p className="font-medium text-primary">+251-911-123-456</p>
              <p className="text-sm text-muted-foreground">Available 8AM - 8PM</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleWhatsApp('+251911123456', 'Hi, I need assistance with property services')}>
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-secondary-foreground" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">WhatsApp Us</h3>
              <p className="text-muted-foreground mb-2">Quick responses guaranteed</p>
              <p className="font-medium text-secondary-foreground">+251-911-123-456</p>
              <p className="text-sm text-muted-foreground">Instant messaging</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleEmail('info@gifirealestate.com')}>
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-primary-foreground" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">Detailed inquiries welcome</p>
              <p className="font-medium text-primary">info@gifirealestate.com</p>
              <p className="text-sm text-muted-foreground">24-48 hour response</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Your first name"
                        className={errors.firstName ? 'border-red-500' : ''}
                        data-testid="input-first-name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Your last name"
                        className={errors.lastName ? 'border-red-500' : ''}
                        data-testid="input-last-name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+251-911-123-456"
                      className={errors.phone ? 'border-red-500' : ''}
                      data-testid="input-phone"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Property Interest
                    </label>
                    <Select value={formData.propertyInterest || ""} onValueChange={(value) => handleInputChange('propertyInterest', value)}>
                      <SelectTrigger data-testid="select-property-interest">
                        <SelectValue placeholder="Select property type (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select property type (optional)</SelectItem>
                        <SelectItem value="apartment">Residential Apartment</SelectItem>
                        <SelectItem value="villa">Villa/House</SelectItem>
                        <SelectItem value="office">Commercial Office</SelectItem>
                        <SelectItem value="land">Land/Plot</SelectItem>
                        <SelectItem value="investment">Investment Property</SelectItem>
                        <SelectItem value="rental">Rental Property</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      rows={4}
                      value={formData.message || ""}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your property requirements, budget, preferred location, etc."
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-testid="button-send-message"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle>Visit Our Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Main Office</h3>
                    <p className="text-muted-foreground">
                      Bole Sub City, Addis Ababa<br />
                      Near Edna Mall, 2nd Floor<br />
                      P.O. Box 12345<br />
                      Ethiopia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-secondary-foreground" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Office Hours</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: By appointment only</p>
                      <p className="text-sm font-medium text-primary mt-2">
                        Emergency hotline available 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Sales Department</p>
                    <p className="text-sm text-muted-foreground">Property purchases & investments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">+251-911-789-012</p>
                    <p className="text-sm text-muted-foreground">sales@gifirealestate.com</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Rental Department</p>
                    <p className="text-sm text-muted-foreground">Property rentals & leasing</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">+251-911-456-789</p>
                    <p className="text-sm text-muted-foreground">rentals@gifirealestate.com</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Project Development</p>
                    <p className="text-sm text-muted-foreground">New developments & investments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">+251-911-234-567</p>
                    <p className="text-sm text-muted-foreground">projects@gifirealestate.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Stay updated with our latest properties and market insights.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    data-testid="link-facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                    data-testid="link-twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                    data-testid="link-instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-900 transition-colors"
                    data-testid="link-linkedin"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  For urgent property matters outside business hours:
                </p>
                <div className="flex items-center space-x-3 mb-2">
                  <Phone className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium">24/7 Emergency Hotline</p>
                    <p className="text-red-600 font-semibold">+251-911-000-999</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  For property emergencies, urgent maintenance, or security issues only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
              <p className="text-center text-muted-foreground">
                Quick answers to common questions about our services.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">How quickly do you respond to inquiries?</h4>
                  <p className="text-muted-foreground text-sm">
                    We respond to all inquiries within 2-4 hours during business hours and within 24 hours on weekends.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Do you offer property viewing appointments?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, we schedule property viewings 7 days a week. Evening and weekend appointments are available.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">What areas of Addis Ababa do you cover?</h4>
                  <p className="text-muted-foreground text-sm">
                    We cover all areas of Addis Ababa and surrounding regions, with expertise in Bole, Kazanchis, CMC, and emerging neighborhoods.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Do you assist with financing and legal processes?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, we provide guidance on financing options and connect you with trusted legal professionals for documentation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
