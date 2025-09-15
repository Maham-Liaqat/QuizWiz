import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('quizwiz_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('quizwiz_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const userData = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: role || 'student', // Default to student if no role provided
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=2563eb&color=fff`
      }
      
      setUser(userData)
      localStorage.setItem('quizwiz_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password, role) => {
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        role: role || 'student', // Default to student if no role provided
        avatar: `https://ui-avatars.com/api/?name=${name}&background=2563eb&color=fff`
      }
      
      setUser(userData)
      localStorage.setItem('quizwiz_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('quizwiz_user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
