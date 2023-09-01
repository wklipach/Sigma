import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChecklistService } from 'src/app/services/checklist.service';
import { GuideService } from 'src/app/services/guide.service';

interface ICheck {
  name: string; 
  grade: string;  
  comment: string;  
}

interface IListCheck {
  id?: number;
  id_object?: number;
  name?: string;
  address?: string;
  DateBegin?: Date; 
  DateEnd?: Date; 
  average_grade?: number; 
  count_trouble?: number;
  id_check_senjor?: number;
  fio?: string; 
}

@Component({
  selector: 'app-list-check-card',
  templateUrl: './list-check-card.component.html',
  styleUrls: ['./list-check-card.component.css']
})
export class ListCheckCardComponent {

  id_po_check: number = 0;
  arrayCheck: ICheck[] = [];
  infoCheck: IListCheck = {};

  constructor (private servguide: GuideService, 
    private auth: AuthService,
    private route: ActivatedRoute,
    private servcheck: ChecklistService) {

   this.route.queryParams.subscribe((params) => { 
     if (params['id_po_check']) {
         this.id_po_check = params['id_po_check'];
     }
   });
}


ngOnInit() {
    let sources: Observable<any>[] = [
      this.servcheck.getCheck(this.id_po_check),
      this.servcheck.getCheckTittleInfo(this.id_po_check),
    ];
    forkJoin(sources)
    .subscribe( ([res1, res2]) => {
      this.arrayCheck = res1;
        this.infoCheck = res2[0]; 

       
       if (this.infoCheck.DateBegin) {
           const dBegin = new Date (this.infoCheck.DateBegin);
           dBegin.setMinutes(dBegin.getMinutes() - dBegin.getTimezoneOffset());
           this.infoCheck.DateBegin = dBegin;
       }
        
       if (this.infoCheck.DateEnd) {
           const dEnd = new Date (this.infoCheck.DateEnd);
           dEnd.setMinutes(dEnd.getMinutes() - dEnd.getTimezoneOffset());
           this.infoCheck.DateEnd = dEnd;
       }


    });    
  }

}  
