import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageCircle, 
  Eye, 
  User,
  Calendar,
  MapPin,
  Building,
  RefreshCw,
  Download,
  Archive
} from 'lucide-react';
import type { Lead } from '@shared/models';

export default function LeadManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ['/api/admin/leads'],
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

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest('PATCH', `/api/admin/leads/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Lead Updated",
        description: "Lead status has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
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
        title: "Error Updating Lead",
        description: "There was a problem updating the lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = !searchQuery || 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.propertyInterest?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filterStatus || lead.status === filterStatus;
    const matchesSource = !filterSource || lead.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  }) || [];

  const handleCall = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmail = (email: string, name: string) => {
    const subject = `Follow-up on your property inquiry - GIFI Real Estate`;
    const body = `Dear ${name},\n\nThank you for your interest in GIFI Real Estate properties.\n\nBest regards,\nGIFI Real Estate Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsApp = (phone: string, name: string) => {
    if (phone) {
      const message = `Hello ${name}, thank you for your interest in GIFI Real Estate. How can we assist you with your property requirements?`;
      const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    updateLeadMutation.mutate({ id: leadId, status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return <Building size={14} />;
      case 'whatsapp': return <MessageCircle size={14} />;
      case 'phone': return <Phone size={14} />;
      case 'referral': return <User size={14} />;
      default: return <Building size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats calculations
  const newLeads = leads?.filter(lead => lead.status === 'new').length || 0;
  const contactedLeads = leads?.filter(lead => lead.status === 'contacted').length || 0;
  const qualifiedLeads = leads?.filter(lead => lead.status === 'qualified').length || 0;
  const closedLeads = leads?.filter(lead => lead.status === 'closed').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
            <p className="text-muted-foreground">
              Track and manage your property inquiries and prospects
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" data-testid="button-refresh-leads">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button variant="outline" data-testid="button-export-leads">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600" data-testid="stat-new-leads">
                {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : newLeads}
              </div>
              <p className="text-sm text-muted-foreground">New Leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600" data-testid="stat-contacted-leads">
                {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : contactedLeads}
              </div>
              <p className="text-sm text-muted-foreground">Contacted</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="stat-qualified-leads">
                {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : qualifiedLeads}
              </div>
              <p className="text-sm text-muted-foreground">Qualified</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600" data-testid="stat-closed-leads">
                {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : closedLeads}
              </div>
              <p className="text-sm text-muted-foreground">Closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search leads by name, email, phone, or property interest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-leads"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40" data-testid="filter-status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full sm:w-40" data-testid="filter-source">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Leads ({filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredLeads.length > 0 ? (
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    data-testid={`lead-item-${lead.id}`}
                  >
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {lead.firstName[0]}{lead.lastName[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {lead.firstName} {lead.lastName}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {getSourceIcon(lead.source || 'website')}
                          <span className="ml-1 capitalize">{lead.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Mail size={14} className="mr-1" />
                        {lead.email}
                        {lead.phone && (
                          <>
                            <span className="mx-2">•</span>
                            <Phone size={14} className="mr-1" />
                            {lead.phone}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {lead.propertyInterest && (
                          <div className="flex items-center">
                            <Building size={14} className="mr-1" />
                            {lead.propertyInterest}
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {lead.createdAt ? formatDate(lead.createdAt.toString()) : 'N/A'}
                        </div>
                      </div>
                      
                      {lead.message && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          "{lead.message}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Select 
                        value={lead.status || 'new'} 
                        onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                        disabled={updateLeadMutation.isPending}
                      >
                        <SelectTrigger className="w-32" data-testid={`status-select-${lead.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Badge className={getStatusColor(lead.status || 'new')}>
                        {lead.status || 'new'}
                      </Badge>
                      
                      <div className="flex space-x-1">
                        {lead.phone && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCall(lead.phone!)}
                            title="Call"
                            data-testid={`button-call-${lead.id}`}
                          >
                            <Phone size={16} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEmail(lead.email, `${lead.firstName} ${lead.lastName}`)}
                          title="Send Email"
                          data-testid={`button-email-${lead.id}`}
                        >
                          <Mail size={16} />
                        </Button>
                        
                        {lead.phone && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleWhatsApp(lead.phone!, `${lead.firstName} ${lead.lastName}`)}
                            title="WhatsApp"
                            data-testid={`button-whatsapp-${lead.id}`}
                          >
                            <MessageCircle size={16} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedLead(lead)}
                          title="View Details"
                          data-testid={`button-view-${lead.id}`}
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Leads Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || filterStatus || filterSource
                    ? 'No leads match your current filters.'
                    : 'No leads have been generated yet. Leads will appear here when visitors contact you through the website.'}
                </p>
                {!searchQuery && !filterStatus && !filterSource && (
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" asChild>
                      <a href="/" target="_blank">
                        <Eye size={16} className="mr-2" />
                        View Website
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lead Details</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedLead(null)}
                  data-testid="button-close-lead-details"
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedLead.firstName} {selectedLead.lastName}</p>
                      <p><strong>Email:</strong> {selectedLead.email}</p>
                      {selectedLead.phone && <p><strong>Phone:</strong> {selectedLead.phone}</p>}
                      <p><strong>Source:</strong> <span className="capitalize">{selectedLead.source}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Lead Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedLead.status || 'new')}`}>
                          {selectedLead.status || 'new'}
                        </Badge>
                      </p>
                      {selectedLead.propertyInterest && (
                        <p><strong>Property Interest:</strong> {selectedLead.propertyInterest}</p>
                      )}
                      <p><strong>Received:</strong> {selectedLead.createdAt ? formatDate(selectedLead.createdAt.toString()) : 'N/A'}</p>
                      {selectedLead.updatedAt && selectedLead.updatedAt !== selectedLead.createdAt && (
                        <p><strong>Last Updated:</strong> {selectedLead.updatedAt ? formatDate(selectedLead.updatedAt.toString()) : 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedLead.message && (
                  <div>
                    <h4 className="font-semibold mb-2">Message</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">{selectedLead.message}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  {selectedLead.phone && (
                    <Button 
                      onClick={() => handleCall(selectedLead.phone!)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Phone size={16} className="mr-2" />
                      Call
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => handleEmail(selectedLead.email, `${selectedLead.firstName} ${selectedLead.lastName}`)}
                    variant="outline"
                  >
                    <Mail size={16} className="mr-2" />
                    Email
                  </Button>
                  
                  {selectedLead.phone && (
                    <Button 
                      onClick={() => handleWhatsApp(selectedLead.phone!, `${selectedLead.firstName} ${selectedLead.lastName}`)}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
