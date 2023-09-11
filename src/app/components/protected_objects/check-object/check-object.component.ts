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
  comment: string;
  grade: number;
  input: boolean;
}

enum typeSummary {
  Grade = 'Grade',
  Comment = 'Comment'
}

@Component({
  selector: 'app-check-object',
  templateUrl: './check-object.component.html',
  styleUrls: ['./check-object.component.css']
})
export class CheckObjectComponent {



  gradeSummary: typeSummary = typeSummary.Grade;
  commentSummary: typeSummary = typeSummary.Comment;

  ProtectedObject: IProtectedObject = {id_object: 0};
  ReportNumber: number = 0;
  fio: string = '--';
  countTrouble: number = 0;
  resultCheck: number = 0;
  arrQuestion: IQuestion[] = [];

  summaryObject: any  = {};
  etalonSummaGrage = 0;

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


    datetimeLocal() {
      const dt = new Date();
      dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
      return dt.toISOString().slice(0, 16);
    }

   ngOnInit() {

    (document.getElementById('meeting-time') as HTMLDataElement).value = this.datetimeLocal();

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
    // console.log('id_user=', id_user);
    this.auth.getUserFromID(id_user).subscribe ( (resUser: any) => {
       this.fio = resUser[0].fio;
    });


    this.servguide.getCheckGuideGuide().subscribe ( (guideRes: any) => {
      console.log(guideRes);
      this.arrQuestion = guideRes;


      // console.log('this.arrQuestion', this.arrQuestion);

      this.arrQuestion.map ( el => {

        this.etalonSummaGrage = this.etalonSummaGrage + el.grade;

      });
      


    });
        
  }

    summaryClick(type: typeSummary, id_check: number, id_grage: number, target: any = '') {

  if (type == typeSummary.Grade)  { 
     if (this.summaryObject[id_check]) this.summaryObject[id_check].id_grage = id_grage; else
                                       this.summaryObject[id_check] = {id_grage: id_grage, comment: ''};
  }

  if (type == typeSummary.Comment)  { 
    if (this.summaryObject[id_check]) this.summaryObject[id_check].comment = target.value;
  }


  // пересчитываем результат
  this.resultCheck = 0;
  this.countTrouble = 0;
  for (let prop in this.summaryObject) {
    if (this.summaryObject[prop].id_grage == 0) this.countTrouble = this.countTrouble + 1;
    if (this.summaryObject[prop].id_grage !== 0) this.resultCheck = this.resultCheck + this.summaryObject[prop].id_grage;
  }
  if (this.etalonSummaGrage > 0) {
         this.resultCheck = Number((this.resultCheck/this.etalonSummaGrage * 100).toFixed(2));
  }

  }
  

  idDateisValid (date: Date) {
    return date.getTime() === date.getTime();
  } 


  closeCheck() {

    window.close();

  }

  saveCheck() {

    const dateBegin = new Date((document.getElementById('meeting-time') as HTMLDataElement).value);

    if (!this.idDateisValid(dateBegin)) {
      alert('Неправильная дата начала');
      return;
    }

    if (Object.keys(this.summaryObject).length < this.arrQuestion.length) {
      alert('Вы отметили не все пункты.');
      return;
    }

      this.servcheck.insertCheckList(this.ProtectedObject.id_object, 
                                    dateBegin, 
                                    new Date(), 
                                    this.auth.getSessionUser().id_user, 
                                    this.summaryObject,
                                    this.resultCheck,
                                    this.countTrouble).subscribe ( (res: any) => {
          

                    if (res.insertId) {
                      console.log(res.insertId);
                        alert ("Лист проверки №"+ res.insertId + " создан успешно.");
                        this.closeCheck();                    
                    } else alert("Лист проверки не создан.");
      });

  }


  //all
}
