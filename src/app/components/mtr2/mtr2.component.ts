import { Component, Renderer2, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import { GuideService } from 'src/app/services/guide.service';
import { MtrService } from 'src/app/services/mtr.service';
import { GlobalRef } from 'globalref';




interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface Imtr { 
  id_mtr?: string;
  name?: string;
  id_mtrvid?: string;
  mtrvid?: string;
  id_mtrcolor?: string;
  mtrcolor?: string;
  status?: string;
  description?: string;
  property?: string;
  equipment?: string;
  price?: string;
  size?: string;
  count?: string;

  date_purchase?: string;
  date_purchase_str?: string;  
  date_issue?: string;
  date_issue_str?: string;


  tabel_number?: string;
  invent_number?: string;
  serial_number?: string;
  barcode?: string;
  invoice?: string;
  delivery_contract?: string;
  id_organization?: string;
  organization?: string;
  id_object?: string;
  ProtectedObject?: string;

  };

  interface IDeleteObject {
    id_mtr?: number;
    sLink?: string;
  }


@Component({
  selector: 'app-mtr2',
  templateUrl: './mtr2.component.html',
  styleUrls: ['./mtr2.component.css']
})
export class Mtr2Component {


  ColumnMode = ColumnMode;
  @ViewChild('myTable') myTable!: DatatableComponent;
  ShowMtr: Imtr[] = [];


  ORIGINAL_ShowMtr: Imtr[] = [];

  guideMtrVid:  ISmallGuide[] = [];
  guideMtrColor:  ISmallGuide[] = [];
  guideOrganization:  ISmallGuide[] = [];
  guideProtectedObject:  ISmallGuide[] = [];
      //объект для модального окна удаления
  curDeleteObject: IDeleteObject = {};
  editing: any = {};


  guideMtrVid2:  ISmallGuide[] = [

    { id: '1', name: "Комплект формы"},
    { id: '2', name: "Форма"},
    { id: '3', name: "три"},
    { id: '4', name: "четыре"},
    { id: '5', name: "пять"},
    { id: '6', name: "шесть"}

  ];


  constructor (private mtrserv: MtrService, 
               private servguide: GuideService, 
               private datePipe: DatePipe,
               private renderer: Renderer2,
               public gr: GlobalRef) {  
  }




  ngOnInit() {

      this.mtrserv.getMTR().subscribe ( (value: any) => {

      this.ORIGINAL_ShowMtr = value;
      

      this.ORIGINAL_ShowMtr.forEach((el)=>
      {
        el.date_purchase_str = this.datePipe.transform(el.date_purchase, 'yyyy-MM-dd') || '--';
        el.date_issue_str = this.datePipe.transform(el.date_issue, 'yyyy-MM-dd') || '--';
        if (el.mtrvid == null) el.mtrvid = "--" ; 
        if (el.mtrcolor == null) el.mtrcolor = "--" ; 
        if (el.status?.trim() === "" || el.status?.trim() == null ) el.status = "--" ; 
        if (el.description?.trim() === "" || el.description?.trim() == null) el.description = "--" ; 
        if (el.property?.trim() === "" || el.property?.trim() == null) el.property = "--" ; 
        if (el.equipment?.trim() === "" || el.equipment?.trim() == null) el.equipment = "--" ; 
        if (el.price?.trim() == null || el.price?.trim() === "") el.price = "--" ; 
        if (el.size?.trim() == null || el.size?.trim() === "") el.size = "--" ; 
        if (el.count?.trim() == null || el.count?.trim() === "") el.count = "--" ; 
        if (el.tabel_number?.trim() === "" || el.tabel_number?.trim() == null) el.tabel_number = "--" ; 
        if (el.invent_number?.trim() === "" || el.invent_number?.trim() == null) el.invent_number = "--" ; 
        if (el.serial_number?.trim() === "" || el.serial_number?.trim() == null) el.serial_number = "--" ; 
        if (el.barcode?.trim() === "" || el.barcode?.trim() == null) el.barcode = "--" ; 
        if (el.invoice?.trim() === "" || el.invoice?.trim() == null) el.invoice = "--" ; 
        if (el.delivery_contract?.trim() === "" || el.delivery_contract?.trim() == null) el.delivery_contract = "--" ; 
        if (el.organization?.trim() === "" || el.organization?.trim() == null) el.organization = "--" ; 
        if (el.organization?.trim() === "" || el.organization?.trim() == null) el.organization = "--" ; 
        if (el.ProtectedObject?.trim() === "" || el.ProtectedObject?.trim() == null ) el.ProtectedObject = "--" ; 

      });


      // при загрузке показываем без всяких ограничений
      this.ShowMtr = [...this.ORIGINAL_ShowMtr];


    });


    this.servguide.getSmallGuide('guide_mtrvid').subscribe( (value: any) => {
      this.guideMtrVid = value; 
   });

   this.servguide.getSmallGuide('guide_mtrcolor').subscribe( (value: any) => {
    this.guideMtrColor = value; 
   });

   this.servguide.getSmallGuide('guide_organization').subscribe( (value: any) => {
    this.guideOrganization = value; 
   });


   this.servguide.getProtectedObjectGuide().subscribe( (value: any) => {
    this.guideProtectedObject = value; 
    console.log(this.guideProtectedObject);
   });


}



onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_mtr: string, field: string, strField: string) {

  if (ev) {
   let res = smallGuide.find( (el) => el.name == ev.target.value);
   if (res) {
   if (!res.name) res.name='';

   let resShowMtr = this.ShowMtr.find( (el) => el.id_mtr == id_mtr);
   if (resShowMtr) {
    resShowMtr[strField as keyof Imtr] = res.name;
   console.log('resShowMtr2=', resShowMtr);
   this.ShowMtr = [...this.ShowMtr];
   }

   let resShowMtrOriginal = this.ORIGINAL_ShowMtr.find( (el) => el.id_mtr == id_mtr);
   if (resShowMtrOriginal) {
    resShowMtrOriginal[strField as keyof Imtr] = res.name;
    this.ORIGINAL_ShowMtr = [...this.ORIGINAL_ShowMtr];
   }

    this.mtrserv.updateMtrSmallGuide(Number(res.id), res.name, id_mtr, field).subscribe(value => {
      //console.log(value);
    });

   }
  }

}



myEnter(event: Event) {

  if (event.target) {
    const elem = <HTMLElement>event.target;
    if (elem) elem.blur();
  }
}

gDblClick(rowIndex: any) {
  this.editing[rowIndex + '-mtrvid'] = true;
  console.log('DBLBV');
}

myValue(value: string) {
  console.log(value);
  if (value==="") return "--"; else return value;
}


myUpdateClick(element: any, id_mtr: number, field: string, strField: string) {
  let text = element.value;
  if (!text ) text='--';
  if (text === '') text='--';
  this.mtrserv.updateMtrOne(text.toString().trim(), id_mtr.toString(), field).subscribe( (res: any) => {
    //console.log('res update = ', res);
  });


  if (text="--") {
      let resShowMtr = this.ShowMtr.find( (el) => el.id_mtr == id_mtr.toString());
      if (resShowMtr) {
      resShowMtr[strField as keyof Imtr] = text;

      console.log('resShowMtr=', resShowMtr);

      this.ShowMtr = [...this.ShowMtr];
      }
      let resShowMtrOriginal = this.ORIGINAL_ShowMtr.find( (el) => el.id_mtr == id_mtr.toString());
      if (resShowMtrOriginal) {
      resShowMtrOriginal[strField as keyof Imtr] = text;
      this.ORIGINAL_ShowMtr = [...this.ORIGINAL_ShowMtr];
    }
  }


}

maxInputLength(e: Event, iLength: number) {
  const text =(e.target! as HTMLInputElement).value;
  if (text.length>=iLength) {
    e.preventDefault();
   }

}

maxPasteLength(e: ClipboardEvent, iLength: number) {
  let clipboardData = e.clipboardData;
  var s = clipboardData!.getData('text')
  if (s.length>=iLength) {
    e.preventDefault();
   }

   const text =(e.target! as HTMLInputElement).value;
   if (text.length>=iLength) {
     e.preventDefault();
    }
}

focusFunction(e: any, datestr: any) {
  e.target.type = 'date';
  e.target.value =  datestr;
}


idDateisValid (date: Date) {
  return date.getTime() === date.getTime();
}; 


setDatePurchase($event: any, id_mtr: number) {

      let date = new Date($event.target.value);
    const isDate = this.idDateisValid(date);

    
    if (isDate) {
      // console.log($event.target.value, date);
      this.mtrserv.updateMtrDate(date, id_mtr.toString(), 'date_purchase').subscribe( (res: any) => { console.log('res update = ', res); } );
    } else {
      // console.log($event.target.value, 'даты нет!');
      this.mtrserv.updateMtrDateNull(id_mtr.toString(), 'date_purchase').subscribe( (res: any) => { console.log('res update = ', res); } );
    }



    if (isDate) {

      this.ShowMtr.forEach((el: Imtr)=> {
        if (el.id_mtr == id_mtr.toString()) {
          let s: string =this.datePipe.transform(date, 'dd.MM.yyyy') || '--';
            el.date_purchase_str = s;
            console.log('el.date_purchase_str =', el.date_purchase_str);
         }
      });

      console.log('this.ShowMtr1=', this.ShowMtr);
      this.ShowMtr = [...this.ShowMtr];
      console.log('this.ShowMtr2=', this.ShowMtr);

      const res2 = this.ORIGINAL_ShowMtr.map( (el: Imtr) => {
        if (el.id_mtr == id_mtr.toString()) {
            el.date_purchase_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
            }
        return el;
      });
      this.ORIGINAL_ShowMtr = [...res2];
    

      

      $event.target.type = '';
      $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '--';
    }

  if (!isDate) {
    const res = this.ShowMtr.map( (el: Imtr) => {
        if (el.id_mtr == id_mtr.toString()) {
            el.date_purchase_str = '';
            }
        return el;
    });
    this.ShowMtr = [...res];

    const res2 = this.ORIGINAL_ShowMtr.map( (el: Imtr) => {
      if (el.id_mtr == id_mtr.toString()) {
          el.date_purchase_str = '';
          }
      return el;
    });
    this.ORIGINAL_ShowMtr = [...res2];
    $event.target.value= '--';
}
     $event.target.type = '';
  
}



setDateIssue($event: any, id_mtr: number) {

  let date = new Date($event.target.value);
  const isDate = this.idDateisValid(date);

   
  if (isDate) {
    // console.log($event.target.value, date);
    this.mtrserv.updateMtrDate(date, id_mtr.toString(), 'date_issue').subscribe( (res: any) => { console.log('res update = ', res); } );
  } else {
    // console.log($event.target.value, 'даты нет!');
    this.mtrserv.updateMtrDateNull(id_mtr.toString(), 'date_issue').subscribe( (res: any) => { console.log('res update = ', res); } );
  }


  if (isDate) {
    const res = this.ShowMtr.map( (el: Imtr) => {
        if (el.id_mtr == id_mtr.toString()) {
            el.date_issue_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
            }
        return el;
    });
    this.ShowMtr = [...res];

    const res2 = this.ORIGINAL_ShowMtr.map( (el: Imtr) => {
      if (el.id_mtr == id_mtr.toString()) {
          el.date_issue_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
          }
      return el;
    });
    this.ORIGINAL_ShowMtr = [...res2];

    $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
}




if (!isDate) {
  const res = this.ShowMtr.map( (el: Imtr) => {
      if (el.id_mtr == id_mtr.toString()) {
          el.date_issue_str = '';
          }
      return el;
  });
  this.ShowMtr = [...res];

  const res2 = this.ORIGINAL_ShowMtr.map( (el: Imtr) => {
    if (el.id_mtr == id_mtr.toString()) {
        el.date_issue_str = '';
        }
    return el;
  });
  this.ORIGINAL_ShowMtr = [...res2];

  $event.target.value = '';
}

  $event.target.type = '';

}


isNumeric (n: string) {
  if (n == '0') return true; else return !!Number(n);
 }

numberpress($event: any) {
  if (!this.isNumeric($event.key) )  $event.preventDefault();
}


onEnterSearch() {
  this.funcSearch();
 }

   

 funcSearch() {

   let sInput = (document.getElementById('search') as HTMLInputElement).value.trim().toUpperCase();

   if (sInput) {
       // console.log('ищем=',sInput);
       
       const res = this.ORIGINAL_ShowMtr.filter( (el: Imtr) => {
          return        (el.id_mtr &&  el.id_mtr.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.name &&  el.name.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.mtrvid &&  el.mtrvid.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.mtrcolor &&  el.mtrcolor.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.status &&  el.status.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.description &&  el.description.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.property &&  el.property.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.equipment &&  el.equipment.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.price &&  el.price.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.size &&  el.size.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.count &&  el.count.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.date_purchase_str &&  el.date_purchase_str.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.date_issue_str &&  el.date_issue_str.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.tabel_number &&  el.tabel_number.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.invent_number &&  el.invent_number.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.serial_number &&  el.serial_number.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.barcode &&  el.barcode.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.invoice &&  el.invoice.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.delivery_contract &&  el.delivery_contract.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.organization &&  el.organization.toString().toUpperCase().indexOf(sInput) != -1) ||
          (el.ProtectedObject &&  el.ProtectedObject.toString().toUpperCase().indexOf(sInput) != -1);
       });


       // console.log('find=', res)
       //this.ShowMtr =  JSON.parse(JSON.stringify(res));
       this.ShowMtr =  [...res];

       console.log(this.ShowMtr);

     } else {
       console.log('обнуляем поиск');
       // показываем без всяких ограничений
       this.ShowMtr = [...this.ORIGINAL_ShowMtr]; //JSON.parse(JSON.stringify(this.ORIGINAL_ShowMtr));
     }
   }  



   addNewMTR() {
    let el: Imtr = {};
    const s = 'Новый ресурс';
  
    
    this.mtrserv.addMtr(s).subscribe( (res: any) =>
      {
        if (res.insertId) {
          el.id_mtr = res.insertId;
          el.name = s;
          if (el.date_purchase_str?.trim() === "" || el.date_purchase_str?.trim() == null )  el.date_purchase_str='--';
          if (el.date_issue_str?.trim() === "" || el.date_issue_str?.trim() == null)  el.date_issue_str='--';
          if (el.mtrvid == null) el.mtrvid = "--" ; 
          if (el.mtrcolor == null) el.mtrcolor = "--" ; 

          if (el.status?.trim() === "" || el.status?.trim() == null ) el.status = "--" ; 
          if (el.description?.trim() === "" || el.description?.trim() == null ) el.description = "--" ; 
          if (el.property?.trim() === "" || el.property?.trim() == null ) el.property = "--" ; 
          if (el.equipment?.trim() === "" || el.equipment?.trim() == null) el.equipment = "--" ; 
          if (el.price?.trim() == null || el.price?.trim() == null) el.price = "--" ; 
          if (el.size?.trim() == null || el.size?.trim() == null) el.size = "--" ; 
          if (el.count?.trim() == null || el.count?.trim() == null) el.count = "--" ; 

          if (el.tabel_number?.trim() === "" || el.tabel_number?.trim() == null) el.tabel_number = "--" ; 
          if (el.invent_number?.trim() === "" || el.invent_number?.trim() == null) el.invent_number = "--" ; 
          if (el.serial_number?.trim() === "" || el.serial_number?.trim() == null) el.serial_number = "--" ; 
          if (el.barcode?.trim() === "" || el.barcode?.trim() == null) el.barcode = "--" ; 
          if (el.invoice?.trim() === "" || el.invoice?.trim() == null) el.invoice = "--" ; 
          if (el.delivery_contract?.trim() === "" || el.delivery_contract?.trim() == null) el.delivery_contract = "--" ; 
          if (el.organization?.trim() === "" || el.organization?.trim() == null) el.organization = "--" ; 
          if (el.ProtectedObject?.trim() === "" || el.ProtectedObject?.trim() == null ) el.ProtectedObject = "--" ; 
  
          this.ShowMtr.unshift(el);
          this.ShowMtr = [...this.ShowMtr];
          this.ORIGINAL_ShowMtr.unshift(el);
          this.ORIGINAL_ShowMtr = [...this.ORIGINAL_ShowMtr];
         
        }
      });
  }


  deleteMtr(id_mtr: number, sLink: string) {
    //openDeleteModalButton
    this.curDeleteObject.sLink = sLink;
    this.curDeleteObject.id_mtr = id_mtr;
    document!.getElementById("openDeleteModalButton")!.click();
  }

  deleteClose() {
    document!.getElementById("closeDeleteModalButton")!.click();
  }
    
  deleteSave() {
  
  
    if (this.curDeleteObject.id_mtr) {
  
      let idMtr = this.curDeleteObject.id_mtr;
      let indexShowMtr = this.ShowMtr.findIndex( (el  =>  el.id_mtr == idMtr.toString()));
      this.ShowMtr.splice(indexShowMtr,1);

      let indexOriginalShowMtr = this.ORIGINAL_ShowMtr.findIndex( (el  =>  el.id_mtr == idMtr.toString()));
      this.ORIGINAL_ShowMtr.splice(indexOriginalShowMtr,1);
  
      //refresh data
      this.ShowMtr = [...this.ShowMtr];
      this.ORIGINAL_ShowMtr = [...this.ORIGINAL_ShowMtr];
  
      this.mtrserv.deleteMtr(idMtr.toString()).subscribe();
    }

    this.deleteClose();
  }
  
}


