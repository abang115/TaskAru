import { Injectable } from '@angular/core';

interface EventData{
  title: string,
  date: string,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventData: EventData[] = [];

  constructor() { }

  addEventData(eventData: EventData){
    this.eventData.push(eventData);
  }

  getEventData(){
    return this.eventData;
  }
}
