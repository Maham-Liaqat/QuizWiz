import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const InstructorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load instructor's quizzes from localStorage
    const instructorQuizzes = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('quiz-')) {
        const quiz = JSON.parse(localStorage.getItem(key))
        // Check if this quiz was created by the current instructor
        if (quiz.createdBy === user?.id) {
          instructorQuizzes.push({
            ...quiz,
            id: key.replace('quiz-', '')
          })
        }
      }
    }
    setQuizzes(instructorQuizzes)
    setLoading(false)
  }, [user?.id])

  const getQuizAttempts = (quizId) => {
    // Count attempts for this quiz
    let attempts = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('results-') && key.includes(quizId)) {
        attempts++
      }
    }
    return attempts
  }

  const copyQuizLink = (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`
    navigator.clipboard.writeText(quizLink)
    alert('Quiz link copied to clipboard! Share this link with your students.')
  }

  const deleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      localStorage.removeItem(`quiz-${quizId}`)
      setQuizzes(quizzes.filter(q => q.id !== quizId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Instructor Dashboard
        </h1>
        <p className="text-slate-600">
          Welcome back, {user?.name}! Manage your quizzes and track student progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-slate-800">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Published</p>
              <p className="text-2xl font-bold text-slate-800">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Attempts</p>
              <p className="text-2xl font-bold text-slate-800">
                {quizzes.reduce((sum, quiz) => sum + getQuizAttempts(quiz.id), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card-gradient border-primary-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">How to Share Quizzes with Students</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>1. Click the <strong>"Share"</strong> button next to any quiz</p>
          <p>2. The quiz link will be copied to your clipboard</p>
          <p>3. Send this link to your students via email, message, or any platform</p>
          <p>4. When students click the link, they'll be prompted to:</p>
          <ul className="ml-4 space-y-1">
            <li>• Sign up/Login to QuizWiz</li>
            <li>• Take the quiz</li>
            <li>• View their results</li>
          </ul>
          <p className="text-primary-600 font-medium">💡 Tip: You can also test your own quizzes by clicking "Test Quiz"!</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Quizzes</h2>
        <button 
          onClick={() => navigate('/create')}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Quiz
        </button>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No Quizzes Created Yet</h2>
          <p className="text-slate-600 mb-6">Create your first quiz to get started!</p>
          <button 
            onClick={() => navigate('/create')}
            className="btn-primary"
          >
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">{quiz.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Published
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2">{quiz.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span>{quiz.questions.length} questions</span>
                    <span>•</span>
                    <span>{getQuizAttempts(quiz.id)} attempts</span>
                    <span>•</span>
                    <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => copyQuizLink(quiz.id)}
                    className="btn-secondary text-sm px-3 py-1"
                    title="Copy quiz link to share with students"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="btn-primary text-sm px-3 py-1"
                    title="Test your quiz as a student would"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Test Quiz
                  </Link>
                  <button 
                    onClick={() => deleteQuiz(quiz.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 text-sm px-3 py-1 rounded-lg transition-colors"
                    title="Delete this quiz"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InstructorDashboard