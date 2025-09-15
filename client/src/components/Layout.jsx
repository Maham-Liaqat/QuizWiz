import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="glass-effect shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-2xl font-black text-gradient">QuizWiz</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-100 shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md'
                }`}
              >
                Home
              </Link>
              
              {/* Instructor-only navigation */}
              {user?.role === 'instructor' && (
                <>
                  <Link
                    to="/create"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/create') 
                        ? 'text-primary-600 bg-primary-100 shadow-lg' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md'
                    }`}
                  >
                    Create Quiz
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/dashboard') 
                        ? 'text-primary-600 bg-primary-100 shadow-lg' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md'
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              
              {/* All users can browse quizzes */}
              <Link
                to="/quizzes"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive('/quizzes') 
                    ? 'text-primary-600 bg-primary-100 shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md'
                }`}
              >
                Browse Quizzes
              </Link>
              
              {/* Authentication Section */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    />
                    <span>{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl py-2 z-50 border border-white/30">
                      <div className="px-4 py-3 text-sm text-slate-700 border-b border-slate-200">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-slate-500">{user.email}</p>
                        <p className="text-xs text-primary-600 font-semibold capitalize mt-1">
                          {user.role}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-white/50"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm px-6 py-2"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2024 QuizWiz. Built with React, Vite, Tailwind CSS, and Lenis.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout