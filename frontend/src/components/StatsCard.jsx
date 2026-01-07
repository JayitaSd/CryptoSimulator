import React from 'react'
import { formatPrice, formatVolume } from '../utils/formatter'
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaChartLine } from 'react-icons/fa'

const StatsCard = ({ marketData = [], selectedSymbol }) => {
  if (!marketData || marketData.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const getStats = () => {
    let totalMarketCap = 0
    let totalChange = 0
    let validItems = 0
    let topGainer = marketData[0]
    let topLoser = marketData[0]

    marketData.forEach(item => {
      if (!item) return
      
      const price = Number(item.price) || 0
      const volume = Number(item.volume) || 0
      const change = Number(item.change24h) || 0
      
      totalMarketCap += price * volume
      totalChange += change
      validItems++

      // Find top gainer (highest positive change)
      if (change > (topGainer?.change24h || -Infinity)) {
        topGainer = item
      }
      
      // Find top loser (lowest change, could be negative)
      if (change < (topLoser?.change24h || Infinity)) {
        topLoser = item
      }
    })

    const selectedSymbolData = marketData.find(item => 
      item && item.symbol === selectedSymbol
    )

    return {
      totalMarketCap,
      averageChange: validItems > 0 ? totalChange / validItems : 0,
      topGainer,
      topLoser,
      selectedSymbolData
    }
  }

  const stats = getStats()

  const statCards = [
    {
      title: 'Total Market Cap',
      value: formatPrice(stats.totalMarketCap || 0),
      change: `${stats.averageChange.toFixed(2)}%`,
      icon: <FaChartLine className="h-6 w-6" />,
      color: 'bg-blue-500',
      changePositive: stats.averageChange >= 0
    },
    {
      title: 'Selected Symbol',
      value: selectedSymbol || 'N/A',
      subValue: stats.selectedSymbolData ? 
        formatPrice(stats.selectedSymbolData.price || 0) : 'N/A',
      icon: <FaExchangeAlt className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: '24h Top Gainer',
      value: stats.topGainer?.symbol || 'N/A',
      subValue: stats.topGainer ? 
        `${(stats.topGainer.change24h || 0).toFixed(2)}%` : '0.00%',
      icon: <FaArrowUp className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: '24h Top Loser',
      value: stats.topLoser?.symbol || 'N/A',
      subValue: stats.topLoser ? 
        `${(stats.topLoser.change24h || 0).toFixed(2)}%` : '0.00%',
      icon: <FaArrowDown className="h-6 w-6" />,
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {card.value}
              </p>
              {card.subValue && (
                <p className="text-sm text-gray-600 mt-1">{card.subValue}</p>
              )}
              {card.change && (
                <p className={`text-sm mt-1 ${card.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change}
                </p>
              )}
            </div>
            <div className={`${card.color} p-3 rounded-full text-white`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCard