import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { Observable, forkJoin } from 'rxjs';
import { AvatarService } from 'src/app/services/avatar.service';
import { GuideService } from 'src/app/services/guide.service';

interface IMtrGuide {
  id_mtr: number;
  name: string; 
  description: string;
}

interface ISmallGuide { 
  id?: string;  
  name?: string; 
}


@Component({
  selector: 'app-post-object',
  templateUrl: './post-object.component.html',
  styleUrls: ['./post-object.component.css']
})
export class PostObjectComponent {


  guideDress: IMtrGuide[] = [];
  guideSpecialMeans: IMtrGuide[] = [];
  guideWeapons: IMtrGuide[] = [];
  guidePostRoutine: ISmallGuide[] = [];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private servguide: GuideService, 
    private auth: AvatarService,
    private fb: FormBuilder, 
    private gr: GlobalRef,
    private datePipe: DatePipe) {
}


  ngOnInit() {
    //getGuideDress()

    let sources: Observable<any>[] = [
      this.servguide.getGuideDress(),
      this.servguide.getSmallGuide('guide_post_routine'),
      this.servguide.getGuideSpecialMeans(),
      this.servguide.getGuideWeapons()
    ];
  
    forkJoin(sources)
    .subscribe( ([res1, res2, res3, res4]) => {
        this.guideDress = res1; 
        this.guidePostRoutine = res2; 
        this.guideSpecialMeans = res3;
        this.guideWeapons = res4;
        });  

        

  }

  close () {
      window.close();
  }

  save() {

    console.log('save');

  }

}
