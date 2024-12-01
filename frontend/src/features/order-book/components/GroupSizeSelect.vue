<script setup lang="ts">
import type { GroupSize } from '../types'

interface Props {
  modelValue: GroupSize
  options: GroupSize[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: GroupSize): void
}>()

const handleChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  emit('update:modelValue', Number(select.value) as GroupSize)
}
</script>

<template>
  <div class="relative mt-auto">
    <select
      :value="modelValue"
      class="bg-gray-800 text-white px-2 py-1 rounded appearance-none cursor-pointer min-w-[100px]"
      data-test="group-size-select"
      @change="handleChange"
    >
      <option v-for="size in options" :key="size" :value="size">Group {{ size }}</option>
    </select>
  </div>
</template>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #1a1a1a;
  color: white;
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
}

/* Style for options */
select option {
  background-color: #1a1a1a;
  color: white;
  padding: 0.5rem;
}

/* Selected option style */
select option:checked {
  background-color: #1a1a1a;
  color: #3b82f6;
}
</style>
