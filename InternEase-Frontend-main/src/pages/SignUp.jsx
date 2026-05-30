import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import apiService from '../services/api'

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    setLoading(true)
    
    try {
      console.log('Starting signup with data:', formData)
      
      // Real API call to backend
      const response = await apiService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      
      console.log('Signup response:', response) // Debug log
      alert('Signup response: ' + JSON.stringify(response, null, 2))
      
      // Backend returns: { _id, name, email, role, token }
      const userData = {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      }
      
      console.log('User data to save:', userData) // Debug log
      alert('User data to save: ' + JSON.stringify(userData, null, 2))
      
      signup(userData)
      
      // Navigate based on role
      const targetPath = response.role === 'student' ? '/student' : '/organizer'
      console.log('Navigating to:', targetPath) // Debug log
      alert('About to navigate to: ' + targetPath)
      navigate(targetPath)
    } catch (error) {
      console.error('Signup failed:', error)
      alert('ERROR: ' + (error.message || 'Signup failed. Please check your information.'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg py-12 px-4">
      <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] top-[-150px] right-[-150px]" />

<div className="absolute w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-[120px] bottom-[-100px] left-[-100px]" />

<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
    <div className="
relative
z-10
max-w-md
w-full
rounded-3xl
border
border-white/10
bg-white/10
backdrop-blur-xl
shadow-[0_25px_60px_rgba(0,0,0,0.25)]
p-8
">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">iE</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              internEase
            </span>
          </Link>
         <h2 className="text-4xl font-bold text-white">
  Create Account 
</h2>

<p className="mt-3 text-white/70">
  Join thousands of students and organizers
</p>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join thousands of students and organizers
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Toggle */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                formData.role === 'student'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'organizer' })}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                formData.role === 'organizer'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary'
              }`}
            >
              Organizer
            </button>
          </div>

          {/* Name Field */}
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Full name"
            />
            <label
              htmlFor="name"
              className="absolute left-4 -top-2.5 bg-white dark:bg-cardDark px-1 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-primary peer-focus:text-sm"
            >
              Full name
            </label>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Email address"
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-2.5 bg-white dark:bg-cardDark px-1 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-primary peer-focus:text-sm"
            >
              Email address
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-2.5 bg-white dark:bg-cardDark px-1 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-primary peer-focus:text-sm"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm password"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-4 -top-2.5 bg-white dark:bg-cardDark px-1 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-primary peer-focus:text-sm"
            >
              Confirm password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* OAuth Buttons */}
        
            
        

          {/* Links */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-secondary font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp