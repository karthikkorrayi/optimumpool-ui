import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalNavigationComponent } from './shared/global-navigation/global-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalNavigationComponent],
  templateUrl: './app.component.html',
  styles:[]
})
export class AppComponent {
  title = 'OptimumPool';
}