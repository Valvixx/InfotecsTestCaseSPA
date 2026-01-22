import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Device {
  deviceName: string;
}

export interface Message {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  version: string;
}

@Injectable({ providedIn: 'root' })
export class DeviceApiService {
  private http = inject(HttpClient);

  getDevices() {
    return this.http.get<{ devices: string[] }>(`/api/message/all_devices`).pipe(
      map(r => r.devices.map(id => ({ deviceName: id }))),
      catchError(() => of([]))
    );
  }

  getDeviceMessages(deviceName: string) {
    const q = encodeURIComponent(deviceName);
    return this.http.get<Message[]>(`/api/message/messages_by_device?deviceName=${q}`).pipe(
      catchError(() => of([]))
    );
  }
}

