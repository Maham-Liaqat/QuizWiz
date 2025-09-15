import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const QuizResults = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load quiz and results from localStorage
    const savedQuiz = localStorage.getItem(`quiz-${id}`)
    const savedResults = localStorage.getItem(`results-${id}`)
    
    if (savedQuiz && savedResults) {
      setQuiz(JSON.parse(savedQuiz))
      setResults(JSON.parse(savedResults))
    }
    setLoading(false)
  }, [id])

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100'
    if (percentage >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent work! 🎉'
    if (percentage >= 80) return 'Great job! 👍'
    if (percentage >= 70) return 'Good effort! 👏'
    if (percentage >= 60) return 'Not bad! Keep practicing! 💪'
    return 'Keep studying! You can do better! 📚'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz || !results) {
    return (
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
    )
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
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(results.percentage)} mb-4`}>
          <span className={`text-3xl font-bold ${getScoreColor(results.percentage)}`}>
            {results.percentage}%
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {results.score} out of {results.total} correct
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          {getScoreMessage(results.percentage)}
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
              : userAnswer?.toLowerCase().trim() === question.options[0]?.toLowerCase().trim()

            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
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
                      {question.type === 'multiple-choice' 
                        ? question.options[userAnswer] || 'No answer'
                        : question.type === 'true-false'
                        ? userAnswer === 0 ? 'True' : userAnswer === 1 ? 'False' : 'No answer'
                        : userAnswer || 'No answer'
                      }
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Correct answer: </span>
                      <span className="text-sm text-green-700">
                        {question.type === 'multiple-choice' 
                          ? question.options[question.correctAnswer]
                          : question.type === 'true-false'
                          ? question.correctAnswer === 0 ? 'True' : 'False'
                          : question.options[0]
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
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

export default QuizResults