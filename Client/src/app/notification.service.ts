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

  addEventData(eventData: EventData){
    this.eventData.push(eventData);
  }

  removeLastEventData(){
    if(this.eventData.length != 0){
      this.eventData.pop();
    }
  }

  removEventData(eventData: EventData){
    const index  = this.eventData.indexOf(eventData);
    if(index != -1){
      this.eventData.splice(index,1);
    }
  } 

  getEventData(){
    return this.eventData;
  }
}
