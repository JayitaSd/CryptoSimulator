import React, { useState, useEffect, useRef } from 'react'
import MarketDataTable from './components/MarketDataTable'
import MarketChart from './components/MarketChart'
import ControlPanel from './components/ControlPanel'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import { useWebSocket } from './hooks/useWebSocket'
import './App.css'

function App() {
  const [marketData, setMarketData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  
  const hasLoadedRef = useRef(false)
  
  const WS_URL = 'http://localhost:8080/ws/market'
  const { connected, latestData } = useWebSocket(WS_URL)

  // Initialize with static data
  useEffect(() => {
    if (!hasLoadedRef.current) {
      fetchMarketData()
      hasLoadedRef.current = true
    }
  }, [])

  // Update market data when new WebSocket data arrives
  useEffect(() => {
    if (latestData) {
      console.log('WebSocket update:', latestData.symbol, latestData.price)
      setMarketData(prev => {
        const index = prev.findIndex(item => item.symbol === latestData.symbol)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = latestData
          return updated
        }
        return [...prev, latestData]
      })
    }
  }, [latestData])

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/simulation/market-data')
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()
      console.log('Loaded', data.length, 'items')
      setMarketData(data || [])
    } catch (error) {
      console.error('Error:', error)
      setMarketData([])
    } finally {
      setLoading(false)
    }
  }

  const handleStartStream = async () => {
    try {
      const response = await fetch('/api/simulation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        setIsStreaming(true)
        console.log('Stream started successfully')
      } else {
        console.error('Failed to start stream:', response.status)
      }
    } catch (error) {
      console.error('Error starting stream:', error)
    }
  }

  const handleStopStream = async () => {
    try {
      const response = await fetch('/api/simulation/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        setIsStreaming(false)
        console.log('Stream stopped successfully')
      }
    } catch (error) {
      console.error('Error stopping stream:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        connected={connected} 
        isStreaming={isStreaming}
        totalSymbols={marketData.length}
      />
      
      <div className="container mx-auto px-4 py-8">
        <ControlPanel
          isStreaming={isStreaming}
          onStartStream={handleStartStream}
          onStopStream={handleStopStream}
          onRefresh={fetchMarketData}
        />
        
        <StatsCard 
          marketData={marketData.slice(0, 100)} // Show top 100 for stats
          selectedSymbol={selectedSymbol}
        />
        
        <div className="mt-8">
          <div className="mb-8">
            <MarketChart
              marketData={marketData}
              selectedSymbol={selectedSymbol}
              onSymbolSelect={setSelectedSymbol}
            />
          </div>
          
          <div>
            <MarketDataTable
              marketData={marketData}
              loading={loading}
              selectedSymbol={selectedSymbol}
              onSymbolSelect={setSelectedSymbol}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App