import { Component, OnInit, ViewChild, TemplateRef  } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from "./event.utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit{
  modalRef?: BsModalRef;
  calendarVisible = true;
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
        click: this.addEventClick.bind(this)
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
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
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
  
  addEventClick(){
    console.log('add events clicked');
    this.modalRef = this.modalService.show(this.addEventModal);
  }
  addEvent(){

  }
}

