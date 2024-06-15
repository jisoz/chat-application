import { Component } from '@angular/core';

import { SignalRService } from '../../services/signal-r.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  

  
  notifications: string[] = [];
  unreadCount = 0;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  markAsRead(index: number) {
    this.notificationService.markAsRead(index);
  }

 
}
