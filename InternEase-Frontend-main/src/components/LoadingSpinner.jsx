import React from 'react'

const sizeMap = {
  sm: 'w-8 h-8 border-2',
  md: 'w-12 h-12 border-[3px]',
  lg: 'w-16 h-16 border-4'
}

const LoadingSpinner = ({ size = 'lg', fullScreen = false, className = '' }) => {
  const spinnerSize = sizeMap[size] || sizeMap.lg

  const spinner = (
    <div className="relative">
      <div className={`${spinnerSize} border-gray-200 dark:border-gray-700 rounded-full animate-spin`}></div>
      <div className={`${spinnerSize} absolute top-0 left-0 border-primary border-t-transparent rounded-full animate-spin`}></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-darkBg">
        {spinner}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      {spinner}
    </div>
  )
}

export default LoadingSpinner