describe('OrderEntryForm Integration', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-test="order-book"]').should('exist')
  })

  it('completes a valid buy order submission', () => {
    // Click a price from the order book (optional)
    cy.get('[data-test="buy-orders"]').find('.price').first().click()

    // Fill out the form
    cy.get('[data-test="price-input"]').should('be.visible').clear().type('50000.00')
    cy.get('[data-test="amount-input"]').should('be.visible').clear().type('0.1')

    // Verify no validation errors
    cy.get('[data-test="price-error"]').should('not.exist')
    cy.get('[data-test="amount-error"]').should('not.exist')

    // Submit should be enabled
    cy.get('[data-test="submit-button"]').should('not.be.disabled').should('contain', 'Buy BTC')

    // Submit the form
    cy.get('[data-test="order-entry-form"]').submit()
  })

  it('completes a valid sell order submission', () => {
    // Switch to sell
    cy.get('[data-test="sell-button"]').should('be.visible').click()

    // Click a price from the order book (optional)
    cy.get('[data-test="sell-orders"]').find('.price').first().click()

    // Fill out the form
    cy.get('[data-test="price-input"]').should('be.visible').clear().type('51000.00')
    cy.get('[data-test="amount-input"]').should('be.visible').clear().type('0.5')

    // Verify button shows "Sell BTC"
    cy.get('[data-test="submit-button"]')
      .should('not.be.disabled')
      .should('contain.text', 'Sell BTC')
      .should('have.class', 'bg-red-600')

    // Submit the form
    cy.get('[data-test="order-entry-form"]').submit()
  })

  it('shows validation errors for invalid inputs', () => {
    // Try invalid price
    cy.get('[data-test="price-input"]').should('be.visible').clear().type('-100')
    cy.get('[data-test="amount-input"]').should('be.visible').clear().type('0')

    // Submit using form submit instead of button click
    cy.get('[data-test="order-entry-form"]').submit()

    // Wait for and check error messages
    cy.get('[data-test="price-error"]')
      .should('be.visible')
      .and('contain.text', 'Price must be greater than 0')

    cy.get('[data-test="amount-error"]')
      .should('be.visible')
      .and('contain.text', 'Amount must be greater than 0')
  })
})
