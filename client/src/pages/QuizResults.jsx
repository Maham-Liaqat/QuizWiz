import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Memoized component for individual question review
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
    <div className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-700/50 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-slate-100">
          Question {index + 1}
        </h4>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isCorrect 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-slate-300 mb-4 font-medium">{question.text}</p>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-slate-400 min-w-[100px]">Your answer:</span>
          <span className={`text-sm font-medium ml-2 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {answerText}
          </span>
        </div>
        
        {!isCorrect && (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400 min-w-[100px]">Correct answer:</span>
            <span className="text-sm font-medium text-green-700 dark:text-green-400 ml-2">
              {correctAnswerText}
            </span>
          </div>
        )}
      </div>

      {question.explanation && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Explanation: </span>
          <span className="text-sm text-blue-600 dark:text-blue-400">{question.explanation}</span>
        </div>
      )}
    </div>
  )
})

QuestionReview.displayName = 'QuestionReview'

// Memoized score display component
const ScoreDisplay = React.memo(({ score, total, percentage }) => {
  const getScoreColor = useCallback((percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 80) return 'text-green-500 dark:text-green-300'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (percentage >= 60) return 'text-yellow-500 dark:text-yellow-300'
    if (percentage >= 50) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }, [])

  const getScoreBgColor = useCallback((percentage) => {
    if (percentage >= 90) return 'bg-green-100 dark:bg-green-900/30'
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20'
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30'
    if (percentage >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20'
    if (percentage >= 50) return 'bg-orange-100 dark:bg-orange-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }, [])

  const getScoreMessage = useCallback((percentage) => {
    if (percentage >= 95) return 'Perfect score! 🎯 Outstanding!'
    if (percentage >= 90) return 'Excellent work! 🎉 You nailed it!'
    if (percentage >= 80) return 'Great job! 👍 Very impressive!'
    if (percentage >= 70) return 'Good effort! 👏 Well done!'
    if (percentage >= 60) return 'Not bad! 💪 Keep practicing!'
    if (percentage >= 50) return 'You passed! 📚 Room for improvement!'
    return 'Keep studying! 📖 You can do better!'
  }, [])

  const getScoreEmoji = useCallback((percentage) => {
    if (percentage >= 90) return '🏆'
    if (percentage >= 80) return '⭐'
    if (percentage >= 70) return '👍'
    if (percentage >= 60) return '💪'
    if (percentage >= 50) return '📚'
    return '📖'
  }, [])

  const scoreColor = getScoreColor(percentage)
  const scoreBgColor = getScoreBgColor(percentage)
  const scoreMessage = getScoreMessage(percentage)
  const scoreEmoji = getScoreEmoji(percentage)

  return (
    <div className="card text-center mb-8 dark:bg-slate-700/80 transition-all duration-300 hover:shadow-xl">
      <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${scoreBgColor} mb-6 mx-auto border-4 ${scoreColor.replace('text', 'border')} transition-transform duration-300 hover:scale-105`}>
        <span className={`text-4xl font-bold ${scoreColor}`}>
          {percentage}%
        </span>
      </div>
      
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          {score} out of {total} correct
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">{scoreEmoji}</span>
          <p className="text-lg text-gray-600 dark:text-slate-300 font-medium">
            {scoreMessage}
          </p>
          <span className="text-2xl">{scoreEmoji}</span>
        </div>
      </div>

      {/* Progress bar visualization */}
      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3 mb-4">
        <div 
          className="h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, #58CC02, #1CB0F6)`
          }}
        ></div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-slate-400">
        Score: {percentage}% • Correct: {score}/{total}
      </div>
    </div>
  )
})

ScoreDisplay.displayName = 'ScoreDisplay'

const QuizResults = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const loadResults = () => {
      try {
        const userId = user?.id || JSON.parse(localStorage.getItem("currentUser"))?.id
        const savedQuiz = localStorage.getItem(`quiz-${id}`)
        let savedResults = null

        // Try user-specific results first
        if (userId) {
          savedResults = localStorage.getItem(`results-${id}-${userId}`)
        }
        // Fallback to generic results
        if (!savedResults) {
          savedResults = localStorage.getItem(`results-${id}`)
        }

        if (savedQuiz && savedResults) {
          const quizData = JSON.parse(savedQuiz)
          const resultsData = JSON.parse(savedResults)
          
          setQuiz(quizData)
          setResults(resultsData)
          
          // Calculate time spent if available
          if (resultsData.startedAt && resultsData.submittedAt) {
            const startTime = new Date(resultsData.startedAt).getTime()
            const endTime = new Date(resultsData.submittedAt).getTime()
            setTimeSpent(Math.round((endTime - startTime) / 1000)) // Convert to seconds
          }
        }
      } catch (error) {
        console.error('Error loading quiz results:', error)
      } finally {
        setLoading(false)
      }
    }

    const requestId = requestIdleCallback(loadResults)
    return () => cancelIdleCallback(requestId)
  }, [id, user])

  // Memoized loading and error states
  const loadingState = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-slate-300">Loading your results...</p>
      </div>
    </div>
  ), [])

  const errorState = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Results Not Found</h1>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          The quiz results you're looking for don't exist or may have been deleted.
        </p>
        <div className="space-y-3">
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            Go Home
          </button>
          <button onClick={() => navigate('/quizzes')} className="btn-outline w-full">
            Browse Quizzes
          </button>
        </div>
      </div>
    </div>
  ), [navigate])

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }, [])

  if (loading) {
    return loadingState
  }

  if (!quiz || !results) {
    return errorState
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Quiz Completed!</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">{quiz.title}</p>
          {timeSpent > 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              Time spent: {formatTime(timeSpent)}
            </p>
          )}
        </div>

        {/* Score Display */}
        <ScoreDisplay 
          score={results.score} 
          total={results.total} 
          percentage={results.percentage} 
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card text-center dark:bg-slate-700/80">
            <div className="text-2xl font-bold text-primary-400">{results.score}</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Correct Answers</div>
          </div>
          <div className="card text-center dark:bg-slate-700/80">
            <div className="text-2xl font-bold text-secondary-400">{results.total - results.score}</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Incorrect Answers</div>
          </div>
          <div className="card text-center dark:bg-slate-700/80">
            <div className="text-2xl font-bold text-accent-400">{results.percentage}%</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Overall Score</div>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="card dark:bg-slate-700/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Question Review</h3>
            <span className="text-sm text-gray-500 dark:text-slate-400">
              {results.score}/{results.total} correct
            </span>
          </div>
          
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button 
            onClick={() => navigate(`/quiz/${id}`)} 
            className="btn-primary flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Quiz
          </button>
          
          <button 
            onClick={() => navigate('/quizzes')} 
            className="btn-secondary flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Browse More Quizzes
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="btn-outline flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </button>
        </div>

        {/* Share Results (Optional) */}
        {results.percentage >= 80 && (
          <div className="text-center mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-slate-300 mb-2">
              🎉 Great score! Share your achievement with others!
            </p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`I scored ${results.percentage}% on "${quiz.title}"! Try it yourself on QuizWiz!`)
                alert('Results copied to clipboard!')
              }}
              className="text-sm text-primary-400 hover:text-primary-500 dark:text-primary-300 dark:hover:text-primary-400 font-medium"
            >
              Copy results to share
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(QuizResults)