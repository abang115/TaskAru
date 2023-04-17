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
    this.eventData.push(eventData);
    console.log(eventData);
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
    console.log(this.eventData);
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

  getEventData(){
    return this.eventData;
  }
}
