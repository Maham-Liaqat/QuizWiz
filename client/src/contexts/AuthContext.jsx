import React, { createContext, useContext, useState, useEffect, useCallback,useMemo } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Constants for localStorage keys
const USER_STORAGE_KEY = 'quizwiz_user'
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Memoized function to validate user session
  const validateSession = useCallback((userData) => {
    if (!userData || !userData.timestamp) return false
    
    const sessionAge = Date.now() - userData.timestamp
    return sessionAge < SESSION_TIMEOUT
  }, [])

  // Memoized function to safely parse JSON
  const safeParseJSON = useCallback((key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error)
      localStorage.removeItem(key)
      return null
    }
  }, [])

  useEffect(() => {
    // Check for stored user data on app load
    const loadUser = () => {
      try {
        const storedUser = safeParseJSON(USER_STORAGE_KEY)
        
        if (storedUser && validateSession(storedUser)) {
          setUser(storedUser)
        } else if (storedUser) {
          // Session expired, clear stored user
          localStorage.removeItem(USER_STORAGE_KEY)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [safeParseJSON, validateSession])

  // Memoized login function
  const login = useCallback(async (email, password, role) => {
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
      }

      // Mock user data - replace with actual API response
      const userData = {
        id: Date.now().toString(),
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        role: role || 'student',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=2563eb&color=fff`,
        timestamp: Date.now() // Add timestamp for session validation
      }
      
      setUser(userData)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }, [])

  // Memoized register function
  const register = useCallback(async (name, email, password, role) => {
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation
      if (!name || !email || !password) {
        return { success: false, error: 'All fields are required' }
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }

      // Check if user already exists (simulated)
      const existingUsers = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('quizwiz_user')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key))
            if (userData.email === email.toLowerCase().trim()) {
              return { success: false, error: 'User with this email already exists' }
            }
          } catch (e) {
            // Skip invalid entries
          }
        }
      }

      // Mock user data - replace with actual API response
      const userData = {
        id: Date.now().toString(),
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role: role || 'student',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=2563eb&color=fff`,
        timestamp: Date.now() // Add timestamp for session validation
      }
      
      setUser(userData)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }, [])

  // Memoized logout function
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }, [])

  // Memoized update user function
  const updateUser = useCallback((updates) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser
      
      const updatedUser = { ...prevUser, ...updates }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  // Memoized value object to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  }), [user, login, register, logout, updateUser, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}