import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-cardDark rounded-2xl shadow-lg p-6 transition-all duration-300'
  const hoverClasses = hover ? 'hover:shadow-xl transform hover:scale-105' : ''
  const clickClasses = onClick ? 'cursor-pointer' : ''
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card