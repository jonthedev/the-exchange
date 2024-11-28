import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Order, WebSocketUpdate, GroupSize } from '../types'

export function useOrderBook() {
  const orders = ref<Order[]>([])
  const isConnected = ref(false)
  const error = ref('')
  const groupSize = ref<GroupSize>(0.5)
  let ws: WebSocket | null = null

  const groupSizeOptions: GroupSize[] = [0.5, 1, 2.5, 5, 10, 25, 50, 100]

  const groupOrders = (orders: Order[]) => {
    const grouped = new Map<number, number>()

    orders.forEach((order) => {
      const groupedPrice = Math.floor(order.price / groupSize.value) * groupSize.value
      const currentAmount = grouped.get(groupedPrice) || 0
      grouped.set(groupedPrice, currentAmount + order.amount)
    })

    return Array.from(grouped.entries()).map(([price, amount]) => ({
      id: price.toString(),
      price,
      amount,
      side: orders[0].side,
    }))
  }

  // Update computed properties to use grouping
  const sellOrders = computed(() => {
    const filtered = orders.value.filter((o) => o.side === 'sell')
    const grouped = groupOrders(filtered)
    return grouped.sort((a, b) => a.price - b.price).slice(0, 12)
  })

  const buyOrders = computed(() => {
    const filtered = orders.value.filter((o) => o.side === 'buy')
    const grouped = groupOrders(filtered)
    return grouped.sort((a, b) => b.price - a.price).slice(0, 12)
  })

  const markPrice = computed(() => {
    const lowestSell = sellOrders.value[0]?.price
    const highestBuy = buyOrders.value[0]?.price

    if (lowestSell && highestBuy) {
      return (lowestSell + highestBuy) / 2
    }
    return null
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

  // WebSocket setup
  onMounted(() => {
    ws = new WebSocket('ws://localhost:8080')

    ws.onopen = () => {
      isConnected.value = true
    }

    ws.onmessage = (event) => {
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
  })

  onUnmounted(() => {
    ws?.close()
  })

  return {
    // State
    orders,
    isConnected,
    error,
    ws,
    groupSize,
    groupSizeOptions,

    // Computed
    sellOrders,
    buyOrders,
    markPrice,

    // Methods
    formatPrice,
    formatAmount,
  }
}
