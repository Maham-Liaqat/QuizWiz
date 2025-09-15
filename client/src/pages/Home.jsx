import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelection = (role) => {
    if (user) {
      // If user is already logged in, navigate based on role
      if (role === 'instructor') {
        navigate('/dashboard')
      } else {
        navigate('/quizzes')
      }
    } else {
      // If not logged in, navigate to register with role pre-selected
      navigate('/register', { state: { role } })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-2xl shadow-primary-500/25 mb-6">
                <span className="text-white font-black text-3xl">Q</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-gradient mb-6">
                QuizWiz
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
                Where Learning Meets Fun
              </p>
            </div>

            {/* About Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="card-gradient">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">About QuizWiz</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  QuizWiz is the ultimate platform for creating and taking engaging quizzes. Whether you're an educator 
                  looking to create interactive learning experiences or a student eager to test your knowledge, QuizWiz 
                  provides the tools you need to make learning fun and effective.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-primary-700 mb-3">For Instructors</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Create interactive quizzes with multiple question types
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Track student progress and performance
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        Access comprehensive analytics and insights
                      </li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-secondary-700 mb-3">For Students</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                        Take quizzes on various topics and subjects
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                        Get instant feedback and detailed explanations
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                        Track your learning progress over time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Choose Your Role</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleRoleSelection('instructor')}
                  className="group card-gradient hover:scale-105 transform transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">I am an Instructor</h4>
                    <p className="text-slate-600 mb-4">Create quizzes, track student progress, and manage your educational content.</p>
                    <div className="btn-primary w-full">
                      Get Started as Instructor
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection('student')}
                  className="group card-gradient hover:scale-105 transform transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">I am a Student</h4>
                    <p className="text-slate-600 mb-4">Take quizzes, test your knowledge, and track your learning progress.</p>
                    <div className="btn-secondary w-full">
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
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose QuizWiz?
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features designed to make learning engaging and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Built with modern technology for instant loading and smooth interactions. 
                Experience buttery smooth scrolling and animations powered by Lenis.
              </p>
            </div>
            
            <div className="card text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Smart Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Get detailed insights into student performance with comprehensive analytics. 
                Track progress, identify knowledge gaps, and optimize learning outcomes.
              </p>
            </div>
            
            <div className="card text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Easy to Use</h3>
              <p className="text-slate-600 leading-relaxed">
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