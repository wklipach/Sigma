import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { GuideService } from 'src/app/services/guide.service';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import { TableService } from 'src/app/services/table.service';


interface IProtectedObject {
  id_object: number;
  name: string;
}

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
  selector: 'app-object-card',
  templateUrl: './object-card.component.html',
  styleUrls: ['./object-card.component.css']
})
export class ObjectCardComponent {

  ProtectedObject: IProtectedObject = {id_object: 0, name: '--'};
  currentObject: ICurrentObject = {};
  public sObjectPath  = '';

  constructor (
    private servguide: GuideService, 
    private datePipe: DatePipe,
    private tableServ:  TableService,
    private router: Router,
    public gr: GlobalRef,
    public objserv:   ListobjectsService,
    private route: ActivatedRoute ) {  

      this.route.queryParams.subscribe((params) => { 

        if (params['id_object']) {
            this.ProtectedObject.id_object = params['id_object'];
        }

        if (params['name']) {
            this.ProtectedObject.name = params['name'];
        }
  });      

}


ngOnInit() {

  this.onLoadFromBase();
}



onLoadFromBase() {
  this.sObjectPath = '';
  this.objserv.getCurrentProtectedObjects(this.ProtectedObject.id_object).subscribe((aRes: any) => {

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
}


clickBack() {
  window.close();   
} 


clickSettings() {

  const id_object = this.ProtectedObject.id_object;
  this.router.navigate(['obj2settings'], { queryParams: { id_object }});

}

}
