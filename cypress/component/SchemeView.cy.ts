import SchemeView from '@v/SchemeView.vue'

describe('SchemeView API Error', () => {
  it('Shows error alert when API fails', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/MutualFund/schemes'
    }, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getSchemesFail')

    cy.mount(SchemeView)
    cy.wait('@getSchemesFail')

    cy.get('.v-alert').should('contain.text', 'Failed to load schemes. Please try again later.')
    cy.get('tbody tr').should('have.length', 1).contains('No data available')
  })
})

describe('SchemeView Component', () => {
  beforeEach('API Call', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/MutualFund/schemes'
    }, (req) => {
      const { pageNumber, pageSize, searchText } = req.query
      if (searchText === 'Growth') {
        req.reply({ body: { items: [{ code: 9, name: 'Growth Fund 1', house: 'House A' }], totalCount: 1, pageNumber: 1, totalPages: 1 } })
      } else if (pageSize === '20') {
        req.reply({ body: { items: [{ code: 10, name: 'Large Cap Fund', house: 'House B' }], totalCount: 50, pageNumber: 1, totalPages: 3 } })
      } else if (pageNumber === '2') {
        req.reply({ fixture: '../fixtures/schemes-page2.json' })
      } else {
        req.reply({ fixture: '../fixtures/schemes-page1.json' })
      }
    }).as('getSchemes')

    cy.mount(SchemeView)
    cy.wait('@getSchemes')
  })

  it('Renders the page title', () => {
    cy.contains('.title', 'Mutual Fund Schemes').should('be.visible')
  })

  it('Renders scheme data in table', () => {
    cy.contains('Equity Fund 1').should('exist')
  })

  it('Shows correct pagination text', () => {
    cy.contains('.footer-count', '1 - 4 of 4').should('exist')
  })

  it('Sorts schemes when header clicked', () => {
    cy.contains('Scheme Sub-Category').click()
    cy.get('tbody tr').eq(0).should('contain.text', 'Equity Fund 2')
  })

  it('Navigates to next page', () => {
    cy.get('.v-pagination').contains('button', '2').click()
    
    cy.wait('@getSchemes').its('request.query.pageNumber').should('eq', '2')
    cy.contains('Equity Fund 3').should('exist')
  })

  it('Searches for a scheme with a 1000ms debounce delay', () => {
    cy.get('input[placeholder="Search"]').type('Growth')
    
    cy.wait('@getSchemes').its('request.query.searchText').should('eq', 'Growth')
    cy.contains('Growth Fund 1').should('exist')
  })

  it('Changes the number of schemes per page', () => {
    cy.get('.page-size-select').click()
    cy.get('.v-list-item').contains('20').click()

    cy.wait('@getSchemes').its('request.query.pageSize').should('eq', '20')
    cy.contains('Large Cap Fund').should('exist')
    cy.contains('.footer-count', '1 - 20 of 50').should('exist')
  })

  it('Resets the view by clicking the title', () => {
    cy.get('input[placeholder="Search"]').type('Growth')
    cy.wait('@getSchemes')
    
    cy.get('.title').click()
    
    cy.wait('@getSchemes').then((interception) => {
      expect(interception.request.query.pageNumber).to.eq('1')
      expect(interception.request.query.pageSize).to.eq('10')
      expect(interception.request.query.searchText || '').to.equal('')
    })
    
    cy.get('input[placeholder="Search"]').should('have.value', '')
  })
})