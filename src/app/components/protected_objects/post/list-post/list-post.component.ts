import { Component, ViewChild } from '@angular/core';
import { ITable } from 'src/app/interface/table';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { TableService } from 'src/app/services/table.service';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import { GlobalRef } from 'globalref';


interface IPost {
	id: number;	
	id_object: number;
	object_name: string;
    object_address: string;
	post_name: string;
	post_number: string; 
	label: DOMStringList;
	id_post_routine: number;
	post_routine: string;
	TimeBegin: string;
	TimeEnd: string;
	DateBegin: Date;
	DateEnd: Date;
	camera_link: string; 
	id_dress: number;
	dress: string; 
	photo_name: string;
}

interface IPObj {
	name: string;
	address: string;
}

interface IDeletePost {
	id_post?: number;
	sLink?: string;
  }
  

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent {

	id_object: number = 0;
	protected_object: IPObj = {name: "", address: ""};
	curDeletePost: IDeletePost = {};

	arrayListPost: IPost[] = [];
	ColumnMode = ColumnMode;
	@ViewChild('PostListTable') datatableComponent!: DatatableComponent;
	faCoffee = faCoffee;
	  //содержит ширины столбцов, взятые из хранилища
	ColumnSizeObj:  ITable[] = [];

	constructor (private tableServ:  TableService, 
		         private postServ:  PostsService,
				 private route: ActivatedRoute,
				 private router: Router,
				 public objserv:   ListobjectsService,
				 public gr: GlobalRef,
				 )	  { 
				
					this.route.queryParams.subscribe((params) => { 
						if (params['id_object']) {
							this.id_object = params['id_object'];
						}
					  });

				 }	

	ngOnInit() {

		this.ColumnSizeObj =   this.tableServ.getTableWidth('PostListTable');
	
	
		this.postServ.getPosts(this.id_object).subscribe( (value: any) => {


		  let listPost: IPost[] = value;	
		  listPost.forEach ( el => {
			if (el.TimeBegin) el.TimeBegin =  el.TimeBegin.substring(0,5);
			if (el.TimeEnd) el.TimeEnd = el.TimeEnd.substring(0,5);

			if (el.photo_name) {
				el.photo_name = this.gr.sUrlPhotoPostGlobal+ el.photo_name;
			  } else {
				el.photo_name = "/assets/img/post.png";
			  }

		  });

		  
		  this.arrayListPost =  [...listPost];
		  
	
		});

		this.objserv.getCurrentProtectedObjects(this.id_object).subscribe((aRes: any) => {

			if (Array(aRes).length > 0 ) {
				this.protected_object.name = aRes[0].name;
				this.protected_object.address = aRes[0].address;
			  }
		  

		});
	  }

 

	getColumnSize(col_name: string) {

		let res: number = 150;
		let resFind = this.ColumnSizeObj.find( el => el.column_name == col_name);
		  if (resFind) {
			  res = Number(resFind.column_width);
		  }
		return res;
	  }
	
	  saveColumnSize(table: DatatableComponent, storage_name: string, new_column: string, newValue: string) {
		let saveObj: ITable[] = [];
		table.bodyComponent.columns.forEach ( col => {
		  if (col.prop && col.width) {
			if (col.prop == new_column) {
			  saveObj.push({column_name: new_column, column_width: newValue});
			} else {
			  saveObj.push({column_name: col.prop.toString(), column_width: col.width.toString()});
			}
		  }
		});
		this.tableServ.setTableWidth(saveObj, storage_name);
	  } 
		
	  onResize(e: any) {
	
		  if (e && e.column && e.column.prop && e.newValue) {
			this.saveColumnSize(this.datatableComponent, 'CheckListTable', e.column.prop, e.newValue);
		  }
	  }	

	  openPostEdit(id: number) {
		this.router.navigate(['post'], { queryParams: { id_post: id }});
	  }

	  openPost(id: number) {

        const url = this.router.serializeUrl(this.router.createUrlTree(['postread'], {
			queryParams: {
			  id_post: id
			}
		  }));
	
		  const newTab = window.open(url, '_blank'); 
		  if(newTab) {
			  newTab.opener = null;
		  }
  
	  }

	  addNewPost(){

		//вставляем новый пост в виде пустой строки
		this.postServ.insertPost(this.id_object).subscribe ( (res: any)=> {

			if (res.insertId) {
				this.router.navigate(['post'], { queryParams: { id_post: res.insertId }});
			}

		});

	  }

	  deletePost(id_post: number, sLink: string) {
		//openDeleteModalButton
		this.curDeletePost.sLink = sLink;
		this.curDeletePost.id_post = id_post;
		document!.getElementById("openDeleteModalButton")!.click();
	  }
  
  
	  deleteClose() {
		document!.getElementById("closeDeleteModalButton")!.click();
	  }

	  deleteSave() {

		if (this.curDeletePost.id_post) {
  
		  let idObject = this.curDeletePost.id_post;
		  let indexShowObjects = this.arrayListPost.findIndex( (el  =>  el.id.toString() == idObject.toString()));
		  this.arrayListPost.splice(indexShowObjects,1);
  
		  //refresh data
		  this.arrayListPost = [...this.arrayListPost];
  
		  this.postServ.deletePost(idObject).subscribe();
		}
		this.deleteClose();
	  }
  


}
