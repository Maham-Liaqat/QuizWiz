import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useCallback, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import InstructorDashboard from './pages/InstructorDashboard'
import CreateQuiz from './pages/CreateQuiz'
import TakeQuiz from './pages/TakeQuiz'
import QuizResults from './pages/QuizResults'
import QuizList from './pages/QuizList'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="text-sm">Please refresh the page and try again.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Lenis hook with better configuration
const useSmoothScroll = () => {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Only initialize if not already initialized
    if (lenisRef.current) return

    try {
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.5,
        infinite: false,
        smoothTouch: false,
        syncTouch: true,
        syncTouchLerp: 0.1,
      })

      lenisRef.current = lenis

      let animationFrameId = null

      const raf = (time) => {
        lenis.raf(time)
        animationFrameId = requestAnimationFrame(raf)
      }

      animationFrameId = requestAnimationFrame(raf)

      // Add resize handler for better mobile experience
      const handleResize = () => {
        lenis.resize()
      }

      window.addEventListener('resize', handleResize)

      // Cleanup function
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        window.removeEventListener('resize', handleResize)
        lenis.destroy()
        lenisRef.current = null
      }
    } catch (error) {
      console.error('Lenis initialization error:', error)
    }
  }, [])

  return lenisRef
}

// Enhanced scroll to top with Lenis integration
const useScrollToTop = () => {
  const location = useLocation()
  const lenisRef = useSmoothScroll()

  useEffect(() => {
    // Use Lenis for smooth scroll to top if available, otherwise fallback
    if (lenisRef.current) {
      requestAnimationFrame(() => {
        lenisRef.current.scrollTo(0, { duration: 1.2 })
      })
    } else {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  }, [location.pathname, lenisRef])
}

// Error boundary wrapper for routes
const RouteWithErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}

function App() {
  const lenisRef = useSmoothScroll()
  useScrollToTop()
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Memoize routes to prevent unnecessary re-renders
  const appRoutes = useMemo(() => (
    <Routes>
      <Route path="/" element={<RouteWithErrorBoundary><Home /></RouteWithErrorBoundary>} />
      <Route path="/login" element={<RouteWithErrorBoundary><Login /></RouteWithErrorBoundary>} />
      <Route path="/register" element={<RouteWithErrorBoundary><Register /></RouteWithErrorBoundary>} />
      <Route 
        path="/dashboard" 
        element={
          <RouteWithErrorBoundary>
            <RoleProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </RoleProtectedRoute>
          </RouteWithErrorBoundary>
        } 
      />
      <Route 
        path="/create" 
        element={
          <RouteWithErrorBoundary>
            <RoleProtectedRoute allowedRoles={['instructor']}>
              <CreateQuiz />
            </RoleProtectedRoute>
          </RouteWithErrorBoundary>
        } 
      />
      <Route 
        path="/quiz/:id" 
        element={
          <RouteWithErrorBoundary>
            <ProtectedRoute>
              <TakeQuiz />
            </ProtectedRoute>
          </RouteWithErrorBoundary>
        } 
      />
      <Route 
        path="/results/:id" 
        element={
          <RouteWithErrorBoundary>
            <ProtectedRoute>
              <QuizResults />
            </ProtectedRoute>
          </RouteWithErrorBoundary>
        } 
      />
      <Route path="/quizzes" element={<RouteWithErrorBoundary><QuizList /></RouteWithErrorBoundary>} />
      
      {/* 404 Fallback Route */}
      <Route 
        path="*" 
        element={
          <RouteWithErrorBoundary>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a href="/" className="btn-primary cursor-none">
                  Go Home
                </a>
              </div>
            </div>
          </RouteWithErrorBoundary>
        } 
      />
    </Routes>
  ), [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Layout>
          {appRoutes}
        </Layout>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default React.memo(App)