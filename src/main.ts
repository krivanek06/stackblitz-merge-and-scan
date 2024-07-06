import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { SelectDeclarativeComponent } from './select-declarative.component';
import { SelectImperativeComponent } from './select-imperative.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectDeclarativeComponent, SelectImperativeComponent],
  template: `
    <div style="display: grid; place-content: center">
      <h2>Imperative Select</h2>
      <app-select-imperative />

      <div style="margin-top: 64px; margin-bottom: 64px" ></div>

      <h2>Declarative Select</h2>
      <app-select-declarative />
    </div>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
