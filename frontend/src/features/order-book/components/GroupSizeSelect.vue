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
  <select
    :value="modelValue"
    class="bg-gray-800 text-white px-2 py-1 rounded"
    data-test="group-size-select"
    @change="handleChange"
  >
    <option v-for="size in options" :key="size" :value="size">Group {{ size }}</option>
  </select>
</template>
