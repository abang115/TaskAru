import { Component, OnInit} from '@angular/core';
import { SignInService } from '../sign-in.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  signedIn: boolean = false;

  constructor(private signInService:SignInService) {}

  ngOnInit(): void {
    this.signInService.isSignedIn$.subscribe((signInStatus: boolean) => {
      setTimeout(() => {
        this.signedIn = signInStatus
        console.log(this.signedIn)
      }, 2000)
  }); 
  }
}
