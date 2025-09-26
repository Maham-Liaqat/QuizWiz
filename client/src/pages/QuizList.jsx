// QuizList.jsx - Updated with Duolingo theme
import React from 'react'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const QuizCard = React.memo(({ quiz, user, index }) => {
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${index * 0.1}s`
          entry.target.classList.add('animate-lenis-fade-up')
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [index])

  const questionCounts = useMemo(() => {
    return {
      multipleChoice: quiz.questions.filter(q => q.type === 'multiple-choice').length,
      trueFalse: quiz.questions.filter(q => q.type === 'true-false').length,
      shortAnswer: quiz.questions.filter(q => q.type === 'short-answer').length
    }
  }, [quiz.questions])

  return (
    <div 
      ref={cardRef}
      className="card hover:shadow-lg hover:-translate-y-2 transition-all duration-500 opacity-0 transform translate-y-8 dark:bg-slate-700/80"
      data-scroll
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
          {quiz.title}
        </h3>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 ml-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {quiz.questions.length}
        </div>
      </div>
      
      {quiz.description && (
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
          {quiz.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
        <span>{quiz.questions.length} questions</span>
        <span>
          {questionCounts.multipleChoice} multiple choice
          {questionCounts.trueFalse > 0 && `, ${questionCounts.trueFalse} true/false`}
          {questionCounts.shortAnswer > 0 && `, ${questionCounts.shortAnswer} short answer`}
        </span>
      </div>
      
      {user ? (
        <Link
          to={`/quiz/${quiz.id}`}
          className="btn-primary w-full text-center block hover:scale-105 transition-transform duration-300"
        >
          Take Quiz
        </Link>
      ) : (
        <Link
          to="/login"
          className="btn-outline w-full text-center block hover:scale-105 transition-transform duration-300"
        >
          Sign In to Take Quiz
        </Link>
      )}
    </div>
  )
})

const QuizList = () => {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  // Initialize scroll animations
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
  }, [quizzes])

  useEffect(() => {
    // Using requestIdleCallback for non-urgent work to avoid blocking the main thread
    const requestId = requestIdleCallback(() => {
      try {
        // More efficient way to get quizzes from localStorage
        const quizKeys = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('quiz-')) {
            quizKeys.push(key)
          }
        }
        
        // Parse all quizzes in a single batch
        const allQuizzes = quizKeys.map(key => {
          try {
            const quiz = JSON.parse(localStorage.getItem(key))
            return {
              ...quiz,
              id: key.replace('quiz-', '')
            }
          } catch (e) {
            console.error(`Error parsing quiz from key ${key}:`, e)
            return null
          }
        }).filter(Boolean) // Remove any null entries from failed parsing
        
        setQuizzes(allQuizzes)
      } catch (error) {
        console.error('Error loading quizzes:', error)
      } finally {
        setLoading(false)
      }
    })
    
    // Cleanup function to cancel the idle callback if component unmounts
    return () => cancelIdleCallback(requestId)
  }, [])

  // Memoize the empty state to prevent unnecessary re-renders
  const emptyState = useMemo(() => (
    <div 
      className="text-center py-16" 
      data-scroll
      style={{ opacity: 0, transform: 'translateY(30px)' }}
    >
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
        <Link 
          to="/create" 
          className="btn-primary inline-block hover:scale-105 transition-transform duration-300"
        >
          Create Your First Quiz
        </Link>
      )}
    </div>
  ), [user?.role])

  // Memoize the instructor CTA to prevent unnecessary re-renders
  const instructorCTA = useMemo(() => (
    user?.role === 'instructor' && (
      <div 
        className="mt-12 text-center" 
        data-scroll
        style={{ opacity: 0, transform: 'translateY(30px)' }}
      >
        <div className="card-gradient border-primary-200 hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Want to create your own quiz?
          </h2>
          <p className="text-slate-600 mb-4">
            Build engaging quizzes with multiple question types and share them with others.
          </p>
          <Link 
            to="/create" 
            className="btn-primary inline-block hover:scale-105 transition-transform duration-300"
          >
            Create New Quiz
          </Link>
        </div>
      </div>
    )
  ), [user?.role])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto" ref={containerRef}>
      <div 
        className="mb-8" 
        data-scroll
        style={{ opacity: 0, transform: 'translateY(30px)' }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Browse Quizzes</h1>
        <p className="text-slate-600 dark:text-slate-300">
          {user ? `Welcome back, ${user.name}! Choose a quiz to test your knowledge.` : 'Sign in to take quizzes and track your progress.'}
        </p>
      </div>


      {quizzes.length === 0 ? (
        emptyState
      ) : (
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-scroll-stagger
          style={{ opacity: 0 }}
        >
          {quizzes.map((quiz, index) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              user={user} 
              index={index}
            />
          ))}
        </div>
      )}

      {instructorCTA}
    </div>
  )
}

export default React.memo(QuizList)

