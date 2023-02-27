import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef  } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId, toEventFormat, getRandomColor } from "./event.utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FullCalendarComponent } from "@fullcalendar/angular";

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
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

  constructor(private modalService: BsModalService, private el: ElementRef) {     }

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
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
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
    this.selectedEvent = arg.event;
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  handleAddEventButtonClick(){
    this.modalRef = this.modalService.show(this.eventModal);
  }

  addEvent(){
    console.log('add events clicked');
    console.log(this.eventForm.value);
    let newEvent = {
      id: createEventId(),
      title: this.eventForm.value.eventTitle || '',
      description: this.eventForm.value.eventDescription || '',
      start: toEventFormat(this.eventForm.value.eventDate, this.eventForm.value.startTime) || '',
      end: toEventFormat(this.eventForm.value.eventDate, this.eventForm.value.endTime) || '',
      backgroundColor: getRandomColor()
    }
    console.log(newEvent);
    this.fullCalendarComponent.getApi().addEvent(newEvent);
    this.eventForm.reset();
    this.modalRef?.hide();  
  }

  eventForm = new FormGroup({
    eventTitle: new FormControl('', [Validators.required]),
    eventDate: new FormControl('', [Validators.required]),
    eventDescription: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    // reoccuring: new FormControl(''),
  })
}

