import { Component, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-matche',
  templateUrl: './matche.component.html',
  styleUrl: './matche.component.css'
})
export class MatcheComponent implements OnInit {

memebers!:Member[];
constructor(private memeberservice:MemberService){}

  ngOnInit(): void {
   this.LoadMembers();
  }

  LoadMembers(){
    this.memeberservice.getMembers().subscribe(
      res=>{
       this.memebers = res;
       console.log(res);
      },
   
    )
  }


}
