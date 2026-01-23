import { ChangeDetectionStrategy, Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeviceApiService, Message } from './device-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-device-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './device-details-page.component.html',
  styleUrls: ['./device-details-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceDetailsPageComponent {
  private deviceService = inject(DeviceApiService);
  private route = inject(ActivatedRoute);

  // ID from URL (/devices/{id})
  deviceId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '')
    ),
    { initialValue: '' }
  );

  // List of sessions
  sessions = signal<Message[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  constructor() {
    // Auto-load when deviceId changes
    effect(() => {
      const id = this.deviceId();
      console.log('📱 Device ID:', id);
      if (id) {
        this.loadSessions(id);
      }
    });
  }

  private loadSessions(deviceId: string) {
    console.log('Loading sessions for:', deviceId);
    this.isLoading.set(true);
    this.hasError.set(false);

    this.deviceService.getDeviceMessages(deviceId).subscribe({
      next: (messages) => {
        console.log('Sessions received:', messages);
        this.sessions.set(messages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Session Error:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();

    if (diffMs < 0) return '0ч 0м';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  }
}
