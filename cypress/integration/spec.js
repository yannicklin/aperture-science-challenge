Cypress.Cookies.debug();

Cypress.Cookies.defaults({
  preserve: 'authentication'
})

context('Aperture Science Enrichment Center Cypress Testing', () => {
    beforeEach(() => {
      cy.setCookie('foo', 'bar');
    });
  
    // beforeEach(() => {
    //   cy.visit('http://nextjs:3000')
    // })
  
    it('finds the home page', function () {
      cy.visit('http://nextjs:3000')
      cy.get('h1');
    })

    // it('can get validation errors with failed CSRF request', function () {
    //   cy.get('#submit').click();
    //   cy.get('[data-testid="error-msg"]').contains('An error occurred, please try again later.');
    // })

    // it('can get a CSRF token and have it set in cookies', function () {
    //   cy.request('/sanctum/csrf-cookie').then(response => {
    //     expect(response.status).to.eq(204);
    //     cy.log(JSON.stringify(response.headers["set-cookie"]));
    //     let cookie;
    //     cy.getCookie('XSRF-TOKEN').should('exist').then(c => {
    //       cy.log(c);
    //       cookie = c;
    //       cy.request({
    //         method: 'POST',
    //         url: '/login',
    //         body: {
    //           "email":"foo@foo.com",
    //           "password":"bar"
    //         },
    //         headers: {
    //           "X-Requested-With": "XMLHttpRequest",
    //           "X-XSRF-TOKEN": decodeURIComponent(cookie.value),
    //           "Accept": "application/json",
    //           "Content-Type": "application/json"
    //         }
    //       }).then(response => {
    //         expect(response.status).to.eq(200);
    //       });
    //     });
        
    //   });
    // })

    it('can log in', function () {
        cy.setCookie('foo', 'bar');
        cy.getCookie('foo').should('exist');
        cy.get('#email').type('foo@foo.com');
        cy.get('#password').type('bar');
        cy.get('#submit').click();
        cy.getCookie('XSRF-TOKEN').should('exist');

        // cy.intercept('/sanctum/csrf-cookie', []).as('csrf');
        cy.location('pathname').should('eq', '/subjects').debug();
        cy.get('h3');
    })
  
})