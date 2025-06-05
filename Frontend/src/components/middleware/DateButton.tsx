// components/DateButton.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

interface DateButtonProps {
  date: Date | string
  linkTo?: string
  onClick?: () => void
  className?: string
}

const DateButton: React.FC<DateButtonProps> = ({ date, linkTo, onClick, className }) => {
  const navigate = useNavigate()
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  const formattedDate = format(parsedDate, 'PPP') // Pretty formatted, like May 25, 2025

  const handleClick = () => {
    if (linkTo) navigate(linkTo)
    else if (onClick) onClick()
  }

  return (
    <button onClick={handleClick} className={`text-blue-600 underline ${className}`}>
      {formattedDate}
    </button>
  )
}

export default DateButton

