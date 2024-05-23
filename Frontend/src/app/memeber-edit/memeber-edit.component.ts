  import { Component, HostListener, OnInit, ViewChild, viewChild } from '@angular/core';
  import { MemberService } from '../../services/member.service';
  import { Member } from '../../interfaces/member';
  import { NgForm } from '@angular/forms';
import { AlertifyServiceService } from '../../services/alertify-service.service';

  @Component({
    selector: 'app-memeber-edit',
    templateUrl: './memeber-edit.component.html',
    styleUrl: './memeber-edit.component.css'
  })
  export class MemeberEditComponent implements OnInit {
  @ViewChild('editform') editForm!: NgForm; 
  @HostListener("window:beforeunload", ['$event']) unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true;  
    }
  }
    member!:Member;

    constructor(private memberservice: MemberService, private alertify: AlertifyServiceService){

    }
    ngOnInit(): void {
      let user=localStorage.getItem('user') as any;
      const userObj = JSON.parse(user);
     
      this.memberservice.getMmeberbyname(userObj.name).subscribe(mmeber =>this.member=mmeber);
   
    }


    updateMember(){
    this.memberservice.UpdateMember(this.member).subscribe(()=>this.alertify.success("Updated Successfully") );
    this.editForm.reset();
      
    }
   

  }
