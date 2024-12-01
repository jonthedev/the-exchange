import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OrderBook from '../OrderBook.vue'
import type { GroupedOrder } from '../../types'
import { ref } from 'vue'

// Mock the composable with proper types and reactive refs
vi.mock('../../composables/useOrderBook', () => ({
  useOrderBook: () => ({
    isConnected: ref(true),
    error: ref(''),
    sellOrders: ref<GroupedOrder[]>([
      { id: '1', side: 'sell', price: 20100, amount: 1.5, total: 1.5, depth: 60 },
      { id: '2', side: 'sell', price: 20200, amount: 1, total: 2.5, depth: 100 },
    ]),
    buyOrders: ref<GroupedOrder[]>([
      { id: '3', side: 'buy', price: 20000, amount: 2, total: 2, depth: 66.7 },
      { id: '4', side: 'buy', price: 19900, amount: 1, total: 3, depth: 100 },
    ]),
    markPrice: ref(20050),
    formatPrice: (price: number) =>
      price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    formatAmount: (amount: number) =>
      amount.toLocaleString('en-US', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      }),
    groupSize: ref(0.5),
    groupSizeOptions: [0.5, 1, 2.5, 5, 10, 25, 50, 100],
  }),
}))

describe('OrderBook', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(OrderBook)
  })

  it('renders the component title', () => {
    expect(wrapper.text()).toContain('Order Book')
  })

  it('displays sell orders correctly', () => {
    const sellOrderRows = wrapper.findAll('.flex-1 .text-red-400')
    expect(sellOrderRows).toHaveLength(2)

    const sellPrices = sellOrderRows.map((el) => el.text())
    expect(sellPrices).toEqual(['20,100.00', '20,200.00'])
  })

  it('displays buy orders correctly', () => {
    const buyOrders = wrapper.findAll('.text-green-400')
    expect(buyOrders).toHaveLength(2)
    expect(buyOrders[0].text()).toBe('20,000.00')
  })

  it('shows mark price', () => {
    expect(wrapper.text()).toContain('Mark: 20,050.00')
  })
})
