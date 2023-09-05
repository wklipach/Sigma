import { DatePipe, Time } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  checked: boolean;
  count: number;
}

interface IMtrChecked {
  id_mtr: number;
  count: number;
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

   //для картинок
   public form!: FormGroup;
   loading = false;
   public sPhotoPostPath  = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private servguide: GuideService, 
    private auth: AvatarService,
    private fb: FormBuilder, 
    private gr: GlobalRef,
    private datePipe: DatePipe,
    private servPost: PostsService) {

      this.createForm();

      this.route.queryParams.subscribe((params) => { 
        if (params['id_post']) {
          this.id_post = params['id_post'];
        }
        });
}


  ngOnInit() {
    
    this.onLoadFromBasePhotoPost();
    let sources: Observable<any>[] = [
      this.servguide.getGuideDress(),
      this.servguide.getSmallGuide('guide_post_routine'),
      this.servguide.getGuideSpecialMeans(),
      this.servguide.getGuideWeapons(),
      this.servPost.getObjectFromPost(this.id_post),
      this.servPost.getPostBase(this.id_post),
      this.servPost.getPostSpecialMeans(this.id_post),
      this.servPost.getPostWeapons(this.id_post)
    ];
  
    forkJoin(sources)
    .subscribe( ([res1, res2, res3, res4, res5, res6, res7, res8]) => {
        this.guideDress = res1; 
        this.guidePostRoutine = res2; 


        this.loadSpecialMeans(res3, res7);
        this.loadWeapons(res4, res8);

        
        if (Array(res5).length>0) {
            this.protected_object.id_object = res5[0].id_object;
            this.protected_object.address = res5[0].address;
            this.protected_object.name = res5[0].name;
        }
       
        this.loadInfo(res6[0]);

        });  

       

  }



   //добавляем количество спецсредств в список для поста  
   loadSpecialMeans(res3: any, res7: any) {
    let SpecialMeans: IMtrGuide[] = res3;
    let SpecialMeansChecked: IMtrChecked[] = res7;
    
    SpecialMeans.forEach ( el => {
      el.count = 0;
      el.checked = false;          
    });

    SpecialMeansChecked.forEach ( el => {
      console.log('el=', el);
      let curEl =  SpecialMeans.find( b => b.id_mtr.toString() == el.id_mtr.toString());
      console.log('curEl=', curEl);
      if (curEl) {
         curEl.checked = true;
         curEl.count = el.count;
      } 
    });
    this.guideSpecialMeans = SpecialMeans;

   }

   //добавляем количество спецсредств в список для поста  
   loadWeapons(res4: any, res8: any) {
    let Weapons: IMtrGuide[] = res4;
    let WeaponsChecked: IMtrChecked[] = res8;
    
    Weapons.forEach ( el => {
      el.count = 0;
      el.checked = false;          
    });

    WeaponsChecked.forEach ( el => {
      console.log('el=', el);
      let curEl =  Weapons.find( b => b.id_mtr.toString() == el.id_mtr.toString());
      if (curEl) {
         curEl.checked = true;
         curEl.count = el.count;
      } 
    });
    this.guideWeapons = Weapons;

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
      //console.log(boolChecked, id_mtr);
      let count = (<HTMLInputElement> document.getElementById('idSpecialMeansCount'+id_mtr.toString())).value.trim();
      if (!Number(count)) {
        count = '0';
      }
     this.servPost.insertSpecialMeans(this.id_post, id_mtr, boolChecked, Number(count)).subscribe();   
   }

   onBlurSpecialMeansInput(target: any, id_mtr: number) {
       console.log(target.value, id_mtr);
       if (!Number(target.value)) return;
       const count = Number(target.value);
       this.servPost.updateSpecialMeans(this.id_post, id_mtr, count).subscribe();   

   }

   onClickWeapons(target: any, id_mtr: number) {
      const boolChecked = target.checked; 
      //console.log(boolChecked, id_mtr);
      let count = (<HTMLInputElement> document.getElementById('idWeaponsCount'+id_mtr.toString())).value.trim();
      if (!Number(count)) {
        count = '0';
      }
    this.servPost.insertWeapons(this.id_post, id_mtr, boolChecked, Number(count)).subscribe();   
 }

    onBlurWeaponsInput(target: any, id_mtr: number) {
      console.log(target.value, id_mtr);
      if (!Number(target.value)) return;
      const count = Number(target.value);
      this.servPost.updateWeapons(this.id_post, id_mtr, count).subscribe();   

 }


  back () {
      this.router.navigate(['/listpost']);
  }


  //РАБОТА С КАРТИНКАМИ

  onFileChange(event: any) {
    console.log('работаем с картинками');
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {

      const file: File = event.target.files[0];
      // todo 164
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const tempImg = new Image();
        if (typeof reader.result === 'string') {
          tempImg.src = reader.result;
        }

        tempImg.onload = () => {
          const dataURL = this.ResizeImage(tempImg);
          this.form!.get('photo_post')!.setValue({
            value: dataURL.split(',')[1]
          });

          this.form!.get('name')!.setValue(file.name);

          this.onPostImagePhotoPost();
        };
      };
    }
  } // onFileChange(event)

  onPostImagePhotoPost() {
    console.log('onPostImage');
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.servPost.updatePhotoPost( {'photo_post': formModel.get('photo_post'), 'Name': formModel.get('name') }, this.id_post, this.id_post).subscribe(() => {
      this.loading = false;
      this.onLoadFromBasePhotoPost();
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

  ResizeImage(tempImg: HTMLImageElement): string {
    const MAX_WIDTH = 200;
    const MAX_HEIGHT = 200;
    let tempW = tempImg.width;
    let tempH = tempImg.height;
    if (tempW > tempH) {
      if (tempW > MAX_WIDTH) {
        tempH *= MAX_WIDTH / tempW;
        tempW = MAX_WIDTH;
      }
    } else {
      if (tempH > MAX_HEIGHT) {
        tempW *= MAX_HEIGHT / tempH;
        tempH = MAX_HEIGHT;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = tempW;
    canvas.height = tempH;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(tempImg, 0, 0, tempW, tempH);
    const dataURL = canvas.toDataURL('image/png');

    return dataURL;
  }  

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      photo_post: ''
    });
  }

  private prepareSave(): FormData {
    const input: FormData = new FormData();
    // tslint:disable-next-line:max-line-length
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    // input.
    input.append('name', this.form!.get('name')!.value);
    input.append('photo_post', JSON.stringify(this.form!.get('photo_post')!.value));
    return input;
  }

  clearFile() {
    this.form!.get('photo_post')!.setValue(null);
    this.form!.get('name')!.setValue(null);
    this.sPhotoPostPath = '';
    this.onClearImageAvatar();
  }

  onClearImageAvatar() {
    this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.servPost.clearPhotoPost(this.id_post).subscribe(() => {
      this.loading = false;
      this.onLoadFromBasePhotoPost();
    });
  }


}
