import SchemePage from "../pages/SchemePage"

describe('User browsing schemes', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/MutualFund/schemes?pageNumber=1&pageSize=10', {
      fixture: '../fixtures/schemes-page1.json'
    }).as('page1')
  })

  it('User navigates through pages', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/MutualFund/schemes',
      query: {
        pageNumber: '2',
        pageSize: '10*'
      }
    }, {
      fixture: '../fixtures/schemes-page2.json'
    }).as('page2')

    SchemePage.visit()
    cy.wait('@page1')

    SchemePage.getScheme('Equity Fund 1').should('exist')

    SchemePage.clickPage('2')
    cy.wait('@page2')

    SchemePage.getScheme('Equity Fund 3').should('exist')
  })

  it('User searches for a scheme with a debounce delay', () => {
    cy.intercept({
      method:'GET',
      pathname: '**/MutualFund/schemes',
      query: {
        pageNumber: '1',
        pageSize: '10',
        searchText: 'Equity'
      }
    }, {
      body: { items: [{ name: 'Equity Fund 1', house: 'House A' }], totalCount: 1, pageNumber: 1, totalPages: 1 }
    }).as('searchReq')

    SchemePage.visit()
    cy.wait('@page1')

    SchemePage.typeSearch('Equity')

    cy.wait('@searchReq')
    SchemePage.getScheme('Equity Fund 1').should('exist')
  })

  it('User changes the number of schemes per page', () => {
    cy.intercept('GET', '**/MutualFund/schemes?pageNumber=1&pageSize=20*', {
      body: { items: [{ name: 'Large Cap Fund 1', house: 'House B' }], totalCount: 4, pageNumber: 1, totalPages: 2 }
    }).as('pageSizeReq')

    SchemePage.visit()
    cy.wait('@page1')

    SchemePage.selectPageSize('20')
    cy.wait('@pageSizeReq')
    
    SchemePage.getScheme('Large Cap Fund 1').should('exist')
  })

  it('User resets the view by clicking the title', () => {
    SchemePage.visit()
    cy.wait('@page1')

    SchemePage.typeSearch('Index')
    
    SchemePage.clickTitle()
    cy.wait('@page1')
    
    SchemePage.getSearchInput().should('have.value', '')
  })

  it('User sees an error alert if the API call fails', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/MutualFund/schemes*',
    }, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('errorReq')
    
    SchemePage.visit()
    cy.wait('@errorReq')

    SchemePage.getErrorAlert().should('be.visible')
  })
})