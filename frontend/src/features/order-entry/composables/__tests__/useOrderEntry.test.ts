import { describe, it, expect } from 'vitest'
import { useOrderEntry } from '../useOrderEntry'

describe('useOrderEntry', () => {
  it('initializes with default values', () => {
    const { side, price, amount, errors, isValid } = useOrderEntry()

    expect(side.value).toBe('buy')
    expect(price.value).toBeNull()
    expect(amount.value).toBeNull()
    expect(errors.value).toEqual({ price: [], amount: [] })
    expect(isValid.value).toBe(false)
  })

  it('validates required fields', () => {
    const { validateForm, errors } = useOrderEntry()

    const isValid = validateForm()

    expect(isValid).toBe(false)
    expect(errors.value.price).toContain('Price is required')
    expect(errors.value.amount).toContain('Amount is required')
  })

  it('validates positive values', () => {
    const { price, amount, validateForm, errors } = useOrderEntry()

    price.value = -1
    amount.value = -1
    const isValid = validateForm()

    expect(isValid).toBe(false)
    expect(errors.value.price).toContain('Price must be greater than 0')
    expect(errors.value.amount).toContain('Amount must be greater than 0')
  })

  it('updates isValid computed property', () => {
    const { price, amount, isValid } = useOrderEntry()

    expect(isValid.value).toBe(false)

    price.value = 100
    amount.value = 1

    expect(isValid.value).toBe(true)
  })

  it('handles form submission with valid data', () => {
    const { side, price, amount, handleSubmit } = useOrderEntry()

    price.value = 100
    amount.value = 1
    side.value = 'sell'

    // TODO: Add API call expectations when implemented
    handleSubmit()
  })
})
