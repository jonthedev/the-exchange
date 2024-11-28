<script setup lang="ts">
import { useOrderBook } from '../composables/useOrderBook'

const { isConnected, error, sellOrders, buyOrders, markPrice, formatPrice, formatAmount } =
  useOrderBook()
</script>

<template>
  <div class="bg-gray-900 text-gray-200 p-4" data-test="order-book">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-lg">Order Book BTC-PERPETUAL</h2>
      <div
        v-if="isConnected"
        data-test="connection-status"
        class="bg-green-500 text-white px-2 py-1 rounded"
      >
        Connected
      </div>
      <div v-else class="text-gray-500">Connecting...</div>
    </div>

    <!-- Headers -->
    <div class="grid grid-cols-3 text-gray-500 text-sm mb-2">
      <div>PRICE (USD)</div>
      <div class="text-right">SIZE (BTC)</div>
      <div class="text-right">TOTAL</div>
    </div>

    <!-- Sell Orders (red) -->
    <div class="space-y-px" data-test="sell-orders">
      <div
        v-for="order in sellOrders"
        :key="order.id"
        class="grid grid-cols-3 text-sm relative order-row"
      >
        <div class="text-red-500 price">{{ formatPrice(order.price) }}</div>
        <div class="text-right amount">{{ formatAmount(order.amount) }}</div>
        <div class="text-right">{{ formatAmount(order.amount) }}</div>
        <div
          class="absolute inset-0 bg-red-900/20"
          :style="{
            width: `${(order.amount / Math.max(...sellOrders.map((o) => o.amount))) * 100}%`,
          }"
        />
      </div>
    </div>

    <!-- Mark Price -->
    <div class="text-center py-2 border-y border-gray-800 my-2" data-test="mark-price">
      <span class="text-gray-500">Mark: {{ markPrice ? formatPrice(markPrice) : '--' }}</span>
    </div>

    <!-- Buy Orders (green) -->
    <div class="space-y-px" data-test="buy-orders">
      <div
        v-for="order in buyOrders"
        :key="order.id"
        class="grid grid-cols-3 text-sm relative order-row"
      >
        <div class="text-green-500 price">{{ formatPrice(order.price) }}</div>
        <div class="text-right amount">{{ formatAmount(order.amount) }}</div>
        <div class="text-right">{{ formatAmount(order.amount) }}</div>
        <div
          class="absolute inset-0 bg-green-900/20"
          :style="{
            width: `${(order.amount / Math.max(...buyOrders.map((o) => o.amount))) * 100}%`,
          }"
        />
      </div>
    </div>

    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>
