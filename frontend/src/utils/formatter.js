// src/utils/formatter.js
import { format, parseISO } from 'date-fns'

export const formatPrice = (price) => {
  const numPrice = Number(price)
  if (isNaN(numPrice)) return '$0.00'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numPrice)
}

export const formatVolume = (volume) => {
  const numVolume = Number(volume)
  if (isNaN(numVolume)) return '$0.00'
  
  if (numVolume >= 1000000000) {
    return `$${(numVolume / 1000000000).toFixed(2)}B`
  }
  if (numVolume >= 1000000) {
    return `$${(numVolume / 1000000).toFixed(2)}M`
  }
  if (numVolume >= 1000) {
    return `$${(numVolume / 1000).toFixed(2)}K`
  }
  return `$${numVolume.toFixed(2)}`
}

export const formatPercentage = (percentage) => {
  const numPercentage = Number(percentage)
  if (isNaN(numPercentage)) return '+0.00%'
  
  const sign = numPercentage >= 0 ? '+' : ''
  return `${sign}${numPercentage.toFixed(2)}%`
}

// ... rest of the code

export const formatTime = (timestamp, formatStr = 'HH:mm:ss') => {
  if (!timestamp) return 'N/A'
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp)
    return format(date, formatStr)
  } catch {
    return 'Invalid Date'
  }
}

export const getChangeColor = (change) => {
  return change >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
}