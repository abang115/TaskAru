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
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
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
  @ViewChild('template') template!: string;
  start: any;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    
  }
  handleDateClick(arg:any){
    console.log(arg);
    console.log(arg.event._def.title);
    this.title = arg.event.def_title;
    this.modalRef = this.modalService.show(this.template, this.config);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}

