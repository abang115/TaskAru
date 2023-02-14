import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, public http: HttpClient) { }

  signupForm: FormGroup = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, {validators: [this.match('password', 'confirmPassword')]});;

  ngOnInit(): void {
  }

  match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    }
  }

  register(){
    const user = {
      firstName: this.signupForm.get('firstName')!.value, 
      lastName: this.signupForm.get('lastName')!.value,
      email: this.signupForm.get('email')!.value, 
      password: this.signupForm.get('password')!.value
    }
    
    this.http.post('http://localhost:8080/register', user).subscribe({
        next: response => {
          console.log('User successfully created', response)
        },
        error: err => {
          console.error('Error creating user: ', err)
        }
      });
  }
}
