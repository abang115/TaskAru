import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private isSignedIn = new BehaviorSubject<boolean>(false)
  public isSignedIn$ = this.isSignedIn.asObservable()
  public email!: string;

  signIn() {
    this.isSignedIn.next(true)
  }

  setEmail(email:string){
    this.email = email
    console.log(this.email)
  }

  getEmail(){
    console.log(this.email)
    return this.email
  }

  removeEmail(){
    this.email = ''
  }

  signOut() {
    this.isSignedIn.next(false)
  }

  getStatus():boolean{
    return this.isSignedIn.getValue()
  }
}
