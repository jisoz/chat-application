import { Component, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { MemberService } from '../../services/member.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-matche',
  templateUrl: './matche.component.html',
  styleUrl: './matche.component.css'
})
export class MatcheComponent implements OnInit {

memebers$!:Observable<Member[]>;
constructor(private memeberservice:MemberService){}

  ngOnInit(): void {
  this.memebers$=this.memeberservice.getMembers();
  }

 

}
