import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { Member } from '../../interfaces/member';

@Component({
  selector: 'app-memeber-edit',
  templateUrl: './memeber-edit.component.html',
  styleUrl: './memeber-edit.component.css'
})
export class MemeberEditComponent implements OnInit {

  member!:Member;
  constructor(private memberservice: MemberService){

  }
  ngOnInit(): void {
    let user=localStorage.getItem('user') as string;
    this.memberservice.getMmeberbyname(user).subscribe(mmeber =>this.member=mmeber);
  }

}
