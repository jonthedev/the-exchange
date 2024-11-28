import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OrderBook from '../OrderBook.vue'

// Mock the composable
vi.mock('../../composables/useOrderBook', () => ({
  useOrderBook: () => ({
    isConnected: true,
    error: '',
    sellOrders: [
      { id: 1, side: 'sell', price: 20100, amount: 1.5 },
      { id: 2, side: 'sell', price: 20200, amount: 1 },
    ],
    buyOrders: [
      { id: 3, side: 'buy', price: 20000, amount: 2 },
      { id: 4, side: 'buy', price: 19900, amount: 1 },
    ],
    markPrice: 20050,
    formatPrice: (price: number) => price.toFixed(2),
    formatAmount: (amount: number) => amount.toFixed(8),
  }),
}))

describe('OrderBook', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(OrderBook)
  })

  it('renders the component title', () => {
    expect(wrapper.text()).toContain('Order Book BTC-PERPETUAL')
  })

  it('displays sell orders correctly', () => {
    const sellOrders = wrapper.findAll('.text-red-500')
    expect(sellOrders).toHaveLength(2)
    expect(sellOrders[0].text()).toBe('20100.00')
  })

  it('displays buy orders correctly', () => {
    const buyOrders = wrapper.findAll('.text-green-500')
    expect(buyOrders).toHaveLength(2)
    expect(buyOrders[0].text()).toBe('20000.00')
  })

  it('shows mark price', () => {
    expect(wrapper.text()).toContain('Mark: 20050.00')
  })
})
