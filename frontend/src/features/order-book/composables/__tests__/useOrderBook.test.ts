import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useOrderBook } from '../useOrderBook'
import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import type { Order } from '../../types'

// Mock WebSocket
class WebSocketMock implements WebSocket {
  onopen: ((ev: Event) => void) | null = null
  onmessage: ((ev: MessageEvent) => void) | null = null
  onclose: ((ev: CloseEvent) => void) | null = null
  onerror: ((ev: Event) => void) | null = null
  sentMessages: string[] = []
  close = vi.fn()
  readyState = WebSocket.OPEN
  binaryType: BinaryType = 'blob'
  bufferedAmount = 0
  extensions = ''
  protocol = ''
  url = ''
  CLOSED = WebSocket.CLOSED
  CLOSING = WebSocket.CLOSING
  CONNECTING = WebSocket.CONNECTING
  OPEN = WebSocket.OPEN

  constructor(url: string) {
    this.url = url
    setTimeout(() => this.onopen?.(new Event('open')), 0)
  }

  send(message: string): void {
    this.sentMessages.push(message)
  }

  simulateMessage(data: unknown): void {
    this.onmessage?.(
      new MessageEvent('message', {
        data: JSON.stringify(data),
      }),
    )
  }

  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean {
    return true
  }
}

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
  let wrapper: VueWrapper
  let mockWs: WebSocketMock

  beforeEach(async () => {
    mockWs = new WebSocketMock('ws://localhost:8080')
    vi.stubGlobal(
      'WebSocket',
      vi.fn().mockImplementation(() => mockWs),
    )
    wrapper = mount(TestComponent)
    await nextTick()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    wrapper.unmount()
  })

  it('should group orders by price according to groupSize', async () => {
    const mockOrders: Order[] = [
      { id: '1', side: 'sell', price: 20100, amount: 1 },
      { id: '2', side: 'sell', price: 20150, amount: 2 },
      { id: '3', side: 'sell', price: 20180, amount: 1.5 },
    ]

    mockWs.simulateMessage({ existing: mockOrders })
    await nextTick()

    const vm = wrapper.vm as unknown as { sellOrders: Order[]; groupSize: number }

    expect(vm.sellOrders).toHaveLength(3)

    vm.groupSize = 100
    await nextTick()

    expect(vm.sellOrders).toHaveLength(1)
    expect(vm.sellOrders[0]).toEqual({
      id: '20100',
      side: 'sell',
      price: 20100,
      amount: 4.5,
    })
  })
})
