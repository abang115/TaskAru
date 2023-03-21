import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  darkMode: boolean = false
  constructor(private formBuilder: FormBuilder, public http: HttpClient, private router: Router, private themeService: ThemeService, private route: ActivatedRoute) { }

  resetForm: FormGroup = this.formBuilder.group({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, {validators: [this.match('password', 'confirmPassword')]});;

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((themeStatus: boolean) => {
      this.darkMode = themeStatus
    }); 
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

  reset(){
    if(!this.resetForm.invalid) {
        const user = {
          password: this.resetForm.get('password')!.value, 
          token: this.route.snapshot.params['token']
        }
        const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
        console.log(user);
        
        this.http.patch('http://localhost:8080/api/resetpassword', user).subscribe({
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
