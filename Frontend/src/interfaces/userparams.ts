import { Member } from "./member";

export class userparams{
    gender:string ;
    minAge=18;
    maxage=100;
    pageNumber=1;
    pageSize=1;
    curentUsername:string;

    constructor(user:any){
     this.gender = user.gender=='male' ? 'female' : 'male';
     this.curentUsername= user.name;
    }
}