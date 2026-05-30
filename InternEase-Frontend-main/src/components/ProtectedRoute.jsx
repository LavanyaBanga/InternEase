import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()
  
  console.log('=== PROTECTED ROUTE CHECK ===')
  console.log('Current user:', user)
  console.log('Required role:', role)
  console.log('User role:', user?.role)
  
  if (!user) {
    console.log('No user found, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  if (role && user.role !== role) {
    console.log('Role mismatch! Redirecting to user dashboard')
    return <Navigate to={user.role === 'student' ? '/student' : '/organizer'} replace />
  }
  
  console.log('Access granted!')
  return children
}

export default ProtectedRoute