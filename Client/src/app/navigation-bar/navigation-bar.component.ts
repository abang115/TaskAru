import { Component, OnInit} from '@angular/core';
import { SignInService } from '../sign-in.service';
import { Router } from '@angular/router'
import { ThemeService } from '../theme.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  signedIn: boolean = false;
  darkMode: boolean = false;
  constructor(private signInService:SignInService, private themeService:ThemeService, private router:Router) {}

  ngOnInit(): void {
    let jwtHelper: JwtHelperService = new JwtHelperService
    const token = localStorage.getItem('token')
    if(token && !jwtHelper.isTokenExpired(token)) {
      this.signInService.signIn()
      this.signedIn = true
      this.router.navigate(['/home'])
    }
    else {
      localStorage.removeItem('token');
    }
    this.signInService.isSignedIn$.subscribe((signInStatus: boolean) => {
      setTimeout(() => {
        this.signedIn = signInStatus
        console.log(this.signedIn)
      }, 2000)
    });
  }

  signOut() {
    this.signInService.signOut()
    this.signInService.removeEmail()
    setTimeout(() => {
      this.router.navigate(['/signin'])
    }, 2000)
  }

  toggleMode() {
    this.themeService.toggleTheme()
    this.themeService.darkMode$.subscribe((themeStatus: boolean) => {
      this.darkMode = themeStatus
      console.log(this.darkMode)
  }); 
    document.body.classList.toggle("dark-mode")
  }
}
