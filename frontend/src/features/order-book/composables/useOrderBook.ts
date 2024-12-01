import { ref, watch, computed } from 'vue'
import { useWebSocket } from '../../../features/websocket/composables/useWebSocket'
import type { Order, GroupSize, GroupedOrder } from '../types'

export function useOrderBook() {
  const orders = ref<Order[]>([])
  const groupSize = ref<GroupSize>(1)
  const groupSizeOptions = [1, 5, 10, 50, 100] as const

  const { data, isConnected, error } = useWebSocket('ws://localhost:8080')

  watch(data, (newData) => {
    if (!newData) return

    if (newData.existing) {
      orders.value = newData.existing
    }
    if (newData.insert) {
      orders.value = [...orders.value, ...newData.insert]
    }
    if (newData.delete) {
      orders.value = orders.value.filter((order) => !newData.delete?.includes(order.id))
    }
  })

  const groupOrders = (orders: Order[], side: 'buy' | 'sell'): GroupedOrder[] => {
    const filtered = orders.filter((order) => order.side === side)
    const grouped = filtered.reduce<Record<number, GroupedOrder>>((acc, order) => {
      const groupedPrice = Math.floor(order.price / groupSize.value) * groupSize.value

      if (!acc[groupedPrice]) {
        acc[groupedPrice] = {
          id: groupedPrice.toString(),
          side,
          price: groupedPrice,
          amount: 0,
          total: 0,
          depth: 0,
        }
      }

      acc[groupedPrice].amount += order.amount
      return acc
    }, {})

    const result = Object.values(grouped)
    let runningTotal = 0
    const sorted = result.sort((a, b) => (side === 'sell' ? a.price - b.price : b.price - a.price))

    sorted.forEach((order) => {
      runningTotal += order.amount
      order.total = runningTotal
    })

    const maxTotal = Math.max(...sorted.map((order) => order.total))
    sorted.forEach((order) => {
      order.depth = (order.total / maxTotal) * 100
    })

    return sorted
  }

  const buyOrders = computed(() => groupOrders(orders.value, 'buy'))
  const sellOrders = computed(() => groupOrders(orders.value, 'sell'))

  const markPrice = computed(() => {
    const highestBuy = buyOrders.value[0]?.price || 0
    const lowestSell = sellOrders.value[0]?.price || 0
    return highestBuy && lowestSell ? (highestBuy + lowestSell) / 2 : null
  })

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    })
  }

  return {
    orders,
    isConnected,
    error,
    groupSize,
    groupSizeOptions,
    sellOrders,
    buyOrders,
    markPrice,
    formatPrice,
    formatAmount,
  }
}
