import { Injectable } from '@angular/core';
import { ITable } from '../interface/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

      public setTableWidth(table: ITable[], storage_name: string) {
        window.localStorage.setItem(storage_name, JSON.stringify(table));

      } 

      public getTableWidth(storage_name: string): ITable[] {

        let curTableWidth = localStorage.getItem(storage_name);

        if (curTableWidth) {
            let res = <ITable[]>JSON.parse(curTableWidth);
            return res;
        } else 
          return [];
    }


}
