import { Component } from '@angular/core';
import { FiltersService } from '../services/filters.service';
import { GuideService } from '../services/guide.service';
import { Router } from '@angular/router';


interface ISmallGuide { 
  id?: string;  
  name?: string; 
}


@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.css']
})
export class AddFilterComponent {



  listfield1: any[] = [];
  listGuide1: ISmallGuide[] = [];
  boolGuideColumn1: boolean = false;
  listfield2: any[] = [];
  listGuide2: ISmallGuide[] = [];
  boolGuideColumn2: boolean = false;

  selectedField1: string = '';
  selectedValue1: string = '';
  selectedField2: string = '';
  selectedValue2: string = '';



  constructor(private servfilter: FiltersService, private servguide: GuideService, private router: Router) {}


  ngOnInit() {

      this.servfilter.getFiltersInit().subscribe( (value: any) => {
        this.listfield1 = value; 
        this.listfield2 = value; 
    });
  }



  onChangeColumn1(curEl: any) {
    // boolGuideColumn1

    if (curEl.value.toString() == "0") {
         this.boolGuideColumn1 = false;
         return;
    }

    let res = this.listfield1.find( (el: any) =>  el.id.toString() == curEl.value.toString());
    if (res) {
      if (res['bitGuide'] == true) {
        this.boolGuideColumn1 = true;
        //грузим справочник
        let guide_db = res['guide_db'];
        this.load_guide1(guide_db);
      } else {
      // грузим обычное поле  
      this.boolGuideColumn1 = false;
      }      
    }
  }



  load_guide1(guide_db: string) {
    if (guide_db !== "guide_senjor_guard") {
        this.servguide.getSmallGuide(guide_db).subscribe( (value: any) => {
          this.listGuide1 = value; 
        });
    }
  
    if (guide_db == "guide_senjor_guard") {    
          this.servguide.getSenjorGuard().subscribe( (value: any) => {
            this.listGuide1.length=0;
            value.forEach ( (el: any) => {
              this.listGuide1.push({id: el.id, name: el.fio});
            }); 
          });
    }     
  }


  onChangeColumn2(curEl: any) {
    // boolGuideColumn1

    if (curEl.value.toString() == "0") {
         this.boolGuideColumn2 = false;
         return;
    }

    let res = this.listfield2.find( (el: any) =>  el.id.toString() == curEl.value.toString());
    if (res) {
      if (res['bitGuide'] == true) {
        this.boolGuideColumn2 = true;
        //грузим справочник
        let guide_db = res['guide_db'];
        this.load_guide2(guide_db);
      } else {
      // грузим обычное поле  
      this.boolGuideColumn2 = false;
      }      
    }
  }

  load_guide2(guide_db: string) {
    if (guide_db !== "guide_senjor_guard") {
        this.servguide.getSmallGuide(guide_db).subscribe( (value: any) => {
          this.listGuide2 = value; 
        });
    }
  
    if (guide_db == "guide_senjor_guard") {    
          this.servguide.getSenjorGuard().subscribe( (value: any) => {
            this.listGuide2.length=0;
            value.forEach ( (el: any) => {
              this.listGuide2.push({id: el.id, name: el.fio});
            }); 
          });
    }     
  }


  saveFilter() {
    let field1 = '';
    let value1 = '';
    let field2 = '';
    let value2 = '';

    if (!(document.getElementById("filterName") as HTMLInputElement).value) return;
    if ((document.getElementById("filterName") as HTMLInputElement).value.trim() === "") return;
    let filterName = (document.getElementById("filterName") as HTMLInputElement).value.trim();


    if (this.selectedField1.trim().length == 0) return; 
    if (this.selectedField1.toString()== "0") return;

   //сохраняем строку один
   let res = this.listfield1.find( (el: any) =>  el.id.toString() == this.selectedField1.toString());
   field1= res.coumn_array;

   //если это справочник
   if (this.boolGuideColumn1) {
     value1 = this.selectedValue1.toString();
   } else {
      if (!document.getElementById("inputFirst")) return;
      value1 = (document.getElementById("inputFirst") as HTMLInputElement).value;
      if (value1 === "") value1 = "--";
   }


   //сохряняем строку два
   if (this.selectedField2.trim().length > 0 && this.selectedField2.toString() !== "0") {
        let res = this.listfield2.find( (el: any) =>  el.id.toString() == this.selectedField2.toString());
        field2= res.coumn_array;
          //если это справочник
          if (this.boolGuideColumn2) {
            value2 = this.selectedValue2.toString();
          } else {
            if (!document.getElementById("inputSecond")) return;
            value2 = (document.getElementById("inputFirst") as HTMLInputElement).value;
            if (value2 === "") value2 = "--";
          }
    }


    let dateBegin= (document.getElementById("dateBegin") as HTMLDataElement).value;
    let dateEnd= (document.getElementById("dateEnd") as HTMLDataElement).value;

    if ((dateBegin && !dateEnd) || (dateEnd && !dateBegin)) {
      alert("Неправильно введены даты");
      return;
    }

    this.servfilter.insertFilter(filterName, field1, value1, field2, value2, dateBegin, dateEnd).subscribe ( value =>
      {
        this.router.navigate(['staff2']);
      })
  }


  backFilter() {
    this.router.navigate(['staff2']);
  }




}
