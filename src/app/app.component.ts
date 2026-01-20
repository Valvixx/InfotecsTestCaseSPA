import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="app">
      <header class="app__header">
        <h1 class="app__title">Сервис мониторинга устройств</h1>
      </header>
      <main class="app__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
