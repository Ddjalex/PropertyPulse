import { useState, useEffect } from 'react'
import { Save, User, Bell, Shield, Database, Globe, Mail, Phone, MapPin } from 'lucide-react'
import { adminApi } from '../../utils/api'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Gift Real Estate',
    email: 'info@giftrealestate.com',
    phone: '+251 911 123 456',
    address: 'Addis Ababa, Ethiopia',
    website: 'https://giftrealestate.com',
    description: 'Ethiopia\'s Premier Real Estate Company since 1990',
    logo: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    leadAlerts: true,
    propertyUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '24',
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    }
  })

  const handleSave = async (settingsType) => {
    setLoading(true)
    try {
      // In a real app, you'd save to backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'company', name: 'Company', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database }
  ]

  const TabButton = ({ tab, isActive, onClick }) => {
    const Icon = tab.icon
    return (
      <button
        onClick={() => onClick(tab.id)}
        className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700 border-primary-200'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{tab.name}</span>
      </button>
    )
  }

  const SettingsCard = ({ title, children, onSave }) => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {children}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
      {saved && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <p className="text-sm text-green-700">Settings saved successfully!</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your application preferences and configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'company' && (
            <SettingsCard 
              title="Company Information"
              onSave={() => handleSave('company')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    rows="3"
                    value={companySettings.description}
                    onChange={(e) => setCompanySettings({...companySettings, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </SettingsCard>
          )}

          {activeTab === 'notifications' && (
            <SettingsCard 
              title="Notification Preferences"
              onSave={() => handleSave('notifications')}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Lead Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified when new leads come in</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.leadAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, leadAlerts: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Property Updates</h4>
                    <p className="text-sm text-gray-500">Notifications about property status changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.propertyUpdates}
                    onChange={(e) => setNotificationSettings({...notificationSettings, propertyUpdates: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                    <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </SettingsCard>
          )}

          {activeTab === 'security' && (
            <SettingsCard 
              title="Security Settings"
              onSave={() => handleSave('security')}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (hours)
                  </label>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="1">1 hour</option>
                    <option value="8">8 hours</option>
                    <option value="24">24 hours</option>
                    <option value="168">1 week</option>
                  </select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Password Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require uppercase letters</span>
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequirements.requireUppercase}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordRequirements: {
                            ...securitySettings.passwordRequirements,
                            requireUppercase: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require numbers</span>
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequirements.requireNumbers}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordRequirements: {
                            ...securitySettings.passwordRequirements,
                            requireNumbers: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>
          )}

          {activeTab === 'database' && (
            <SettingsCard 
              title="Database Information"
              onSave={() => handleSave('database')}
            >
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Database Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Connected to MongoDB</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Backup</h4>
                  <p className="text-sm text-gray-600 mb-3">Regular backups help protect your data</p>
                  <button className="btn-secondary text-sm">
                    Create Backup
                  </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Collections: </span>
                      <span className="font-medium">7</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Documents: </span>
                      <span className="font-medium">~500</span>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>
          )}
        </div>
      </div>
    </div>
  )
}