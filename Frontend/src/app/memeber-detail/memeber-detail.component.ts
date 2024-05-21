import { Component, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { MemberService } from '../../services/member.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrl: './memeber-detail.component.css'
})
export class MemeberDetailComponent implements OnInit {
  constructor(private memberservice:MemberService  , private route:ActivatedRoute){}
 memeber!:Member;
 username: string | null = '';
 galleryOptions!:NgxGalleryOptions[];
 galleryImages!:NgxGalleryImage[];


  ngOnInit(): void {
    this.LoadMember();
    
    this.galleryOptions=[{
      width:'500px',
      height:'500px',
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview:false

    }]
  }

  GetImages():NgxGalleryImage[]{
  const imageUrls=[];
  for (const photo of this.memeber.photos){
    imageUrls.push({
      small:photo?.url, 
      medium:photo?.url,
      big:photo?.url,
    })
  }
  return imageUrls;
  }

  LoadMember(){
    this.username = this.route.snapshot.paramMap.get('username');
    if (this.username) {
      this.memberservice.getMember( this.username).subscribe(
        res=>{
         
          this.memeber=res;
          this.galleryImages=this.GetImages();
        }
       )


    }
  
  }


}
