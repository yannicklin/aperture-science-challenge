context('Cypress TodoMVC test', () => {
    beforeEach(() => {
      cy.visit('http://nextjs:3000')
    })
  
    it('finds the home page', function () {
      cy.get('h1');
    })
})