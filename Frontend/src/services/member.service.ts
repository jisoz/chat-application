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
    return this.http.get<Member[]>(`${this.baseUrl}Members`);
  }

  getMember(username:string){
    return this.http.get<Member>(`${this.baseUrl}Members/${username}`);
  }


  getMmeberbyname(username:string){
    return this.http.get<Member>(`${this.baseUrl}Member/${username}`);
  }

    
}
