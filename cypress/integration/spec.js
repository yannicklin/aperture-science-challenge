let LOCAL_STORAGE_MEMORY = {}

describe('Aperture Science Enhancement Center Cypress Tests', () => {
  Cypress.Cookies.defaults({
    preserve: (cookie) => {
      return /^(laravel|XSRF).+/.test(cookie.name)
    }
  })

  // beforeEach(() => {
  //   cy.visit('http://nextjs:3000')
  // })

  // it('finds the home page', function () {
  //   cy.visit('http://nextjs:3000')
  //   cy.get('h1');
  // })

  // it('can get validation errors with failed CSRF request', function () {
  //   cy.get('#submit').click();
  //   cy.get('[data-testid="error-msg"]').contains('An error occurred, please try again later.');
  // })

  // it('can set cookies', function () {
  //   cy.setCookie('XSRF-FOO', 'abc');
  //   cy.getCookie('XSRF-FOO').should('exist');
  // });

  it('can get a CSRF token and have it set in cookies', function () {
    cy.visit('http://nextjs:3000')
    cy.request('/sanctum/csrf-cookie').then(response => {
      expect(response.status).to.eq(204);
      cy.log('response.headers["set-cookie"]["0"]:', response.headers["set-cookie"]["0"]);
      // cy.getCookie refuses to work, manually pull cookie and append it to X-XSRF-TOKEN header
      const xsrf = response.headers["set-cookie"]["0"].split(';')[0].split("=")[1];
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          "email":"foo@foo.com",
          "password":"bar"
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(xsrf),
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  })

  // it('can log in', function () {
  //   cy.visit('http://nextjs:3000')
  //   cy.get('#email').type(Cypress.env('email'));
  //   cy.get('#password').type(Cypress.env('password'));
  //   cy.get('#submit').click();
  //   // cy.getCookie('XSRF-TOKEN').should('exist');
  //   cy.wait(2000);
  //   cy.intercept('POST', 'http://webserver/login', {
  //     statusCode: 200,
  //   });
  //   cy.location('pathname').should('eq', '/subjects').debug();
  //   cy.get('h3');
  // })
  
})