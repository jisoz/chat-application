import { Component, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { MemberService } from '../../services/member.service';
import { decodeToken } from '../../helpers/decodefunction';
import { userparams } from '../../interfaces/userparams';


@Component({
  selector: 'app-matche',
  templateUrl: './matche.component.html',
  styleUrls: ['./matche.component.css']
})
export class MatcheComponent implements OnInit {
  members: Member[] = [];
  pagination: any = {};
  user: any;
  userid!:string
  userparams!: userparams;
  loading = false;
  genderList= [{value: "male",display:"Males"}, {value: "female", display:"Females"}];

  constructor(private memberservice: MemberService) {
    this.userparams=this.memberservice.getuserparams();


   
  }

  ngOnInit(): void {
    this.LoadMembers();
    // const userString = localStorage.getItem('user');
    // const user = userString ? JSON.parse(userString) : null;
    // const token=user.token
    // const decodedToken = decodeToken(token);
   
    // const userid=decodedToken.nameid;
    // this.userid=userid;
    // console.log( this.userid)
   
  }

  LoadMembers() {
    this.memberservice.setuserparams(this.userparams);
    this.loading = true;
    this.memberservice.getMembers(this.userparams).subscribe(
      res => {
        this.members = res.result ?? [];
        this.pagination = res.pagination;
        this.loading = false;
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }


  ResetFilter(){
    this.userparams = this.memberservice.resetuserparams()
    this.LoadMembers();
  }

  Pagechanged(event: any) {
    if (this.userparams.pageNumber !== event.page) {
      this.userparams.pageNumber = event.page;
      this.memberservice.setuserparams(this.userparams);
      this.LoadMembers();
    }
  }
}
