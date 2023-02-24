import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private isSignedIn = new BehaviorSubject<boolean>(false)
  public isSignedIn$ = this.isSignedIn.asObservable()

  signIn() {
    this.isSignedIn.next(true)
  }

  signOut() {
    this.isSignedIn.next(false)
  }
}
