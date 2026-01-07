import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { formatPrice, formatTime } from '../utils/formatter'

const MarketChart = ({ marketData, selectedSymbol, onSymbolSelect }) => {
  const [chartData, setChartData] = useState([])
  const [timeRange, setTimeRange] = useState('24h')

  // Prepare chart data for selected symbol
  useEffect(() => {
    if (marketData.length === 0) return

    // Filter data for selected symbol
    const symbolData = marketData.filter(item => 
      item && item.symbol === selectedSymbol
    )
    
    if (symbolData.length === 0) {
      // If no data for selected symbol, use first available symbol
      const firstSymbol = marketData[0]?.symbol
      if (firstSymbol) {
        onSymbolSelect(firstSymbol)
        return
      }
    }

    // Sort by timestamp and prepare chart data
    const sortedData = [...symbolData].sort((a, b) => 
      new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    )

    // Create chart data points
    const preparedData = sortedData.map((item, index) => ({
      time: formatTime(item.timestamp, 'HH:mm'),
      index: index,
      price: item.price || 0,
      volume: item.volume || 0,
      change: item.change24h || 0
    }))

    // Take last 50 points or all if less
    setChartData(preparedData.slice(-50))
  }, [marketData, selectedSymbol, onSymbolSelect])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{selectedSymbol}</p>
          <p className="text-lg font-bold text-gray-800">
            {formatPrice(payload[0].value)}
          </p>
          <p className="text-sm text-gray-500">
            Time: {label}
          </p>
          <p className={`text-sm ${payload[0].payload.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {payload[0].payload.change >= 0 ? '+' : ''}{payload[0].payload.change.toFixed(2)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedSymbol} Price Chart
          </h2>
          <p className="text-sm text-gray-600">Real-time price movements</p>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {['1h', '4h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickFormatter={formatPrice}
                domain={['dataMin', 'dataMax']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-lg mb-2">No data available for {selectedSymbol}</div>
            <p className="text-sm">Start the simulation or select a different symbol</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketChart