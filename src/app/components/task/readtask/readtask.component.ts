import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { TaskService } from 'src/app/services/task.service';


interface ITask {
  id_task? : string, 
  id_department? : string,   
  note? : string,  
  department_name? : string, 
  date_begin? : string, 
  date_end? : string, 
  bitSuccess? : boolean;
  Success?: string;
  RESFIO? : string;
  name_task? : string; 
  Acceptor? : string; 
  bitAccept? : string; 
  id_object? : string; 
  object_name? : string; 
  }


@Component({
  selector: 'app-readtask',
  templateUrl: './readtask.component.html',
  styleUrls: ['./readtask.component.css']
})


export class ReadtaskComponent {

  private id_task: number = 0;
  public curTask: ITask = {};

  constructor(private servTask: TaskService,
    private route: ActivatedRoute,
    private router: Router ) {    
}


  ngOnInit() {
  this.route.queryParams.subscribe( (params) => { 
    this.id_task = params['id_task'];
    this.loadData(this.id_task);
   });
  }


  loadData(id_task: number) {

    this.servTask.getTask_One(id_task).subscribe ( (res: any) => {
      this.curTask = res[0];
    })

  }

  back() {
    this.router.navigate(['/listtask']);
  }

}
