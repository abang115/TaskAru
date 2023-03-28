import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EventApi, } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId, toEventFormat, parseToRRule, getRandomColor, parseBackendForm } from "./event.utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit  {
  modalRef?: BsModalRef;
  calendarVisible = true;
  currentEvents: EventApi[] = [];
  selectedEvent: any;
  calendarOptions: any;

  config ={
    animated: true
  };

  @ViewChild('eventModal') eventModal!: string;
  @ViewChild('showEvent') showEvent!: string;
  @ViewChild('editEventModal') editEventModal!: string;
  @ViewChild('cal') fullCalendarComponent!:FullCalendarComponent; // Access the Calendar as an object

  constructor(private modalService: BsModalService, private http: HttpClient) {     }

  ngOnInit(): void {
    this.calendarOptions = {
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
      initialEvents: INITIAL_EVENTS, 
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventClick: this.handleDateClick.bind(this),
    };
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
      id: createEventId(),
      title: formVars.eventTitle || '',
      description: formVars.eventDescription || '',
      start: toEventFormat(formVars.eventDate, formVars.startTime) || '',
      end: toEventFormat(formVars.eventDate, formVars.endTime) || '',
      rrule: parseToRRule(formVars.eventDate, formVars.reoccuring),
      backgroundColor: getRandomColor()
    }
    console.log(newEvent);
    // Call fullcalendar api to add event
    this.fullCalendarComponent.getApi().addEvent(newEvent);
    // Add event to backend
    this.eventAddToBackend(newEvent, formVars.eventDate || '', formVars.startTime || '', formVars.endTime || '');
    // Reset form with default values
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    // Hide Modal upon exit
    this.modalRef?.hide();  
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
    // Fetch old event
    let oldEvent = this.fullCalendarComponent.getApi().getEventById(formVars.id||'');
    console.log(oldEvent);
    // create a new edited event
    let editedEvent = {
      // groupid: '0',
      id: formVars.id || '',
      title: formVars.eventTitle || '',
      description: formVars.eventDescription || '',
      start: toEventFormat(formVars.eventDate, formVars.startTime) || '',
      end: toEventFormat(formVars.eventDate, formVars.endTime) || '',
      rrule: parseToRRule(formVars.eventDate, formVars.reoccuring),
      backgroundColor: formVars.color || '',
    }
    console.log(editedEvent);
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
    this.eventRemoveToBackend(this.selectedEvent.toPlainObject());
    this.selectedEvent.remove(); 
    this.modalRef?.hide(); 
   }

  eventAddToBackend(newEvent:any, EDate:string, startT:string, endT:string){
    let f
    let u
    let d
    if(newEvent.rrule == undefined){
      f = ''
      u = ''
      d = ''
    }
    else{
      f = newEvent.rrule.freq
      u = newEvent.rrule.until
      d = newEvent.rrule.dtstart
    }

    const backendForm = {
      email: 'aaa@gamil.com', //TODO ADD EMAIL WHEN LOGGED IN 
      // groupid: newEvent.groupid,
      eventID: newEvent.id,
      eventTitle: newEvent.title,
      eventDescription: newEvent.description,
      eventDate: EDate, 
      startTime: startT,
      endTime: endT,
      freq: f,
      until: u,
      dtstart: d,
      backgroundColor: newEvent.backgroundColor,
    }
    console.log(backendForm)  
    this.http.post('http://localhost:8080/api/event',backendForm).subscribe({
      next: response => {
        console.log('Backend successfully reached: ', response)
        console.log('Event successfully added ')
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  eventRemoveToBackend(existingEvent:any){
    //Todo
  }

  eventEditToBackend(editedEvent:any){
    this.http.put('http://localhost:8080/api/event',editedEvent).subscribe({
      next: response => {
        console.log('Backend successfully reached: ', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  fetchEvents(){
    // TODO GET FUNCTION RETURN EVENTS
    
    // PARSE EVENTS TO FORMAT, CALL parseBackendForm  FUNCTION
    
    // PUT THEM ON THE CALENDAR AND REFRESH
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
