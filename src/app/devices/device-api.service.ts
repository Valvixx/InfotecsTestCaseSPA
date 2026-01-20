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

@Injectable({
  providedIn: 'root'
})
export class DeviceApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5096';  // твой порт

  getDevices() {
    return this.http.get<{ devices: string[] }>(`${this.baseUrl}/api/message/all_devices`).pipe(
      map(response => response.devices.map(id => ({ deviceName: id }))),  // ← ТОЧНО ТВОЙ ФОРМАТ
      catchError(() => of([]))
    );
  }

  getDeviceMessages(deviceName: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/api/message/messages_by_device?deviceName=${deviceName}`).pipe(
      catchError(() => of([]))
    );
  }
}
