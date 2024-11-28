import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Order, WebSocketUpdate } from '../types'

export function useOrderBook() {
  const orders = ref<Order[]>([])
  const isConnected = ref(false)
  const error = ref('')
  let ws: WebSocket | null = null

  // Computed properties for sorted orders
  const sellOrders = computed(() => {
    return orders.value
      .filter((o) => o.side === 'sell')
      .sort((a, b) => a.price - b.price)
      .slice(0, 12)
  })

  const buyOrders = computed(() => {
    return orders.value
      .filter((o) => o.side === 'buy')
      .sort((a, b) => b.price - a.price)
      .slice(0, 12)
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

    // Computed
    sellOrders,
    buyOrders,
    markPrice,

    // Methods
    formatPrice,
    formatAmount,
  }
}
