import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  darkMode: boolean = false
  constructor(private formBuilder: FormBuilder, public http: HttpClient, private router: Router, private themeService: ThemeService) { }

  forgotForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((themeStatus: boolean) => {
      this.darkMode = themeStatus
    }); 
  }

  forgot(){
    if(!this.forgotForm.invalid) {
        const user = {
          email: this.forgotForm.get('email')!.value, 
        }
        const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
        console.log(user);
        
        this.http.post('http://localhost:8080/api/forgotpassword', user).subscribe({
            next: response => {
              console.log('Backend successfully reached: ', response)
            },
            error: err => {
              console.error('Error: ', err)
            }
          });
      }
    }
}
