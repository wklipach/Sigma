import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SummaryService } from 'src/app/services/summary.service';


type ObjectSenjor = {
  id_object?: number; 
  PONAME?: string; 
  senjor?: string;
};

type Company = {
  id_organization?: number; 
  name?: string; 
};

type OLLR = {
  name?: string; 
  bitOverdue: boolean;
};



@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})

export class SummaryComponent  implements OnInit  {



  id_staff: number = 0;
  ShowRes: { Age: ''; DateBirth: ''; fio: ''; phone: '', phone2: ''; position: ''; status: '';  typeperson: ''} | undefined;

  ShowObjectSenjor: ObjectSenjor[] = [];
  ShowCompany: Company[] = [];
  ShowOLLR: OLLR[] = [];




  constructor(private route: ActivatedRoute, private summaryServ: SummaryService ) { 
        this.route.queryParams.subscribe((params) => { this.id_staff = params['id_staff'];
      });
  }

  
   ngOnInit() {
    console.log(this.id_staff);


    this.summaryServ.getStaffOne(this.id_staff).subscribe ( (value: any) => {

      if (value?.[0] !== undefined) {
            this.ShowRes = {
                          Age:  value[0].Age,
                          DateBirth: value[0].DateBirth,
                          fio: value[0].fio,
                          phone: value[0].phone,
                          phone2: value[0].phone2,
                          position:value[0].position,
                          status: value[0].status,
                          typeperson: value[0].typeperson
                        };
                      }
      });
    

    this.summaryServ.getObjectSenjor(this.id_staff).subscribe ( (value: any) => {
      this.ShowObjectSenjor = value;
    });

    this.summaryServ.getCompany(this.id_staff).subscribe ( (value: any) => {
      this.ShowCompany = value;
    });

    this.summaryServ.getOLLR(this.id_staff).subscribe ( (value: any) => {
      this.ShowOLLR = value;
    });

  }

}
