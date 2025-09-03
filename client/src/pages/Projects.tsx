import { useState } from 'react';
import { Link } from 'wouter';
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
  Calendar,
  TrendingUp,
  Building,
  Users,
  Clock
} from 'lucide-react';
import type { Project, ConstructionUpdate } from '@shared/schema';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: updates, isLoading: updatesLoading } = useQuery<ConstructionUpdate[]>({
    queryKey: ['/api/construction-updates', selectedProject ? { projectId: selectedProject } : {}],
    enabled: !!selectedProject,
  });

  const handleCall = (phone: string = '+251911123456') => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string = '+251911123456', message: string = '') => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'construction': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
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
                <h1 className="text-3xl font-bold" data-testid="page-title">Our Projects</h1>
                <p className="text-primary-foreground/80">Track the progress of our development projects</p>
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
        {/* Projects Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-total-projects">
                  {projectsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : projects?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-secondary-foreground mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-active-projects">
                  {projectsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : 
                    projects?.filter(p => p.status === 'construction').length || 0
                  }
                </div>
                <p className="text-sm text-muted-foreground">Active Construction</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground" data-testid="stat-completed-projects">
                  {projectsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : 
                    projects?.filter(p => p.status === 'completed').length || 0
                  }
                </div>
                <p className="text-sm text-muted-foreground">Completed Projects</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects Grid */}
        {projectsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
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
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => {
              const mainImage = project.images?.[0] || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
              
              return (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={mainImage} 
                      alt={project.name}
                      className="w-full h-64 object-cover"
                      data-testid={`project-image-${project.id}`}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getStatusColor(project.status || 'planning')} font-medium`}>
                        {project.progress}% Complete
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {project.status === 'planning' ? 'Planning' :
                         project.status === 'construction' ? 'Under Construction' :
                         project.status === 'completed' ? 'Completed' : 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-card-foreground" data-testid={`project-name-${project.id}`}>
                        {project.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        Updated recently
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground flex items-center mb-3" data-testid={`project-location-${project.id}`}>
                      <MapPin size={16} className="mr-1" />
                      {project.location}
                    </p>
                    
                    {project.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`project-description-${project.id}`}>
                        {project.description}
                      </p>
                    )}
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress || 0}%` }}
                        data-testid={`project-progress-${project.id}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Expected Completion:</span>
                        <p className="font-medium" data-testid={`project-completion-${project.id}`}>
                          {project.expectedCompletion 
                            ? formatDate(project.expectedCompletion.toString())
                            : 'TBD'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available Units:</span>
                        <p className="font-medium" data-testid={`project-units-${project.id}`}>
                          {project.availableUnits || 0} units
                        </p>
                      </div>
                    </div>

                    {project.features && project.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Project Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {project.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => setSelectedProject(project.id)}
                        variant="outline"
                        className="flex-1"
                        data-testid={`button-view-updates-${project.id}`}
                      >
                        <Clock size={16} className="mr-1" />
                        View Updates
                      </Button>
                      <Button 
                        onClick={() => handleWhatsApp('+251911123456', `Hi, I'm interested in ${project.name} project`)}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        data-testid={`button-inquire-${project.id}`}
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Inquire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building size={64} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Available</h3>
            <p className="text-muted-foreground mb-6">
              We don't have any active construction projects at the moment. Stay tuned for exciting new developments!
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => handleCall('+251911123456')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Phone size={16} className="mr-2" />
                Call for Updates
              </Button>
              <Link href="/contact">
                <Button variant="outline">
                  <Mail size={16} className="mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Construction Updates Modal/Panel */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Construction Updates</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedProject(null)}
                  data-testid="button-close-updates"
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                {updatesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <Skeleton className="h-5 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ))}
                  </div>
                ) : updates && updates.length > 0 ? (
                  <div className="space-y-6">
                    {updates.map((update) => (
                      <div key={update.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold" data-testid={`update-title-${update.id}`}>
                            {update.title}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {update.updateDate ? formatDate(update.updateDate.toString()) : 'Recent'}
                          </span>
                        </div>
                        {update.progress !== null && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{update.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${update.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {update.content && (
                          <p className="text-muted-foreground" data-testid={`update-content-${update.id}`}>
                            {update.content}
                          </p>
                        )}
                        {update.images && update.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {update.images.slice(0, 3).map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`Update ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No construction updates available for this project yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Interested in Pre-booking?</h3>
          <p className="text-muted-foreground mb-6">
            Get early access to our upcoming projects and secure the best units at pre-launch prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleCall('+251911123456')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-call-projects"
            >
              <Phone size={16} className="mr-2" />
              Call Project Manager
            </Button>
            <Button 
              onClick={() => handleWhatsApp('+251911123456', 'Hi, I\'m interested in pre-booking a unit')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              data-testid="button-whatsapp-projects"
            >
              <MessageCircle size={16} className="mr-2" />
              WhatsApp Inquiry
            </Button>
            <Link href="/contact">
              <Button variant="outline" data-testid="button-contact-projects">
                <Mail size={16} className="mr-2" />
                Send Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
