export type OrderSide = 'buy' | 'sell'

export type Order = {
  id: number
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
  delete?: number[]
}
