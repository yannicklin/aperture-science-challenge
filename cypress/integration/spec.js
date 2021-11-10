let LOCAL_STORAGE_MEMORY = {}

describe('Aperture Science Enhancement Center Cypress Tests', () => {
  Cypress.Cookies.debug(true);
  Cypress.Cookies.defaults({
    preserve: (cookie) => {
      return /^(laravel|XSRF).+/.test(cookie.name)
    }
  })

  it('finds the home page', function () {
    cy.visit('http://host.docker.internal:3000')
    cy.get('h1');
  })
  
  // it('can log in and see a list of subjects', function () {
  //   let cookies = null
  //   let token = ''

  //   cy.visit('http://host.docker.internal:3000')
  //   cy.get('#email').type(Cypress.env('email'));
  //   cy.get('#password').type(Cypress.env('password'));

  //   cy.intercept('http://webserver/sanctum/csrf-cookie', (req) => {
  //     req.on('response', (res) => {
  //       cookies = res.headers["set-cookie"]
  //     })
  //   }).as('token')

  //   cy.intercept('POST', 'http://webserver/login', (req) => {
  //     for (const cookie of cookies) {
  //       const name = cookie.split(';')[0].split("=")[0]
  //       const val = cookie.split(';')[0].split("=")[1]

  //       if (name === 'XSRF-TOKEN') {
  //         token = decodeURIComponent(val)
  //         req.headers['X-XSRF-TOKEN'] = token
  //       }
  //     }
  //     req.headers['Cookie'] = cookies.join(';')

  //     req.on('response', (res) => {
  //       cookies = res.headers["set-cookie"]
  //     })
  //   }).as('login')

  //   cy.get('#submit').click()

  //   cy.wait('@token')
  //   cy.wait('@login')
  //     .its('request.headers')
  //     .should('have.property', 'X-XSRF-TOKEN')
  //     .then(() => {
  //       for (const cookie of cookies) {
  //         const name = cookie.split(';')[0].split("=")[0]
  //         const val = cookie.split(';')[0].split("=")[1]
  //         cy.setCookie(name, val)
  //       }
  //     })

  //   cy.intercept('POST', 'http://webserver/graphql', (req) => {
  //     req.headers['Cookie'] = cookies.join(';')
  //   }).as('graphql')

  //   cy.location('pathname').should('eq', '/subjects')
  //   cy.get('h1').contains('Testing Subjects');
  //   cy.get('div[data-testid="skeleton"]');

  //   cy.wait('@graphql')
  //   cy.get('table[data-testid="subjects-table"]');
  // })

  it('can log in and see a list of subjects', function () {
    cy.visit('http://host.docker.internal:3000')
    cy.get('#email').type(Cypress.env('email'));
    cy.get('#password').type(Cypress.env('password'));

    cy.get('#submit').click()

    cy.location('pathname').should('eq', '/subjects')
    cy.get('h1').contains('Testing Subjects');

    cy.intercept('POST', 'http://host.docker.internal/graphql').as('graphql')

    cy.location('pathname').should('eq', '/subjects')
    cy.get('h1').contains('Testing Subjects');
    cy.get('div[data-testid="skeleton"]');

    cy.wait('@graphql')
    cy.get('table[data-testid="subjects-table"]');
  });

})