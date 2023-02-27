describe('signin', () => {
    it('Should not sign-in if no fields are entered', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign In"]').click()
        cy.url().should('includes', 'signin');
        cy.get('[data-cy="Submit SignIn"]').click()
        cy.url().should('not.include', 'home');
    })

    it('Should go to signup page when signup link is clicked', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign In"]').click()
        cy.url().should('includes', 'signin');
        cy.get('[data-cy="Go SignUp"]').click()
        cy.url().should('include', 'signup');
    })
})