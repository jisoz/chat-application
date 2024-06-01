import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { AlertifyServiceService } from '../../services/alertify-service.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { Photo } from '../../interfaces/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
user:any;

  constructor(private http:HttpClient, private alertify:AlertifyServiceService, private authservice:AuthService){

    this.authservice.currentuser$.pipe(take(1)).subscribe(user=>this.user = user);
  }
ngOnInit(): void {
  this.initializeuploader();

  // this.http.get("http://localhost:5197/api/Account/whoami",{responseType:"text" as any}).subscribe(
  //   res=>{
  //     console.log(res);
  //   }
  // )

}
@Input() memeber!:Member;
uploader!:FileUploader;
hasBaseDropZoneOver=false;
baseUrl="http://localhost:5197/api/Photo/";


fileOverBase(e:any){
  this.hasBaseDropZoneOver=e;
}

setmainphoto(photo:Photo){
  this.http.put(this.baseUrl + `set-main-photo/${photo.publicId}`, {}).subscribe(
    ()=>{
      this.user.photoUrl=photo.url;
      this.authservice.setcurrentuser(this.user);
      this.memeber.photoUrl=photo.url;
      this.memeber.photos.forEach(p => {
        if (p.isMain) p.isMain=false
        if(p.publicId==photo.publicId) photo.isMain=true;
      
      })

    },
   
  )
}

initializeuploader(): void {
  try {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const authToken = 'Bearer ' + user.token;
    this.uploader = new FileUploader({
      url: this.baseUrl + "upload-image-user",
      authToken: authToken,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      try {
        switch (filter.name) {
          case 'fileSize':
            alert('File size exceeded. Please select a file smaller than 10MB.');
            break;
          default:
            console.log('File not allowed');
            break;
        }
      } catch (error) {
        console.error('Error in onWhenAddingFileFailed:', error);
      }
      return false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      try {
        if (response) {
          const photo:Photo = JSON.parse(response);
          this.memeber.photos.push(photo);
          if(photo.isMain){
            this.user.photoUrl=photo.url;
            this.memeber.photoUrl=photo.url;
            this.authservice.setcurrentuser(this.user);
          }
        }
      } catch (error) {
        console.error('Error in onSuccessItem:', error);
      }
    };
  } catch (error) {
    console.error('Error in initializeuploader:', error);
  }
}

deletephoto(publicid:string){
try{

  this.http.delete(this.baseUrl + `deleteimageuser/${publicid}`).subscribe(
    res=>{
    this.memeber.photos = this.memeber.photos.filter((photo: any) => photo.publicId !== publicid);
    this.user.photoUrl="../../assets/default.jpg";
    this.memeber.photoUrl="../../assets/default.jpg";
    this.authservice.setcurrentuser(this.user);
     this.alertify.success("photo removed successfully")
    },
   
  )
}catch(e){
  console.error(e);
}




}

}
