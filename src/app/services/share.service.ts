import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface ICard {

  photo_name: string;
  name: string;

}

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }

  public drop(event: CdkDragDrop<ICard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log(event.container.data);
    console.log(event.previousContainer.data);
  }
}
