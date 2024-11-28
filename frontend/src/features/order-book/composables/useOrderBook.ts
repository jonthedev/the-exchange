import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Order, WebSocketUpdate, GroupSize, OrderSide } from '../types'

export function useOrderBook() {
  const orders = ref<Order[]>([])
  const isConnected = ref(false)
  const error = ref<string>('')
  const groupSize = ref<GroupSize>(1)
  let ws: WebSocket | null = null

  const groupSizeOptions = [1, 5, 10, 50, 100] as const

  const groupOrders = (orderList: Order[], side: OrderSide) => {
    if (!orderList.length) return []

    const grouped = new Map<number, number>()

    orderList.forEach((order) => {
      const groupedPrice = Math.floor(order.price / groupSize.value) * groupSize.value
      const currentAmount = grouped.get(groupedPrice) || 0
      grouped.set(groupedPrice, currentAmount + order.amount)
    })

    const entries = Array.from(grouped.entries())
      .map(([price, amount]) => ({
        id: price.toString(),
        price,
        amount,
        side,
        total: 0,
        depth: 0,
      }))
      .sort((a, b) => (side === 'sell' ? a.price - b.price : b.price - a.price))

    let runningTotal = 0
    const maxTotal = entries[entries.length - 1]?.amount || 0
    entries.forEach((entry) => {
      runningTotal += entry.amount
      entry.total = runningTotal
      entry.depth = (entry.total / runningTotal) * 100
    })

    return entries
  }

  const sellOrders = computed(() => {
    const filtered = orders.value.filter((o) => o.side === 'sell')
    return groupOrders(filtered, 'sell').slice(0, 12)
  })

  const buyOrders = computed(() => {
    const filtered = orders.value.filter((o) => o.side === 'buy')
    return groupOrders(filtered, 'buy').slice(0, 12)
  })

  const markPrice = computed((): number | null => {
    const lowestSell = sellOrders.value[0]?.price
    const highestBuy = buyOrders.value[0]?.price

    if (lowestSell && highestBuy) {
      return (lowestSell + highestBuy) / 2
    }
    return null
  })

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    })
  }

  onMounted(() => {
    try {
      ws = new WebSocket('ws://localhost:8080')

      ws.onopen = () => {
        isConnected.value = true
        error.value = ''
      }

      ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data) as WebSocketUpdate

        if (data.existing) {
          orders.value = data.existing
        }
        if (data.insert) {
          orders.value = [...orders.value, ...data.insert]
        }
        if (data.delete) {
          orders.value = orders.value.filter((order) => !data.delete?.includes(order.id))
        }
      }

      ws.onclose = () => {
        isConnected.value = false
      }

      ws.onerror = () => {
        error.value = 'Connection error'
      }
    } catch (err) {
      error.value = 'Failed to establish connection'
    }
  })

  onUnmounted(() => {
    ws?.close()
    ws = null
  })

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
