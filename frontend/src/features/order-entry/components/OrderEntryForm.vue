<script setup lang="ts">
import { ref } from 'vue'
import type { OrderSide } from '../../order-book/types'

const side = ref<OrderSide>('buy')
const price = ref<number | null>(null)
const amount = ref<number | null>(null)

const handleSubmit = () => {
  if (!price.value || !amount.value) return

  // TODO: Implement order submission
  console.log({
    side: side.value,
    price: price.value,
    amount: amount.value,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="p-4 bg-gray-900" data-test="order-entry-form">
    <!-- Buy/Sell Selection -->
    <div class="mb-4">
      <div class="flex gap-2">
        <button
          type="button"
          class="flex-1 py-2 px-4 rounded"
          :class="[
            side === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          ]"
          @click="side = 'buy'"
          data-test="buy-button"
        >
          Buy
        </button>
        <button
          type="button"
          class="flex-1 py-2 px-4 rounded"
          :class="[
            side === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          ]"
          @click="side = 'sell'"
          data-test="sell-button"
        >
          Sell
        </button>
      </div>
    </div>

    <!-- Price Input -->
    <div class="mb-4">
      <label class="block text-sm text-gray-400 mb-1">Price (USD)</label>
      <input
        v-model.number="price"
        type="number"
        step="0.01"
        min="0"
        class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
        placeholder="0.00"
        data-test="price-input"
      />
    </div>

    <!-- Amount Input -->
    <div class="mb-4">
      <label class="block text-sm text-gray-400 mb-1">Amount (BTC)</label>
      <input
        v-model.number="amount"
        type="number"
        step="0.00000001"
        min="0"
        class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
        placeholder="0.00000000"
        data-test="amount-input"
      />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full py-2 px-4 rounded font-medium"
      :class="[
        side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
        'text-white',
      ]"
      data-test="submit-button"
    >
      {{ side === 'buy' ? 'Buy' : 'Sell' }} BTC
    </button>
  </form>
</template>
