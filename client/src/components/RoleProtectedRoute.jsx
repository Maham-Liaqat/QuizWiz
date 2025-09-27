import React from 'react' // Add this import
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useMemo, useCallback } from 'react'

// Memoized loading component to prevent unnecessary re-renders
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

// Memoized access denied component
const AccessDenied = React.memo(({ onGoBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <button
          onClick={onGoBack}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    </div>
  )
})

AccessDenied.displayName = 'AccessDenied'

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Memoize the redirect element to prevent unnecessary re-renders
  const redirectElement = useMemo(() => {
    return <Navigate to="/login" state={{ from: location }} replace />
  }, [location])

  // Memoize the role check for better performance
  const hasRequiredRole = useMemo(() => {
    if (allowedRoles.length === 0) return true // No role restriction
    return user && allowedRoles.includes(user.role)
  }, [user, allowedRoles])

  // Memoized go back handler
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate('/') // Fallback to home if no history
    }
  }, [navigate])

  // Memoized access denied component with handler
  const accessDeniedElement = useMemo(() => {
    return <AccessDenied onGoBack={handleGoBack} />
  }, [handleGoBack])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return redirectElement
  }

  if (!hasRequiredRole) {
    return accessDeniedElement
  }

  return children
}

export default React.memo(RoleProtectedRoute)