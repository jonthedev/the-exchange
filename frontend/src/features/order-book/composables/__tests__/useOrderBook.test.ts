import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOrderBook } from '../useOrderBook'
import type { Order } from '../../types'

// Mock lifecycle hooks to suppress warnings
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(),
    onUnmounted: vi.fn(),
  }
})

// We don't need to mount a component to test the composable
describe('useOrderBook', () => {
  let orderBook: ReturnType<typeof useOrderBook>

  beforeEach(() => {
    // Call the composable directly
    orderBook = useOrderBook()
  })

  describe('groupOrders', () => {
    it('should correctly group orders and calculate depth', () => {
      orderBook.groupSize.value = 1

      const testOrders = [
        { id: '1', side: 'sell', price: 100, amount: 1 },
        { id: '2', side: 'sell', price: 101, amount: 2 },
        { id: '3', side: 'sell', price: 102, amount: 3 },
      ] as Order[]

      orderBook.orders.value = testOrders

      const sellOrders = orderBook.sellOrders.value
      expect(sellOrders).toHaveLength(3)
      expect(sellOrders[0]).toMatchObject({
        id: '100',
        price: 100,
        amount: 1,
        total: 1,
        depth: 100 * (1 / 6),
        side: 'sell',
      })
      expect(sellOrders[2]).toMatchObject({
        id: '102',
        price: 102,
        amount: 3,
        total: 6,
        depth: 100,
        side: 'sell',
      })
    })

    it('should respect group size when grouping orders', () => {
      orderBook.groupSize.value = 5

      const testOrders = [
        { id: '1', side: 'buy', price: 100, amount: 1 },
        { id: '2', side: 'buy', price: 102, amount: 2 },
        { id: '3', side: 'buy', price: 103, amount: 3 },
      ] as Order[]

      orderBook.orders.value = testOrders

      const buyOrders = orderBook.buyOrders.value
      expect(buyOrders).toHaveLength(1)
      expect(buyOrders[0]).toMatchObject({
        price: 100,
        amount: 6,
        total: 6,
        depth: 100,
      })
    })
  })

  describe('markPrice', () => {
    it('should calculate correct mark price', () => {
      const testOrders = [
        { id: '1', side: 'sell', price: 100, amount: 1 },
        { id: '2', side: 'buy', price: 90, amount: 1 },
      ] as Order[]

      orderBook.orders.value = testOrders

      expect(orderBook.markPrice.value).toBe(95)
    })

    it('should return null when no orders exist', () => {
      orderBook.orders.value = []
      expect(orderBook.markPrice.value).toBeNull()
    })
  })

  describe('formatting', () => {
    it('should format price correctly', () => {
      expect(orderBook.formatPrice(1234.5678)).toBe('1,234.57')
      expect(orderBook.formatPrice(1000)).toBe('1,000.00')
    })

    it('should format amount correctly', () => {
      expect(orderBook.formatAmount(1.23456789)).toBe('1.23456789')
      expect(orderBook.formatAmount(1)).toBe('1.00000000')
    })
  })
})
