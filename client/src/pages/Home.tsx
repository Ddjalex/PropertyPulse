import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Building, Users, TrendingUp, Clock, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property, Lead } from '@shared/models';

export default function Home() {
  // Fetch dashboard data
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/admin/leads'],
  });

  const totalProperties = properties?.length || 0;
  const activeLeads = leads?.filter(lead => lead.status === 'new' || lead.status === 'contacted').length || 0;
  const soldThisMonth = properties?.filter(property => {
    if (property.status !== 'sold' || !property.updatedAt) return false;
    const soldDate = new Date(property.updatedAt);
    const now = new Date();
    return soldDate.getMonth() === now.getMonth() && soldDate.getFullYear() === now.getFullYear();
  }).length || 0;

  const recentProperties = properties?.slice(0, 5) || [];
  const recentLeads = leads?.slice(0, 5) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="dashboard-title">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back to Gift Real Estate Admin
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/properties">
              <Button data-testid="button-add-property">
                <Plus size={16} className="mr-2" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                Active listings
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
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                2h
              </div>
              <p className="text-xs text-muted-foreground">
                Average lead response
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <Card>
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
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : recentProperties.length > 0 ? (
                  recentProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="flex items-center space-x-4"
                      data-testid={`recent-property-${property.id}`}
                    >
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <Building size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{property.title}</p>
                        <p className="text-xs text-muted-foreground">{property.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">ETB {Number(property.price).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground capitalize">{property.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-4">No properties found</p>
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
                    <div key={i} className="flex items-center space-x-4">
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
                      className="flex items-center space-x-4"
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
                        <p className="text-xs text-muted-foreground truncate">
                          {lead.propertyInterest || 'General Inquiry'}
                        </p>
                      </div>
                      <div className="text-right">
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
                  <p className="text-muted-foreground text-sm py-4">No leads found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/admin/properties">
                <Button variant="outline" className="w-full" data-testid="quick-action-add-property">
                  <Building className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full" data-testid="quick-action-add-project">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </Link>
              <Link href="/admin/leads">
                <Button variant="outline" className="w-full" data-testid="quick-action-manage-leads">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Leads
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full" data-testid="quick-action-settings">
                  <Clock className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
