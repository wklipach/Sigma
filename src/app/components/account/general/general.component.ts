import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {

  public sAvatarPath  = '';
  id_staff: number = -1;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private auth: AvatarService,
    private fb: FormBuilder, 
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




}
