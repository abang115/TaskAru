import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EventApi, } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId, toEventFormat, parseToRRule, getRandomColor, parseFromBackend, parseToBackend } from "./event.utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignInService } from '../sign-in.service';
import { s } from "@fullcalendar/core/internal-common";
import { ParsedEvent } from "@angular/compiler";

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit  {
  modalRef?: BsModalRef;
  calendarVisible = true;

  currentEvents: any[] = [];
  selectedEvent: any;
  eventID = 1;
  calendarOptions= {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      rrulePlugin
    ],
    customButtons:{
      myCustomButton:{
        text: 'Add Event',
        click: this.handleAddEventButtonClick.bind(this)
      }
    },
    headerToolbar: {
      left: 'prev,next today myCustomButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.currentEvents, 
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleDateClick.bind(this),
  };

  email: string = '';
  signedIn: boolean = false;

  config ={
    animated: true
  };

  @ViewChild('eventModal') eventModal!: string;
  @ViewChild('showEvent') showEvent!: string;
  @ViewChild('editEventModal') editEventModal!: string;
  @ViewChild('cal') fullCalendarComponent!:FullCalendarComponent; // Access the Calendar as an object

  constructor(private modalService: BsModalService, private http: HttpClient, public signInService: SignInService) {     }

  ngOnInit(): void {
    this.signedIn = this.signInService.getStatus();
    if(this.signedIn){
      this.email = this.signInService.getEmail();
      this.fetchEvents();
      console.log('Showing user:' + this.email);
    }
    else{
      this.currentEvents = INITIAL_EVENTS;
      console.log('Showing Default Events');
    }
    this.calendarOptions.initialEvents = this.currentEvents;
  }

  ngAfterViewInit(): void{
  }

  handleDateClick(arg:any){
    console.log(arg);
    this.selectedEvent = arg.event;
    this.modalRef = this.modalService.show(this.showEvent, this.config);
  }

  handleAddEventButtonClick(){
    this.modalRef = this.modalService.show(this.eventModal);
  }

  addEvent(){
    let formVars = this.eventForm.value;
    console.log('add events clicked');
    // Create new event struct using form vals
    let newEvent = {
      id: createEventId(this.eventID),
      title: formVars.eventTitle || '',
      description: formVars.eventDescription || '',
      start: toEventFormat(formVars.eventDate, formVars.startTime) || '',
      end: toEventFormat(formVars.eventDate, formVars.endTime) || '',
      rrule: parseToRRule(formVars.eventDate, formVars.reoccuring),
      backgroundColor: getRandomColor()
    }
    this.eventID++;
    console.log(newEvent);
    // Add event to calendar and send data to backend if user is signed in
    this.fullCalendarComponent.getApi().addEvent(newEvent);
    if(this.signedIn){
      let backendForm = parseToBackend(newEvent, formVars.eventDate || '', formVars.startTime || '', formVars.endTime || '', this.email);
      this.eventAddToBackend(backendForm);
    }

    // Reset form with default values
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    // Hide Modal upon exit
    this.modalRef?.hide();  
  }

  eventAddToBackend(backendForm:any){
    console.log(backendForm)  
    
    this.http.post('http://localhost:8080/api/event', backendForm).subscribe({
      next: response => {
        console.log('Event successfully added: ', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  editEventButton(){
    this.modalRef?.hide();
    var eventObj = this.selectedEvent.toPlainObject();
    console.log(eventObj);
  
    // Fetch previous event data
    this.eventForm.get('id')?.setValue(eventObj.id);
    this.eventForm.get('eventTitle')?.setValue(eventObj.title);
    this.eventForm.get('eventDate')?.setValue(eventObj.start);
    this.eventForm.get('eventDescription')?.setValue(eventObj.description);
    this.eventForm.get('color')?.setValue(eventObj.backgroundColor);
    
    // Give time for previous modal to fully close
    setTimeout(() => {
      this.modalRef = this.modalService.show(this.editEventModal, this.config);
    }, 150);
  }

  editedEventSubmission(){
    let formVars = this.eventForm.value;
    let oldEvent = this.fullCalendarComponent.getApi().getEventById(formVars.id||'');
    // create a new edited event
    let editedEvent = {
      // Will add feature later 
      // groupid: '0',
      id: formVars.id || '',
      title: formVars.eventTitle || '',
      description: formVars.eventDescription || '',
      start: toEventFormat(formVars.eventDate, formVars.startTime) || '',
      end: toEventFormat(formVars.eventDate, formVars.endTime) || '',
      rrule: parseToRRule(formVars.eventDate, formVars.reoccuring),
      backgroundColor: formVars.color || '',
    }

    // Remove old event
    oldEvent?.remove();

    // Add back the updated event
    this.fullCalendarComponent.getApi().addEvent(editedEvent);
    this.eventEditToBackend(editedEvent);

    // Reset form
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    this.modalRef?.hide();
  }

  removeEvent(){
    if(this.signedIn){
      let REvent = {
        email: this.email,
        eventID: this.selectedEvent.toPlainObject().id 
      }
      this.eventRemoveToBackend(REvent);
    }
    this.selectedEvent.remove(); 
    this.modalRef?.hide(); 
   }

  eventRemoveToBackend(REvent:any){
    this.http.delete('http://localhost:8080/api/event', REvent).subscribe({
      next: response => {
        console.log('Backend successfully reached, Event is removed :', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  eventEditToBackend(editedEvent:any){
    
    // TODO FIX form of edited event
    this.http.patch('http://localhost:8080/api/event',editedEvent).subscribe({
      next: response => {
        console.log('Backend successfully reached: ', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  fetchEvents(){
    this.http.get(`http://localhost:8080/api/event?email=${this.email}`).subscribe({
      next: response => {
        let eventArr:any;
        eventArr = response;
        console.log('Events Fetched:', response);
        console.log(eventArr);
        let parsedEvent: any[] = [];
        if(eventArr != null || eventArr != undefined){
          for(let i = 0; i < eventArr.length; i++){
            this.fullCalendarComponent.getApi().addEvent(parseFromBackend(eventArr[i]));
          }
        }
        this.eventID = eventArr.length;    
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  getShareEvents(Sharer:any){
    // TODO get events from response and 
    this.http.get(`http://localhost:8080/api/sharedevent?email=${this.email}`, Sharer).subscribe({
      next: response => {
        console.log('Backend successfully reached, fetched events for: ' + Sharer, response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  // Event form variables, with required fields
  eventForm = new FormGroup({
    id: new FormControl(''),
    eventTitle: new FormControl('', [Validators.required]),
    eventDate: new FormControl('', [Validators.required]),
    eventDescription: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    reoccuring: new FormControl('once'),
    color: new FormControl(''),
  })
}
