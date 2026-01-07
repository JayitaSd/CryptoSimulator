// src/components/Header.jsx
import React from 'react'
import { WiDaySunny, WiCloudy } from 'react-icons/wi'
import { FaBitcoin } from 'react-icons/fa'

const Header = ({ connected, isStreaming, totalSymbols }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBitcoin className="h-8 w-8 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CryptoSimulator</h1>
              <p className="text-sm text-gray-600">Real-time cryptocurrency data streaming</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm">{connected ? 'WebSocket Connected' : 'Disconnected'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isStreaming ? (
                <WiDaySunny className="h-6 w-6 text-green-500 animate-pulse" />
              ) : (
                <WiCloudy className="h-6 w-6 text-gray-400" />
              )}
              <span className="text-sm">{isStreaming ? 'Streaming Active' : 'Streaming Paused'}</span>
            </div>
            
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                {totalSymbols} Symbols
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header