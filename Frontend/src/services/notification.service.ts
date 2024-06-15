import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();


  addNotification(notification: string) {
    const notifications = this.notificationsSubject.getValue();
    notifications.push(notification);
    this.notificationsSubject.next(notifications);
    this.unreadCountSubject.next(this.unreadCountSubject.getValue() + 1);
  }

  markAsRead(index: number) {
    const notifications = this.notificationsSubject.getValue();
    notifications.splice(index, 1);
    this.notificationsSubject.next(notifications);
    this.unreadCountSubject.next(this.unreadCountSubject.getValue() - 1);
  }
}
