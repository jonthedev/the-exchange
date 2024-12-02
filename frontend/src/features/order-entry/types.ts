import type { OrderSide } from '../order-book/types'
import type { Ref, ComputedRef } from 'vue'

export interface OrderEntry {
  side: OrderSide
  price: number
  amount: number
}

export interface OrderEntryValidation {
  price: string[]
  amount: string[]
}

export interface UseOrderEntryReturn {
  side: Ref<OrderSide>
  price: Ref<number | null>
  amount: Ref<number | null>
  errors: Ref<OrderEntryValidation>
  isValid: ComputedRef<boolean>
  handleSubmit: () => void
  validateForm: () => boolean
}
