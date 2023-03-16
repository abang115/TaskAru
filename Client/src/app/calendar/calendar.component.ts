import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { EventApi,} from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId, toEventFormat, parseToRRule, getRandomColor } from "./event.utils";
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
  @ViewChild('template') template!: string;
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
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  handleAddEventButtonClick(){
    this.modalRef = this.modalService.show(this.eventModal);
  }

  removeEvent(){
   this.selectedEvent.remove(); 
   this.modalRef?.hide(); 
  }

  addEvent(){
    let formVars = this.eventForm.value;
    console.log('add events clicked');
    // console.log(formVars);
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
    this.fullCalendarComponent.getApi().addEvent(newEvent);
    this.eventAddToBackend(newEvent);
    this.eventForm.reset();
    this.eventForm.get('reoccuring')?.setValue('once');
    this.modalRef?.hide();  
  }

  eventAddToBackend(newEvent:any){
    this.http.post('http://localhost:8080/api/event',newEvent).subscribe({
      next: response => {
        console.log('Backend successfully reached: ', response)
      },
      error: err => {
        console.error('Error: ', err)
      }
    });
  }

  eventForm = new FormGroup({
    eventTitle: new FormControl('', [Validators.required]),
    eventDate: new FormControl('', [Validators.required]),
    eventDescription: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    reoccuring: new FormControl('once'),
  })
}

