<script setup lang="ts">
import { useOrderBook } from '../composables/useOrderBook'

const { isConnected, error, sellOrders, buyOrders, markPrice, formatPrice, formatAmount } =
  useOrderBook()
</script>

<template>
  <div class="bg-gray-900 text-gray-200 p-4">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-lg">Order Book BTC-PERPETUAL</h2>
      <div v-if="!isConnected" class="text-gray-500">Connecting...</div>
    </div>

    <!-- Headers -->
    <div class="grid grid-cols-3 text-gray-500 text-sm mb-2">
      <div>PRICE (USD)</div>
      <div class="text-right">SIZE (BTC)</div>
      <div class="text-right">TOTAL</div>
    </div>

    <!-- Sell Orders (red) -->
    <div class="space-y-px">
      <div v-for="order in sellOrders" :key="order.id" class="grid grid-cols-3 text-sm relative">
        <div class="text-red-500">{{ formatPrice(order.price) }}</div>
        <div class="text-right">{{ formatAmount(order.amount) }}</div>
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
    <div class="text-center py-2 border-y border-gray-800 my-2">
      <span class="text-gray-500">Mark: {{ markPrice ? formatPrice(markPrice) : '--' }}</span>
    </div>

    <!-- Buy Orders (green) -->
    <div class="space-y-px">
      <div v-for="order in buyOrders" :key="order.id" class="grid grid-cols-3 text-sm relative">
        <div class="text-green-500">{{ formatPrice(order.price) }}</div>
        <div class="text-right">{{ formatAmount(order.amount) }}</div>
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
