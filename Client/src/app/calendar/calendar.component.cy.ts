import { CalendarComponent } from "./calendar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FullCalendarComponent } from "@fullcalendar/angular";


describe('CalendarComponent', () => {
    it('should mount', () => {
      cy.mount(CalendarComponent, {
        imports: [
          FormsModule,
          ReactiveFormsModule,
        ],
        providers:[
          BsModalRef,
          BsModalService,
        ],
        declarations: [FullCalendarComponent,],
      })
      cy.viewport(1000, 850)
    });
})