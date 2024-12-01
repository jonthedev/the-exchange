describe('WebSocket Connection', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-test="order-book"]').should('exist')
  })

  it('shows reconnecting message when disconnected', () => {
    cy.window().then((win) => {
      // @ts-expect-error - accessing internal WebSocket instance
      const ws = win.orderBookSocket
      if (ws) {
        // Normal closure
        ws.close(1000, 'Normal closure')
      }
    })

    cy.get('[data-test="connection-status"]').should('be.visible').and('contain', 'Reconnecting')
  })

  it('hides status messages when connected', () => {
    cy.get('[data-test="connection-status"]').should('not.exist')
    cy.get('[data-test="error-message"]').should('not.exist')
  })
})
