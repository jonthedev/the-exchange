export type OrderSide = 'buy' | 'sell'

export type Order = {
  id: string
  side: OrderSide
  price: number
  amount: number
}

export type GroupedOrder = {
  id: string
  side: OrderSide
  price: number
  amount: number
  total: number
  depth: number
}

export type NewOrder = Omit<Order, 'id'>

export type OrderResponse = {
  result: 'inserted' | 'executed'
  order?: Order
}

export type WebSocketUpdate = {
  existing?: Order[]
  insert?: Order[]
  delete?: string[]
}

export type GroupSize = 1 | 5 | 10 | 50 | 100
