import React from 'react' // Add this import
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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
  minLength,
  maxLength,
  inputRef,
  children,
  ariaRequired = "true"
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
        minLength={minLength}
        maxLength={maxLength}
        ref={inputRef}
        aria-required={ariaRequired}
      />
      {children}
    </div>
  )
})

FormInput.displayName = 'FormInput'

const Register = () => {
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const nameInputRef = useRef(null)

  // Autofocus for accessibility
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  // Set role from navigation state if present
  useEffect(() => {
    if (location.state?.role && (location.state.role === "student" || location.state.role === "instructor")) {
      setFormData(prev => ({ ...prev, role: location.state.role }))
    }
  }, [location.state])

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Email regex for basic validation
  const isValidEmail = useCallback((email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [])

  // Form validation function
  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      return 'Full name is required'
    }
    if (!isValidEmail(formData.email)) {
      return 'Please enter a valid email address'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    if (!['student', 'instructor'].includes(formData.role)) {
      return 'Invalid role selected'
    }
    return null
  }, [formData, isValidEmail])

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
      const result = await register(
        formData.name.trim(),
        formData.email.toLowerCase().trim(),
        formData.password,
        formData.role
      )

      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }, [formData, register, navigate, validateForm])

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-slate-100">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="on" aria-label="Register Form">
          {errorDisplay}

          <div className="space-y-4">
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Full name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required={true}
              maxLength={60}
              inputRef={nameInputRef}
            />

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
              maxLength={80}
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label={
                <>
                  Password <span className="text-xs text-gray-500">(min 6 characters)</span>
                </>
              }
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
              required={true}
              spellCheck={false}
              minLength={6}
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required={true}
              spellCheck={false}
              minLength={6}
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(Register)