import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {


  loading = false;
  public sAvatarPath  = '';
  public form!: FormGroup;
  id_staff: number = 168;


 

  constructor(private router: Router,
              private auth: AvatarService,
              private fb: FormBuilder, 
              private gr: GlobalRef,
              private cd: ChangeDetectorRef) {

                this.createForm();
}


  ngOnInit(): void {

    this.onLoadFromBaseAvatar();
  

}


  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: ''
    });
  }


  onFileChange(event: any) {
    console.log('работаем с картинками');
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {

      const file: File = event.target.files[0];
      // todo 164
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const tempImg = new Image();
        if (typeof reader.result === 'string') {
          tempImg.src = reader.result;
        }

        tempImg.onload = () => {
          const dataURL = this.ResizeImage(tempImg);
          this.form!.get('avatar')!.setValue({
            value: dataURL.split(',')[1]
          });

          this.form!.get('name')!.setValue(file.name);

          this.onPostImageAvatar();
        };
      };
    }
  } // onFileChange(event)


  ResizeImage(tempImg: HTMLImageElement): string {
    const MAX_WIDTH = 200;
    const MAX_HEIGHT = 200;
    let tempW = tempImg.width;
    let tempH = tempImg.height;
    if (tempW > tempH) {
      if (tempW > MAX_WIDTH) {
        tempH *= MAX_WIDTH / tempW;
        tempW = MAX_WIDTH;
      }
    } else {
      if (tempH > MAX_HEIGHT) {
        tempW *= MAX_HEIGHT / tempH;
        tempH = MAX_HEIGHT;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = tempW;
    canvas.height = tempH;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(tempImg, 0, 0, tempW, tempH);
    const dataURL = canvas.toDataURL('image/png');

    return dataURL;
  }


  onPostImageAvatar() {
    console.log('onPostImageAvatar');
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.auth.updateAvatarUserTable( {'Avatar': formModel.get('avatar'), 'Name': formModel.get('name') }, this.id_staff).subscribe(() => {
      this.loading = false;
      this.onLoadFromBaseAvatar();
    });
  }


  onLoadFromBaseAvatar() {
    this.sAvatarPath = '';
    this.auth.getStaffFromId(this.id_staff).subscribe((aRes: any) => {

      if (!aRes) {
        return;
      }

      if (Array(aRes).length === 0 ) {
        return;
      }

      const S = aRes[0].avatar_name;

      console.log('this.sAvatarPath S=', S);

      if (S !== '""' && (S)) {
        if (typeof S !== 'undefined') {
          if (S.length > 0) {
            this.sAvatarPath = this.gr.sUrlAvatarGlobal + S;
          }
        }
      }
    });
  }


  private prepareSave(): FormData {
    const input: FormData = new FormData();
    // tslint:disable-next-line:max-line-length
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    // input.
    input.append('name', this.form!.get('name')!.value);
    input.append('avatar', JSON.stringify(this.form!.get('avatar')!.value));
    return input;
  }


  clearFile() {
    this.form!.get('avatar')!.setValue(null);
    this.form!.get('name')!.setValue(null);
    this.sAvatarPath = '';
    this.onClearImageAvatar();
  }

  onClearImageAvatar() {
    const formModel = this.prepareSave();
    this.loading = true;
    // tslint:disable-next-line:max-line-length
    this.auth.clearStaffUserTable(this.id_staff).subscribe(() => {
      this.loading = false;
      this.onLoadFromBaseAvatar();
    });
  }

}
