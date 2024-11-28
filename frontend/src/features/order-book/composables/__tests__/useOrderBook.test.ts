import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useOrderBook } from '../useOrderBook'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import type { Order } from '../../types'

// Mock WebSocket
class WebSocketMock {
  onopen: ((ev?: any) => void) | null = null
  onmessage: ((ev?: MessageEvent) => void) | null = null
  onclose: ((ev?: CloseEvent) => void) | null = null
  onerror: ((ev?: Event) => void) | null = null
  sentMessages: string[] = []
  close = vi.fn()
  readyState = 1 // OPEN

  constructor(url: string) {
    setTimeout(() => this.onopen?.(), 0)
  }

  send(message: string) {
    this.sentMessages.push(message)
  }

  simulateMessage(data: any) {
    this.onmessage?.(
      new MessageEvent('message', {
        data: JSON.stringify(data),
      }),
    )
  }
}

// Create a wrapper component to test composable
const TestComponent = defineComponent({
  setup() {
    const orderBook = useOrderBook()
    return {
      ...orderBook,
      wsInstance: orderBook.ws,
    }
  },
  template: '<div></div>',
})

describe('useOrderBook', () => {
  let wrapper: any
  let mockWs: WebSocketMock

  beforeEach(async () => {
    // Create WebSocket mock before mounting
    mockWs = new WebSocketMock('ws://localhost:8080')
    vi.stubGlobal(
      'WebSocket',
      vi.fn().mockImplementation(() => mockWs),
    )

    // Mount component
    wrapper = mount(TestComponent)

    // Wait for onMounted to complete
    await nextTick()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    wrapper?.unmount()
  })

  it('should sort and limit sell orders correctly', async () => {
    const mockOrders: Order[] = [
      { id: 1, side: 'sell', price: 20300, amount: 1 },
      { id: 2, side: 'sell', price: 20100, amount: 1 },
      { id: 3, side: 'sell', price: 20200, amount: 1 },
    ]

    mockWs.simulateMessage({ existing: mockOrders })
    await nextTick()

    expect(wrapper.vm.sellOrders.map((o: Order) => o.price)).toEqual([20100, 20200, 20300])
  })

  it('should handle WebSocket connection states', async () => {
    await nextTick()

    mockWs.onopen?.()
    await nextTick()
    expect(wrapper.vm.isConnected).toBe(true)

    mockWs.onclose?.()
    expect(wrapper.vm.isConnected).toBe(false)

    mockWs.onerror?.()
    expect(wrapper.vm.error).toBe('Connection error')
  })

  it('should calculate mark price from best bid/ask', async () => {
    const mockOrders: Order[] = [
      { id: 1, side: 'sell', price: 20100, amount: 1 },
      { id: 2, side: 'buy', price: 20000, amount: 1 },
    ]

    mockWs.simulateMessage({ existing: mockOrders })

    await nextTick()
    expect(wrapper.vm.markPrice).toBe(20050)
  })

  it('should format price and amount correctly', () => {
    expect(wrapper.vm.formatPrice(1234.5678)).toBe('1,234.57')
    expect(wrapper.vm.formatAmount(1.23456789)).toBe('1.23456789')
  })
})
