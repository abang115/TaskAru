describe('Event Functionality', () => {
    it('Should have error for new user', () => {
        cy.viewport(1400, 900);
        cy.wait(500);
        cy.visit('/');
        cy.get('[data-cy="Sign In"]').click();
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignIn"]').click();
        cy.url().should('include', 'home');
        cy.request({
        method: 'GET',
            url: '/api/events',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    })

    it('Sign in and create events', () => {
        cy.viewport(1400, 900);
        cy.wait(500);
        cy.visit('/');
        cy.get('[data-cy="Sign In"]').click();
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignIn"]').click();
        cy.url().should('include', 'home');
        cy.request({
        method: 'GET',
            url: '/api/events',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
        // Event 1
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click();
        cy.wait(100);
        cy.get('.modal-body').should('be.visible');
        cy.get('[data-cy="event-title"]').type('Test Event 1 - Timed');
        cy.get('[data-cy="event-date"]').type('2023-04-27');
        cy.get('[data-cy="event-start-time"]').type('11:00');
        cy.get('[data-cy="event-end-time"]').type('12:00');
        cy.get('[data-cy="event-reoccuring"]').select('once');
        cy.get('[data-cy="event-description"]').type('This is a test');
        cy.wait(100);
        cy.get('[data-cy="event-submit-button"]').click();
        cy.wait(100);
        cy.get('.fc-daygrid-day-events').should('contain', 'Test Event 1 - Timed');
        // Event 2
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click();
        cy.wait(100);
        cy.get('.modal-body').should('be.visible');
        cy.get('[data-cy="event-title"]').type('Test Event 2 - AllDay');
        cy.get('[data-cy="event-date"]').type('2023-04-27');
        cy.get('[data-cy="event-reoccuring"]').select('once');
        cy.get('[data-cy="event-description"]').type('This is a test');
        cy.wait(100);
        cy.get('[data-cy="event-submit-button"]').click();
        cy.wait(100);
        cy.get('.fc-daygrid-day-events').should('contain', 'Test Event 2 - AllDay');
    })

    it('Events should be stored', () => {
        cy.viewport(1400, 900);
        cy.wait(500);
        cy.visit('/');
        cy.get('[data-cy="Sign In"]').click();
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignIn"]').click();
        cy.wait(1000);
        cy.url().should('include', 'home');
        cy.request({
            method: 'GET',
            url: '/api/events',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click();
        cy.wait(100);
        cy.get('.modal-body').should('be.visible');
        cy.get('[data-cy="event-title"]').type('Test Event 3 - Timed');
        cy.get('[data-cy="event-date"]').type('2023-04-21');
        cy.get('[data-cy="event-start-time"]').type('11:00');
        cy.get('[data-cy="event-end-time"]').type('12:00');
        cy.get('[data-cy="event-reoccuring"]').select('once');
        cy.get('[data-cy="event-description"]').type('This is a test');
        cy.wait(100);
        cy.get('[data-cy="event-submit-button"]').click();
        cy.wait(100);
        cy.get('.fc-daygrid-day-events').should('contain', 'Test Event 3 - Timed');
        cy.wait(1000);
        cy.get('.fc-daygrid-day-events').should('contain', 'Test Event 2 - AllDay');
        cy.wait(100);
    })
    
    it('Make User 2', () => {
        cy.visit('/')
        cy.get('[data-cy="Sign Up"]').click();
        cy.url().should('includes', 'signup');
        cy.get('[formControlName="first_name"]').type('testing2', {force: true});
        cy.get('[formControlName="last_name"]').type('tester2', {force: true});
        cy.get('[formControlName="email"]').type('testing2@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[formControlName="confirmPassword"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignUp"]').click();
        cy.wait(500)
        cy.url().should('include', 'signin');
    })
    
    it('Share Calendar', () => {
        cy.viewport(1400, 900);
        cy.wait(500);
        cy.visit('/');
        cy.get('[data-cy="Sign In"]').click();
        cy.get('[formControlName="email"]').type('testing@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignIn"]').click();
        cy.wait(1000);
        cy.url().should('include', 'home');
        cy.request({
            method: 'GET',
            url: '/api/events',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click();
        cy.wait(100);
        cy.get('.modal-body').should('be.visible');
        cy.wait(500);
        cy.get('[data-cy="close-modal-button"]').click();
        cy.wait(100);
        cy.get('[data-cy="share-event"]').click();
        cy.get('.modal-body').should('be.visible');
        cy.get('[formControlName="shareEmail"]').type('testing2@gmail.com', {force: true});
        cy.get('[data-cy="share-button"]').click();
    })

    it('Get shared', () => {
        cy.viewport(1400, 900);
        cy.wait(500);
        cy.visit('/');
        cy.get('[data-cy="Sign In"]').click();
        cy.get('[formControlName="email"]').type('testing2@gmail.com', {force: true});
        cy.get('[formControlName="password"]').type('testing123', {force: true});
        cy.get('[data-cy="Submit SignIn"]').click();
        cy.wait(1000);
        cy.url().should('include', 'home');
        cy.request({
            method: 'GET',
            url: '/api/events',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click();
        cy.wait(100);
        cy.get('.modal-body').should('be.visible');
        cy.wait(500);
        cy.get('[data-cy="close-modal-button"]').click();
        cy.wait(100);
        cy.get('[data-cy="get-share-event"]').click();

        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click();
        cy.wait(100);
        cy.get('.modal-body').should('be.visible');
        cy.wait(500);
        cy.get('[data-cy="close-modal-button"]').click();
        cy.get('.fc-daygrid-day-events').should('contain', 'testing Test Event 1 - Timed');
        cy.get('.fc-daygrid-day-events').should('contain', 'testing Test Event 2 - AllDay');
        cy.get('.fc-daygrid-day-events').should('contain', 'testing Test Event 3 - Timed');
    })
    
})