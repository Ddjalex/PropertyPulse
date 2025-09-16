import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  DollarSign,
  Eye,
  Plus,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    newLeads: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    activeUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch properties
        const propertiesResponse = await fetch('/api/properties')
        const properties = await propertiesResponse.json()
        
        // Fetch leads
        const leadsResponse = await fetch('/api/admin/leads')
        const leads = await leadsResponse.json()
        
        // Fetch team members
        const teamResponse = await fetch('/api/team')
        const team = await teamResponse.json()

        // Calculate stats
        const activeProperties = properties.filter(p => p.status === 'available').length
        const newLeads = leads.filter(l => l.status === 'new').length
        const totalRevenue = properties
          .filter(p => p.status === 'sold')
          .reduce((sum, p) => sum + p.price, 0)

        setStats({
          totalProperties: properties.length,
          activeProperties,
          totalLeads: leads.length,
          newLeads,
          totalRevenue,
          monthlyRevenue: totalRevenue * 0.15, // Estimate monthly
          totalUsers: team.length,
          activeUsers: team.filter(t => t.active).length
        })

        // Set recent activity (mock for now)
        setRecentActivity([
          { id: 1, type: 'lead', message: 'New lead from John Doe', time: '2 hours ago' },
          { id: 2, type: 'property', message: 'Property "Luxury Villa" updated', time: '4 hours ago' },
          { id: 3, type: 'sale', message: 'Property sold for ETB 5,000,000', time: '1 day ago' },
          { id: 4, type: 'user', message: 'New team member added', time: '2 days ago' }
        ])

        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your real estate business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building}
          title="Total Properties"
          value={stats.totalProperties}
          subtitle={`${stats.activeProperties} active`}
          color="blue"
        />
        <StatCard
          icon={MessageSquare}
          title="Total Leads"
          value={stats.totalLeads}
          subtitle={`${stats.newLeads} new`}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`ETB ${stats.totalRevenue.toLocaleString()}`}
          subtitle={`ETB ${stats.monthlyRevenue.toLocaleString()} this month`}
          color="yellow"
        />
        <StatCard
          icon={Users}
          title="Team Members"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active`}
          color="purple"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/properties"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-4">Manage property listings, add new properties, and update existing ones.</p>
          <div className="flex items-center text-blue-600 font-medium">
            <span>Manage Properties</span>
            <Plus className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/leads"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">Track and manage customer inquiries and potential sales.</p>
          <div className="flex items-center text-green-600 font-medium">
            <span>View Leads</span>
            <Eye className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/team"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team</h3>
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-gray-600 mb-4">Manage team members, agents, and user roles.</p>
          <div className="flex items-center text-purple-600 font-medium">
            <span>Manage Team</span>
            <Plus className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            <BarChart3 className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-gray-600 mb-4">View detailed analytics and performance reports.</p>
          <div className="flex items-center text-yellow-600 font-medium">
            <span>View Analytics</span>
            <TrendingUp className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Available</span>
              <span className="text-sm font-medium">{stats.activeProperties}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.activeProperties / stats.totalProperties) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sold</span>
              <span className="text-sm font-medium">{stats.totalProperties - stats.activeProperties}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${((stats.totalProperties - stats.activeProperties) / stats.totalProperties) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'lead' ? 'bg-green-100' :
                  activity.type === 'property' ? 'bg-blue-100' :
                  activity.type === 'sale' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <Activity className={`h-4 w-4 ${
                    activity.type === 'lead' ? 'text-green-600' :
                    activity.type === 'property' ? 'text-blue-600' :
                    activity.type === 'sale' ? 'text-yellow-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}