// src/services/api.js
export const API_BASE_URL = '/api'

export const marketAPI = {
  getMarketData: async () => {
    const response = await fetch(`${API_BASE_URL}/market-data`)
    return response.json()
  },
  
  startSimulation: async () => {
    const response = await fetch(`${API_BASE_URL}/simulation/start`, {
      method: 'POST'
    })
    return response.json()
  },
  
  stopSimulation: async () => {
    const response = await fetch(`${API_BASE_URL}/simulation/stop`, {
      method: 'POST'
    })
    return response.json()
  }
}