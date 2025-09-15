import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
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

function App() {
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

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Add smooth scrolling to all anchor links
    lenis.on('scroll', (e) => {
      // Optional: Add scroll-based animations here
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <RoleProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </RoleProtectedRoute>
          } />
          <Route path="/create" element={
            <RoleProtectedRoute allowedRoles={['instructor']}>
              <CreateQuiz />
            </RoleProtectedRoute>
          } />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/results/:id" element={<QuizResults />} />
          <Route path="/quizzes" element={<QuizList />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
