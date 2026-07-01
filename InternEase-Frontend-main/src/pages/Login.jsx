import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import apiService from '../services/api'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('🔐 Attempting login with:', {
        email: formData.email,
        passwordLength: formData.password?.length
      })
      
      // Real API call to backend
      const response = await apiService.login({
        email: formData.email,
        password: formData.password
      })
      
      console.log('✅ Login response:', response)
      
      
      const userData = {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      }
      
      login(userData)
      navigate(response.role === 'student' ? '/student' : '/organizer')
    } catch (error) {
      console.error(' Login failed:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert(error.message || 'Login failed. Please check your credentials.')
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
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[120px] top-[-150px] right-[-150px]" />

<div className="absolute w-[400px] h-[400px] rounded-full bg-pink-500/30 blur-[120px] bottom-[-100px] left-[-100px]" />

<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
     <div
  className="
  relative
  z-10
  max-w-md
  w-full
  p-8
  rounded-3xl
  border
  border-white/10
  backdrop-blur-xl
  bg-white/10
  shadow-[0_25px_60px_rgba(0,0,0,0.25)]
"
>
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">iE</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              internEase
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Role Toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.role === 'student'
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'organizer' })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.role === 'organizer'
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Organizer
            </button>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/80">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              placeholder="name@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/80">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/20 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            
          
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-secondary font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login