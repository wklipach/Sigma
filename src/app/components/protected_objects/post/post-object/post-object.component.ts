import { DatePipe, Time } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { Observable, forkJoin } from 'rxjs';
import { AvatarService } from 'src/app/services/avatar.service';
import { GuideService } from 'src/app/services/guide.service';
import { PostsService } from 'src/app/services/posts.service';

interface IMtrGuide {
  id_mtr: number;
  name: string; 
  description: string;
}

interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface IPObj {
  id_object: number;
	name: string;
	address: string;
}

interface IPostInfo {
  post_name: string;
  post_number: string;
  label: string;
  camera_link: string;
  TimeBegin?: string;
  TimeEnd?: string;
  DateBegin?: Date;
  DateEnd?: Date;
  id_post_routine?: number;
  id_dress?: number;
}


@Component({
  selector: 'app-post-object',
  templateUrl: './post-object.component.html',
  styleUrls: ['./post-object.component.css']
})
export class PostObjectComponent {


  guideDress: IMtrGuide[] = [];
  guideSpecialMeans: IMtrGuide[] = [];
  guideWeapons: IMtrGuide[] = [];
  guidePostRoutine: ISmallGuide[] = [];
  protected_object: IPObj = {id_object: 0, name: "", address: ""};
  postInfo: IPostInfo = {  post_name: '', post_number: '',  label: '',  camera_link: ''};

  id_post: number = 0;

   // ngModel для select-option
   id_post_routine = 0;
   id_dress = 0;
   //конец ngModel для select-option

  constructor(private route: ActivatedRoute,
    private router: Router,
    private servguide: GuideService, 
    private auth: AvatarService,
    private fb: FormBuilder, 
    private gr: GlobalRef,
    private datePipe: DatePipe,
    private servPost: PostsService) {

      this.route.queryParams.subscribe((params) => { 
        if (params['id_post']) {
          this.id_post = params['id_post'];
        }
        });
}


  ngOnInit() {
    //getGuideDress()

    let sources: Observable<any>[] = [
      this.servguide.getGuideDress(),
      this.servguide.getSmallGuide('guide_post_routine'),
      this.servguide.getGuideSpecialMeans(),
      this.servguide.getGuideWeapons(),
      this.servPost.getObjectFromPost(this.id_post),
      this.servPost.getPostBase(this.id_post)
    ];
  
    forkJoin(sources)
    .subscribe( ([res1, res2, res3, res4, res5, res6]) => {
        this.guideDress = res1; 
        this.guidePostRoutine = res2; 
        this.guideSpecialMeans = res3;
        this.guideWeapons = res4;
        
        if (Array(res5).length>0) {
            this.protected_object.id_object = res5[0].id_object;
            this.protected_object.address = res5[0].address;
            this.protected_object.name = res5[0].name;
        }
       
        this.loadInfo(res6[0]);

        });  

        

  }



   loadInfo(postInfo: IPostInfo) {


    (document.getElementById('namePost') as HTMLInputElement).value = postInfo.post_name;
    (document.getElementById('numberPost') as HTMLInputElement).value = postInfo.post_number;
    (document.getElementById('labelPost') as HTMLInputElement).value = postInfo.label;
    (document.getElementById('linkcameraPost') as HTMLInputElement).value = postInfo.camera_link;


    
    if (postInfo.TimeBegin) {
       (<HTMLInputElement> document.getElementById("idTimeBegin")).value=postInfo.TimeBegin.substring(0, 5);
    }

    if (postInfo.TimeEnd) {
     (<HTMLInputElement> document.getElementById("idTimeEnd")).value = postInfo.TimeEnd.substring(0, 5);
    }
  
    if (postInfo.DateBegin) {

      (<HTMLInputElement> document.getElementById("idDateBegin")).valueAsDate = new Date(postInfo.DateBegin);
   }

   if (postInfo.DateEnd) {
    (<HTMLInputElement> document.getElementById("idDateEnd")).valueAsDate = new Date(postInfo.DateEnd);
   }
   
   if (postInfo.id_post_routine) {
      this.id_post_routine = postInfo.id_post_routine;
   }

   if (postInfo.id_dress) {
    this.id_dress = postInfo.id_dress;
   }

    
   }
    

   onClickSpecialMeans(target: any, id_mtr: number) {
    const boolChecked = target.checked; 
    console.log(boolChecked, id_mtr);
    let count = (<HTMLInputElement> document.getElementById('idSpecialMeansCount'+id_mtr.toString())).value.trim();
    if (!Number(count)) {
       count = '0';
    }

     this.servPost.insertSpecialMeans(this.id_post, id_mtr, boolChecked, Number(count)).subscribe( res=> 
      console.log(res) 
      );   

   }


  close () {
      window.close();
  }

  save() {

    console.log('save');

  }

}
