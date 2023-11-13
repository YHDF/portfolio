import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightingModeService {
  // BehaviorSubject will hold the current theme and emit a new value whenever it changes.
  private lightingMode = new BehaviorSubject<string>('dark'); // default to 'light' mode

  // Observable to allow components to subscribe to lighting mode changes
  public lightingMode$ = this.lightingMode.asObservable();

  constructor() {}

  // Method to set the lighting mode
  setLightingMode(mode: 'light' | 'dark'): void {
    this.lightingMode.next(mode);
  }

  // Method to get the current lighting mode
  getLightingMode(): string {
    return this.lightingMode.value;
  }

  // Toggle the lighting mode
  toggleMode(): void {
    this.setLightingMode(this.getLightingMode() === 'light' ? 'dark' : 'light');
  }
}
