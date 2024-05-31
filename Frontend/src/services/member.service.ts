import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/member';
import { Observable, map, of } from 'rxjs';
import { PaginationResult } from '../interfaces/pagination';
import { userparams } from '../interfaces/userparams';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members:Member[] = [];

  constructor(private http:HttpClient) { }
  private baseUrl:string="http://localhost:5197/api/Account/"
  getMembers(userparams:userparams){
 
let params =this.getPaginationheaders(userparams.pageNumber , userparams.pageSize);
params=params.append('minAge', userparams.minAge.toString())
params=params.append('maxAge', userparams.maxage.toString())
params=params.append('gender', userparams.gender)
params=params.append('username', userparams.curentUsername)
    return this.paginationResult<Member[]>(this.baseUrl +'Members' ,params);
  }


  private paginationResult<T>(url: any, params: any): Observable<PaginationResult<T>> {
    const paginationResult: PaginationResult<T> = {
      result: undefined,
      pagination: undefined
    };
    try{
      return this.http.get<T>(url, { observe: 'response', params: params }).pipe(
        map((response: HttpResponse<T>) => {
          paginationResult.result = response.body ?? undefined; 
          const paginationHeader = response.headers.get("Pagination");
          console.log(paginationHeader);
          if (paginationHeader) {
            paginationResult.pagination = JSON.parse(paginationHeader);
          }
          return paginationResult;
        })
      );
    }catch(e){
     console.error(e);
     return of(paginationResult)
    }
   
  }


 private getPaginationheaders(pageNumber:number, pageSize:number){

  let params= new HttpParams();

    params=params.append("PageNumber",pageNumber.toString());
    params=params.append("PageSize",pageSize.toString());
  return params;

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
