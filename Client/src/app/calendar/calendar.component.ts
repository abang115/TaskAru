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
import { NotificationService, EventData } from "../notification.service";

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
  groupID = '0';
  calendarName = 'Personal';
  shareAbility: string[] = [];

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

  constructor(private modalService: BsModalService, private http: HttpClient, public signInService: SignInService, private notificationService: NotificationService) {     }

  async ngOnInit(): Promise<void> {
    this.signedIn = this.signInService.getStatus();
    if(this.signedIn ){ // Use signed in to show events
      // Gets all necessary info and gets fetches events
      this.email = this.signInService.getEmail();
      // Check if user has any calendars that are theirs
      let cal = await this.getSharedCal();
      if(cal == null){
        this.createDefaultCal();
      }
      else{
        let count = 0;
        for(let each of cal){
          if(each.email == this.email){
            count++;
          } 
        }
        if(count != 3){
          this.createDefaultCal();
        }
      }
      const events = await this.fetchEvents(this.email, this.groupID);
      this.currentEvents = events || [];
      // Add all, if any, events to the current calendar
      console.log(this.currentEvents);
      await this.updateCal();
      this.updateNotification();
      // Update the event ID only when events are present 
      if(this.currentEvents.length != 0){
        this.eventID = ++this.currentEvents[this.currentEvents.length-1].id;
      }
    }
    else{ // Set default events
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

  async onCalSelectChange(event: any) {
    this.groupID = event.value;
    let calAPI = this.fullCalendarComponent.getApi();
    if(this.groupID == '0'){
      this.calendarName = 'Personal';
      await this.updateCal();
      this.notificationService.clearEventData();
      this.updateNotification();
    }
    else if(this.groupID == '1'){
      this.calendarName = 'Work';
      await this.updateCal();
      this.notificationService.clearEventData();
      this.updateNotification();
    }
    else if(this.groupID == '2'){
      this.calendarName = 'School';
      await this.updateCal();
      this.notificationService.clearEventData();
      this.updateNotification();
    }
    console.log('Selected Calendar:', this.groupID, this.calendarName);
  }

  async updateCal(){
    let calAPI = this.fullCalendarComponent.getApi();
    this.currentEvents = await this.fetchEvents(this.email, this.groupID) || [];
    console.log(this.currentEvents);
    calAPI.removeAllEvents();
    calAPI.setOption('events', this.currentEvents);
    setTimeout(() => {
      calAPI.refetchEvents();
    }, 1000);
    
  }

  updateNotification(){
    for(let event of this.currentEvents){
      const eventData: EventData = {
        title: event.title,
        date: event.end.substring(0,10)
      };
      this.notificationService.addEventData(eventData);
    }
    this.notificationService.removePastDue();
  }

  addEventClick(){
    this.modalRef = this.modalService.show(this.addEventModal);
  }

  addEvent(){
    let formVars = this.eventForm.value;
    // Create new event struct using form vals
    let newEvent = {
      id: createEventId(this.eventID),
      groupID: this.groupID,
      title: formVars.eventTitle || '',
      description: formVars.eventDescription || '',
      start: toEventFormat(formVars.eventDate, formVars.startTime) || '',
      end: toEventFormat(formVars.eventDate, formVars.endTime) || '',
      rrule: parseToRRule(formVars.eventDate, formVars.reoccuring),
      backgroundColor: getRandomColor()
    }
    this.eventID++;
    this.currentEvents.push(newEvent);
    console.log(newEvent);

    // Add event to calendar and send data to backend if user is signed in
    this.fullCalendarComponent.getApi().addEvent(newEvent);
    if(this.signedIn){
      let backendForm = parseToBackend(newEvent, formVars.eventDate || '', formVars.startTime || '', formVars.endTime || '', this.email);
      this.postEvent(backendForm);

      const eventData: EventData = {
        title: formVars.eventTitle || '',
        date: formVars.eventDate || ''
      } 
      this.notificationService.addEventData(eventData);
    }
    // Reset form with default values
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    // Hide Modal upon exit
    this.modalRef?.hide();  
  }

  postEvent(backendForm:any){
    this.http.post('http://localhost:8080/api/event', backendForm).subscribe({
      next: response => {
        console.log('Event successfully added: ', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  editEventButtonClick(){
    this.modalRef?.hide();
    var eventObj = this.selectedEvent.toPlainObject();
    let EEvent;
    for(let event of this.currentEvents){
      if(eventObj.id == event.id){
        EEvent = event;
        break;
      }
    }

    this.eventForm.get('id')?.setValue(EEvent.id);
    this.eventForm.get('eventTitle')?.setValue(EEvent.title);
    this.eventForm.get('eventDate')?.setValue(EEvent.start.substring(0,10));
    this.eventForm.get('eventDescription')?.setValue(EEvent.description);
    this.eventForm.get('color')?.setValue(EEvent.backgroundColor);
    if(EEvent.rrule != undefined){
      this.eventForm.get('reoccuring')?.setValue(EEvent.rrule.freq);
    }
    if(EEvent.start.length > 10){
      this.eventForm.get('startTime')?.setValue(EEvent.start.substring(11,16));
      this.eventForm.get('endTime')?.setValue(EEvent.end.substring(11,16));
    }
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
      groupID: this.groupID,
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
    
    if(this.signedIn){
      let backendForm = parseToBackend(editedEvent, formVars.eventDate || '', formVars.startTime || '', formVars.endTime || '', this.email);
      console.log(backendForm);
      this.patchEditToBackend(backendForm);
    }
    this.notificationService.clearEventData();
    this.updateNotification();
    // Reset form
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    this.modalRef?.hide();
  }

  patchEditToBackend(editedEvent:any){
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

  removeEventButtonClick(){
    var eventObj = this.selectedEvent.toPlainObject();
    if(this.signedIn && (eventObj.groupID != '3')){
      let REvent = {
        email: this.email,
        groupID: this.groupID,
        eventID: eventObj.id
      }
      this.deleteEvent(REvent);
      const eventData: EventData = {
        title: eventObj.title || '',
        date: eventObj.start.substring(0,10) || ''
      } 
      this.notificationService.removeEventData(eventData);
    }
    this.selectedEvent.remove(); 
    this.modalRef?.hide(); 
  }

  deleteEvent(REvent:any){
    console.log(REvent);
    this.http.delete(`http://localhost:8080/api/event`, {headers: new HttpHeaders(), body:REvent}).subscribe({
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

  createDefaultCal(){
    let cal = {
      email: this.email,
      groupID: '0',
      calendarName:'Personal'
    }
    this.createCal(cal);
    cal.groupID = '1';
    cal.calendarName = 'Work';
    this.createCal(cal);
    cal.groupID = '2';
    cal.calendarName = 'School'
    this.createCal(cal);
  }

  createCal(newCal:any){
    console.log(newCal);
    this.http.post(`http://localhost:8080/api/calendar`, newCal).subscribe({
      next: response => {
        console.log('Posted to backend:', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  shareButtonClick(){
    if(this.signedIn){
      this.modalRef = this.modalService.show(this.sharing);
    }
  }
  
  shareCalSubmit(){
    let share = {
      email: this.email,
      groupID: this.groupID,
      calendarName: this.calendarName, 
      shareAbility: this.shareForm.value.shareEmail // change delimiter stuff
    }
    if(this.signedIn){
      this.patchSharedCal(share);
    }
    this.eventForm.reset();
    this.modalRef?.hide();  
  }
  
  patchSharedCal(share:any){
    console.log(share);
    // TODO changed shared with to add delimiters of old 
    this.http.patch(`http://localhost:8080/api/calendar`, share).subscribe({
      next: response => {
        console.log('Edited share:', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  async getShareButtonClick(){
    if(this.signedIn){
      let shared = await this.getSharedCal();
      if (shared != null){
        // Remove current events
        this.fullCalendarComponent.getApi().removeAllEvents();
        let sharedEmails, otherGroupID;
        console.log(shared);
        // All created calendars that belong and are shared to you, 
        for(let cal of shared){
          sharedEmails = cal.email;
          otherGroupID = cal.groupID;
          if(this.groupID == otherGroupID){
            // Add events for each calendar feteched
            const events = await this.fetchEvents(sharedEmails, otherGroupID) || [];
            for(let event of events){
              if(sharedEmails != this.email){
                event.groupID = '3';
                event.title = sharedEmails.substring(0,sharedEmails.indexOf('@'))+ ' ' + event.title;
              }
              this.fullCalendarComponent.getApi().addEvent(event);
            }
          }
        }
      }
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
