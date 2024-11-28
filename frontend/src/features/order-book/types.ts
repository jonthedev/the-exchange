export type OrderSide = 'buy' | 'sell'

export type Order = {
  id: string
  side: OrderSide
  price: number
  amount: number
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

export type GroupSize = 0.5 | 1 | 2.5 | 5 | 10 | 25 | 50 | 100
