import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signal-r.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
 
 
  

  // receivedMessage!: string;

  constructor(private signalRService: SignalRService) {
    // this.signalRService.messageReceived$.subscribe(message => {
    //   this.receivedMessage = message;
    // });
  }
  ngOnInit(): void {
    // this.signalRService.startConnection();
   
  }

  // sendMessage() {
  //   const userId = '4034'; 
  //   const message = 'Hello from Angular';
  //   this.signalRService.sendNotification(userId, message);
  // }

  
  

  



}
