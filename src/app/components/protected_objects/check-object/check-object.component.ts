import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChecklistService } from 'src/app/services/checklist.service';
import { GuideService } from 'src/app/services/guide.service';


interface IProtectedObject {
  id_object: number;
  name?: string;
  address?: string
}

interface  IQuestion {
  id: number;
  name: string;
  grade: number;
  input: boolean;
}


@Component({
  selector: 'app-check-object',
  templateUrl: './check-object.component.html',
  styleUrls: ['./check-object.component.css']
})
export class CheckObjectComponent {



  ProtectedObject: IProtectedObject = {id_object: 0};
  ReportNumber: number = 0;
  fio: string = '--';
  countTrouble: number = 0;
  resultCheck: number = 0;
  arrQuestion: IQuestion[] = [];

  constructor (private servguide: GuideService, 
               private auth: AuthService,
               private route: ActivatedRoute,
               private servcheck: ChecklistService) {

              this.route.queryParams.subscribe((params) => { 
                if (params['id_object']) {
                    this.ProtectedObject.id_object = params['id_object'];
                }
              });
   }


   ngOnInit() {

    // сведения об объекте
    this.servcheck.getObjectInfo(this.ProtectedObject.id_object).subscribe( (res: any) => {
        this.ProtectedObject.name = res[0].name;
        this.ProtectedObject.address = res[0].address;
    });
    
    // следующий номер
    this.servcheck.getNextNumber().subscribe ( (resNextNumber: any) => {
      this.ReportNumber  = resNextNumber[0].NextNumber;
    }); 


    //подробности об юзере
    const id_user = this.auth.getSessionUser().id_user;
    console.log('id_user=', id_user);
    this.auth.getUserFromID(id_user).subscribe ( (resUser: any) => {
       this.fio = resUser[0].fio;
    });


    this.servguide.getCheckGuideGuide().subscribe ( (guideRes: any) => {
      console.log(guideRes);
      this.arrQuestion = guideRes;
      console.log('this.arrQuestion', this.arrQuestion);
    });
        
  }

  contClick() {

    console.log('click');

  }


}
