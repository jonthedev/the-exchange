/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    object, // props
    object, // data/computed
    unknown // methods
  >
  export default component
}
