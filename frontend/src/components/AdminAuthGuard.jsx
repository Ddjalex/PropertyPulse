import { useState, useEffect } from 'react'
import { hasAdminKey, setAdminKey, validateAdminAccess } from '../utils/api'

export default function AdminAuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKeyInput] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    if (hasAdminKey()) {
      try {
        setIsValidating(true)
        const isValid = await validateAdminAccess()
        setIsAuthenticated(isValid)
        if (!isValid) {
          setError('Admin key is invalid or expired. Please re-enter.')
        }
      } catch (error) {
        setError('Unable to validate admin access. Please check your connection.')
      } finally {
        setIsValidating(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!adminKey.trim()) {
      setError('Please enter the admin key')
      return
    }

    try {
      setIsValidating(true)
      setError('')
      setAdminKey(adminKey.trim())
      
      const isValid = await validateAdminAccess()
      if (isValid) {
        setIsAuthenticated(true)
      } else {
        setError('Invalid admin key. Please check and try again.')
      }
    } catch (error) {
      setError('Authentication failed. Please check your admin key and try again.')
    } finally {
      setIsValidating(false)
    }
  }

  if (isAuthenticated) {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Access Required
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your admin key to access the administration panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700">
                Admin Key
              </label>
              <div className="mt-1">
                <input
                  id="adminKey"
                  name="adminKey"
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admin key"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isValidating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isValidating ? 'Validating...' : 'Access Admin Panel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}