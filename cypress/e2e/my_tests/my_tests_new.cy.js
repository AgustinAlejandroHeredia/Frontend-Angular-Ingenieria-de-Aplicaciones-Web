describe('inge_app', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200')

        cy.contains('Iniciar Sesión').click()

        cy.origin('https://dev-s2w5lzkgxmbf0wl0.us.auth0.com', () => {
            
            cy.get('input[name="username"][type="text"]').type(Cypress.env("correo"))
            
            cy.get('input[name="password"]').type(Cypress.env("contraseña_auth0"), { log: false })
        
            cy.contains('Continue').click()
        });
        cy.wait(2000)
    })

    it('token invalido', () => {

        cy.contains('Ingresar token +').click()

        cy.get('#token').type('146889')

        cy.contains('Validar').click()

        cy.on('window:alert', (mensaje) => {
            expect(mensaje).to.equal('Token invalido')
        });
    })

    
    // el usuario que se usa para pruebas es admin y creator
    it('crear proyecto', () => {

        cy.contains('testing_cypress').click()

        cy.contains('Nuevo proyecto cypress').should('not.exist');

        cy.contains('Crear Proyecto +').click()

        cy.get('#nombre').type('Nuevo proyecto cypress')

        //cy.contains('Crear proyecto').click()

        cy.contains('Mis Proyectos').click()

        cy.contains('Nuevo proyecto cypress')

        cy.contains('Ver').click()

    })

    it('editar proyecto', () => {

        cy.contains('testing_cypress').click()

        cy.contains('Nuevo proyecto cypress')

        cy.contains('Ver').click()

        cy.contains('Administrar proyecto').click()

        cy.get('#expediente').clear()

        cy.get('#expediente').type('Expediente desde cypress')

        cy.contains('Editar')

        cy.contains('Mis Proyectos').click()

        cy.contains('Nombre: Nuevo proyecto cypress')

    })

    it('eliminar proyecto', () => {

        cy.contains('testing_cypress').click()

        cy.contains('Nuevo proyecto cypress')

        cy.contains('Eliminar').click()

        cy.wait(200)

        cy.contains('Nuevo proyecto cypress').should('not.exist')

    })

    it('invitar usuario a organizacion', () => {

        cy.contains('testing_cypress').click()

        cy.contains('Admin. Usuarios').click()

        cy.contains('Invitar usuario a la organizacion').click()

        cy.get('#email').type(Cypress.env("correo"))

        cy.get('#opciones').select('24')

        cy.contains('Enviar invitacion').click()

        cy.on('window:alert', (mensaje) => {
            expect(mensaje).to.equal('Invitacion enviada exitosamente')
        });

    })
    

})
