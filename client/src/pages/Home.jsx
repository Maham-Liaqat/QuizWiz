import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCallback, useEffect, useRef } from 'react'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  const handleRoleSelection = useCallback(
    (role) => {
      if (user) {
        navigate(role === 'instructor' ? '/dashboard' : '/quizzes')
      } else {
        navigate('/register', { state: { role } })
      }
    },
    [user, navigate]
  )

  // Scroll animation initialization
  useEffect(() => {
    const initScrollAnimations = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('scroll-visible')
            } else {
              entry.target.classList.remove('scroll-visible')
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      )

      document.querySelectorAll('[data-scroll]').forEach((el) => {
        observer.observe(el)
      })

      document.querySelectorAll('[data-scroll-stagger]').forEach((el) => {
        observer.observe(el)
      })

      return () => observer.disconnect()
    }

    const timer = setTimeout(initScrollAnimations, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden" ref={heroRef}>
        {/* Background Gradients - Mobile optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30 dark:from-primary-900/10 dark:via-transparent dark:to-secondary-900/10"></div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-5 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-5 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            {/* Logo & Title */}
            <div className="mb-6 lg:mb-8" data-scroll>
              <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl shadow-2xl shadow-primary-400/25 mb-4 lg:mb-6 animate-lenis-fade-up">
                <span className="text-white font-black text-2xl lg:text-3xl">Q</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gradient mb-4 lg:mb-6 animate-lenis-fade-up" style={{animationDelay: '0.1s'}}>
                QuizWiz
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-700 dark:text-slate-200 mb-4 lg:mb-6 animate-lenis-fade-up" style={{animationDelay: '0.2s'}}>
                Where Learning Meets Fun
              </p>
            </div>

            {/* About Section */}
            <div className="max-w-4xl mx-auto mb-8 lg:mb-16" data-scroll>
              <div className="card-gradient border-primary-200 dark:border-slate-600 p-4 lg:p-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 lg:mb-6">About QuizWiz</h2>
                <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4 lg:mb-6">
                  QuizWiz is the ultimate platform for creating and taking engaging quizzes. Whether you're an educator 
                  looking to create interactive learning experiences or a student eager to test your knowledge, QuizWiz 
                  provides the tools you need to make learning fun and effective.
                </p>
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6" data-scroll-stagger>
                  <div className="text-left">
                    <h3 className="text-lg lg:text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2 lg:mb-3">For Instructors</h3>
                    <ul className="space-y-1 lg:space-y-2 text-sm lg:text-base text-slate-600 dark:text-slate-300">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 lg:mr-3"></span>
                        Create interactive quizzes with multiple question types
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 lg:mr-3"></span>
                        Track student progress and performance
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 lg:mr-3"></span>
                        Access comprehensive analytics and insights
                      </li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg lg:text-xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2 lg:mb-3">For Students</h3>
                    <ul className="space-y-1 lg:space-y-2 text-sm lg:text-base text-slate-600 dark:text-slate-300">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2 lg:mr-3"></span>
                        Take quizzes on various topics and subjects
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2 lg:mr-3"></span>
                        Get instant feedback and detailed explanations
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2 lg:mr-3"></span>
                        Track your learning progress over time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="max-w-2xl mx-auto" data-scroll>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 lg:mb-8">Choose Your Role</h3>
              <div className="grid md:grid-cols-2 gap-4 lg:gap-6" data-scroll-stagger>
                <button
                  onClick={() => handleRoleSelection('instructor')}
                  className="group card-gradient hover:scale-105 transform transition-all duration-300 border-primary-200 dark:border-slate-600 p-4 lg:p-6"
                  type="button"
                  aria-label="Get Started as Instructor"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">I am an Instructor</h4>
                    <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 mb-3 lg:mb-4">Create quizzes, track student progress, and manage your educational content.</p>
                    <div className="btn-primary text-sm lg:text-base">
                      Get Started as Instructor
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection('student')}
                  className="group card-gradient hover:scale-105 transform transition-all duration-300 border-secondary-200 dark:border-slate-600 p-4 lg:p-6"
                  type="button"
                  aria-label="Start Learning as Student"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">I am a Student</h4>
                    <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 mb-3 lg:mb-4">Take quizzes, test your knowledge, and track your learning progress.</p>
                    <div className="btn-secondary text-sm lg:text-base">
                      Start Learning
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-16" data-scroll>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Why Choose QuizWiz?
            </h2>
            <p className="text-base lg:text-xl text-slate-600 dark:text-slate-300">
              Powerful features designed to make learning engaging and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8" data-scroll-stagger>
            <div className="card text-center group dark:bg-slate-700/80 p-4 lg:p-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 lg:mb-4">Lightning Fast</h3>
              <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Built with modern technology for instant loading and smooth interactions. 
                Experience buttery smooth scrolling and animations powered by Lenis.
              </p>
            </div>
            
            <div className="card text-center group dark:bg-slate-700/80 p-4 lg:p-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 lg:mb-4">Smart Analytics</h3>
              <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Get detailed insights into student performance with comprehensive analytics. 
                Track progress, identify knowledge gaps, and optimize learning outcomes.
              </p>
            </div>
            
            <div className="card text-center group dark:bg-slate-700/80 p-4 lg:p-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 lg:mb-4">Easy to Use</h3>
              <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Intuitive interface designed for both educators and students. 
                Create quizzes in minutes with our user-friendly tools and templates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home