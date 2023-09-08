import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';

interface ICard {

  photo_name: string;
  name: string;

}

@Component({
  selector: 'app-drag-drop-test',
  templateUrl: './drag-drop-test.component.html',
  styleUrls: ['./drag-drop-test.component.css']
})
export class DragDropTestComponent {

  constructor(private ss: ShareService) { }

  ngOnInit() {
  }

  // Transfer Items Between Lists
  MoviesList: ICard[] = [
    {photo_name: "/assets/img/usernull.jpg", name:'The Far Side of the World'},
    {photo_name: "/assets/img/addwork.png", name:'Morituri'},
    {photo_name: "/assets/img/delete.png", name:'Napoleon Dynamite'},
    {photo_name: "/assets/img/done.png", name:'Pulp Fiction'},
    {photo_name: "/assets/img/plus.png", name:'Blade Runner'},
    {photo_name: "/assets/img/marked.png", name:'Cool Hand Luke'},
    {photo_name: "/assets/img/expand.png", name:'Heat'},
    {photo_name: "/assets/img/filter.png", name:'Juice'},    
  ];

  MoviesWatched: ICard[] = [
    {photo_name: "/assets/img/post.png", name:'Transformers'},
  ];

  onDrop(event: CdkDragDrop< ICard[]>) {
    this.ss.drop(event);
  }  

}
