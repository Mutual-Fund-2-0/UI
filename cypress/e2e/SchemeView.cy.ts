import SchemePage from "../pages/SchemePage"

describe('User browsing schemes', () => {

  it('User navigates through pages', () => {
    cy.intercept('GET', '**/MutualFund/schemes?pageNumber=1', {
      fixture: 'schemes-page1.json'
    }).as('page1')

    cy.intercept('GET', '**/MutualFund/schemes?pageNumber=2', {
      fixture: 'schemes-page2.json'
    }).as('page2')

    SchemePage.visit()

    SchemePage.getScheme('Equity Fund 1').should('exist')

    SchemePage.clickNextPage('2')

    SchemePage.getScheme('Equity Fund 3').should('exist')

  })

})
