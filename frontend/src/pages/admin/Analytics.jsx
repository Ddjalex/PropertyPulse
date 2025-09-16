import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Building, MessageSquare, DollarSign, Calendar, Activity } from 'lucide-react'
import { adminApi, publicApi } from '../../utils/api'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    monthlyData: [],
    propertyStats: {},
    leadStats: {},
    revenueStats: {}
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // 30 days default

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch data from various endpoints
      const [properties, leads, team] = await Promise.all([
        publicApi.get('/properties'),
        adminApi.get('/leads'),
        publicApi.get('/team')
      ])

      // Calculate analytics from the data
      const monthlyStats = calculateMonthlyStats(properties, leads)
      const propertyStats = calculatePropertyStats(properties)
      const leadStats = calculateLeadStats(leads)
      const revenueStats = calculateRevenueStats(properties)

      setAnalytics({
        monthlyData: monthlyStats,
        propertyStats,
        leadStats,
        revenueStats
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyStats = (properties, leads) => {
    // Generate mock monthly data for the chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, index) => ({
      month,
      properties: Math.floor(Math.random() * 50) + 20,
      leads: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 5000000) + 2000000
    }))
  }

  const calculatePropertyStats = (properties) => {
    const total = properties.length
    const available = properties.filter(p => p.status === 'available').length
    const sold = properties.filter(p => p.status === 'sold').length
    const rented = properties.filter(p => p.status === 'rented').length

    return { total, available, sold, rented }
  }

  const calculateLeadStats = (leads) => {
    const total = leads.length
    const newLeads = leads.filter(l => l.status === 'new').length
    const contacted = leads.filter(l => l.status === 'contacted').length
    const qualified = leads.filter(l => l.status === 'qualified').length
    const closed = leads.filter(l => l.status === 'closed').length

    return { total, newLeads, contacted, qualified, closed }
  }

  const calculateRevenueStats = (properties) => {
    const soldProperties = properties.filter(p => p.status === 'sold')
    const totalRevenue = soldProperties.reduce((sum, p) => sum + (p.price || 0), 0)
    const avgPrice = soldProperties.length > 0 ? totalRevenue / soldProperties.length : 0
    
    return { 
      totalRevenue, 
      avgPrice, 
      soldCount: soldProperties.length,
      monthlyEstimate: totalRevenue * 0.15 
    }
  }

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => {
    const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600'
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gray-50 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    )
  }

  const ChartCard = ({ title, data, type = 'bar' }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-primary-500 rounded-t-sm w-full"
              style={{
                height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                minHeight: '4px'
              }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building}
          title="Total Properties"
          value={analytics.propertyStats.total}
          change="+12% from last month"
          color="blue"
        />
        <StatCard
          icon={MessageSquare}
          title="Total Leads"
          value={analytics.leadStats.total}
          change="+8% from last month"
          color="green"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`ETB ${analytics.revenueStats.totalRevenue?.toLocaleString() || 0}`}
          change="+15% from last month"
          color="yellow"
        />
        <StatCard
          icon={Activity}
          title="Conversion Rate"
          value="24%"
          change="+3% from last month"
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Monthly Properties"
          data={analytics.monthlyData.map(d => ({ label: d.month, value: d.properties }))}
        />
        <ChartCard
          title="Lead Generation"
          data={analytics.monthlyData.map(d => ({ label: d.month, value: d.leads }))}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available</span>
              <span className="font-medium">{analytics.propertyStats.available}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sold</span>
              <span className="font-medium">{analytics.propertyStats.sold}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rented</span>
              <span className="font-medium">{analytics.propertyStats.rented}</span>
            </div>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Pipeline</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Leads</span>
              <span className="font-medium">{analytics.leadStats.newLeads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Contacted</span>
              <span className="font-medium">{analytics.leadStats.contacted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Qualified</span>
              <span className="font-medium">{analytics.leadStats.qualified}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Closed</span>
              <span className="font-medium">{analytics.leadStats.closed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}