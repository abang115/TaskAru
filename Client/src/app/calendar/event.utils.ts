import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment'; // import moment library

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
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

export function parseBackendForm(existingEvent:any){
  let parsedRRule = {
    freq: existingEvent.freq,
    dtstart: existingEvent.dtstart,
    until: existingEvent.until,
  }

  let parsedEvent = {
    groupid: '0',
    id: existingEvent.id || '',
    title: existingEvent.eventTitle || '',
    description: existingEvent.eventDescription || '',
    start: existingEvent.start || '',
    end: existingEvent.end || '',
    rrule: parsedRRule,
    backgroundColor: existingEvent.backgroundColor || '',
  }
  return parsedEvent
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}