describe('inge_app', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200')
    })

    it('iniciar sesion', () => {
        // Hacer clic en Iniciar Sesión
        cy.contains('Iniciar Sesión').click()

        cy.origin('https://dev-s2w5lzkgxmbf0wl0.us.auth0.com', () => {
            // Esperar que el campo username esté visible y escribir el email
            cy.get('input[name="username"][type="text"]').type(Cypress.env("correo"))
            
            // Esperar el campo de password y escribir la contraseña
            cy.get('input[name="password"]').type(Cypress.env("contraseña"), { log: false })
            
            // Hacer clic en el botón de login
            cy.contains('Continue').click()

            cy.get('#ingresar-token').should('be.visible').click();
        });

    })

})
