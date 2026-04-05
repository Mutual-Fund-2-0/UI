class SchemePage {
  visit = () => cy.visit('/schemes')

  getTitle = () => cy.get('h1.title')

  clickTitle = () => this.getTitle().click()

  getSearchInput = () => cy.get('input[placeholder="Search"]')

  typeSearch = (text: string) => this.getSearchInput().type(text)

  clearSearch = () => this.getSearchInput().clear()

  getPagination = () => cy.get('.v-pagination')

  clickPage = (page: string) => this.getPagination().contains('button', page).click()

  getScheme = (name: string) => cy.contains('td', name)

  getPageSizeSelect = () => cy.get('.page-size-select')

  selectPageSize = (size: string) => {
    this.getPageSizeSelect().click()
    cy.get('.v-list-item').contains(size).click()
  }

  getErrorAlert = () => cy.get('.v-alert').contains('Failed to load schemes')
  
  getFooterCount = () => cy.get('.footer-count')
}

export default new SchemePage()