import type { Component } from 'vue'

// Create a proper Symbol for Vue refs
export const RefSymbol = Symbol.for('v-ref')

// Create proper types
export interface Ref<T> {
  value: T
  [RefSymbol]: true
}

// Create ref with proper symbol
export const ref = <T>(value: T): Ref<T> => ({
  value,
  [RefSymbol]: true,
})

// Create computed with proper symbol
export const computed = <T>(getter: () => T): Ref<T> => ({
  value: getter(),
  [RefSymbol]: true,
})

// Other Vue exports
export const onMounted = (fn: () => void) => fn()
export const onUnmounted = (fn: () => void) => fn()
export const defineComponent = <T extends Component>(component: T): T => component
