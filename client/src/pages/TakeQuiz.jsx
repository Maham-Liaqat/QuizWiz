import React from 'react'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Memoized option button component
const OptionButton = React.memo(({ 
  id, 
  questionId, 
  index, 
  option, 
  isSelected, 
  onSelect, 
  inputRef 
}) => {
  return (
    <label
      className={`flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
        isSelected
          ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-[1.02]'
          : 'border-gray-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:shadow-md'
      }`}
      htmlFor={id}
    >
      <input
        ref={isSelected ? inputRef : null}
        type="radio"
        id={id}
        name={`question-${questionId}`}
        value={index}
        checked={isSelected}
        onChange={() => onSelect(index)}
        className="text-primary-400 mr-3 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        aria-checked={isSelected}
      />
      <span className="text-sm sm:text-base text-gray-900 dark:text-slate-100 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {option}
      </span>
    </label>
  )
})

OptionButton.displayName = 'OptionButton'

// Memoized question component
const QuestionComponent = React.memo(({ 
  question, 
  answer, 
  onAnswer, 
  inputRef,
  questionNumber,
  totalQuestions
}) => {
  const handleMultipleChoice = useCallback((index) => {
    onAnswer(question.id, index)
  }, [question.id, onAnswer])

  const handleTrueFalse = useCallback((index) => {
    onAnswer(question.id, index)
  }, [question.id, onAnswer])

  const handleShortAnswer = useCallback((value) => {
    onAnswer(question.id, value)
  }, [question.id, onAnswer])

  const getQuestionTypeLabel = useCallback((type) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice'
      case 'true-false': return 'True or False'
      case 'short-answer': return 'Short Answer'
      default: return type
    }
  }, [])

  return (
    <div className="card mb-6 sm:mb-8 dark:bg-slate-700/80 transition-all duration-300 hover:shadow-xl">
      {/* Question Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 pb-4 border-b border-gray-200 dark:border-slate-600">
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
          <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300">
            {getQuestionTypeLabel(question.type)}
          </span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
          Points: 1
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 sm:mb-6 leading-relaxed">
        {question.text}
      </h2>

      {/* Answer Options */}
      {question.type === 'multiple-choice' && (
        <div className="space-y-2 sm:space-y-3">
          {question.options.map((option, index) => (
            <OptionButton
              key={index}
              id={`q${question.id}-option${index}`}
              questionId={question.id}
              index={index}
              option={option}
              isSelected={answer === index}
              onSelect={handleMultipleChoice}
              inputRef={inputRef}
            />
          ))}
        </div>
      )}

      {question.type === 'true-false' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {['True', 'False'].map((option, index) => (
            <OptionButton
              key={index}
              id={`q${question.id}-tf${index}`}
              questionId={question.id}
              index={index}
              option={option}
              isSelected={answer === index}
              onSelect={handleTrueFalse}
              inputRef={inputRef}
            />
          ))}
        </div>
      )}

      {question.type === 'short-answer' && (
        <div>
          <textarea
            ref={inputRef}
            rows={3}
            className="input-field dark:bg-slate-600/80 w-full resize-none text-sm sm:text-base"
            placeholder="Type your answer here..."
            value={answer || ''}
            onChange={(e) => handleShortAnswer(e.target.value)}
            aria-labelledby={`question-${question.id}`}
          />
          <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2">
            Provide a brief answer to the question above.
          </div>
        </div>
      )}

      {/* Question Hint (if available) */}
      {question.hint && (
        <div className="mt-3 sm:mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 font-medium">Hint: </span>
            <span className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 ml-1">{question.hint}</span>
          </div>
        </div>
      )}
    </div>
  )
})

QuestionComponent.displayName = 'QuestionComponent'

const TakeQuiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [startTime, setStartTime] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const inputRef = useRef(null)

  // Timer effect
  useEffect(() => {
    let interval
    if (startTime && !isSubmitted) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [startTime, isSubmitted])

  // Focus management
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentQuestion, quiz])

  // Load quiz and initialize timer
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/quiz/${id}` } })
      return
    }

    const loadQuiz = () => {
      try {
        const savedQuiz = localStorage.getItem(`quiz-${id}`)
        if (savedQuiz) {
          const quizData = JSON.parse(savedQuiz)
          setQuiz(quizData)
          setStartTime(Date.now())
        }
      } catch (error) {
        console.error('Error loading quiz:', error)
      } finally {
        setLoading(false)
      }
    }

    const requestId = requestIdleCallback(loadQuiz)
    return () => cancelIdleCallback(requestId)
  }, [id, user, navigate])

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(prev => Math.min(prev + 1, quiz.questions.length - 1))
  }, [quiz])

  const prevQuestion = useCallback(() => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0))
  }, [])

  const goToQuestion = useCallback((index) => {
    setCurrentQuestion(index)
  }, [])

  const submitQuiz = useCallback(() => {
    if (isSubmitted) return
    
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
        if (typeof userAnswer === "string" &&
          userAnswer?.toLowerCase().trim() === question.options[0]?.toLowerCase().trim()) {
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
      startedAt: new Date(startTime).toISOString(),
      submittedAt: new Date().toISOString(),
      timeSpent: timeSpent
    }

    // Save results to localStorage
    try {
      localStorage.setItem(`results-${id}-${user.id}`, JSON.stringify(results))
    } catch (error) {
      console.error('Error saving results:', error)
    }
    
    navigate(`/results/${id}`)
  }, [answers, id, isSubmitted, navigate, quiz, user, startTime, timeSpent])

  // Memoized computed values
  const progress = useMemo(() => 
    quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0,
    [currentQuestion, quiz]
  )

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  const answeredQuestions = useMemo(() => 
    Object.keys(answers).length,
    [answers]
  )

  // Loading and error states
  const loadingState = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-slate-300">Loading quiz...</p>
      </div>
    </div>
  ), [])

  const errorState = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-8">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Quiz Not Found</h1>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          The quiz you're looking for doesn't exist or may have been deleted.
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

  if (loading) return loadingState
  if (!quiz) return errorState

  const question = quiz.questions[currentQuestion]
  const currentAnswer = answers[question.id]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Quiz Header */}
        <div className="card mb-4 sm:mb-8 dark:bg-slate-700/80">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 line-clamp-2">{quiz.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                <span>By: {quiz.createdByName || 'Unknown Author'}</span>
                <span>•</span>
                <span>{quiz.questions.length} questions</span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-primary-400">{formatTime(timeSpent)}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Time Elapsed</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="card mb-4 sm:mb-8 dark:bg-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                Progress: {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm font-medium text-primary-400">
                Answered: {answeredQuestions}/{quiz.questions.length}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 sm:h-3 mb-3 sm:mb-4">
            <div 
              className="h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, #58CC02, #1CB0F6)`
              }}
            ></div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  index === currentQuestion
                    ? 'bg-primary-400 text-white scale-110'
                    : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-400 dark:hover:bg-slate-500'
                }`}
                title={`Go to question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <QuestionComponent
          question={question}
          answer={currentAnswer}
          onAnswer={handleAnswer}
          inputRef={inputRef}
          questionNumber={currentQuestion + 1}
          totalQuestions={quiz.questions.length}
        />

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-2 sm:order-1"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Previous</span>
          </button>

          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-slate-400 order-1 sm:order-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length !== quiz.questions.length || isSubmitted}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-3"
            >
              <span className="text-sm sm:text-base">
                {isSubmitted ? 'Submitting...' : 'Submit Quiz'}
              </span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="btn-primary w-full sm:w-auto order-3"
            >
              <span className="text-sm sm:text-base">Next Question</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick Submit Warning */}
        {currentQuestion === quiz.questions.length - 1 && answeredQuestions < quiz.questions.length && (
          <div className="mt-3 sm:mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                You have {quiz.questions.length - answeredQuestions} unanswered questions.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(TakeQuiz)