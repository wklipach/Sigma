import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryService } from 'src/app/services/summary.service';



interface IShowRes { 
  Age?: string; 
  DateBirth?: Date; 
  fio?: string; 
  phone?: string; 
  phone2?: string; 
  position?: string; 
  status?: string; 
  typeperson?: string; 
  rank?: string;
};


interface IObjectSenjor  {
  id_object?: number; 
  PONAME?: string; 
  senjor?: string;
};

interface ICompany  {
  id_organization?: number; 
  name?: string; 
};

interface IOLLR  {
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
  ShowRes: IShowRes = <IShowRes>{};
  ShowObjectSenjor: IObjectSenjor[] = [];
  ShowCompany: ICompany[] = [];
  ShowOLLR: IOLLR[] = [];




  constructor(private route: ActivatedRoute, private summaryServ: SummaryService, private router: Router) { 
        this.route.queryParams.subscribe((params) => { this.id_staff = params['id_staff'];
      });
  }

  
   ngOnInit() {

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
                          typeperson: value[0].typeperson,
                          rank: value[0].rank
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

  backStaff() {
    this.router.navigate(['staff2']);
  }

}
