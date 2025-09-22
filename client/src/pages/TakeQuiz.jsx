import React from 'react' // Add this import
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Memoized question component to prevent unnecessary re-renders
const QuestionComponent = React.memo(({ 
  question, 
  answer, 
  onAnswer, 
  inputRef 
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

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6" id={`question-${question.id}`}>
        {question.text}
      </h2>

      {question.type === 'multiple-choice' && (
        <div className="space-y-3">
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
        <div className="space-y-3">
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
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            placeholder="Enter your answer"
            value={answer || ''}
            onChange={(e) => handleShortAnswer(e.target.value)}
            aria-labelledby={`question-${question.id}`}
            aria-required="true"
            autoComplete="off"
          />
        </div>
      )}
    </div>
  )
})

QuestionComponent.displayName = 'QuestionComponent'

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
      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300'
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
        className="text-primary-600 mr-3"
        aria-checked={isSelected}
        aria-labelledby={`question-${questionId}`}
      />
      <span className="text-gray-900">{option}</span>
    </label>
  )
})

OptionButton.displayName = 'OptionButton'

const TakeQuiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef(null)

  // Scroll/focus accessibility for each question
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentQuestion, quiz])

  useEffect(() => {
    // Check if user is authenticated (required for taking quizzes)
    if (!user) {
      navigate('/login', { state: { from: `/quiz/${id}` } })
      return
    }

    // Load quiz from localStorage
    const loadQuiz = () => {
      try {
        const savedQuiz = localStorage.getItem(`quiz-${id}`)
        if (savedQuiz) {
          setQuiz(JSON.parse(savedQuiz))
        }
      } catch (error) {
        console.error('Error loading quiz:', error)
      } finally {
        setLoading(false)
      }
    }

    // Use requestIdleCallback for non-urgent work
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

  // Prevent double submission
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
        if (
          typeof userAnswer === "string" &&
          userAnswer?.toLowerCase().trim() === question.options[0]?.toLowerCase().trim()
        ) {
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

    // Save results to localStorage
    try {
      localStorage.setItem(
        `results-${id}-${user.id}`,
        JSON.stringify(results)
      )
    } catch (error) {
      console.error('Error saving results:', error)
    }
    
    navigate(`/results/${id}`)
  }, [answers, id, isSubmitted, navigate, quiz, user])

  // Memoized loading and error states
  const loadingState = useMemo(() => (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  ), [])

  const errorState = useMemo(() => (
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
  ), [navigate])

  // Memoized progress calculation
  const progress = useMemo(() => 
    quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0,
    [currentQuestion, quiz]
  )

  if (loading) {
    return loadingState
  }

  if (!quiz) {
    return errorState
  }

  const question = quiz.questions[currentQuestion]
  const currentAnswer = answers[question.id]

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
        <div className="w-full bg-gray-200 rounded-full h-2" aria-label="Progress">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          ></div>
        </div>
      </div>

      {/* Question */}
      <QuestionComponent
        question={question}
        answer={currentAnswer}
        onAnswer={handleAnswer}
        inputRef={inputRef}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-disabled={currentQuestion === 0}
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={submitQuiz}
            className="btn-primary"
            disabled={Object.keys(answers).length !== quiz.questions.length || isSubmitted}
            aria-disabled={Object.keys(answers).length !== quiz.questions.length || isSubmitted}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn-primary"
            aria-disabled={false}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}

export default React.memo(TakeQuiz)