import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import type { OrderSide } from '../../../order-book/types'
import OrderEntryForm from '../OrderEntryForm.vue'
import { useOrderEntry } from '../../composables/useOrderEntry'

vi.mock('../../composables/useOrderEntry', () => ({
  useOrderEntry: vi.fn(),
}))

describe('OrderEntryForm', () => {
  beforeEach(() => {
    // Default mock implementation for all tests
    vi.mocked(useOrderEntry).mockImplementation(() => ({
      side: ref<OrderSide>('buy'),
      price: ref<number | null>(null),
      amount: ref<number | null>(null),
      errors: ref({ price: [], amount: [] }),
      isValid: computed(() => false),
      handleSubmit: vi.fn(),
      validateForm: vi.fn(),
    }))
  })

  it('renders form elements', () => {
    const wrapper = mount(OrderEntryForm)

    expect(wrapper.find('[data-test="order-entry-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="buy-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="sell-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="price-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="amount-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="submit-button"]').exists()).toBe(true)
  })

  it('toggles between buy and sell', async () => {
    const wrapper = mount(OrderEntryForm)

    await wrapper.find('[data-test="sell-button"]').trigger('click')
    expect(wrapper.find('[data-test="sell-button"]').classes()).toContain('bg-red-600')

    await wrapper.find('[data-test="buy-button"]').trigger('click')
    expect(wrapper.find('[data-test="buy-button"]').classes()).toContain('bg-green-600')
  })

  it('displays validation errors', () => {
    vi.mocked(useOrderEntry).mockImplementation(() => ({
      side: ref<OrderSide>('buy'),
      price: ref<number | null>(null),
      amount: ref<number | null>(null),
      errors: ref({ price: ['Price is required'], amount: [] }),
      isValid: computed(() => false),
      handleSubmit: vi.fn(),
      validateForm: vi.fn(),
    }))

    const wrapper = mount(OrderEntryForm)
    expect(wrapper.find('[data-test="price-error"]').text()).toBe('Price is required')
  })

  it('disables submit button when form is invalid', () => {
    const wrapper = mount(OrderEntryForm)

    expect(wrapper.find('[data-test="submit-button"]').attributes('disabled')).toBeDefined()
  })

  it('submits form with valid data', async () => {
    const handleSubmit = vi.fn()
    vi.mocked(useOrderEntry).mockImplementation(() => ({
      side: ref<OrderSide>('buy'),
      price: ref<number | null>(100),
      amount: ref<number | null>(1),
      errors: ref({ price: [], amount: [] }),
      isValid: computed(() => true),
      handleSubmit,
      validateForm: vi.fn(),
    }))

    const wrapper = mount(OrderEntryForm)
    await wrapper.find('form').trigger('submit')
    expect(handleSubmit).toHaveBeenCalled()
  })
})
