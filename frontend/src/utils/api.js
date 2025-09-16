// Centralized API client with admin authentication
const API_BASE_URL = '/api'

// Get admin key from session storage (secure, no fallback)
const getAdminKey = () => {
  const key = sessionStorage.getItem('adminApiKey')
  if (!key) {
    throw new Error('Admin authentication required. Please set admin key.')
  }
  return key
}

// Public API calls (no authentication required)
export const publicApi = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  }
}

// Admin API calls (requires authentication)
export const adminApi = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      headers: {
        'X-Admin-Key': getAdminKey(),
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'POST',
      headers: {
        'X-Admin-Key': getAdminKey(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'PUT',
      headers: {
        'X-Admin-Key': getAdminKey(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'PATCH',
      headers: {
        'X-Admin-Key': getAdminKey(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Key': getAdminKey(),
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  }
}

// Set admin key securely in session storage
export const setAdminKey = (key) => {
  sessionStorage.setItem('adminApiKey', key)
}

// Check if admin key is set
export const hasAdminKey = () => {
  return !!sessionStorage.getItem('adminApiKey')
}

// Clear admin key (logout)
export const clearAdminKey = () => {
  sessionStorage.removeItem('adminApiKey')
}

// Validate admin access
export const validateAdminAccess = async () => {
  try {
    await adminApi.get('/leads')
    return true
  } catch (error) {
    return false
  }
}