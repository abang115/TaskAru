import { CalendarComponent } from "./calendar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FullCalendarComponent } from "@fullcalendar/angular";


describe('CalendarComponent', () => {
    it('should mount', () => {
      cy.mount(CalendarComponent, {
        imports: [],
        providers:[
          BsModalRef,
          BsModalService,
        ],
        declarations: [
          FullCalendarComponent,
          CalendarComponent,
        ],
      })
      cy.viewport(1000, 850)
    });

    it('Modal Opens up', () =>{
      cy.mount(CalendarComponent, {
        imports: [ReactiveFormsModule],
        providers:[
          BsModalRef,
          BsModalService,
        ],
        declarations: [
          FullCalendarComponent,
          CalendarComponent,
        ],
      }).then( ()=>{
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click(); 
        cy.get('.modal-body').should('be.visible');
      })
    });

    it('Create new event',() =>{
      cy.mount(CalendarComponent, {
        imports: [ReactiveFormsModule],
        providers:[
          BsModalRef,
          BsModalService,
        ],
        declarations: [
          FullCalendarComponent,
          CalendarComponent,
        ],
      }).then( ()=> {
        // Add Event Buttom
        cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click(); 
        // Make sure modal pops up
        cy.wait(100);
        // Fill out form fields
        cy.get('#event-title').type('Test Event');
        cy.get('#event-date').type('2023-02-27');
        cy.get('#event-start-time').type('11:00');
        cy.get('#event-end-time').type('12:00');
        cy.get('#event-reoccuring').select('once');
        cy.get('#event-description').type('This is a test');
        cy.wait(100);
        cy.get('#event-button-submit').click();
        // Make sure new event shows up
        cy.wait(100)
        // Check if new event is inserted
        cy.get('.fc-daygrid-day-events').should('contain', 'Test Event');
      })
    });
})  