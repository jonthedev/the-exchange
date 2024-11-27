<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Order } from '../types'

const orders = ref<Order[]>([])
const isConnected = ref(false)
const error = ref('')

let ws: WebSocket | null = null

onMounted(() => {
  ws = new WebSocket('ws://localhost:8080')

  ws.onopen = () => {
    isConnected.value = true
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.existing) {
      orders.value = data.existing
    }
    if (data.insert) {
      orders.value = [...orders.value, ...data.insert]
    }
    if (data.delete) {
      orders.value = orders.value.filter((order) => !data.delete.includes(order.id))
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
</script>

<template>
  <div class="p-4">
    <div v-if="!isConnected" class="text-gray-600">Connecting to order book...</div>

    <div v-else class="grid grid-cols-2 gap-4">
      <div>
        <h3 class="font-bold mb-2">Buy Orders</h3>
        <div class="space-y-1">
          <div
            v-for="order in orders.filter((o) => o.side === 'buy')"
            :key="order.id"
            class="grid grid-cols-2 gap-2"
          >
            <span class="text-green-500">${{ order.price }}</span>
            <span>{{ order.amount }}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 class="font-bold mb-2">Sell Orders</h3>
        <div class="space-y-1">
          <div
            v-for="order in orders.filter((o) => o.side === 'sell')"
            :key="order.id"
            class="grid grid-cols-2 gap-2"
          >
            <span class="text-red-500">${{ order.price }}</span>
            <span>{{ order.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-500 mt-4">
      {{ error }}
    </div>
  </div>
</template>
