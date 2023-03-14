import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false)
  public darkMode$ = this.darkMode.asObservable()

  toggleTheme() {
    this.darkMode.next(!this.darkMode.value)
  }

  getThemeVal() {
    return this.darkMode.value
  }

}
