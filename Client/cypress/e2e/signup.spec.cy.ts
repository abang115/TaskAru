describe('signup', () => {
    it('Should not sign-up if no fields are entered', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign Up"]').click();
        cy.url().should('includes', 'signup');
        cy.get('[data-cy="Submit SignUp"]').click();
        cy.url().should('not.include', 'home');
    })

    it('Should successfully sign-up', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign Up"]').click();
        cy.url().should('includes', 'signup');
        cy.get('[formControlName="first_name"]').type('testing', {force: true});
        cy.get('[formControlName="last_name"]').type('tester', {force: true});
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[formControlName="confirmPassword"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignUp"]').click();
        cy.wait(500)
        cy.url().should('include', 'signin');
    })

    it('Should not sign-up if password and confirm password do not match', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign Up"]').click();
        cy.url().should('includes', 'signup');
        cy.get('[formControlName="first_name"]').type('testing', {force: true});
        cy.get('[formControlName="last_name"]').type('tester', {force: true});
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[formControlName="confirmPassword"]').type('testing1234', {force: true});
        cy.get('[data-cy="Submit SignUp"]').click();
        cy.url().should('not.include', 'home');
    })
})