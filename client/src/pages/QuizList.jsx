import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const QuizList = () => {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load all quizzes from localStorage (in a real app, this would be an API call)
    const allQuizzes = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('quiz-')) {
        const quiz = JSON.parse(localStorage.getItem(key))
        allQuizzes.push({
          ...quiz,
          id: key.replace('quiz-', '')
        })
      }
    }
    setQuizzes(allQuizzes)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Browse Quizzes</h1>
        <p className="text-slate-600">
          {user ? `Welcome back, ${user.name}! Choose a quiz to test your knowledge.` : 'Sign in to take quizzes and track your progress.'}
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No Quizzes Available</h2>
          <p className="text-slate-600 mb-6">
            {user?.role === 'instructor' 
              ? 'Create your first quiz to get started!' 
              : 'No quizzes have been created yet. Check back later!'
            }
          </p>
          {user?.role === 'instructor' && (
            <Link to="/create" className="btn-primary">
              Create Your First Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">
                  {quiz.title}
                </h3>
                <div className="flex items-center text-sm text-slate-500 ml-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.questions.length}
                </div>
              </div>
              
              {quiz.description && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {quiz.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span>{quiz.questions.length} questions</span>
                <span>
                  {quiz.questions.filter(q => q.type === 'multiple-choice').length} multiple choice
                  {quiz.questions.filter(q => q.type === 'true-false').length > 0 && 
                    `, ${quiz.questions.filter(q => q.type === 'true-false').length} true/false`
                  }
                  {quiz.questions.filter(q => q.type === 'short-answer').length > 0 && 
                    `, ${quiz.questions.filter(q => q.type === 'short-answer').length} short answer`
                  }
                </span>
              </div>
              
              {user ? (
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="btn-primary w-full text-center block"
                >
                  Take Quiz
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-outline w-full text-center block"
                >
                  Sign In to Take Quiz
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Quiz CTA - Only for Instructors */}
      {user?.role === 'instructor' && (
        <div className="mt-12 text-center">
          <div className="card-gradient border-primary-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Want to create your own quiz?
            </h2>
            <p className="text-slate-600 mb-4">
              Build engaging quizzes with multiple question types and share them with others.
            </p>
            <Link to="/create" className="btn-primary">
              Create New Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizList