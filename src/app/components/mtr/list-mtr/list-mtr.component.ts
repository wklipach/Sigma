import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, Renderer2, ViewChild } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { MtrService } from 'src/app/services/mtr.service';



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
  selector: 'app-list-mtr',
  templateUrl: './list-mtr.component.html',
  styleUrls: ['./list-mtr.component.css']
})
export class ListMtrComponent {



  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  ShowMtr: Imtr[] = [];
  ORIGINAL_ShowMtr: Imtr[] = [];

  guideMtrVid:  ISmallGuide[] = [];
  guideMtrColor:  ISmallGuide[] = [];
  guideOrganization:  ISmallGuide[] = [];
  guideProtectedObject:  ISmallGuide[] = [];
      //объект для модального окна удаления
  curDeleteObject: IDeleteObject = {};



  constructor (private mtrserv: MtrService, 
               private servguide: GuideService, 
               private datePipe: DatePipe,
               private renderer: Renderer2) {  

  }


  ngOnInit() {

    this.mtrserv.getMTR().subscribe ( (value: any) => {

      this.ORIGINAL_ShowMtr = value;
      // posts.forEach((post)=>post.id===1?post.text='other text':post.text=post.text)
      this.ORIGINAL_ShowMtr.forEach((el)=>
      {
        el.date_purchase_str = this.datePipe.transform(el.date_purchase, 'yyyy-MM-dd') || '';
        el.date_issue_str = this.datePipe.transform(el.date_issue, 'yyyy-MM-dd') || '';
      });

      // при загрузке показываем без всяких ограничений
      this.ShowMtr = JSON.parse(JSON.stringify(this.ORIGINAL_ShowMtr));


    });

    this.servguide.getSmallGuide('guide_mtr').subscribe( (value: any) => {
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
   });

}


clicObject(objectmtr: Imtr) {
    alert(objectmtr.name );
}

onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_object: string, field: string) {
  if (ev) {
   let res = smallGuide.find( (el) => Number(el.id) == Number(ev.target.value));
   if (res) {
    if (!res.name) res.name='';
    this.mtrserv.updateMtrSmallGuide(Number(res.id), res.name, id_object, field).subscribe(value => {
      //console.log(value);
    })
   }
  }
}

myUpdateClick(x: any, id_mtr: number, field: string) {
  let text = x.innerText;
  if (!text ) text='';
  this.mtrserv.updateMtrOne(text, id_mtr.toString(), field).subscribe( (res: any) => {
    //console.log('res update = ', res);
  });
}

maxInputLength(e: Event, iLength: number) {
  const text =(e.target! as HTMLInputElement).innerText;
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
      const res = this.ShowMtr.map( (el: Imtr) => {
          if (el.id_mtr == id_mtr.toString()) {
              el.date_purchase_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
              }
          return el;
      });
      this.ShowMtr = [...res];

      const res2 = this.ORIGINAL_ShowMtr.map( (el: Imtr) => {
        if (el.id_mtr == id_mtr.toString()) {
            el.date_purchase_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
            }
        return el;
      });
      this.ORIGINAL_ShowMtr = [...res2];

      $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
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

    $event.target.value = '';
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
       
       const res = this.ORIGINAL_ShowMtr.filter( (el) => {
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
       this.ShowMtr =  JSON.parse(JSON.stringify(res));

     } else {
       console.log('обнуляем поиск');
       // показываем без всяких ограничений
       this.ShowMtr = [...this.ORIGINAL_ShowMtr]; //JSON.parse(JSON.stringify(this.ORIGINAL_ShowMtr));
     }
   }  


   addNewMTR() {

    let item: Imtr = {};
    const s = 'Новый ресурс';
  
    
    this.mtrserv.addMtr(s).subscribe( (res: any) =>
      {
        if (res.insertId) {
          item.id_mtr = res.insertId;
          item.name = s;
          this.ShowMtr.unshift(item);
          this.ShowMtr = [...this.ShowMtr];

          this.ORIGINAL_ShowMtr.unshift(item);
          this.ORIGINAL_ShowMtr = [...this.ORIGINAL_ShowMtr];
          
          this.virtualScroll.scrollTo({top: 0});
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
  


  // divColName
  ngAfterViewInit() {

/*    
    const htmlElem = document.getElementById("divColName")!;
    const thColName = document.getElementById("thColName")!;

    const resizeObserver = new ResizeObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            // contentBoxSize is an array:
            console.log("entry.contentBoxSize: " + entry.contentBoxSize[0].inlineSize, 'htmlElem=', htmlElem.clientWidth)
            this.renderer.setStyle(thColName, "width", `${htmlElem.clientWidth}px`);
          } else {
            console.log("entry.contentRect: " + entry.contentRect.width)
          }
        }
      }
    )
    resizeObserver.observe(htmlElem);
*/    
  }


  test() {

    //const htmlElem = document.getElementById("divColName")!;
    const thColName = document.getElementById("thColName")!;
    const tdColName = document.getElementById("name")!;
    //console.log('htmlElem.clientWidth*3', htmlElem.clientWidth*3);
    //this.renderer.setStyle(thColName, "width", `${htmlElem.clientWidth*3}px`);


    console.log(thColName);
    this.renderer.setStyle(thColName, "width", `500px`);
    this.renderer.setStyle(tdColName, "width", `${tdColName.clientWidth+30}px`);
  }


}


