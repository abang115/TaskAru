describe('reset password', () => {
    it('Should successfully reset password', () => {
        cy.visit('http://localhost:4200/resetpassword/RussVmaozFZB')
        cy.get('[formControlName="password"]').type('testing1234', {force: true});
        cy.get('[formControlName="confirmPassword"]').type('testing1234', {force: true});
        cy.get('[data-cy="Submit Reset"]').click();
        cy.wait(500)
        cy.url().should('include', 'signin');
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing1234', {force: true});
        cy.get('[data-cy="Submit SignIn"]').click();
        cy.url().should('include', 'home');
    })

    it('Should fail to reset password if password and confirm password do not match', () => {
        cy.visit('http://localhost:4200/resetpassword/RussVmaozFZB')
        cy.get('[formControlName="password"]').type('testing1234', {force: true});
        cy.get('[formControlName="confirmPassword"]').type('testing12345', {force: true});
        cy.get('[data-cy="Submit Reset"]').click();
        cy.wait(500)
        cy.url().should('not.include', 'signin');
    })
})