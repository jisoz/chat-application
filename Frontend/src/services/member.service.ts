import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members:Member[] = [];

  constructor(private http:HttpClient) { }
  private baseUrl:string="http://localhost:5197/api/Account/"
  getMembers(){
    if (this.members.length>0) return of(this.members);
    return this.http.get<Member[]>(`${this.baseUrl}Members`).pipe(
     map(members=>{
      this.members = members;
      return members;

     }
      
      
     )

    );
  }

  getMember(username:string){
    const memeber=this.members.find(x=>x.knownAs===username);
    if (memeber!=undefined) return of(memeber);
    return this.http.get<Member>(`${this.baseUrl}Members/${username}`);
  }


  getMmeberbyname(username:string){
    const memeber=this.members.find(x=>x.name===username);
    if (memeber!=undefined) return of(memeber);
    return this.http.get<Member>(`${this.baseUrl}Member/${username}`);
  }

  UpdateMember(memeber:Member){
   return this.http.put(`${this.baseUrl}`, memeber).pipe(
    map(
      ()=>{
        const index=this.members.indexOf(memeber);
        this.members[index] = memeber;
      }
    )
   );
  }
    
}
