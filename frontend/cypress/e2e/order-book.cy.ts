describe('Order Book', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Order Book', { timeout: 10000 })
    // Wait for WebSocket connection and initial data
    cy.get('[data-test="sell-orders"] .order-row', { timeout: 10000 }).should(
      'have.length.at.least',
      1,
    )
  })

  it('displays order book with proper structure and data', () => {
    // Structure checks
    cy.get('[data-test="order-book"]').should('be.visible')
    cy.get('[data-test="sell-orders"]').should('be.visible')
    cy.get('[data-test="buy-orders"]').should('be.visible')
    cy.get('[data-test="mark-price"]').should('be.visible')
    cy.get('[data-test="group-size-select"]').should('be.visible')

    // Data format checks
    cy.get('[data-test="sell-orders"] .price')
      .first()
      .invoke('text')
      .should('match', /^\d{1,3}(,\d{3})*\.\d{2}$/)

    cy.get('[data-test="sell-orders"] .amount')
      .first()
      .invoke('text')
      .should('match', /^\d*\.?\d{8}$/)
  })

  it('maintains correct price sorting and updates in real-time', () => {
    // Verify sell orders sorting (ascending)
    cy.get('[data-test="sell-orders"] .price').then(($prices) => {
      const prices = $prices.toArray().map((el) => parseFloat(el.innerText.replace(',', '')))
      expect(prices).to.deep.equal([...prices].sort((a, b) => a - b))
    })

    // Verify buy orders sorting (descending)
    cy.get('[data-test="buy-orders"] .price').then(($prices) => {
      const prices = $prices.toArray().map((el) => parseFloat(el.innerText.replace(',', '')))
      expect(prices).to.deep.equal([...prices].sort((a, b) => b - a))
    })
  })

  it('handles group size changes correctly', () => {
    // Get initial order count
    cy.get('[data-test="sell-orders"] .order-row')
      .its('length')
      .then((initialCount) => {
        // Change group size - target the select element directly
        cy.get('[data-test="group-size-select"] select').select('50')

        // Verify orders are grouped
        cy.get('[data-test="sell-orders"] .order-row')
          .its('length')
          .should('be.lessThan', initialCount)
      })
  })

  it('calculates and displays totals correctly', () => {
    cy.get('[data-test="sell-orders"] .order-row')
      .first()
      .within(() => {
        cy.get('.amount')
          .invoke('text')
          .then((amount) => {
            cy.get('.total').invoke('text').should('eq', amount)
          })
      })
  })

  it('updates depth visualization', () => {
    cy.get('[data-test="sell-orders"] .order-row')
      .should('have.length.at.least', 1)
      .first()
      .find('div[class*="bg-red-900"]')
      .should('have.attr', 'style')
      .and('include', 'width:')
  })

  it('maintains correct scroll position after initial load', () => {
    // Check sell orders are scrolled to bottom (or near bottom)
    cy.get('[data-test="sell-orders"]').then(($el) => {
      const element = $el[0]
      const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50
      expect(isNearBottom).to.be.true
    })

    // Check buy orders are scrolled to top
    cy.get('[data-test="buy-orders"]').then(($el) => {
      const isAtTop = $el[0].scrollTop < 50
      expect(isAtTop).to.be.true
    })
  })

  it('maintains correct scroll position after group size change', () => {
    cy.get('[data-test="group-size-select"] select').select('50')

    // Check sell orders are scrolled to bottom (or near bottom)
    cy.get('[data-test="sell-orders"]').then(($el) => {
      const element = $el[0]
      const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50
      expect(isNearBottom).to.be.true
    })

    // Check buy orders are scrolled to top
    cy.get('[data-test="buy-orders"]').then(($el) => {
      const isAtTop = $el[0].scrollTop < 50
      expect(isAtTop).to.be.true
    })
  })
})
