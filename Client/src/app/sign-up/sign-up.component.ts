import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, public http: HttpClient, private router: Router) { }

  signupForm: FormGroup = this.formBuilder.group({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
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
    if(!this.signupForm.invalid) {
        const user = {
          first_name: this.signupForm.get('first_name')!.value, 
          last_name: this.signupForm.get('last_name')!.value,
          email: this.signupForm.get('email')!.value, 
          password: this.signupForm.get('password')!.value
        }
        const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
        console.log(user);
        
        this.http.post('http://localhost:8080/api/register', user).subscribe({
            next: response => {
              console.log('Backend successfully reached: ', response)
              setTimeout(() => {
                this.router.navigate(['/signin']);
              }, 2000);
            },
            error: err => {
              console.error('Error: ', err)
            }
          });
      }
    }
}
