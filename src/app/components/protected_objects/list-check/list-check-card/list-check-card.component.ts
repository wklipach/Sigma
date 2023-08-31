import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChecklistService } from 'src/app/services/checklist.service';
import { GuideService } from 'src/app/services/guide.service';

interface ICheck {
  name: string; 
  grade: string;  
  comment: string;  
}

@Component({
  selector: 'app-list-check-card',
  templateUrl: './list-check-card.component.html',
  styleUrls: ['./list-check-card.component.css']
})
export class ListCheckCardComponent {

  id_po_check: number = 0;
  arrayCheck: ICheck[] = [];

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

  // сведения о проверке
  this.servcheck.getCheck(this.id_po_check).subscribe( (res: any) => {
    this.arrayCheck = res;
    console.log(this.arrayCheck);
  });
  }

}  
