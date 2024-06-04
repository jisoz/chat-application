import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl:string="http://localhost:5197/api/"
  constructor(private http: HttpClient) { }

  addlike(username:string){
   return this.http.post(this.baseUrl+ 'likes/' + username, {})
  }

  // getLikes(predicate:string){
  //  return this.http.get(this.baseUrl+ 'likes?=' + predicate)
  // }
}
