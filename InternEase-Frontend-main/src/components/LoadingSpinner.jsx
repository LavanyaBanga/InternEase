import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-darkBg">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner