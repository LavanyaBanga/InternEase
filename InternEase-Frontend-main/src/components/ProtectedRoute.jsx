import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  // Wait for auth check (e.g. token validation on page refresh) to finish
  // before deciding to redirect — otherwise a logged-in user briefly sees
  // user === null and gets bounced to /login.
  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'student' ? '/student' : '/organizer'} replace />
  }

  return children
}

export default ProtectedRoute