class SchemePage {

  visit = () => cy.visit('/schemes')

  getTitle = () => cy.contains('Mutual Fund Schemes')

  getPagination = () => cy.get('.v-pagination')

  clickNextPage = (page: string) => this.getPagination().contains(page).click()

  getScheme = (name: string) => cy.contains(name)
}

export default new SchemePage()
