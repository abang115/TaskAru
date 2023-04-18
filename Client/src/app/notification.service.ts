import { Injectable } from '@angular/core';

export interface EventData{
  title: string,
  date: string,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventData: EventData[] = [];

  addEventData(eventData: EventData){
    const twoDaysInMs = 2 * 23 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(today.getHours() - 4); // adjust UTC conversion for eventdate
    const eventDate = new Date(eventData.date);
    let diff = eventDate.getTime() - today.getTime();
    if(diff > 0 && diff <= twoDaysInMs){
      this.eventData.push(eventData);
    }
    else if(diff > -82800000 && diff < twoDaysInMs){ // Adjust for UTC conversion
      this.eventData.push(eventData);
    }
    console.log(this.eventData);
  }

  removeLastEventData(){
    if(this.eventData.length != 0){
      this.eventData.pop();
    }
  }

  removeEventData(eventData: EventData){
    const index  = this.eventData.indexOf(eventData);
    if(index != -1){
      this.eventData.splice(index,1);
    }
  } 

  removePastDue(): boolean{
    const today = new Date();
    for(let event of this.eventData){
      const [year, month, day] = event.date.split('-');
      const eventDate = new Date(Number(year), Number(month), Number(day));
      if(eventDate < today){
        this.removeEventData(event);
        return true;
      }
    }
    return false;
  }

  clearEventData(){
    this.eventData.splice(0, this.eventData.length);
  }

  getEventData(){
    return this.eventData;
  }
}
