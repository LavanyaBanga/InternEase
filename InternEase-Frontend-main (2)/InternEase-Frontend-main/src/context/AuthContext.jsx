import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const savedUser = localStorage.getItem('internease_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    console.log('AuthContext: Logging in user:', userData) 
    setUser(userData)
    localStorage.setItem('internease_user', JSON.stringify(userData))
  }

  const logout = () => {
    console.log('AuthContext: Logging out user') 
    setUser(null)
    localStorage.removeItem('internease_user')
  }

  const signup = (userData) => {
    console.log('AuthContext: Signing up user:', userData) 
    localStorage.setItem('internease_user', JSON.stringify(userData))
  }

  const value = {
    user,
    login,
    logout,
    signup,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}