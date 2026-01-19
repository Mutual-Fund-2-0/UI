import WelcomeItem from './WelcomeItem.vue'

describe('<WelcomeItem />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(WelcomeItem)
  })
})