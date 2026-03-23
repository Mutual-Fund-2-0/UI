  import SchemeView from '@v/SchemeView.vue'

  describe('SchemeView API Error', () => {

    it('Shows error when API fails', () => {
      cy.intercept({
        method: 'GET',
        pathname: '/MutualFund/schemes'
      },
      {
        statusCode: 500,
        body: { message: 'Internal Server Error' }
      }).as('getSchemesFail')
      cy.mount(SchemeView)
      cy.wait('@getSchemesFail')
      cy.get('tbody tr').should('have.length', 1).contains('No data available')
    })
  })

  describe('SchemeView Component', () => {

    beforeEach('API Call', () => {
      cy.intercept({
        method: 'GET',
        pathname: '/MutualFund/schemes'
      }, (req) => {
        const page = req.query.pageNumber
        req.reply({ fixture: page === '2' ? 'schemes-page2.json' : 'schemes-page1.json' })
      }).as('getSchemes').mount(SchemeView).wait('@getSchemes')
    })

    it('Renders the page title', () => {
      cy.contains('Mutual Fund Schemes').should('be.visible')
    })

    it('Renders scheme data in table', () => {
      cy.contains('Equity Fund 1').should('exist')
    })

    it('Shows correct pagination text', () => {
      cy.contains('1 - 2 of 4').should('exist')
    })

    it('Sorts schemes when header clicked', () => {
      cy.contains('Name').click()
      cy.contains('Equity Fund 1').should('exist')
    })

    it('Navigates to next page', () => {
    cy.contains('button', '2').click()
    cy.wait('@getSchemes')
    cy.contains('Equity Fund 3').should('exist')
  })
  })
