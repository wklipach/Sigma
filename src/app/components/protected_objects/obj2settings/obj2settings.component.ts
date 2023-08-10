import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { GuideService } from 'src/app/services/guide.service';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import { TableService } from 'src/app/services/table.service';

interface ICurrentObject { 
  id_object?: string;  
  name?: string; 
  id_post_status?: string; 
  post_status?: string; 
  options?: string; 
  id_organization?: string; 
  cur_organization?: string;   
  address?: string; 
  yandex_maps?: string;  
  google_maps?: string;  
  phone?: string; 
  id_senjor_guard?: string; 
  senjor_guard?: string; 
  postwasset_date?: string; 
  postwassetdate_str?: string; 
  withdrawal_date?: string;  
  withdrawaldate_str?: string;  
  id_mtr?: string; 
  MTR?: string; 
  id_customer?: string; 
  customer?: string; 
  id_object_type?: string; 
  object_type?: string; 
  photo_name?: string; 
};

@Component({
  selector: 'app-obj2settings',
  templateUrl: './obj2settings.component.html',
  styleUrls: ['./obj2settings.component.css']
})
export class Obj2settingsComponent {

  id_object: number = 0;
  public form!: FormGroup;
  loading = false;

  currentObject: ICurrentObject = {};
  public sObjectPath  = '';


  constructor (
    private servguide: GuideService, 
    private datePipe: DatePipe,
    private tableServ:  TableService,
    private fb: FormBuilder, 
    private router: Router,
    public gr: GlobalRef,
    public objserv:   ListobjectsService,
    private route: ActivatedRoute ) {  

      this.createForm();
   }


  ngOnInit() {

    this.route.queryParams.subscribe((params) => { 
      if (params['id_object']) {
          this.id_object = params['id_object'];
      }
      this.onLoadFromBase();
     
    });      

  }

  onLoadFromBase() {
    this.sObjectPath = '';
    this.objserv.getCurrentProtectedObjects(this.id_object).subscribe((aRes: any) => {
  
      if (!aRes) {
        return;
      }
  
      if (Array(aRes).length === 0 ) {
        return;
      }
  
      const S = aRes[0].photo_name;
  
      console.log('this.sObjectPath=', S);
  
      if (S !== '""' && (S)) {
        if (typeof S !== 'undefined') {
          if (S.length > 0) {
            this.sObjectPath = this.gr.sUrlObjectGlobal + S;
          }
        }
      }
      this.loadTextInfo (aRes);
      });
  }

  loadTextInfo (aRes: any) {
    this.currentObject = aRes[0];
    console.log('currentObject', this.currentObject);
  
  }

  clickBack() {

    const id_object = this.id_object;
    this.router.navigate(['obj2card'], { queryParams: { id_object }});
  }


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


        console.log('работаем с картинками 2');

        tempImg.onload = () => {
          const dataURL = this.ResizeImage(tempImg);
          this.form!.get('imageObject')!.setValue({
            value: dataURL.split(',')[1]
          });

          console.log('работаем с картинками 3');

          this.form!.get('name')!.setValue(file.name);

          this.onPostImageAvatar();
        };
      };
    }
  } // onFileChange(event)

  onPostImageAvatar() {
    console.log('onPostImageAvatar');
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.objserv.updatePhotoObject( {'imageObject': formModel.get('imageObject'), 'Name': formModel.get('name') }, this.id_object).subscribe(() => {
      this.loading = false;
      this.onLoadFromBase();
    });
  }

  private prepareSave(): FormData {
    const input: FormData = new FormData();
    // tslint:disable-next-line:max-line-length
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    // input.
    input.append('name', this.form!.get('name')!.value);
    input.append('imageObject', JSON.stringify(this.form!.get('imageObject')!.value));
    return input;
  }

  clearFile() {
    this.form!.get('imageObject')!.setValue(null);
    this.form!.get('name')!.setValue(null);
    this.sObjectPath = '';
    this.onClearImageAvatar();
  }

  onClearImageAvatar() {
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.objserv.clearPhotoObject(this.id_object).subscribe(() => {
      this.loading = false;
      this.onLoadFromBase();
    });
  }



  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      imageObject: ''
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

}