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
  let modifiedTime = moment(time, 'hh:mm A').format('HH:mm:ss');
  let finishedFormat = modifiedDate + 'T' + modifiedTime;
  return finishedFormat;
}