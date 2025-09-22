import React from 'react' // Add this import
import { useState, useCallback, useMemo, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Memoized input field component to prevent unnecessary re-renders
const FormInput = React.memo(({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  spellCheck = false,
  inputRef,
  children
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className="input-field mt-1"
        placeholder={placeholder}
        spellCheck={spellCheck}
        ref={inputRef}
      />
      {children}
    </div>
  )
})

FormInput.displayName = 'FormInput'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailInputRef = useRef(null)

  // Autofocus for accessibility
  useEffect(() => {
    emailInputRef.current?.focus()
  }, [])

  // Pre-fill email from navigation state if available
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email
      }))
    }
  }, [location.state])

  // Memoized change handler for better perf with many fields
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Form validation function
  const validateForm = useCallback(() => {
    if (!formData.email.trim()) {
      return 'Email is required'
    }
    if (!formData.password) {
      return 'Password is required'
    }
    if (!['student', 'instructor'].includes(formData.role)) {
      return 'Invalid role selected'
    }
    return null
  }, [formData])

  // Memoized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const result = await login(
        formData.email.toLowerCase().trim(), 
        formData.password, 
        formData.role
      )
      
      if (result.success) {
        // Redirect to the intended page or home
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        setError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }, [formData, login, navigate, validateForm, location.state])

  // Memoized error display
  const errorDisplay = useMemo(() => {
    if (!error) return null
    
    return (
      <div 
        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
        role="alert"
        aria-live="assertive"
      >
        {error}
      </div>
    )
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div 
            className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center"
            aria-label="QuizWiz logo"
          >
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit} 
          autoComplete="on"
          aria-label="Login Form"
        >
          {errorDisplay}
          
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required={true}
              spellCheck={false}
              inputRef={emailInputRef}
            />
            
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required={true}
              spellCheck={false}
            />
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field mt-1"
                aria-required="true"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(Login)