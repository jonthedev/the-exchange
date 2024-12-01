import { ref, onMounted, onUnmounted } from 'vue'
import type { WebSocketUpdate } from '@/features/order-book/types'

export const MAX_RETRIES = 5

export type WebSocketFactory = (url: string) => WebSocket
const defaultWebSocketFactory: WebSocketFactory = (url: string) => new WebSocket(url)

export function useWebSocket(
  url: string,
  createWebSocket: WebSocketFactory = defaultWebSocketFactory,
) {
  const data = ref<WebSocketUpdate | null>(null)
  const isConnected = ref(false)
  const error = ref<string>('')
  const isReconnecting = ref(false)
  let ws: WebSocket | null = null
  let reconnectTimeout: NodeJS.Timeout | null = null
  let retryCount = 0
  let isPaused = false

  const connect = () => {
    if (isPaused || retryCount >= MAX_RETRIES) {
      return
    }

    if (retryCount < MAX_RETRIES) {
      error.value = ''
    }

    try {
      ws = createWebSocket(url)

      ws.onopen = () => {
        isConnected.value = true
        isReconnecting.value = false
        error.value = ''
        retryCount = 0
      }

      ws.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data)
          data.value = parsed
        } catch (err) {
          error.value = 'Invalid message data'
        }
      }

      ws.onclose = (event: CloseEvent) => {
        isConnected.value = false
        retryCount++

        if (retryCount >= MAX_RETRIES) {
          error.value = 'Maximum reconnection attempts reached'
          isReconnecting.value = false
          return
        }

        switch (event.code) {
          case 1000: // Normal closure
            break
          case 1006: // Abnormal closure
            error.value = 'Connection error'
            break
          case 1011: // Server error
            error.value = 'Server error'
            break
          default:
            error.value = `Connection closed (${event.code})`
        }

        isReconnecting.value = true
        attemptReconnect()
      }

      ws.onerror = () => {
        isConnected.value = false
        error.value = 'Connection error'
      }
    } catch (err) {
      error.value = 'Failed to establish connection'
      attemptReconnect()
    }
  }

  const attemptReconnect = () => {
    if (retryCount >= MAX_RETRIES) {
      error.value = 'Maximum reconnection attempts reached'
      isReconnecting.value = false
      return
    }

    isReconnecting.value = true

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
    }

    reconnectTimeout = setTimeout(() => {
      connect()
    }, 1000 * retryCount) as unknown as NodeJS.Timeout
  }

  const pause = () => {
    isPaused = true
    if (ws) {
      isConnected.value = false
      error.value = 'Connection error'
      ws.close(1006) // Abnormal closure
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
    }
  }

  const resume = () => {
    isPaused = false
    connect()
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
    }
    ws?.close()
    ws = null
  })

  return {
    data,
    isConnected,
    isReconnecting,
    error,
    pause,
    resume,
  }
}
