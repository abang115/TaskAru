import { SignUpComponent } from './sign-up.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { SignInService } from '../sign-in.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignUpComponent', () => {
    it('should mount', () => {
      cy.mount(SignUpComponent, {
        imports: [
          FormsModule,
          ReactiveFormsModule,
          HttpClientModule,
          MatButtonModule,
          MatCheckboxModule,
          MatFormFieldModule,
          MatInputModule,
          BrowserAnimationsModule,
        ],
        providers:[
          Router, 
          SignInService,
        ],
      })
      cy.viewport(600, 525)
    });
})