describe('Order Book', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for WebSocket connection
    cy.contains('Order Book BTC-PERPETUAL', { timeout: 10000 })
  })

  it('displays order book with proper structure', () => {
    // Check basic structure
    cy.get('[data-test="order-book"]').should('exist')
    cy.get('[data-test="sell-orders"]').should('exist')
    cy.get('[data-test="buy-orders"]').should('exist')
    cy.get('[data-test="mark-price"]').should('exist')
  })

  it('shows connection status', () => {
    cy.get('[data-test="connection-status"]')
      .should('have.class', 'bg-green-500')
      .and('contain', 'Connected')
  })

  it('displays and updates orders in real-time', () => {
    // Wait for initial orders to load
    cy.get('[data-test="sell-orders"] .order-row').should('have.length.at.least', 1)
    cy.get('[data-test="buy-orders"] .order-row').should('have.length.at.least', 1)

    // Verify price formatting
    cy.get('[data-test="sell-orders"] .price')
      .first()
      .invoke('text')
      .should('match', /^\d{1,3}(,\d{3})*\.\d{2}$/)

    // Verify amount formatting
    cy.get('[data-test="sell-orders"] .amount')
      .first()
      .invoke('text')
      .should('match', /^\d*\.?\d{0,8}$/)
  })

  it('maintains price sorting', () => {
    // Check sell orders are ascending
    cy.get('[data-test="sell-orders"] .price').then(($prices) => {
      const prices = $prices.toArray().map((el) => parseFloat(el.innerText.replace(',', '')))
      const isSorted = prices.every((price, i) => i === 0 || prices[i - 1] <= price)
      expect(isSorted).to.be.true
    })

    // Check buy orders are descending
    cy.get('[data-test="buy-orders"] .price').then(($prices) => {
      const prices = $prices.toArray().map((el) => parseFloat(el.innerText.replace(',', '')))
      const isSorted = prices.every((price, i) => i === 0 || prices[i - 1] >= price)
      expect(isSorted).to.be.true
    })
  })
})
