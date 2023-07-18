import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';
import { MtrService } from 'src/app/services/mtr.service';


interface Imtr { 
  id_mtr?: string;
  name?: string;
  id_mtrvid?: string;
  mtrvid?: string;
  color?: string;
  status?: string;
  description?: string;
  property?: string;
  equipment?: string;
  price?: string;
  size?: string;
  count?: string;
  date_purchase?: string;
  date_issue?: string;
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


@Component({
  selector: 'app-list-mtr',
  templateUrl: './list-mtr.component.html',
  styleUrls: ['./list-mtr.component.css']
})
export class ListMtrComponent {

  ShowMtr: Imtr[] = [];
  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  constructor (private mtrserv: MtrService) {  

  }


  ngOnInit() {
    this.mtrserv.getMTR().subscribe ( (value: any) => {
      this.ShowMtr = value;
      console.log('this.ShowMtr =', this.ShowMtr);
    });
}


clicObject(objectmtr: Imtr) {
    alert(objectmtr.name );
}

}


