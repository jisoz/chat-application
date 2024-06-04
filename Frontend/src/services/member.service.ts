import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/member';
import { Observable, map, of, take } from 'rxjs';
import { PaginationResult } from '../interfaces/pagination';
import { userparams } from '../interfaces/userparams';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members:Member[] = [];
  user!:any;
  userparams!:userparams;
  membercaache= new Map();
  constructor(private http:HttpClient, private authservice: AuthService) {

    this.authservice.currentuser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userparams = new userparams(user);
      // this.LoadMembers();
    });
   }

   getuserparams(){
    return  this.userparams;
   }

   setuserparams(params:userparams){
this.userparams = params;
   }

   resetuserparams(){
this.userparams=new userparams(this.user);
return this.userparams;


   }

  private baseUrl:string="http://localhost:5197/api/Account/"
  getMembers(userparams:userparams){
 let response = this.membercaache.get(Object.values(userparams).join('-'));
 if (response){
return of(response)

 }
let params =this.getPaginationheaders(userparams.pageNumber , userparams.pageSize);
params=params.append('minAge', userparams.minAge.toString())
params=params.append('maxAge', userparams.maxage.toString())
params=params.append('gender', userparams.gender)
params=params.append('username', userparams.curentUsername)
    return this.paginationResult<Member[]>(this.baseUrl +'Members' ,params).pipe(
      map(response => {
        this.membercaache.set(Object.values(userparams).join('-'),response);
        return response;
      })
    );
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
    const memeber=[...this.membercaache.values()].reduce((arr,elm)=>arr.concat(elm.result), []).find((memebr:Member)=>memebr.knownAs==username)
    if (memeber){
      return of(memeber)
    }

    
    return this.http.get<Member>(`${this.baseUrl}Members/${username}`);
  }


  getMmeberbyname(username:string){
    const memeber=[...this.membercaache.values()].reduce((arr,elm)=>arr.concat(elm.result), []).find((memebr:Member)=>memebr.name==username)
    if (memeber){
      return of(memeber)
    }
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
