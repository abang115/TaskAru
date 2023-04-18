import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment'; // import moment library


const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: '0',
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: '1',
    title: 'Timed event',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00'
  },
  {
    id: '2',
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  }
];

export function createEventId(eventID: any) {
  return String(eventID++);
}

export function toEventFormat(date:any, time:any){
  let modifiedDate = moment(date).format('YYYY-MM-DD');
  if(time != '' && time != null){
    let modifiedTime = moment(time, 'hh:mm A').format('HH:mm:ss');
    let finishedFormat = modifiedDate + 'T' + modifiedTime;
    return finishedFormat;
  }
  return modifiedDate;
}

export function parseToRRule(date:any, reoccuringType:any){
  if(reoccuringType == 'once'){
    return undefined;
  }
  let newRRule ={
    freq: reoccuringType,
    dtstart: date,
    until: '2025-01-01' // Temp stopping point
  }
  return newRRule;
}

export function parseFromBackend(existingEvent:any){
  let temp;
  if (existingEvent.freq == ''){
    temp = undefined;
  }
  else{
    temp = parseToRRule(existingEvent.eventDate, existingEvent.freq) || '';
  }
  let parsedEvent = {
    // groupid: '0',
    id: existingEvent.eventID || '',
    title: existingEvent.eventTitle || '',
    description: existingEvent.eventDescription || '',
    start: toEventFormat(existingEvent.eventDate, existingEvent.startTime) || '',
    end: toEventFormat(existingEvent.eventDate, existingEvent.endTime) || '',
    rrule: temp,
    backgroundColor: existingEvent.backgroundColor || '',
  }
  return parsedEvent
}

export function parseToBackend(newEvent:any, EDate:string, startT:string, endT:string, eEmail:string){
  let f, u, d;
  // Check if rrule is defined for this event 
  if(newEvent.rrule == undefined){
    f = '';
    u = '';
    d = '';
  }
  else{
    f = newEvent.rrule.freq;
    u = newEvent.rrule.until;
    d = newEvent.rrule.dtstart;
  }
  // Create form that will be sent to backend
  const backendForm = {
    email: eEmail,
    groupID: newEvent.groupID,
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
  return backendForm;
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}