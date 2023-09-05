import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalRef } from 'globalref';
import { GuideService } from 'src/app/services/guide.service';
import { PostsService } from 'src/app/services/posts.service';

interface IPObj {
  id_object: number;
	name: string;
	address: string;
}

interface IPostInfo {
  post_name?: string;
  post_number?: string;
  label?: string;
  camera_link?: string;
  TimeBegin?: string;
  TimeEnd?: string;
  DateBegin?: Date;
  DateEnd?: Date;
  id_post_routine?: number;
  routine?: string; 
  id_dress?: number;
  dress?: string;
  description?: string;
}

interface IMtrGuide {
  id_mtr: number;
  name: string; 
  description: string;
  checked: boolean;
  count: number;
}

interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface IPostWeapon { 
  id_mtr: string;  
  name: string; 
  count: number; 
}





@Component({
  selector: 'app-post-read',
  templateUrl: './post-read.component.html',
  styleUrls: ['./post-read.component.css']
})
export class PostReadComponent {

  protected_object: IPObj = {id_object: 0, name: "", address: ""};
  postInfo: IPostInfo ={};
  id_post: number = 0;
  guideDress: IMtrGuide[] = [];
  guidePostRoutine: ISmallGuide[] = [];
  guidePostWeapon:  IPostWeapon[] = [];
  guideSpecialMeans:  IPostWeapon[] = [];
   //для картинок
  public sPhotoPostPath  = '';


  constructor (private servPost: PostsService,
               private route: ActivatedRoute,
               private servguide: GuideService, 
               public gr: GlobalRef,
               )	  { 

        this.route.queryParams.subscribe((params) => { 
            if (params['id_post']) {
              this.id_post = params['id_post']; 
            }
        });
  }	

  ngOnInit() {
    this.onLoadFromBasePhotoPost();

    this.servPost.getObjectFromPost(this.id_post).subscribe ( (res5: any) => {
      if (res5) {
        this.protected_object.id_object = res5[0].id_object;
        this.protected_object.address = res5[0].address;
        this.protected_object.name = res5[0].name;
      }
     });

     this.servPost.getPostBase(this.id_post).subscribe ( (value: any) => {
        this.loadInfo(value[0]);
     });

  }


  loadInfo(postInfo: IPostInfo) {


    this.postInfo.post_name = postInfo.post_name;
    this.postInfo.post_number = postInfo.post_number;
    this.postInfo.label = postInfo.label;
    this.postInfo.camera_link = postInfo.camera_link;

    
    if (postInfo.TimeBegin) {
      this.postInfo.TimeBegin = postInfo.TimeBegin.substring(0, 5);
    }

    if (postInfo.TimeEnd) {
      this.postInfo.TimeEnd = postInfo.TimeEnd.substring(0, 5);
    }
  
    if (postInfo.DateBegin) {

      this.postInfo.DateBegin  = postInfo.DateBegin;
   }

   if (postInfo.DateEnd) {
    this.postInfo.DateEnd = postInfo.DateEnd;
   }
   
   if (postInfo.id_post_routine) {

    this.servguide.getSmallGuide('guide_post_routine').subscribe ( (res: any) => {
      this.guidePostRoutine = res;
      const s = this.guidePostRoutine.find( el => el.id?.toString() == postInfo.id_post_routine?.toString())?.name;
      if (s) {
       this.postInfo.routine =  s;
      }


    });
      //postInfo.id_post_routine
   }

   if (postInfo.id_dress) {
    this.servguide.getGuideDress().subscribe ( (res: any) => {
       this.guideDress = res;
       const fElem = this.guideDress.find( el => el.id_mtr.toString() == postInfo.id_dress?.toString());
       
       if (fElem?.name) {
        this.postInfo.dress = fElem.name;
       }

       if (fElem?.description) {
        this.postInfo.description = fElem.description;
       }

       
    });

   }

   this.servPost.getPostReadSpecialMeans(this.id_post).subscribe((res: any) => {
    this.guideSpecialMeans = res;
   });


    this.servPost.getPostReadWeapon(this.id_post).subscribe((res: any) => {
           this.guidePostWeapon = res;
    });

    
   }


  onLoadFromBasePhotoPost() {
    this.sPhotoPostPath = '';
    this.servPost.getPostPhotoName(this.id_post).subscribe((aRes: any) => {

      if (!aRes) {
        return;
      }

      if (Array(aRes).length === 0 ) {
        return;
      }

      const S = aRes[0].photo_name;

      if (S !== '""' && (S)) {
        if (typeof S !== 'undefined') {
          if (S.length > 0) {
            this.sPhotoPostPath = this.gr.sUrlPhotoPostGlobal + S;
          }
        }
      }


    });
  }

  close() {
    window.close();
  }

  

}
