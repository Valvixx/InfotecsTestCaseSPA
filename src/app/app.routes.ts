import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/devices', pathMatch: 'full' },
  {
    path: 'devices',
    loadComponent: () => import('./devices/devices-page.component').then(m => m.DevicesPageComponent)
  },
  // ВРЕМЕННО ЗАКОММЕНТИЛИ
  // {
  //   path: 'devices/:id',
  //   loadComponent: () => import('./devices/device-details-page.component').then(m => m.DeviceDetailsPageComponent)
  // },
  { path: '**', redirectTo: '/devices' }
];
