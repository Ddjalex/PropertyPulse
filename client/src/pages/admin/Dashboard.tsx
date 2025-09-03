import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Clock, 
  Plus, 
  Eye,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import type { Property, Lead, Project, TeamMember } from '@shared/schema';

export default function Dashboard() {
  // Fetch dashboard data
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/admin/leads'],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });

  // Calculate stats
  const totalProperties = properties?.length || 0;
  const activeLeads = leads?.filter(lead => ['new', 'contacted'].includes(lead.status || '')).length || 0;
  const soldThisMonth = properties?.filter(property => {
    if (property.status !== 'sold' || !property.updatedAt) return false;
    const soldDate = new Date(property.updatedAt);
    const now = new Date();
    return soldDate.getMonth() === now.getMonth() && soldDate.getFullYear() === now.getFullYear();
  }).length || 0;
  const activeProjects = projects?.filter(project => project.status === 'construction').length || 0;

  const recentProperties = properties?.slice(0, 5) || [];
  const recentLeads = leads?.slice(0, 5) || [];
  const featuredProperties = properties?.filter(p => p.featured).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="dashboard-title">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back to GIFI Real Estate Admin Portal
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/properties">
              <Button data-testid="button-add-property">
                <Plus size={16} className="mr-2" />
                Add Property
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" data-testid="button-view-website">
                <Eye size={16} className="mr-2" />
                View Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary" data-testid="stat-total-properties">
                {propertiesLoading ? <Skeleton className="h-8 w-16" /> : totalProperties}
              </div>
              <p className="text-xs text-muted-foreground">
                {featuredProperties} featured listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground" data-testid="stat-active-leads">
                {leadsLoading ? <Skeleton className="h-8 w-16" /> : activeLeads}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending follow-up
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="stat-sold-this-month">
                {propertiesLoading ? <Skeleton className="h-8 w-16" /> : soldThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully closed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" data-testid="stat-active-projects">
                {projectsLoading ? <Skeleton className="h-8 w-16" /> : activeProjects}
              </div>
              <p className="text-xs text-muted-foreground">
                Under construction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Properties */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Properties
                <Link href="/admin/properties">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-properties">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertiesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))
                ) : recentProperties.length > 0 ? (
                  recentProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      data-testid={`recent-property-${property.id}`}
                    >
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <Building size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{property.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin size={12} className="mr-1" />
                          {property.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">ETB {Number(property.price).toLocaleString()}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No properties added yet</p>
                    <Link href="/admin/properties">
                      <Button className="mt-2" size="sm">Add First Property</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Leads
                <Link href="/admin/leads">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-leads">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      data-testid={`recent-lead-${lead.id}`}
                    >
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {lead.firstName[0]}{lead.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail size={12} className="mr-1" />
                          {lead.email}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {lead.propertyInterest || 'General Inquiry'}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'new' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'qualified'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No leads yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Leads will appear as visitors contact you</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Projects
                <Link href="/admin/projects">
                  <Button variant="ghost" size="sm" data-testid="button-view-projects">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.filter(p => p.status === 'construction').slice(0, 3).map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg" data-testid={`project-${project.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.location}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active projects</p>
                  <Link href="/admin/projects">
                    <Button className="mt-2" size="sm">Add Project</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Team Overview
                <Link href="/admin/team">
                  <Button variant="ghost" size="sm" data-testid="button-view-team">
                    Manage
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : teamMembers && teamMembers.length > 0 ? (
                <div className="space-y-4">
                  {teamMembers.filter(m => m.active).slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center space-x-3" data-testid={`team-member-${member.id}`}>
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.position}</p>
                      </div>
                      <div className="flex space-x-1">
                        {member.phone && (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone size={12} className="text-green-600" />
                          </div>
                        )}
                        {member.email && (
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail size={12} className="text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {teamMembers.filter(m => m.active).length > 4 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{teamMembers.filter(m => m.active).length - 4} more team members
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No team members added</p>
                  <Link href="/admin/team">
                    <Button className="mt-2" size="sm">Add Team Member</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/properties">
                <Button variant="outline" className="w-full h-20 flex-col" data-testid="quick-action-add-property">
                  <Building className="mb-2 h-6 w-6" />
                  <span>Add Property</span>
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full h-20 flex-col" data-testid="quick-action-add-project">
                  <TrendingUp className="mb-2 h-6 w-6" />
                  <span>Add Project</span>
                </Button>
              </Link>
              <Link href="/admin/leads">
                <Button variant="outline" className="w-full h-20 flex-col" data-testid="quick-action-manage-leads">
                  <Users className="mb-2 h-6 w-6" />
                  <span>Manage Leads</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-20 flex-col" data-testid="quick-action-settings">
                  <Clock className="mb-2 h-6 w-6" />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
