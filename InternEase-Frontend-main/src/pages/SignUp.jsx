import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
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
      const response = await apiService.signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      })

      const userData = {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      }

      signup(userData)

      navigate(
        response.role === 'student'
          ? '/student'
          : '/organizer'
      )
    } catch (error) {
      console.error('Signup failed:', error)

      alert(
        error.message ||
          'Signup failed. Please check your information.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const handleRoleChange = (role) => {
    setFormData((previousData) => ({
      ...previousData,
      role
    }))
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-indigo-200/40 blur-[90px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-200/40 blur-[90px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.04)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:50px_50px]" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center sm:min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_20px_50px_rgba(79,70,229,0.08)] sm:rounded-3xl sm:p-8 sm:shadow-[0_25px_60px_rgba(79,70,229,0.08)]">
          {/* Header */}
          <div className="text-center">
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-2 sm:mb-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 sm:h-10 sm:w-10">
                <span className="text-lg font-bold text-white sm:text-xl">
                  iE
                </span>
              </div>

              <span className="text-xl font-bold text-slate-900 sm:text-2xl">
                internEase
              </span>
            </Link>

            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Create Account
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
              Join thousands of students and organizers
            </p>
          </div>

          <form
            className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Role toggle */}
            <div className="flex rounded-xl border border-slate-100 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 rounded-lg px-2 py-2.5 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  formData.role === 'student'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('organizer')}
                className={`flex-1 rounded-lg px-2 py-2.5 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  formData.role === 'organizer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                Organizer
              </button>
            </div>

            {/* Name field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                placeholder="John Doe"
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                placeholder="name@example.com"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previousValue) => !previousValue)
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previousValue) => !previousValue
                    )
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base ${
                loading
                  ? 'cursor-not-allowed opacity-60'
                  : ''
              }`}
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>

            {/* Login link */}
            <div className="text-center">
              <p className="text-sm text-slate-500 sm:text-base">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp