import React from 'react'
import { FaPlay, FaStop, FaSync, FaStream } from 'react-icons/fa'

const ControlPanel = ({ isStreaming, onStartStream, onStopStream, onRefresh }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FaStream className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Stream Controls</h2>
            <p className="text-sm text-gray-600">
              {isStreaming ? 'Real-time data streaming active' : 'Simulation paused'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            className="flex items-center px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <FaSync className="mr-2" />
            Refresh Data
          </button>
          
          {!isStreaming ? (
            <button
              onClick={onStartStream}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <FaPlay className="mr-2" />
              Start Stream
            </button>
          ) : (
            <button
              onClick={onStopStream}
              className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <FaStop className="mr-2" />
              Stop Stream
            </button>
          )}
        </div>
      </div>
      
      {isStreaming && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium text-green-700">
              Live data streaming in real-time
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel