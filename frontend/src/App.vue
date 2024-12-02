<script setup lang="ts">
import OrderEntryForm from './features/order-entry/components/OrderEntryForm.vue'
import OrderBook from './features/order-book/components/OrderBook.vue'
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Order Book</h1>
    <OrderEntryForm />
    <OrderBook />
  </div>
</template>
