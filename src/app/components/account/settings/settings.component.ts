import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { Observable, forkJoin } from 'rxjs';
import { AvatarService } from 'src/app/services/avatar.service';
import { GuideService } from 'src/app/services/guide.service';
import { SettingsService } from 'src/app/services/settings.service';
import { StaffService } from 'src/app/services/staff.service';


interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface ISenjorGuardGuide { 
  id?: string;  
  id_staff?: string;  
  fio?: string; 
}



interface ISetting { 
  id_staff?: string;  
  fio?: string;  
  f?: string;  
  i?: string;  
  o?: string;  
  phone?: string;  
  phone2?: string;  
  DateBirth?: Date;  
  DateBirth_str?: string;  
  height?: string;  
  weight?: string;  
  date_interview?: Date;  
  date_interview_str?: string;  
  id_organization?: string;  
  organization?: string;  
  department?: string;  
  senjor_guard?: string;  
  position?: string;  
  gender?: string;  
  type?: string; 
  sms?: string; 
  status?: string;  
  rank?: string;  
  comment?: string;  
  sAge?: string;  
}

interface IProtectedObject {
   id?: number; 
   id_object?: number; 
   name_object?: string;
}



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {


  loading = false;
  public sAvatarPath  = '';
  public form!: FormGroup;
  id_staff: number = 0;

  guideProtectedObject:  ISmallGuide[] = [];
  guidePosition:  ISmallGuide[] = [];
  guideStatus:  ISmallGuide[] = [];
  guideOrganization:  ISmallGuide[] = [];
  guideGender:  ISmallGuide[] = [];
  guideTypeperson:  ISmallGuide[] = [];
  guideSMS:  ISmallGuide[] = [];
  guideSenjorGuard:  ISenjorGuardGuide[] = [];
  guideDepartment:  ISmallGuide[] = [];
  settingData:  ISetting = {};
  settingProtectedObject:  IProtectedObject = {};


  constructor(private route: ActivatedRoute,
              private router: Router,
              private servguide: GuideService, 
              private auth: AvatarService,
              private fb: FormBuilder, 
              private gr: GlobalRef,
              private staffserv: StaffService,
              private settingserv: SettingsService,
              private datePipe: DatePipe) {

                this.createForm();
}


  ngOnInit(): void {


    this.route.queryParams.subscribe( (params) => { 
      this.id_staff = params['id_staff'];
      this.loadData();
      console.log('this.id_staff', this.id_staff);
     });

 }




 loadData() {
  this.onLoadFromBaseAvatar();
  //загружаем справочники Компания, Отдел, Руководитель, Должность, Разряд, Статус
  let sources: Observable<any>[] = [
      this.servguide.getSmallGuide('guide_position'),
      this.servguide.getSmallGuide('guide_organization'),
      this.servguide.getSmallGuide('guide_status'),  
      this.servguide.getSmallGuide('guide_gender'),
      this.servguide.getSmallGuide('guide_typeperson'),
      this.servguide.getSmallGuide('guide_sms'),
      this.servguide.getSenjorGuard(),
      this.servguide.getSmallGuide('guide_department'),
      this.settingserv.getSetting(this.id_staff),
      this.settingserv.getSettingProtectedObject(this.id_staff),
      this.servguide.getProtectedObjectGuide()
    ];

  forkJoin(sources)
  .subscribe(([res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11]) => {
      this.guidePosition = res1; 
      this.guideOrganization = res2; 
      this.guideStatus = res3; 
      this.guideGender = res4; 
      this.guideTypeperson = res5; 
      this.guideSMS = res6; 
      this.guideSenjorGuard = res7; 
      this.guideDepartment = res8;
      if (res9 && res9.length>0) {
        this.settingData = res9[0];  
        this.settingData.DateBirth_str = this.datePipe.transform(this.settingData.DateBirth, 'yyyy-MM-dd') || '';
        this.settingData.date_interview_str = this.datePipe.transform(this.settingData.date_interview, 'yyyy-MM-dd') || '';


        if (this.settingData.DateBirth) {
          this.settingData.sAge =  this.getAge(new Date (this.settingData.DateBirth)).toString();
        } else this.settingData.sAge = '--';

        this.settingData.f = '';
        this.settingData.i = '';
        this.settingData.o = '';
        const words = this.settingData.fio?.split(' ');
        if (words && words[0])  this.settingData.f = words[0];
        if (words && words[1])  this.settingData.i = words[1];
        if (words && words[2])  this.settingData.o = words[2];
      } 

      console.log('1', this.settingData.f);
      console.log('2', this.settingData.i);
      console.log('3', this.settingData.o);



      if (res10 && res10.length>0) {
        this.settingProtectedObject = res10[0];  
      }

      this.guideProtectedObject = res11;
      console.log('this.settingData=', this.settingData);
  });    

 }


  

 getAge (birthdate: Date) {
  let timeDiff = Math.abs(Date.now() - birthdate.getTime());
  let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  console.log(age)
  return age;
 }



  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });
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

        tempImg.onload = () => {
          const dataURL = this.ResizeImage(tempImg);
          this.form!.get('avatar')!.setValue({
            value: dataURL.split(',')[1]
          });

          this.form!.get('name')!.setValue(file.name);

          this.onPostImageAvatar();
        };
      };
    }
  } // onFileChange(event)


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


  onPostImageAvatar() {
    console.log('onPostImageAvatar');
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.auth.updateAvatarUserTable( {'Avatar': formModel.get('avatar'), 'Name': formModel.get('name') }, this.id_staff).subscribe(() => {
      this.loading = false;
      this.onLoadFromBaseAvatar();
    });
  }


  onLoadFromBaseAvatar() {
    this.sAvatarPath = '';
    this.auth.getStaffFromId(this.id_staff).subscribe((aRes: any) => {

      if (!aRes) {
        return;
      }

      if (Array(aRes).length === 0 ) {
        return;
      }

      const S = aRes[0].avatar_name;

      if (S !== '""' && (S)) {
        if (typeof S !== 'undefined') {
          if (S.length > 0) {
            this.sAvatarPath = this.gr.sUrlAvatarGlobal + S;
          }
        }
      }


    });
  }


  private prepareSave(): FormData {
    const input: FormData = new FormData();
    // tslint:disable-next-line:max-line-length
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    // input.
    input.append('name', this.form!.get('name')!.value);
    input.append('avatar', JSON.stringify(this.form!.get('avatar')!.value));
    return input;
  }


  clearFile() {
    this.form!.get('avatar')!.setValue(null);
    this.form!.get('name')!.setValue(null);
    this.sAvatarPath = '';
    this.onClearImageAvatar();
  }

  onClearImageAvatar() {
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.auth.clearStaffUserTable(this.id_staff).subscribe(() => {
      this.loading = false;
      this.onLoadFromBaseAvatar();
    });
  }

  onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], field: string) {
    if (ev) {
     let res = smallGuide.find( (el) => el.name == ev.target.value);
     if (res) {
     if (!res.name) res.name='';
      this.staffserv.updateProtectedSmallGuide(Number(res.id), res.name, this.id_staff.toString(), field).subscribe();
     }
    }
  }

  onChangeProtectedObject(ev: any, smallGuide:  ISmallGuide[], id: number) {



    console.log(this.settingProtectedObject);

    if (ev) {
      let res = smallGuide.find( (el) => el.name == ev.target.value);
      if (res) {
      if (!res.name) res.name='';
      console.log(res, id);

        if (res.id == '1') {
          this.settingserv.setSettingDeleteProtectedObject(id, this.settingProtectedObject.id_object || 0, this.id_staff).subscribe();
          return;
        }

        if (id == 0) {
          console.log('добавляем');
          this.settingserv.setInsertProtectedObject(res.id || '0', this.id_staff).subscribe();
          return;
        }

        if (id > 0) {
          console.log('апдейтим');
          this.settingserv.setUpdateProtectedObject(id, res.id || '0', this.id_staff).subscribe();
          return;
        }

      }
     }    
  }


  isNumeric (n: string) {
    if (n == '0') return true; else return !!Number(n);
   }

  myUpdateNumberClick(x: any, field: string) {

        let text = "";
        if (x.value) { text = x.value; }
        if (x.target.value) { text = x.target.value; }

        text = text.replace('\n', '');
        if (!this.isNumeric(text)) {
            text = 'null';
          } 
        this.staffserv.updateStaffNumber(text, this.id_staff.toString(), field).subscribe( (res: any) => {
          console.log('res update = ', res);
        });
  }

  onChangeSenjorGuard(ev: any,  senjorGuide:  ISenjorGuardGuide[], field: string) {
    if (ev) {
     let res = senjorGuide.find( (el) => el.fio == ev.target.value);
     if (res) {
      if (!res.fio) res.fio='';
         this.staffserv.updateProtectedSmallGuide(Number(res.id_staff), res.fio, this.id_staff.toString(), field).subscribe();
     }
    }
  }


  onChange(e: any) {
    if (e.target.value) {
      console.log(e.target.value);
    }
  }


  idDateisValid (date: Date) {
    return date.getTime() === date.getTime();
  } 


  
   setDate($event: any, field: string) {
        let date = new Date($event.target.value);
        const isDate = this.idDateisValid(date);
        if (isDate) {
          // console.log($event.target.value, date);
          this.staffserv.updateStaffDate(date, this.id_staff.toString(), field).subscribe( (res: any) => { console.log('res update = ', res); } );
        } else {
          // console.log($event.target.value, 'даты нет!');
          this.staffserv.updateStaffDateNull(this.id_staff.toString(), field).subscribe( (res: any) => { console.log('res update = ', res); } );
        }
   } 

   myUpdateClick(element: any, field: string) {
      let text = element.value;
      if (!text ) text='--';
      if (text === '') text='--';

      this.staffserv.updateStaffOne(text, this.id_staff.toString(), field).subscribe( (res: any) => {
        console.log('res update = ', res);
      });
   }


   myUpdateFioClick(element: any, field: string) {
    let text = element.value;


    if (field == 'f') {
      this.settingData.f = text;
    }

    if (field == 'i') {
      this.settingData.i = text;
    }

    if (field == 'o') {
      this.settingData.o = text;
    }

    this.settingData.fio = this.settingData.f + ' '+ this.settingData.i+' '+this.settingData.o;


    this.staffserv.updateStaffOne(this.settingData.fio, this.id_staff.toString(), 'fio').subscribe( (res: any) => {
      console.log('res update = ', res);
    })
    
 }



   backGeneral() {
    this.router.navigate(['general'], { queryParams: { id_staff: this.id_staff }});
 }
 

  //all
}