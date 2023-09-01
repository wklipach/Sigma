import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }

  getSmallGuide(guidename: string) {
    const params = new HttpParams()
         .set('get_small_guide', guidename);
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }

  getCheckGuideGuide() {
    const params = new HttpParams()
         .set('get_guide_checklist', 'get_guide_checklist');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }  

  getGuideDress() {
    const params = new HttpParams()
         .set('get_guide_dress', 'get_guide_dress');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }  

  getGuideSpecialMeans() {
    const params = new HttpParams()
         .set('get_special_means', 'get_special_means');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }  

  getGuideWeapons() {
    const params = new HttpParams()
         .set('get_weapons', 'get_weapons');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }  


  getSenjorGuard() {
    const params = new HttpParams()
         .set('get_senjor_guard', 'get_senjor_guard');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }

  getProtectedObjectGuide() {
    const params = new HttpParams()
         .set('get_protected_object', 'get_protected_object');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }

  getOllrGuide() {
    const params = new HttpParams()
         .set('get_ollr_guide', 'get_ollr_guide');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }

  // get_realprotected_object
  
}
