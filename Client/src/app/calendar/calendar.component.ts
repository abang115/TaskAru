import { Component, OnInit, ViewChild, TemplateRef,ChangeDetectorRef  } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from "./event.utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit{
  modalRef?: BsModalRef;
  calendarVisible = true;
  currentEvents: EventApi[] = [];
  title: any;
  start: any;
  calendarOptions: CalendarOptions = {
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
  
  config ={
    animated: true
  };

  @ViewChild('addEventModal') addEventModal!: string;
  @ViewChild('template') template!: string;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    this.calendarOptions = this.calendarOptions;
  }

  handleDateClick(arg:any){
    console.log(arg);
    console.log(arg.event._def.title);
    this.title = arg.event.def_title;
    
    this.modalRef = this.modalService.show(this.template, this.config);
  }
  
  handleAddEventClick(){
    console.log('add events clicked');
    this.modalRef = this.modalService.show(this.addEventModal);
  }

  addEvent(){
    console.log('add events clicked');

  }

  addEventForm = new FormGroup({
    eventTitle: new FormControl('',[Validators.required]),
    eventDate: new FormControl('',[Validators.required]),
    // startTime: new FormControl(''),
    // endTime: new FormControl(''),
    // reoccuring: new FormControl(''),

  })
}

