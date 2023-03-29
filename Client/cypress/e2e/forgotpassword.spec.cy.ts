describe('forgot password', () => {
    it('Should successfully enter email and redirect to reset password', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign In"]').click();
        cy.url().should('includes', 'signin');
        cy.get('[data-cy="Forgot Password"]').click();
        cy.url().should('include', 'forgotpassword');
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[data-cy="Submit Forgot"]').click();
    })

    it('Should fail to reach backend with wrong email', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign In"]').click();
        cy.url().should('includes', 'signin');
        cy.get('[data-cy="Forgot Password"]').click();
        cy.url().should('include', 'forgotpassword');
        cy.get('[formControlName="email"]').type('testing111@gmail.com', {force: true});
        cy.get('[data-cy="Submit Forgot"]').click();
        cy.get('[data-cy="error"]').should('be.visible');
    })

    it('Should fail to submit without entering an email', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign In"]').click();
        cy.url().should('includes', 'signin');
        cy.get('[data-cy="Forgot Password"]').click();
        cy.url().should('include', 'forgotpassword');
        cy.get('[data-cy="Submit Forgot"]').click();
        cy.get('[data-cy="error"]').should('be.visible');
    })
})