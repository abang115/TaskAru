import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef  } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from "./event.utils";
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
  title: any;
  start: any;
  calendarOptions: any;
  
  config ={
    animated: true
  };

  @ViewChild('eventModal') eventModal!: string;
  @ViewChild('template') template!: string;
  @ViewChild('cal') fullCalendarComponent!:FullCalendarComponent;

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
          click: this.handleAddEventClick.bind(this)
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
    this.addEvent();
    }

  ngAfterViewInit(): void{
    console.log(this.fullCalendarComponent);
  }

  handleDateClick(arg:any){
    console.log(arg);
    console.log(arg.event._def.title);
    this.title = arg.event.def_title;
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  handleAddEventClick(){
    console.log('add events clicked');
    this.modalRef = this.modalService.show(this.eventModal);
  }

  addEvent(){
    console.log('add events clicked');
    console.log(this.addEventForm.value);
    let newEvent = {
      id: createEventId(),
      title: this.addEventForm.value.eventTitle || '',
      start: this.addEventForm.value.eventDate || '',
    }
    this.fullCalendarComponent.getApi().addEvent(newEvent);
    this.modalRef?.hide();  
  }

  addEventForm = new FormGroup({
    eventTitle: new FormControl('', [Validators.required]),
    eventDate: new FormControl('', [Validators.required]),
    // startTime: new FormControl(''),
    // endTime: new FormControl(''),
    // reoccuring: new FormControl(''),

  })
}

