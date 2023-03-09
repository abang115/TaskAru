import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, public http: HttpClient, private router: Router, public signInService: SignInService) { }
  signinForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
  }

  signIn() {
    if(!this.signinForm.invalid) {
      const userSignIn = {
        email: this.signinForm.get('email')!.value, 
        password: this.signinForm.get('password')!.value
      }
      console.log(userSignIn)
      
      this.http.post('http://localhost:8080/signin', userSignIn).subscribe({
        next: response => {
          console.log('Backend successfully reached: ', response)
          this.signInService.signIn()
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        error: err => {
          console.error('Error: ', err)
          this.signinForm.get('email')!.setErrors({
            'invalidEmail': true
          })
        }
      });
    }
  }
}
