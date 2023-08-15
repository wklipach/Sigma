import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { AvatarService } from 'src/app/services/avatar.service';
import { StaffService } from 'src/app/services/staff.service';

interface IObjectOne { 
  id_staff?: string;  
  fio?: string;  
  phone?: string;  
  phone2?: string;  
  id_position?: string;  
  guide_position?: string;  
  id_status?: string;  
  guide_status?: string;  
  id_gender?: string;  
  guide_gender?: string;  
  id_typeperson?: string;   
  guide_typeperson?: string;  
  DateBirth?: string;  
  sAge?: string;  
  DateBirth_str?: string;  
  s002from?: string;  
  s002from_str?: string;  
  s003from?: string;  
  s003from_str?: string;  
  rank?: string;  
  id_senjor_guard?: string;  
  senjor_guard?: string;  
  id_organization?: string;
  organization?: string;
  DateCreation?: string;
  
  date_interview?: string;
  date_interview_str?: string;  
  id_sms?: string;
  guide_sms?: string;
  Color?: string;
  comment?: string;
  avatar_name?: string;
  ItIsAvatar?: string;
}

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {

  public sAvatarPath  = '';
  id_staff: number = -1;

  constructor(private router: Router,
    private staffserv: StaffService, 
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private auth: AvatarService,
    private gr: GlobalRef) {
      
   }


   ngOnInit(): void {

    console.log('general onInit');

    this.route.queryParams.subscribe((params) => { 
      if (params['id_staff']) {
          this.id_staff = params['id_staff'];
          this.onLoadFromBaseAvatar();
      }
    });
 }  

 clickBack() {
  window.close();   
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

    console.log('this.sAvatarPath S=', S);

    if (S !== '""' && (S)) {
      if (typeof S !== 'undefined') {
        if (S.length > 0) {
          this.sAvatarPath = this.gr.sUrlAvatarGlobal + S;
        }
      }
    }
  });
}


settings() {

   const id_staff = this.id_staff;
   this.router.navigate(['settings'], { queryParams: { id_staff }});
}

ollr() {
    const id_staff = this.id_staff;
    this.router.navigate(['ollr'], { queryParams: { id_staff }});
}


AddStaff()  {
  document!.getElementById("openAddModalButton")!.click();
}

addClose() {
  document!.getElementById("closeAddModalButton")!.click();
}


addNewStaff() {

  let el: IObjectOne = {};
  const s = 'Новый сотрудник';

  
  this.staffserv.addStaff(s).subscribe( (res: any) =>
    {
      if (res.insertId) {
        this.addClose();
        const id_staff = res.insertId;
        this.router.navigate(['settings'], { queryParams: { id_staff }});
     

/*        
        el.id_staff = res.insertId;
        el.fio = s;
        el.s003from_str = this.datePipe.transform(el.s003from, 'yyyy-MM-dd') || '--';
        if (el.fio?.trim() === "" || el.fio?.trim() == null ) el.fio = "--" ; 
        if (el.phone?.trim() === "" || el.phone?.trim() == null ) el.phone = "--" ; 
        if (el.phone2?.trim() === "" || el.phone2?.trim() == null ) el.phone2 = "--" ; 
        if (el.guide_position?.trim() === "" || el.guide_position?.trim() == null ) el.guide_position = "--" ; 
        if (el.guide_status?.trim() === "" || el.guide_status?.trim() == null ) el.guide_status = "--" ; 
        if (el.guide_gender?.trim() === "" || el.guide_gender?.trim() == null ) el.guide_gender = "--" ; 
        if (el.guide_typeperson?.trim() === "" || el.guide_typeperson?.trim() == null ) el.guide_typeperson = "--" ; 
        if (el.DateBirth_str?.trim() === "" || el.DateBirth_str?.trim() == null ) el.DateBirth_str = "--" ; 
        if (el.s002from_str?.trim() === "" || el.s002from_str?.trim() == null ) el.s002from_str = "--" ; 
        if (el.s003from_str?.trim() === "" || el.s003from_str?.trim() == null ) el.s003from_str = "--" ; 
        if (el.rank?.toString().trim() === "" || el.rank?.toString().trim() == null ) el.rank = "--" ; 
        if (el.senjor_guard?.trim() === "" || el.senjor_guard?.trim() == null ) el.senjor_guard = "--" ; 
        if (el.organization?.trim() === "" || el.organization?.trim() == null ) el.organization = "--" ; 
        if (el.date_interview_str?.trim() === "" || el.date_interview_str?.trim() == null ) el.date_interview_str = "--" ;   
        if (el.comment?.trim() === "" || el.comment?.trim() == null ) el.comment = "--" ; 
        if (el.guide_sms?.trim() === "" || el.guide_sms?.trim() == null ) el.guide_sms = "--" ; 
*/


      }
    });
  

  
}



}
