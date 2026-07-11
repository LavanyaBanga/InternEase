import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 transition-shadow duration-200'
  const hoverClasses = hover ? 'hover:shadow-md' : ''
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