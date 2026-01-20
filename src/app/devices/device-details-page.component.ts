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
  template: `
    <section class="device-details">
      <div class="device-details__header">
        <div class="device-details__back">
          <a routerLink="/devices" class="back-link">
            ← Назад к устройствам
          </a>
        </div>
        <h1 class="device-details__title">Сессии устройства</h1>
        <div class="device-details__device-id">
          {{ deviceId() }}
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading">Загрузка сессий...</div>
      } @else if (hasError()) {
        <div class="error">Не удалось загрузить сессии устройства</div>
      } @else {
        @if (sessions().length === 0) {
          <div class="empty">Сессий не найдено</div>
        } @else {
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Всего сессий:</span>
              <span class="stat-value">{{ sessions().length }}</span>
            </div>
          </div>

          <table class="sessions-table" role="table" aria-label="Сессии устройства">
            <thead>
            <tr>
              <th scope="col">Устройство</th>
              <th scope="col">Начало</th>
              <th scope="col">Конец</th>
              <th scope="col">Длительность</th>
              <th scope="col">Версия</th>
            </tr>
            </thead>
            <tbody>
              @for (session of sessions(); track session._id) {
                <tr>
                  <td>{{ session.name }}</td>
                  <td>{{ formatDate(session.startTime) }}</td>
                  <td>{{ formatDate(session.endTime) }}</td>
                  <td>{{ formatDuration(session.startTime, session.endTime) }}</td>
                  <td>{{ session.version }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      }
    </section>
  `,
  styleUrls: ['./device-details-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceDetailsPageComponent {
  private deviceService = inject(DeviceApiService);
  private route = inject(ActivatedRoute);

  // ID из URL (/devices/{id})
  deviceId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '')
    ),
    { initialValue: '' }
  );

  // Список сессий
  sessions = signal<Message[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  constructor() {
    // Автозагрузка при смене deviceId
    effect(() => {
      const id = this.deviceId();
      console.log('📱 Device ID:', id);
      if (id) {
        this.loadSessions(id);
      }
    });
  }

  private loadSessions(deviceId: string) {
    console.log('Загрузка сессий для:', deviceId);
    this.isLoading.set(true);
    this.hasError.set(false);

    this.deviceService.getDeviceMessages(deviceId).subscribe({
      next: (messages) => {
        console.log('Сессии получены:', messages);
        this.sessions.set(messages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Ошибка сессий:', err);
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
