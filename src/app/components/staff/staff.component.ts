import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {  CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GuideService } from 'src/app/services/guide.service';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';



interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface ISenjorGuardGuide { 
  id?: string;  
  id_staff?: string;  
  fio?: string; 
}

interface IObjectOne { 
    id_staff?: string;  
    fio?: string;  
    phone?: string;  
    phone2?: string;  
    id_position?: string;  
    guide_position?: string;  
    id_status?: string;  
    guide_status?: string;  
    id_gender?: string;  
    guide_gender?: string;  
    id_typeperson?: string;   
    guide_typeperson?: string;  
    DateBirth?: string;  
    sAge?: string;  
    DateBirth_str?: string;  
    s002from?: string;  
    s002from_str?: string;  
    s003from?: string;  
    s003from_str?: string;  
    rank?: string;  
    id_senjor_guard?: string;  
    senjor_guard?: string;  
    id_organization?: string;
    organization?: string;
}

interface IDeleteObject {
  id_staff?: number;
  sLink?: string;
}


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent {


    // то что показывается в таблице - ограниченно строкой поиска
    ShowStaff: IObjectOne[] = [];
    // все что скачано с сервера
    ORIGINAL_ShowStaff: IObjectOne[] = [];

    guidePosition:  ISmallGuide[] = [];
    guideStatus:  ISmallGuide[] = [];
    guideOrganization:  ISmallGuide[] = [];
    guideGender:  ISmallGuide[] = [];
    guideTypeperson:  ISmallGuide[] = [];
    guideSenjorGuard:  ISenjorGuardGuide[] = [];
    //объект для модального окна удаления
    curDeleteObject: IDeleteObject = {};



    @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;
      
  constructor (private staffserv: StaffService, 
    private servguide: GuideService, 
    private datePipe: DatePipe,
    private router: Router) {  
}


ngOnInit() {




  this.servguide.getSmallGuide('guide_position').subscribe( (value: any) => {
    this.guidePosition = value; 
  });

  
  this.servguide.getSmallGuide('guide_organization').subscribe( (value: any) => {
    this.guideOrganization = value; 
  });



  this.servguide.getSmallGuide('guide_status').subscribe( (value: any) => {
    this.guideStatus = value; 
  });


  this.servguide.getSmallGuide('guide_gender').subscribe( (value: any) => {
    this.guideGender = value; 
  });

  this.servguide.getSmallGuide('guide_typeperson').subscribe( (value: any) => {
    this.guideTypeperson = value; 
  });

  this.servguide.getSenjorGuard().subscribe( (value: any) => {
    this.guideSenjorGuard = value; 
    //console.log('guideSenjorGuard', this.guideSenjorGuard);
  });




  this.staffserv.getStaff_All().subscribe ( (value: any) => {
    console.log('value=', value);
    this.ORIGINAL_ShowStaff = value;
    console.log('this.ORIGINAL_ShowStaff=', this.ORIGINAL_ShowStaff);
    this.ORIGINAL_ShowStaff.forEach((el)=>
    {
      el.DateBirth_str = this.datePipe.transform(el.DateBirth, 'yyyy-MM-dd') || '';
      el.s002from_str = this.datePipe.transform(el.s002from, 'yyyy-MM-dd') || '';
      el.s003from_str = this.datePipe.transform(el.s003from, 'yyyy-MM-dd') || '';
    });

    // при загрузке показываем без всяких ограничений
    this.ShowStaff = [...this.ORIGINAL_ShowStaff];     //JSON.parse(JSON.stringify(this.ORIGINAL_ShowStaff));

     console.log('this.ShowStaff =', this.ShowStaff);
  });

}

summaryOpen(id_staff: number) {
  this.router.navigate(['summary'], { queryParams: { id_staff }});
  }


 onEnterSearch() {
   this.funcSearch();
  }
    
    

  funcSearch() {
    let sInput = (document.getElementById('search') as HTMLInputElement).value.trim().toUpperCase();

    if (sInput) {
        // console.log('ищем=',sInput);
        
        const res = this.ORIGINAL_ShowStaff.filter( (el) => {
           return (el.id_staff &&  el.id_staff.toString().toUpperCase().indexOf(sInput) != -1) ||
                  (el.fio &&  el.fio.toUpperCase().indexOf(sInput) != -1) ||
                  (el.phone &&  el.phone.toUpperCase().indexOf(sInput) != -1) ||          
                  (el.phone2 &&  el.phone2.toUpperCase().indexOf(sInput) != -1) ||
                  (el.guide_position &&  el.guide_position.toUpperCase().indexOf(sInput) != -1) ||                  
                  (el.guide_status &&  el.guide_status.toUpperCase().indexOf(sInput) != -1) ||                                    
                  (el.guide_gender &&  el.guide_gender.toUpperCase().indexOf(sInput) != -1) ||                                    
                  (el.guide_typeperson &&  el.guide_typeperson.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.sAge &&  el.sAge.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.DateBirth_str &&  el.DateBirth_str.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.s002from_str &&  el.s002from_str.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.s003from_str &&  el.s003from_str.toUpperCase().indexOf(sInput) != -1) ||                                                                                          
                  (el.rank &&  el.rank.toString().toUpperCase().indexOf(sInput) != -1);
        });



        // console.log('find=', res)
        this.ShowStaff =  JSON.parse(JSON.stringify(res));

      } else {
        console.log('обнуляем поиск');
        // показываем без всяких ограничений
        this.ShowStaff = JSON.parse(JSON.stringify(this.ORIGINAL_ShowStaff));
      }
    }  
  

    onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_object: string, field: string) {
      if (ev) {
       let res = smallGuide.find( (el) => Number(el.id) == Number(ev.target.value));
       if (res) {
        if (!res.name) res.name='';
        this.staffserv.updateProtectedSmallGuide(Number(res.id), res.name, id_object, field).subscribe();
       }
      }
    }


    onChangeSenjorGuard(ev: any,  senjorGuide:  ISenjorGuardGuide[], id_object: string, field: string) {
      if (ev) {
       let res = senjorGuide.find( (el) => Number(el.id_staff) == Number(ev.target.value));
       if (res) {
        if (!res.fio) res.fio='';
        this.staffserv.updateProtectedSmallGuide(Number(res.id_staff), res.fio, id_object, field).subscribe();
       }
      }
    }




       isNumeric (n: string) {
        return !!Number(n);
       }

        myUpdateNumberClick(x: any, id_staff: number, field: string) {
    

     

      let text = x.innerText;
      text = text.replace('\n', '');
 
      if (!this.isNumeric(text)) {
         text = 'null';
      } 
      console.log('text =', text);
      this.staffserv.updateStaffNumber(text, id_staff.toString(), field).subscribe( (res: any) => {
        console.log('res update = ', res);
      });
    }

  
    myUpdateClick(x: any, id_staff: number, field: string) {
    
      let text = x.innerText;
      if (!text ) text='';

      this.staffserv.updateStaffOne(text, id_staff.toString(), field).subscribe( (res: any) => {
        console.log('res update = ', res);
      });
    }

    maxInputLength(e: Event, iLength: number) {
      const text =(e.target! as HTMLInputElement).innerText;
      console.log('text=', text, 'text.length=', text.length);
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
    
    focusOutFunction(e: any) {
      e.target.type = '';
      e.target.value = this.datePipe.transform(e.target.value, 'dd.MM.yyyy') || '';
    }
  
    focusFunction(e: any, datestr: any) {
      e.target.type = 'date';
      e.target.value =  datestr;
    }
  
  
    idDateisValid (date: Date) {
      return date.getTime() === date.getTime();
    } 


    // Преобразование даты рождения
    setDateBirth($event: any, id_staff: number) {
      let date = new Date($event.target.value);
      const isDate = this.idDateisValid(date);
      if (isDate) {
        // console.log($event.target.value, date);
        this.staffserv.updateStaffDate(date, id_staff.toString(), 'DateBirth').subscribe( (res: any) => { console.log('res update = ', res); } );
      } else {
        // console.log($event.target.value, 'даты нет!');
        this.staffserv.updateStaffDateNull(id_staff.toString(), 'DateBirth').subscribe( (res: any) => { console.log('res update = ', res); } );
      }


      if (isDate) {      
              const res = this.ShowStaff.map( el => {
                if (el.id_staff == id_staff.toString()) {
                  el.sAge =  (new Date().getFullYear() -  date.getFullYear()).toString();
                  el.DateBirth_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
                }
                return el;
              });
            this.ShowStaff = [...res];

            const res2 = this.ORIGINAL_ShowStaff.map( el => {
              if (el.id_staff == id_staff.toString()) {
                el.sAge =  (new Date().getFullYear() -  date.getFullYear()).toString();
                el.DateBirth_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
               }
               return el;
              });
             this.ORIGINAL_ShowStaff = [...res2];

            $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
       }            

       if (!isDate) {      
            const res = this.ShowStaff.map( el => {
              if (el.id_staff == id_staff.toString()) {
                el.sAge =  '';
                el.DateBirth_str = '';
              }
              return el;
            });
          this.ShowStaff = [...res];


          const res2 = this.ORIGINAL_ShowStaff.map( el => {
            if (el.id_staff == id_staff.toString()) {
              el.sAge =  '';
              el.DateBirth_str = '';
            }
            return el;
            });
          this.ORIGINAL_ShowStaff = [...res2];

          $event.target.value = '';
        }            


        $event.target.type = '';
     
    } 
    
    

  

  set002from($event: any, id_staff: number) {
     let date = new Date($event.target.value);
     const isDate = this.idDateisValid(date);
     if (isDate) {
       // console.log($event.target.value, date);
        this.staffserv.updateStaffDate(date, id_staff.toString(), '002from').subscribe( (res: any) => { console.log('res update = ', res); } );
        } else {
         this.staffserv.updateStaffDateNull(id_staff.toString(), '002from').subscribe( (res: any) => { console.log('res update = ', res); } );
     }
    
     if (isDate) {
          const res = this.ShowStaff.map( (el: IObjectOne) => {
              if (el.id_staff == id_staff.toString()) {
                  el.s002from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
                  }
              return el;
          });
          this.ShowStaff = [...res];

          const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
            if (el.id_staff == id_staff.toString()) {
                el.s002from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
                }
            return el;
          });
          this.ORIGINAL_ShowStaff = [...res2];

          $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
      }

      if (!isDate) {
         const res = this.ShowStaff.map( el => {
            if (el.id_staff == id_staff.toString()) {
                el.s002from_str = '';
                }
            return el;
        });
        this.ShowStaff = [...res];


        const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
          if (el.id_staff == id_staff.toString()) {
              el.s002from_str ='';
              }
          return el;
        });
        this.ORIGINAL_ShowStaff = [...res2];


        $event.target.value = '';
      }
     $event.target.type = '';
  }    

  set003from($event: any, id_staff: number) {
    let date = new Date($event.target.value);


    const isDate = this.idDateisValid(date);


    if (isDate) {
      // console.log($event.target.value, date);
       this.staffserv.updateStaffDate(date, id_staff.toString(), '003from').subscribe( (res: any) => { console.log('res update = ', res); } );
       } else {
        this.staffserv.updateStaffDateNull(id_staff.toString(), '003from').subscribe( (res: any) => { console.log('res update = ', res); } );
    }
    
   
    if (isDate) {
         const res = this.ShowStaff.map( (el: IObjectOne) => {
             if (el.id_staff == id_staff.toString()) {
                 el.s003from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
                 }
             return el;
         });
         this.ShowStaff = [...res];

         const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
          if (el.id_staff == id_staff.toString()) {
              el.s003from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
              }
          return el;
        });
        this.ORIGINAL_ShowStaff = [...res2];

         $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
     }


     if (!isDate) {
        const res = this.ShowStaff.map( el => {
           if (el.id_staff == id_staff.toString()) {
               el.s003from_str = '';
               }
           return el;
       });
       this.ShowStaff = [...res];

       const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
        if (el.id_staff == id_staff.toString()) {
            el.s003from_str = '';
            }
        return el;
      });
      this.ORIGINAL_ShowStaff = [...res2];

       $event.target.value = '';
     }

    $event.target.type = '';

 }
 
 
 addNewStaff() {

  let item: IObjectOne = {};
  const s = 'Новый сотрудник';

  
  this.staffserv.addStaff(s).subscribe( (res: any) =>
    {
      if (res.insertId) {
        item.id_staff = res.insertId;
        item.fio = s;
        this.ShowStaff.unshift(item);
        this.ORIGINAL_ShowStaff.unshift(item);
        this.ShowStaff = [...this.ShowStaff];
        this.virtualScroll.scrollTo({top: 0});
      }
    });
  

  
}



deleteStaff(id_staff: number, sLink: string) {
  //openDeleteModalButton
  this.curDeleteObject.sLink = sLink;
  this.curDeleteObject.id_staff = id_staff;
  document!.getElementById("openDeleteModalButton")!.click();
}



deleteClose() {
  document!.getElementById("closeDeleteModalButton")!.click();
}
  
deleteSave() {


  if (this.curDeleteObject.id_staff) {

    let idStaff = this.curDeleteObject.id_staff;
    let indexShowObjects = this.ShowStaff.findIndex( (el  =>  el.id_staff == idStaff.toString()));
    this.ShowStaff.splice(indexShowObjects,1);
    let indexOriginalShowStaff = this.ORIGINAL_ShowStaff.findIndex( (el  =>  el.id_staff == idStaff.toString()));
    this.ORIGINAL_ShowStaff = this.ORIGINAL_ShowStaff.splice(indexOriginalShowStaff,1);

    //refresh data
    this.ShowStaff = [...this.ShowStaff];
    this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];

    this.staffserv.deleteStaff(idStaff.toString()).subscribe();
  }
  this.deleteClose();
}


}
