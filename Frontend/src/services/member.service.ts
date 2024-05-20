import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http:HttpClient) { }
  private baseUrl:string="http://localhost:5197/api/Account/"
  getMembers(){
    let token=localStorage.getItem("Token");
    let head_obj=new HttpHeaders().set("Authorization","bearer " +token);
    return this.http.get<Member[]>(`${this.baseUrl}Members`, {headers:head_obj});
  }

    
}
