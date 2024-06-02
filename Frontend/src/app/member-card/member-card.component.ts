import { Component, Input, OnDestroy, OnInit,  } from '@angular/core';
import { Member } from '../../interfaces/member';
import { AuthService } from '../../services/auth.service';

import { Subscription, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent implements OnInit {
@Input() member!:Member; 
isOnline!:boolean;

 constructor(private authservice:AuthService){

 }
 ngOnInit(): void {
  const interval$ = interval(30000).pipe(
    switchMap(() => this.authservice.isUserOnline(this.member.id))
  );

  interval$.subscribe(res => {
      
        this.isOnline = res.isOnline;
      })
 }

 
 

}
