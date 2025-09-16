// Centralized API client with admin authentication
const API_BASE_URL = '/api'

// Admin authentication functions
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }
  
  return response.json()
}

export const adminLogout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/logout`, {
    method: 'POST',
    credentials: 'include'
  })
  
  if (!response.ok) {
    throw new Error('Logout failed')
  }
  
  return response.json()
}

export const adminVerify = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/verify`, {
    credentials: 'include'
  })
  
  if (!response.ok) {
    throw new Error('Not authenticated')
  }
  
  return response.json()
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

// Admin API calls (requires session authentication)
export const adminApi = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  },
  
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`Admin API error: ${response.status}`)
    }
    return response.json()
  }
}

// Legacy admin key functions - no longer needed with session authentication
// Session management is now handled server-side