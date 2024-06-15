import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

   hubConnection!: signalR.HubConnection;
   private messageReceivedSubject = new BehaviorSubject<string>('');
   messageReceived$ = this.messageReceivedSubject.asObservable();
   constructor(private notificationService: NotificationService) { }
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5197/notificationHub', {
        accessTokenFactory: () => {
          const user = localStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.token; 
          }
          return ''; 
        }
      })
      .build();

      this.hubConnection
          .start()
          .then(() => console.log('Connection started'))
          .catch(err => console.log('Error while starting connection: ' + err));

          this.hubConnection.on('ReceiveNotification', (message: string) => {
            this.notificationService.addNotification(message);
            this.messageReceivedSubject.next(message);
          });
  }

  // public addTransferChartDataListener() {
  //     this.hubConnection.on('ReceiveMessage', (user, message) => {
  //         console.log(`Message from ${user}: ${message}`);
  //     });
  // }


  // public addNotificationListener() {
  //   this.hubConnection.on('ReceiveNotification', (message: string) => {
  //       console.log('Notification received: ', message);
  //       this.notificationsSubject.next([...this.notificationsSubject.value, message]);
  //   });
// }



sendNotification(userId: string, message: string) {
  this.hubConnection.invoke('SendNotification', userId, message)
    .catch(err => console.error(err));
}

}
