import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeviceApiService, Device } from './device-api.service';

@Component({
  selector: 'app-devices-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './devices-page.component.html',
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
        console.log('Received devices:', devices);
        this.devices.set(devices);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
