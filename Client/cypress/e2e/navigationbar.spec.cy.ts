describe('navigation bar', () => {
    it('Should successfully switch between light and dark mode', () => {
        cy.visit('/')
        cy.get('[data-cy="Light"]').should('be.visible');
        cy.get('[data-cy="Toggle Mode"]').click();
        cy.get('[data-cy="Dark"]').should('be.visible');
    })

    it('Should successfully navigate to calendar', () => {
        cy.visit('/')
        cy.get('[data-cy="calendar"]').click();
        cy.url().should('include', 'calendar');
    })

    it('Should successfully navigate to sign in', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign In"]').click();
        cy.url().should('include', 'signin');
    })

    it('Should successfully navigate to sign up', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign Up"]').click();
        cy.url().should('include', 'signup');
    })
})