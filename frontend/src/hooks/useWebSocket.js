import { useState, useEffect, useCallback } from 'react'
import websocketService from '../services/websocket'

export const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false)
  const [latestData, setLatestData] = useState(null)

  const handleNewData = useCallback((data) => {
    console.log('WebSocket data received:', data)
    setLatestData(data)
  }, [])

  useEffect(() => {
    console.log('Initializing WebSocket connection to:', url)
    
    websocketService.connect(
      url,
      () => {
        console.log('WebSocket connected')
        setConnected(true)
      },
      (error) => {
        console.error('WebSocket connection error:', error)
        setConnected(false)
      }
    )

    const unsubscribe = websocketService.subscribe('market', handleNewData)

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection')
      unsubscribe()
      websocketService.disconnect()
    }
  }, [url, handleNewData])

  return { connected, latestData }
}