import { Injectable } from '@angular/core';

export interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];            
  badge?: string;                
  renotify?: boolean;            
  tag?: string;                  
  requireInteraction?: boolean;  
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** ¿El navegador soporta la API? */
  get isSupported(): boolean {
    return 'Notification' in window;
  }

  /** Devuelve el estado actual: 'default' | 'granted' | 'denied' | 'unsupported' */
  get permission(): NotificationPermission | 'unsupported' {
    return this.isSupported ? Notification.permission : 'unsupported';
  }

  /** Pide permiso al usuario (debe llamarse por un gesto del usuario: click) */
  async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported) return 'unsupported';
    const result = await Notification.requestPermission();
    return result;
  }

  /**
   * Muestra una notificación local.
   * - Si hay Service Worker, usa showNotification (mejor en background).
   * - Si no, usa new Notification como fallback mientras la pestaña está activa.
   */
  async showLocalNotification(
    title: string,
    options: ExtendedNotificationOptions = {}
  ): Promise<void> {
    if (!this.isSupported) {
      console.warn('Notifications not supported by this browser.');
      return;
    }
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }

    // Opciones por defecto (puedes cambiarlas)
    const defaults: ExtendedNotificationOptions = {
      body: 'Esta es una notificación local de tu app.',
      icon: 'assets/icons/icon-192x192.png',
      badge: 'assets/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      tag: 'local-demo',
      renotify: true,
    };

    const finalOptions: ExtendedNotificationOptions = {
      ...defaults,
      ...options,
    };

    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) {
        await reg.showNotification(title, finalOptions);
      } else {
        new Notification(title, finalOptions);
      }
    } catch (err) {
      console.error('Error showing notification:', err);
    }
  }
}