import { ref, computed } from 'vue'
import type { OrderSide } from '../../order-book/types'
import type { OrderEntry, OrderEntryValidation, UseOrderEntryReturn } from '../types'

export function useOrderEntry(): UseOrderEntryReturn {
  const side = ref<OrderSide>('buy')
  const price = ref<number | null>(null)
  const amount = ref<number | null>(null)
  const errors = ref<OrderEntryValidation>({ price: [], amount: [] })

  const validateForm = () => {
    errors.value = { price: [], amount: [] }
    let isValid = true

    // Price validation
    if (!price.value) {
      errors.value.price.push('Price is required')
      isValid = false
    } else if (price.value <= 0) {
      errors.value.price.push('Price must be greater than 0')
      isValid = false
    }

    // Amount validation
    if (!amount.value && amount.value !== 0) {
      errors.value.amount.push('Amount is required')
      isValid = false
    } else if (amount.value <= 0) {
      errors.value.amount.push('Amount must be greater than 0')
      isValid = false
    }

    return isValid
  }

  const isValid = computed(() => {
    return price.value != null && price.value > 0 && amount.value != null && amount.value > 0
  })

  const handleSubmit = () => {
    if (!validateForm()) return

    const order: OrderEntry = {
      side: side.value,
      price: price.value!,
      amount: amount.value!,
    }

    // TODO: Submit order to backend
    console.log('Submitting order:', order)
  }

  return {
    side,
    price,
    amount,
    errors,
    isValid,
    handleSubmit,
    validateForm,
  }
}
