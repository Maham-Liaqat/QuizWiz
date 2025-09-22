import React from 'react' // Add this import
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useCallback, useMemo } from 'react'
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

// Memoized Lenis initialization to prevent re-creation
const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    let animationFrameId = null

    const raf = (time) => {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }

    animationFrameId = requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      lenis.destroy()
    }
  }, [])
}
   
// Scroll to top on route change
const useScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }, [location.pathname])
}

function App() {
  useSmoothScroll()
  useScrollToTop()

  // Memoize routes to prevent unnecessary re-renders
  const appRoutes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <RoleProtectedRoute allowedRoles={['instructor']}>
            <CreateQuiz />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/quiz/:id" 
        element={
          <ProtectedRoute>
            <TakeQuiz />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/results/:id" 
        element={
          <ProtectedRoute>
            <QuizResults />
          </ProtectedRoute>
        } 
      />
      <Route path="/quizzes" element={<QuizList />} />
      
      {/* 404 Fallback Route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Page not found</p>
              <a href="/" className="btn-primary">
                Go Home
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  ), [])

  return (
    <AuthProvider>
      <Layout>
        {appRoutes}
      </Layout>
    </AuthProvider>
  )
}

export default React.memo(App)