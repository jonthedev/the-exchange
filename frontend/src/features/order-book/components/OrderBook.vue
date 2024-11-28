<script setup lang="ts">
import { useOrderBook } from '../composables/useOrderBook'
import GroupSizeSelect from './GroupSizeSelect.vue'

const {
  isConnected,
  error,
  sellOrders,
  buyOrders,
  markPrice,
  formatPrice,
  formatAmount,
  groupSize,
  groupSizeOptions,
} = useOrderBook()
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900">
    <!-- Connection error message -->
    <div v-if="error" class="p-2 bg-red-900/50 text-red-200 text-sm">
      {{ error }}
    </div>

    <!-- Disconnected message -->
    <div v-if="!isConnected" class="p-2 bg-yellow-900/50 text-yellow-200 text-sm">
      Connecting to order book...
    </div>

    <!-- Header with group size -->
    <div class="flex justify-between items-center p-2 border-b border-gray-800/50">
      <div class="text-lg">Order Book</div>
      <GroupSizeSelect v-model="groupSize" :options="[...groupSizeOptions]" />
    </div>

    <!-- Column headers -->
    <div class="grid grid-cols-3 px-4 py-1.5 text-sm text-gray-500 border-b border-gray-800/50">
      <div class="text-left">Price (USD)</div>
      <div class="text-right">Size (BTC)</div>
      <div class="text-right">Total (BTC)</div>
    </div>

    <!-- Sells/Asks -->
    <div class="flex-1 overflow-auto">
      <div
        v-for="order in sellOrders"
        :key="order.price"
        class="grid grid-cols-3 px-4 py-1 text-sm relative group"
      >
        <div
          class="absolute inset-0 bg-red-900/40"
          :style="{ width: `${order.depth}%`, right: 0 }"
        ></div>
        <div class="relative text-left text-red-400">{{ formatPrice(order.price) }}</div>
        <div class="relative text-right text-white">{{ formatAmount(order.amount) }}</div>
        <div class="relative text-right text-white">{{ formatAmount(order.total) }}</div>
      </div>
    </div>

    <!-- Mark Price -->
    <div
      class="flex items-center justify-between px-4 py-1.5 border-y border-gray-800/50 bg-gray-900/50"
    >
      <div class="text-red-400">↓ {{ formatPrice(markPrice || 0) }}</div>
      <div class="text-gray-400">Mark: {{ markPrice !== null ? formatPrice(markPrice) : '—' }}</div>
    </div>

    <!-- Buys/Bids -->
    <div class="flex-1 overflow-auto">
      <div
        v-for="order in buyOrders"
        :key="order.price"
        class="grid grid-cols-3 px-4 py-1 text-sm relative group"
      >
        <div
          class="absolute inset-0 bg-green-900/40"
          :style="{ width: `${order.depth}%`, right: 0 }"
        ></div>
        <div class="relative text-left text-green-400">{{ formatPrice(order.price) }}</div>
        <div class="relative text-right text-white">{{ formatAmount(order.amount) }}</div>
        <div class="relative text-right text-white">{{ formatAmount(order.total) }}</div>
      </div>
    </div>
  </div>
</template>
