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
  <div class="flex flex-col h-[800px] bg-gray-900" data-test="order-book">
    <!-- Connection error message -->
    <div v-if="error" class="p-2 bg-red-900/50 text-red-200 text-sm" data-test="error-message">
      Connection error
    </div>

    <!-- Disconnected message -->
    <div
      v-if="!isConnected"
      class="p-2 bg-yellow-900/50 text-yellow-200 text-sm"
      data-test="connection-status"
    >
      Reconnecting
    </div>

    <!-- Header with group size -->
    <div class="flex justify-between items-center p-2 border-b border-gray-800/50">
      <div class="text-lg">Order Book</div>
      <GroupSizeSelect
        v-model="groupSize"
        :options="[...groupSizeOptions]"
        data-test="group-size-select"
      />
    </div>

    <!-- Column headers -->
    <div class="grid grid-cols-3 px-4 py-1.5 text-sm text-gray-500 border-b border-gray-800/50">
      <div class="text-left">Price (USD)</div>
      <div class="text-right">Size (BTC)</div>
      <div class="text-right">Total (BTC)</div>
    </div>

    <!-- Sells/Asks - Fixed height with scroll -->
    <div class="h-[300px] overflow-auto scrollbar" data-test="sell-orders">
      <div class="flex flex-col-reverse">
        <!-- Reverse to show lowest sells at bottom -->
        <div
          v-for="order in sellOrders"
          :key="order.price"
          class="grid grid-cols-3 px-4 py-1 text-sm relative group order-row"
        >
          <div
            class="absolute inset-0 bg-red-900/40"
            :style="{ width: `${order.depth}%`, right: 0 }"
          ></div>
          <div class="relative text-left text-red-400 price">{{ formatPrice(order.price) }}</div>
          <div class="relative text-right text-white amount">{{ formatAmount(order.amount) }}</div>
          <div class="relative text-right text-white total">{{ formatAmount(order.total) }}</div>
        </div>
      </div>
    </div>

    <!-- Mark Price - stays fixed -->
    <div
      class="flex items-center justify-between px-4 py-1.5 border-y border-gray-800/50 bg-gray-900/50"
      data-test="mark-price"
    >
      <div class="text-red-400">↓ {{ formatPrice(markPrice || 0) }}</div>
      <div class="text-gray-400">Mark: {{ markPrice !== null ? formatPrice(markPrice) : '—' }}</div>
    </div>

    <!-- Buys/Bids - Fixed height with scroll -->
    <div class="h-[300px] overflow-auto scrollbar" data-test="buy-orders">
      <div
        v-for="order in buyOrders"
        :key="order.price"
        class="grid grid-cols-3 px-4 py-1 text-sm relative group order-row"
      >
        <div
          class="absolute inset-0 bg-green-900/40"
          :style="{ width: `${order.depth}%`, right: 0 }"
        ></div>
        <div class="relative text-left text-green-400 price">{{ formatPrice(order.price) }}</div>
        <div class="relative text-right text-white amount">{{ formatAmount(order.amount) }}</div>
        <div class="relative text-right text-white total">{{ formatAmount(order.total) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar {
  /* For Webkit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #374151; /* gray-700 */
  }

  &::-webkit-scrollbar-thumb {
    background: #9ca3af; /* gray-400 */
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #d1d5db; /* gray-300 */
  }

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #374151;
}
</style>
