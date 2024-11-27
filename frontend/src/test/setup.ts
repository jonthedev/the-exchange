import { config } from '@vue/test-utils'
import { beforeAll, vi } from 'vitest'
import { ref } from '@/test/mocks/vue'

// Configure Vue Test Utils
beforeAll(() => {
  config.global.stubs = {
    transition: false,
    'transition-group': false
  }

  // Mock composables
  vi.mock('@/composables/useOrderBook', () => ({
    useOrderBook: () => ({
      orders: ref([]),
      markPrice: ref(0),
      error: ref(null),
      isConnected: ref(true)
    })
  }))
})
