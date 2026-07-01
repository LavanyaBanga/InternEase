import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon, 
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
   
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-cardDark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">iE</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              internEase
            </span>
          </Link>

          {/* Desktop Navigation */}
         

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <BellIcon className="h-6 w-6" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserCircleIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-cardDark rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfile(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/gamification"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfile(false)}
                      >
                        Gamification
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary !py-1.5 !px-3 sm:!py-2 sm:!px-4 text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => {
                if (setSidebarOpen && !['/login', '/signup'].includes(location.pathname)) {
                  setSidebarOpen(!sidebarOpen)
                } else {
                  setIsOpen(!isOpen)
                }
              }}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {(setSidebarOpen && !['/login', '/signup'].includes(location.pathname) ? sidebarOpen : isOpen) ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-cardDark border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar