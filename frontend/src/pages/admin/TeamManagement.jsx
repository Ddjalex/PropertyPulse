import { useState, useEffect } from 'react'
import { publicApi, adminApi } from '../../utils/api'
import { 
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  UserCheck,
  UserX
} from 'lucide-react'

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [teamMembers, searchTerm, activeFilter])

  const fetchTeamMembers = async () => {
    try {
      const data = await publicApi.get('/team')
      const mappedData = data.map(member => ({
        ...member,
        id: member._id
      }))
      setTeamMembers(mappedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching team members:', error)
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = teamMembers

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (activeFilter !== '') {
      const isActive = activeFilter === 'active'
      filtered = filtered.filter(member => member.active === isActive)
    }

    setFilteredMembers(filtered)
  }

  const updateMemberStatus = async (memberId, active) => {
    try {
      await adminApi.patch(`/team/${memberId}`, { active })
      fetchTeamMembers()
    } catch (error) {
      console.error('Error updating member status:', error)
    }
  }

  const deleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await adminApi.delete(`/team/${memberId}`)
        fetchTeamMembers()
      } catch (error) {
        console.error('Error deleting member:', error)
      }
    }
  }

  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="relative">
        <img
          src={member.profileImage || '/api/placeholder/300/200'}
          alt={member.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            member.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {member.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-blue-600 font-medium">{member.position}</p>
        </div>

        {member.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
        )}

        <div className="space-y-2 mb-4">
          {member.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2 text-blue-500" />
              <span>{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-green-500" />
              <span>{member.phone}</span>
            </div>
          )}
          {member.whatsapp && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-green-500" />
              <span>WhatsApp: {member.whatsapp}</span>
            </div>
          )}
        </div>

        {member.specializations && member.specializations.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
            <div className="flex flex-wrap gap-1">
              {member.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateMemberStatus(member.id, !member.active)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                member.active 
                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {member.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              <span>{member.active ? 'Deactivate' : 'Activate'}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => deleteMember(member.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your team members and agents</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <p className="text-2xl font-bold">
                {teamMembers.filter(m => m.active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Inactive Members</p>
              <p className="text-2xl font-bold">
                {teamMembers.filter(m => !m.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Active Filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Members</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600">Try adjusting your search filters or add a new team member.</p>
        </div>
      )}
    </div>
  )
}