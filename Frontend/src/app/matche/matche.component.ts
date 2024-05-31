import { Component, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { MemberService } from '../../services/member.service';
import { Observable, take } from 'rxjs';
import { pagination } from '../../interfaces/pagination';
import { userparams } from '../../interfaces/userparams';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-matche',
  templateUrl: './matche.component.html',
  styleUrl: './matche.component.css'
})
export class MatcheComponent implements OnInit {

// memebers$!:Observable<Member[]>;
members: Member[] = [];
pagination:any = {

};
user:any;
userparams!:userparams;
loading:any;
constructor(private memeberservice:MemberService, private authservicce:AuthService){}
  
  ngOnInit(): void {
    this.authservicce.currentuser$.pipe(take(1)).subscribe(user=>{
      this.user = user;
      this.userparams = new userparams(user);
    })
  this.LoadMembers();
  
  }

  LoadMembers(){
    this.loading = true;
    this.memeberservice.getMembers(this.userparams).subscribe(
      res=>{
        console.log(res);
        this.members = res.result ?? []; 
       
        this.pagination = res.pagination;
        this.loading = false;
      
      }
    )
  }
  Pagechanged(event:any){
    this.userparams.pageNumber=event.page;
    this.LoadMembers();

  }

}
