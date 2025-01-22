describe('inge_app', () => {

    beforeEach(()=> {
        cy.visit('http://localhost:4200')
    })

    it('frontpage can be opened', ()=>{
        cy.contains('Planos existentes')
    })

    it('crear plano', ()=>{
        cy.contains('Crear plano')
        cy.get('[placeholder="nombre_create"]').type('nuevo plano cypress')
        cy.get('[placeholder="proyectoid_create"]').type('67213c86d65cb722d9c88baa')
        cy.contains('button', 'Crear plano nuevo').click()
        cy.contains('nuevo plano cypress').should('exist')
    })

    it('editar plano', ()=>{
        cy.contains('Planos existentes')
        cy.contains('li.list-group-item', 'nuevo plano cypress')
            .within(()=>{
                cy.contains('button', 'Seleccionar para editar').click()
            })
        cy.contains('Editar plano')
        cy.get('[placeholder="nombre_edit"]').type(' editado') // tambien podria usar .clear() para borrar y luego escribir todo completo
        cy.contains('button', 'Editar').click()
    })

    it('eliminar plano', ()=>{
        cy.contains('Planos existentes')
        cy.contains('li.list-group-item', 'nuevo plano cypress editado')
            .within(()=>{
                cy.contains('button', 'Eliminar').click()
            })
            cy.contains('li.list-group-item', 'nuevo plano cypress editado').should('not.exist')
    })

})