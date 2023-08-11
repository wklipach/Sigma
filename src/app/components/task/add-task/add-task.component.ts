import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuideService } from 'src/app/services/guide.service';
import { TaskService } from 'src/app/services/task.service';

interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface IProtectedObject {
  id_object: number;
  name: string;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})



export class AddTaskComponent {

  guideDepartment: ISmallGuide[] = [];
  ProtectedObject: IProtectedObject = {id_object: 0, name: '--'};
  id_department = 0;

  constructor (private servguide: GuideService, 
               private servTask: TaskService, 
               private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params) => { 

            if (params['id_object']) {
                this.ProtectedObject.id_object = params['id_object'];
            }

            if (params['name']) {
                this.ProtectedObject.name = params['name'];
            }
      });
  }

  ngOnInit() {
    this.servguide.getSmallGuide('guide_department').subscribe( (value: any) => {
      this.guideDepartment = value; 
    });
  }


  clickBack() {
     window.close();   
  } 

  clickApply() {

    if (this.ProtectedObject.id_object == 0) {
      alert("Отсутствует отдел.");
      return;
    }    

    if (this.id_department == 0) {
      alert("Введите отдел.");
      return;
    }

    let sNote = (document.getElementById('areaNote') as HTMLTextAreaElement).value.trim();

    if (!sNote) {
      alert("Введите сообщение.");
      return;      
    }


    let dateBegin = (document.getElementById('dateBegin') as HTMLDataElement).value;

    if (!dateBegin) {
      alert("Введите дату начала.");
      return;      
    }

    
    let dateEnd = (document.getElementById('dateEnd') as HTMLDataElement).value;

    if (!dateEnd) {
      alert("Введите дату выполнения.");
      return;      
    }


    let nameTask = (document.getElementById('nameTask') as HTMLInputElement).value.trim();
    if (!nameTask) {
      alert("Введите наименование задачи.");
      return;      
    }



    //console.log(this.id_department);
    //console.log(sNote);
    //console.log(dateEnd);

    this.servTask.insertTask(this.ProtectedObject.id_object, nameTask, this.id_department, sNote, dateBegin, dateEnd).subscribe( (value: any) => {


        if (value.insertId) {
          alert("Задача успешно создана.");
          window.close();   

      } else 
      alert("Задача не создана.");

    });

  }

}
