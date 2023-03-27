import { Component, OnInit} from '@angular/core';
import { SignInService } from '../sign-in.service';
import { Router } from '@angular/router'
import { ThemeService } from '../theme.service';

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
    this.signInService.isSignedIn$.subscribe((signInStatus: boolean) => {
      setTimeout(() => {
        this.signedIn = signInStatus
        console.log(this.signedIn)
      }, 2000)
    }); 

  }

  signOut() {
    setTimeout(() => {
      this.signInService.signOut()
      this.router.navigate(['/signin']);
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
