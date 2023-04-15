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
  groupID = 0;

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
        click: this.addEventClick.bind(this)
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

  @ViewChild('addEventModal') addEventModal!: string;
  @ViewChild('showEvent') showEvent!: string;
  @ViewChild('editEventModal') editEventModal!: string;
  @ViewChild('cal') fullCalendarComponent!:FullCalendarComponent; // Access the Calendar as an object
  @ViewChild('sharing') sharing!:string;

  constructor(private modalService: BsModalService, private http: HttpClient, public signInService: SignInService) {     }

  async ngOnInit(): Promise<void> {
    this.signedIn = this.signInService.getStatus();
    if(this.signedIn){
      this.email = this.signInService.getEmail();
      const events = await this.fetchEvents(this.email, this.groupID);
      this.currentEvents = events ? events : [];
      for(let event of this.currentEvents){
        this.fullCalendarComponent.getApi().addEvent(event);
      }
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

  addEventClick(){
    this.modalRef = this.modalService.show(this.addEventModal);
  }

  addEvent(){
    let formVars = this.eventForm.value;
    // Create new event struct using form vals
    let newEvent = {
      id: createEventId(this.eventID),
      groupID: this.groupID.toString(),
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
      this.postEvent(backendForm);
    }
    // Reset form with default values
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    // Hide Modal upon exit
    this.modalRef?.hide();  
  }

  postEvent(backendForm:any){
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


  async fetchEvents(email:any, groupID:any){
   try{
    const response = await this.http.get(`http://localhost:8080/api/event?email=${email}&groupID=${groupID}`).toPromise();
    let parsedEvent: any[] = [];
    if(Array.isArray(response)){
      for(let event of response){
        parsedEvent.push(parseFromBackend(event));
      }
    }
    return parsedEvent;
   } catch(err){
    console.error('Error: ', err)
    return null;
   }
  }

  shareButtonClick(){
    this.modalRef = this.modalService.show(this.sharing);
  }
  
  shareCalSubmit(){
    let share = {
      email: this.email,
      groupID: this.groupID.toString(),
      sharedWith: this.shareForm.value.shareEmail
    }
    if(this.signedIn){
      this.postSharedCal(share);
    }
    this.eventForm.reset();
    this.modalRef?.hide();  
  }
  
  postSharedCal(share:any){
    console.log(share);
    this.http.post(`http://localhost:8080/api/calendar`, share).subscribe({
      next: response => {
        console.log('Posted to backend:', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  async getShareButtonClick(){
    let shared = await this.getSharedCal();
    if (shared != null){
      this.fullCalendarComponent.getApi().removeAllEvents();
      let otherEmail, otherGroupID;
      
      for(let cal of shared){
        
      }
      console.log(shared);
    }
  }

  async getSharedCal(){
    try{
      const response = await this.http.get(`http://localhost:8080/api/calendar?email=${this.email}`).toPromise();
      return response as Array<any>;
    }catch(err){
      console.error('Error: ', err);
      return null;
    }
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

  shareForm = new FormGroup({
    shareEmail: new FormControl(''),
  })
}
