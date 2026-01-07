// src/services/websocket.js
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

class WebSocketService {
  constructor() {
    this.client = null
    this.subscriptions = new Map()
    this.callbacks = new Map()
  }

  connect(url, onConnect, onError) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('Connected to WebSocket:', frame)
        onConnect?.()
        this.subscribeToTopics()
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error)
        onError?.(error)
      }
    })

    this.client.activate()
  }

  subscribeToTopics() {
    const subscription = this.client.subscribe('/topic/market', (message) => {
      const data = JSON.parse(message.body)
      this.notifyCallbacks('market', data)
    })

    this.subscriptions.set('market', subscription)
  }

  subscribe(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set())
    }
    this.callbacks.get(event).add(callback)
    
    return () => {
      this.unsubscribe(event, callback)
    }
  }

  unsubscribe(event, callback) {
    if (this.callbacks.has(event)) {
      this.callbacks.get(event).delete(callback)
    }
  }

  notifyCallbacks(event, data) {
    if (this.callbacks.has(event)) {
      this.callbacks.get(event).forEach(callback => {
        callback(data)
      })
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach(sub => sub.unsubscribe())
      this.client.deactivate()
      this.client = null
      this.subscriptions.clear()
      this.callbacks.clear()
    }
  }
}

export default new WebSocketService()