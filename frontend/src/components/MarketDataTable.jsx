import React, { useState, useEffect } from 'react'
import { formatPrice, formatVolume, formatPercentage, formatTime } from '../utils/formatter'
import { FaCaretUp, FaCaretDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const MarketDataTable = ({ marketData, loading, selectedSymbol, onSymbolSelect }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50) // Fixed at 50 items per page
  const [displayData, setDisplayData] = useState([]) // This will hold first 1000 rows
  const [sortedData, setSortedData] = useState([]) // This will hold sorted data for current sort

  // Take first 1000 rows from marketData
  useEffect(() => {
    if (marketData && marketData.length > 0) {
      // Take exactly first 1000 rows from the CSV/API response
      const first1000 = marketData.slice(0, 1000)
      setDisplayData(first1000)
      // Initially, sortedData is same as displayData
      setSortedData(first1000)
    }
  }, [marketData])

  // Calculate pagination values
  const totalItems = displayData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Get items for the current page - always show rows in their CSV order
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = displayData.slice(startIndex, endIndex)

  // Handle page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Smooth scroll to top of table when changing pages
      const tableElement = document.querySelector('.market-data-table')
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Show ellipsis and limited page numbers
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // In the middle
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  const getSymbolIcon = (symbol) => {
    const icons = {
      'btc': '🟡',
      'wbeth': '🔷', 
      'bnb': '🟡',
      'steth': '⚡',
      'ada': '🔷',
      'weeth': '🟣',
      'doge': '🐕',
      'dot': '🔴',
      'matic': '🟣',
      'shib': '🐕',
      'usdt': '🟢',
      'usds': '🟢',
      'leo': '🟠',
      'usds': '🟢',
      'leo': '🟠',
      'm': '🔵',
      'figr_heloc': '🟤',
      'cro': '🔷',
      'susde': '🟣'
    }
    return icons[symbol.toLowerCase()] || '💰'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!marketData || marketData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-700">No Market Data</h3>
          <p className="text-gray-500 mt-2">Start the simulation to see live market data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 market-data-table">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Market Watch</h2>
          
          
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{endIndex} of {displayData.length} entries
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  Symbol
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  Price
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  24h Change
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  Volume
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              if (!item) return null
              
              const isSelected = selectedSymbol === item.symbol
              const changePositive = item.change24h >= 0
              const absoluteIndex = startIndex + index + 1 // Show actual row number from CSV
              
              return (
                <tr
                  key={`${item.symbol}-${absoluteIndex}`}
                  onClick={() => onSymbolSelect(item.symbol)}
                  className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getSymbolIcon(item.symbol)}</span>
                      <div>
                        <div className="font-bold text-gray-800 uppercase">{item.symbol}</div>
                        
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{formatPrice(item.price)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center font-medium ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
                      {changePositive ? (
                        <FaCaretUp className="mr-1" />
                      ) : (
                        <FaCaretDown className="mr-1" />
                      )}
                      {formatPercentage(item.change24h)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-700">{formatVolume(item.volume)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-500">{formatTime(item.timestamp)}</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Only show if more than one page */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200">
          
          
          <div className="flex items-center space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-2 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <FaChevronLeft className="mr-1" />
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1 mx-2">
              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`min-w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>
            
            {/* Next Page Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-2 rounded-md ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Next
              <FaChevronRight className="ml-1" />
            </button>
          </div>
          
          {/* Quick Page Jump */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-sm text-gray-600">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  goToPage(page)
                }
              }}
              className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center"
            />
          </div>
        </div>
      )}
      
    
    </div>
  )
}

export default MarketDataTable