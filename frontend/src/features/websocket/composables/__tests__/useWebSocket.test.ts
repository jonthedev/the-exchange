import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useWebSocket, MAX_RETRIES } from '../useWebSocket'
import type { WebSocketUpdate, OrderSide } from '@/features/order-book/types'
import { shallowMount } from '@vue/test-utils'
import type { Ref } from 'vue'

class MockWebSocket {
  url: string
  readyState: number = WebSocket.CONNECTING
  onopen: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null

  constructor(url: string) {
    this.url = url
  }

  simulateOpen() {
    this.readyState = WebSocket.OPEN
    if (this.onopen) this.onopen(new Event('open'))
  }

  simulateClose(code: number = 1000, reason: string = '') {
    this.readyState = WebSocket.CLOSED
    if (this.onclose) {
      const closeEvent = new CloseEvent('close', {
        code,
        reason,
        wasClean: code === 1000,
      })
      this.onclose(closeEvent)
    }
  }

  simulateError() {
    if (this.onerror) this.onerror(new Event('error'))
  }

  simulateMessage(data: WebSocketUpdate) {
    if (this.onmessage) {
      this.onmessage(
        new MessageEvent('message', {
          data: JSON.stringify(data),
        }),
      )
    }
  }

  close() {
    this.simulateClose()
  }
}

type WebSocketReturn = {
  isConnected: Ref<boolean>
  error: Ref<string>
  isReconnecting: Ref<boolean>
  data: Ref<WebSocketUpdate | null>
}

describe('useWebSocket', () => {
  let mockSocket: MockWebSocket
  let websocketReturn: WebSocketReturn
  const WS_URL = 'ws://localhost:8080'

  beforeEach(async () => {
    mockSocket = new MockWebSocket(WS_URL)
    global.WebSocket = vi.fn().mockImplementation(() => mockSocket) as unknown as typeof WebSocket

    vi.useFakeTimers()
    vi.clearAllTimers()

    const Component = {
      template: '<div></div>',
      setup() {
        websocketReturn = useWebSocket(WS_URL)
        return {
          isConnected: websocketReturn.isConnected,
          error: websocketReturn.error,
          isReconnecting: websocketReturn.isReconnecting,
          data: websocketReturn.data,
        }
      },
    }

    shallowMount(Component)
    await nextTick()
  })

  it('connects successfully', async () => {
    mockSocket.simulateOpen()
    await nextTick()

    expect(websocketReturn.isConnected.value).toBe(true)
    expect(websocketReturn.error.value).toBe('')
  })

  it('handles connection error', async () => {
    mockSocket.simulateError()
    await nextTick()

    expect(websocketReturn.error.value).toBe('Connection error')
    expect(websocketReturn.isConnected.value).toBe(false)
  })

  it('attempts reconnection on disconnect', async () => {
    mockSocket.simulateClose()
    await nextTick()

    expect(websocketReturn.isConnected.value).toBe(false)
    expect(websocketReturn.isReconnecting.value).toBe(true)

    // Fast-forward past reconnect timeout
    vi.advanceTimersByTime(1000)
    await nextTick()

    expect(global.WebSocket).toHaveBeenCalledTimes(2)
  })

  it('stops reconnecting after max attempts', async () => {
    mockSocket.simulateOpen()
    await nextTick()

    for (let i = 0; i < MAX_RETRIES; i++) {
      mockSocket.simulateClose()
      await nextTick()

      // Advance timer to trigger next reconnection attempt
      vi.advanceTimersByTime(1000 * (i + 1))
      await nextTick()
    }

    // One final close to trigger the max retries error
    mockSocket.simulateClose()
    await nextTick()

    expect(websocketReturn.error.value).toBe('Maximum reconnection attempts reached')
    expect(websocketReturn.isReconnecting.value).toBe(false)
  })

  it('processes received data correctly', async () => {
    mockSocket.simulateOpen()
    await nextTick()

    const testData: WebSocketUpdate = {
      existing: [{ id: '1', price: 100, amount: 1, side: 'buy' as OrderSide }],
    }
    mockSocket.simulateMessage(testData)
    await nextTick()

    expect(websocketReturn.data.value).toEqual(testData)
  })

  it('handles abnormal closure', async () => {
    mockSocket.simulateClose(1006, 'Abnormal closure')
    await nextTick()

    expect(websocketReturn.error.value).toBe('Connection error')
    expect(websocketReturn.isConnected.value).toBe(false)
    expect(websocketReturn.isReconnecting.value).toBe(true)
  })

  it('handles server error closure', async () => {
    mockSocket.simulateClose(1011, 'Server error')
    await nextTick()

    expect(websocketReturn.error.value).toBe('Server error')
    expect(websocketReturn.isConnected.value).toBe(false)
    expect(websocketReturn.isReconnecting.value).toBe(true)
  })

  it('handles normal closure', async () => {
    mockSocket.simulateClose(1000, 'Normal closure')
    await nextTick()

    expect(websocketReturn.error.value).toBe('')
    expect(websocketReturn.isConnected.value).toBe(false)
    expect(websocketReturn.isReconnecting.value).toBe(true)
  })
})
