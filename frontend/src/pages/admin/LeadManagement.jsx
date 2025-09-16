import { useState, useEffect } from 'react'
import { 
  MessageSquare,
  Phone,
  Mail,
  User,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function LeadManagement() {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchTerm, statusFilter, sourceFilter])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads')
      const data = await response.json()
      const mappedData = data.map(lead => ({
        ...lead,
        id: lead._id
      }))
      setLeads(mappedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = leads

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    if (sourceFilter) {
      filtered = filtered.filter(lead => lead.source === sourceFilter)
    }

    setFilteredLeads(filtered)
  }

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      fetchLeads()
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const deleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await fetch(`/api/admin/leads/${leadId}`, {
          method: 'DELETE'
        })
        fetchLeads()
      } catch (error) {
        console.error('Error deleting lead:', error)
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4" />
      case 'contacted':
        return <Phone className="h-4 w-4" />
      case 'qualified':
        return <CheckCircle className="h-4 w-4" />
      case 'closed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-blue-100 text-blue-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const LeadCard = ({ lead }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h3>
            <p className="text-sm text-gray-600">{lead.email}</p>
          </div>
        </div>
        <div className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(lead.status)}`}>
          {getStatusIcon(lead.status)}
          <span className="capitalize">{lead.status}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {lead.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{lead.phone}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Created: {formatDate(lead.createdAt)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>Source: {lead.source}</span>
        </div>
      </div>

      {lead.propertyInterest && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Interest:</p>
          <p className="text-sm font-medium text-gray-900">{lead.propertyInterest}</p>
        </div>
      )}

      {lead.message && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Message:</p>
          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{lead.message}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <select
          value={lead.status}
          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full">
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => deleteLead(lead.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-60"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <p className="text-gray-600">Track and manage customer inquiries and potential sales</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">New Leads</p>
              <p className="text-2xl font-bold">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Contacted</p>
              <p className="text-2xl font-bold">
                {leads.filter(l => l.status === 'contacted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Qualified</p>
              <p className="text-2xl font-bold">
                {leads.filter(l => l.status === 'qualified').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Closed</p>
              <p className="text-2xl font-bold">
                {leads.filter(l => l.status === 'closed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone</option>
            <option value="referral">Referral</option>
          </select>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  )
}