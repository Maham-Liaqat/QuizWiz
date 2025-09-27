import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import AnimatedCursor from './AnimatedCursor'

// Theme Toggle Component
const ThemeToggle = React.memo(({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center w-12 h-6 bg-gray-200 dark:bg-slate-600 rounded-full transition-colors duration-300 mr-4"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={`absolute left-1 top-1 w-4 h-4 bg-white dark:bg-slate-300 rounded-full transition-transform duration-300 ${
        darkMode ? 'translate-x-6' : 'translate-x-0'
      }`} />
      <span className="sr-only">{darkMode ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'

// Mobile Menu Component
const MobileMenu = React.memo(({ 
  isOpen, 
  onClose, 
  navItems, 
  isActive, 
  user, 
  handleLogout, 
  darkMode, 
  toggleDarkMode 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <Link to="/" className="flex items-center space-x-3" onClick={onClose}>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-2xl font-black text-gradient">QuizWiz</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'text-primary-400 bg-primary-100 dark:bg-primary-900/30 shadow-lg' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-400 capitalize">
                    {user.role}
                  </span>
                  <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    onClose()
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full px-4 py-3 text-center text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg hover:from-primary-500 hover:to-secondary-500 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

MobileMenu.displayName = 'MobileMenu'

// Memoized navigation link component
const NavLink = React.memo(({ to, children, isActive, onClick, mobile = false }) => {
  const baseClasses = mobile 
    ? 'block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300'
    : 'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-none'

  const activeClasses = mobile
    ? 'text-primary-400 bg-primary-100 dark:bg-primary-900/30 shadow-lg'
    : 'text-primary-400 bg-primary-100 dark:bg-primary-900/30 shadow-lg'

  const inactiveClasses = mobile
    ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 hover:shadow-md'

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </Link>
  )
})

NavLink.displayName = 'NavLink'

// Memoized user menu component
const UserMenu = React.memo(({ user, onLogout, showUserMenu, setShowUserMenu, menuRef, darkMode, toggleDarkMode }) => {
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-3 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 hover:shadow-md transition-all duration-300 cursor-none"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-600 shadow-md"
          loading="lazy"
        />
        <span className="hidden lg:inline">{user.name}</span>
        <svg className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl py-2 z-[100] border border-white/30 dark:border-slate-600/30">
          <div className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-slate-500 dark:text-slate-400 truncate">{user.email}</p>           
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-primary-400 font-semibold capitalize">
                {user.role}
              </span>
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors cursor-none"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
})

UserMenu.displayName = 'UserMenu'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const menuRef = useRef(null)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newDarkMode = !prev
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return newDarkMode
    })
  }, [])

  // Memoized active path check
  const isActive = useCallback((path) => {
    return location.pathname === path
  }, [location.pathname])

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
    setShowUserMenu(false)
    setMobileMenuOpen(false)
  }, [logout, navigate])

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

  // Close menu when route changes
  useEffect(() => {
    setShowUserMenu(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Memoized navigation items for better performance
  const navItems = useMemo(() => [
    { path: '/', label: 'Home' },
    { path: '/quizzes', label: 'Browse Quizzes' },
    ...(user?.role === 'instructor' ? [
      { path: '/create', label: 'Create Quiz' },
      { path: '/dashboard', label: 'Dashboard' }
    ] : [])
  ], [user?.role])

  // Memoized auth section to prevent unnecessary re-renders
  const authSection = useMemo(() => {
    if (user) {
      return (
        <UserMenu
          user={user}
          onLogout={handleLogout}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          menuRef={menuRef}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )
    } else {
      return (
        <div className="hidden lg:flex items-center space-x-4">
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Link
            to="/login"
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-white/50 cursor-none"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm px-6 py-2 cursor-none"
          >
            Sign up
          </Link>
        </div>
      )
    }
  }, [user, handleLogout, showUserMenu, darkMode, toggleDarkMode])

  return (
    <>
      <AnimatedCursor 
        color={darkMode ? "secondary" : "primary"}
        outerSize={35}
        innerSize={6}
        outerScale={1.8}
        innerScale={1.4}
        trailingDots={4}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Navigation */}
        <nav className="glass-effect shadow-lg border-b border-white/20 dark:border-slate-600/20 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3 cursor-none">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">Q</span>
                  </div>
                  <span className="text-2xl font-black text-gradient">QuizWiz</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4 relative">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    isActive={isActive(item.path)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {authSection}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navItems={navItems}
          isActive={isActive}
          user={user}
          handleLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="glass-effect border-t border-white/20 dark:border-slate-600/20 mt-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-slate-600 dark:text-slate-400">
              <p className="text-sm">&copy; 2024 QuizWiz. Built with React, Vite, Tailwind CSS, and Lenis.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default React.memo(Layout)