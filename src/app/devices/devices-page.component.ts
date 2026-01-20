import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeviceApiService, Device } from './device-api.service';

@Component({
  selector: 'app-devices-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="devices-page">
      <div class="devices-page__header">
        <h1 class="devices-page__title">Устройства</h1>
      </div>

      @if (isLoading()) {
        <div class="devices-page__loading">Загрузка списка...</div>
      } @else if (hasError()) {
        <div class="devices-page__error">Ошибка загрузки устройств</div>
      } @else {
        @if (devices().length === 0) {
          <div class="devices-page__empty">Устройств нет</div>
        } @else {
          <ul class="devices-list" role="list">
            @for (device of devices(); track device.deviceName) {
              <li class="devices-list__item">
                <a
                  [routerLink]="['/devices', device.deviceName]"
                  class="devices-list__link"
                >
                  {{ device.deviceName }}
                </a>
              </li>
            }
          </ul>
        }
      }
    </section>
  `,
  styleUrls: ['./devices-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesPageComponent {
  private deviceService = inject(DeviceApiService);

  devices = signal<Device[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  constructor() {
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        console.log('Получены устройства:', devices);
        this.devices.set(devices);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Ошибка API:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
