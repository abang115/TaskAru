import { CalendarComponent } from "./calendar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


describe('CalendarComponent', () => {
  it('should mount', () => {
    cy.mount(CalendarComponent, {
      imports: [
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    cy.viewport(1000, 850)
  });

  it('Modal open up', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click(); 
      cy.get('.modal-body').should('be.visible');
    })
  });

  it('Create new event',() =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=> {
      cy.viewport(1400, 900);
      cy.wait(500);
      // Add Event Buttom
      cy.get('.fc-myCustomButton-button.fc-button.fc-button-primary').click(); 
      // Make sure modal pops up
      cy.wait(100);
      // Fill out form fields
      cy.get('#event-title').type('Test Event');
      cy.get('#event-date').type('2023-04-27');
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

  it('Open existing event', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('.fc-daygrid-more-link').eq(0).click();
      cy.wait(100); 
      cy.get('.fc-daygrid-event-harness').eq(3).click();
      cy.wait(100);
      cy.get('.modal-body').should('be.visible');
    })
  });

  it('Edit event with same values', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('.fc-daygrid-more-link').click(); 
      cy.get('.fc-daygrid-event-harness').eq(4).click();
      cy.wait(100);
      cy.get('.modal-body').should('be.visible');
      cy.get('#edit-submit').click();
      cy.wait(100);
      cy.get('#event-title').should('have.value', "All-day event");
    })
  });


  it('Edit Event to new Date', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('.fc-daygrid-more-link').click(); 
      cy.get('.fc-daygrid-event-harness').eq(3).click();
      cy.wait(100);
      cy.get('.modal-body').should('be.visible');
      cy.get('#edit-submit').click();
      cy.wait(100);
      cy.get('#event-date').type('2023-04-27');
      cy.wait(100);
      cy.get('#save-button').click();
    })
  });

  it('Remove Event', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('.fc-daygrid-event-harness').eq(0).click();
      cy.wait(100);
      cy.get('.modal-body').should('be.visible');
      cy.get('#remove-submit').click();
      cy.wait(100);
      cy.get('.fc-daygrid-day-events').should('not.contain', 'All-day event');
    })
  });

  it('Do not display share modal', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('#share-event').click();
      cy.get('.modal-body').should('not.exist');
    })
  });

  it('Change calendar toggle be visible', () =>{
    cy.mount(CalendarComponent, {
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers:[
        BsModalRef,
        BsModalService,
      ],
      declarations: [
        FullCalendarComponent,
        CalendarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).then( ()=>{
      cy.viewport(1400, 900);
      cy.wait(500);
      cy.get('mat-button-toggle-group').should('be.visible');
      cy.get('mat-button-toggle').should('have.length', 3);
    })
  });

})  