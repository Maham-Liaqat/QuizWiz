import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const TakeQuiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (required for taking quizzes)
    if (!user) {
      navigate('/login', { state: { from: `/quiz/${id}` } })
      return
    }

    // Load quiz from localStorage (in a real app, this would be an API call)
    const savedQuiz = localStorage.getItem(`quiz-${id}`)
    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz))
    }
    setLoading(false)
  }, [id, user, navigate])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuiz = () => {
    setIsSubmitted(true)
    // Calculate score
    let score = 0
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          score++
        }
      } else if (question.type === 'short-answer') {
        if (userAnswer?.toLowerCase().trim() === question.options[0]?.toLowerCase().trim()) {
          score++
        }
      }
    })

    const results = {
      quizId: id,
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      answers,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      submittedAt: new Date().toISOString()
    }

    localStorage.setItem(`results-${id}`, JSON.stringify(results))
    navigate(`/results/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
        <p className="text-gray-600 mb-8">The quiz you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Go Home
        </button>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-600">{quiz.description}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.text}
        </h2>

        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  answers[question.id] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="text-primary-600 mr-3"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-3">
            {['True', 'False'].map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  answers[question.id] === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="text-primary-600 mr-3"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'short-answer' && (
          <div>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your answer"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={submitQuiz}
            className="btn-primary"
            disabled={Object.keys(answers).length !== quiz.questions.length}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn-primary"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}

export default TakeQuiz