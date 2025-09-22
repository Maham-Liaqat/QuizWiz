import React from 'react' // Add this import
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Memoized component for individual question review to prevent unnecessary re-renders
const QuestionReview = React.memo(({ 
  question, 
  index, 
  userAnswer, 
  isCorrect 
}) => {
  const getAnswerText = useCallback((question, userAnswer) => {
    switch (question.type) {
      case 'multiple-choice':
        return typeof userAnswer === "number" && question.options[userAnswer]
          ? question.options[userAnswer]
          : 'No answer'
      case 'true-false':
        return userAnswer === 0 
          ? 'True' 
          : userAnswer === 1 
            ? 'False' 
            : 'No answer'
      default:
        return userAnswer || 'No answer'
    }
  }, [])

  const getCorrectAnswerText = useCallback((question) => {
    switch (question.type) {
      case 'multiple-choice':
        return question.options[question.correctAnswer]
      case 'true-false':
        return question.correctAnswer === 0 ? 'True' : 'False'
      default:
        return question.options[0]
    }
  }, [])

  const answerText = useMemo(() => 
    getAnswerText(question, userAnswer), 
    [question, userAnswer, getAnswerText]
  )
  
  const correctAnswerText = useMemo(() => 
    getCorrectAnswerText(question), 
    [question, getCorrectAnswerText]
  )

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900">
          Question {index + 1}
        </h4>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isCorrect 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">{question.text}</p>
      
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-600">Your answer: </span>
          <span className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {answerText}
          </span>
        </div>
        
        {!isCorrect && (
          <div>
            <span className="text-sm font-medium text-gray-600">Correct answer: </span>
            <span className="text-sm text-green-700">
              {correctAnswerText}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

QuestionReview.displayName = 'QuestionReview'

const QuizResults = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load quiz and results data
    const loadResults = () => {
      try {
        // Prefer user-specific results if available
        const userId = JSON.parse(localStorage.getItem("currentUser"))?.id
        const savedQuiz = localStorage.getItem(`quiz-${id}`)
        let savedResults = null

        // Try user-specific results first, fallback to generic (legacy)
        if (userId) {
          savedResults = localStorage.getItem(`results-${id}-${userId}`)
        }
        if (!savedResults) {
          savedResults = localStorage.getItem(`results-${id}`) // legacy
        }

        if (savedQuiz && savedResults) {
          setQuiz(JSON.parse(savedQuiz))
          setResults(JSON.parse(savedResults))
        }
      } catch (error) {
        console.error('Error loading quiz results:', error)
      } finally {
        setLoading(false)
      }
    }

    // Use requestIdleCallback for non-urgent work
    const requestId = requestIdleCallback(loadResults)
    
    return () => cancelIdleCallback(requestId)
  }, [id])

  // Memoized score evaluation functions
  const getScoreColor = useCallback((percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }, [])

  const getScoreBgColor = useCallback((percentage) => {
    if (percentage >= 80) return 'bg-green-100'
    if (percentage >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }, [])

  const getScoreMessage = useCallback((percentage) => {
    if (percentage >= 90) return 'Excellent work! 🎉'
    if (percentage >= 80) return 'Great job! 👍'
    if (percentage >= 70) return 'Good effort! 👏'
    if (percentage >= 60) return 'Not bad! Keep practicing! 💪'
    return 'Keep studying! You can do better! 📚'
  }, [])

  // Memoized score display elements
  const scoreColor = useMemo(() => 
    results ? getScoreColor(results.percentage) : '', 
    [results, getScoreColor]
  )
  
  const scoreBgColor = useMemo(() => 
    results ? getScoreBgColor(results.percentage) : '', 
    [results, getScoreBgColor]
  )
  
  const scoreMessage = useMemo(() => 
    results ? getScoreMessage(results.percentage) : '', 
    [results, getScoreMessage]
  )

  // Memoized loading and error states
  const loadingState = useMemo(() => (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  ), [])

  const errorState = useMemo(() => (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h1>
      <p className="text-gray-600 mb-8">The results you're looking for don't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary"
      >
        Go Home
      </button>
    </div>
  ), [navigate])

  if (loading) {
    return loadingState
  }

  if (!quiz || !results) {
    return errorState
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        <p className="text-gray-600">{quiz.title}</p>
      </div>

      {/* Score Summary */}
      <div className="card text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${scoreBgColor} mb-4`}>
          <span className={`text-3xl font-bold ${scoreColor}`}>
            {results.percentage}%
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {results.score} out of {results.total} correct
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          {scoreMessage}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="btn-primary"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h3>
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = results.answers[question.id]
            const isCorrect = question.type === 'multiple-choice' || question.type === 'true-false' 
              ? userAnswer === question.correctAnswer
              : typeof userAnswer === "string" && userAnswer?.toLowerCase().trim() === question.options[0]?.toLowerCase().trim()

            return (
              <QuestionReview
                key={question.id}
                question={question}
                index={index}
                userAnswer={userAnswer}
                isCorrect={isCorrect}
              />
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => navigate('/create')}
          className="btn-primary"
        >
          Create New Quiz
        </button>
        <button
          onClick={() => navigate('/quizzes')}
          className="btn-secondary"
        >
          Browse More Quizzes
        </button>
      </div>
    </div>
  )
}

export default React.memo(QuizResults)