import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { filter, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';

import { element } from 'protractor';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';

import { State } from '../../../examples/examples.state';
import {
  actionFormReset,
  actionFormUpdate
} from '../../../examples/form/form.actions';
import { selectFormState } from '../../../examples/form/form.selectors';
import { SharedService } from '../../../../shared/shared-service/shared.service'
import { DocumentGoService } from './document-go.service';
import { ItemDocumentGo, ListDocType, ItemSeleted, ItemSeletedCode, ItemUser } from './../models/document-go';

@Component({
  selector: 'anms-document-go-waiting',
  templateUrl: './document-go-waiting.component.html',
  styleUrls: ['./document-go-waiting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentGoWaitingComponent implements OnInit {

 
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private docServices: DocumentGoService,
    private resServices: SharedService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) { }

  displayedColumns: string[] = ['ID', 'DocTypeName', 'Compendium', 'UserCreateName', 'DateCreated', 'UserOfHandle', 'Deadline', 'StatusName'];
  dataSource = new MatTableDataSource<ItemDocumentGo>();
  // selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText = '';
  date = new FormControl(new Date());
  addNew = false;
  showList = true;
  ListDocumentGo: ItemDocumentGo[] = [];
  // ListBookType: ItemSeletedCode[] = [];
  // ListDocType: ItemSeleted[] = [];
  // ListSecret: ItemSeleted[] = [];
  // ListUrgent: ItemSeleted[] = [];
  // ListMethodSend: ItemSeleted[] = [];
  // ListDepartment: ItemSeleted[] = [];
  // ListSource: ItemSeletedCode[] = [];
  // ListApproverStep: ItemUser[] = [];
  // ListUserSigner: ItemUser[] = [];
  // ListUserCreate: ItemUser[] = [];
  id = null;
  strFilter = '';
  strFilterUser = '';
  userApproverId = '';
  userApproverEmail = '';
  currentUserId = '';
  currentUserName = '';
  currentUserEmail='';
  ngOnInit() {

   // lấy tham số truyền vào qua url
    this.route.paramMap.subscribe(parames => {
      this.id = parames.get('id');
      //Load ds văn bản
     // this.getListDocumentGo_Wait();
    });
    this.getCurrentUser();
  }
  isNotNull(str) {
    return (str !== null && str !== "" && str !== undefined);
  }

  CheckNull(str) {
    if (!this.isNotNull(str)) {
      return "";
    }
    else {
      return str;
    }
  }
   // format định dạng ngày    
   formatDateTime(date: Date): string {
    if (!date) {
      return '';
    }
    return moment(date).format('DD/MM/YYYY');
    //return moment(date).format('DD/MM/YYYY hh:mm A');
  }
   //Lấy người dùng hiện tại
   getCurrentUser() {
    this.resServices.getCurrentUser().subscribe(
      itemValue => {
        this.currentUserId = itemValue["Id"];
        this.currentUserName = itemValue["Title"];
        this.currentUserEmail = itemValue["Email"];
        console.log("currentUserEmail: " + this.currentUserEmail);
      },
      error => {
        console.log("error: " + error);
        
      },
      () => {
        console.log("Current user email is: \n" + "Current user Id is: " + this.currentUserId + "\n" + "Current user name is: " + this.currentUserName);
        this.getListDocumentGo_Wait();
      }
    );
  }
  //lấy ds phiếu xử lý
  getListDocumentGo_Wait() {
    let idStatus;
    let TypeCode='';
    let strSelect = '';
    //chờ xử lý
    if(this.id=='1') {
      idStatus=0;
      TypeCode='CXL' ;
      strSelect = ` and (TypeCode eq 'CXL' or TypeCode eq 'TL') and StatusID eq '0'`;
    }
    //Đã xử lý
    else  if(this.id=='2') {
      idStatus=1;
      TypeCode='CXL' ;
      strSelect = ` and (TypeCode eq 'CXL' or TypeCode eq 'TL') and StatusID eq '1'`;
    }
    //Chờ xin ý kiến
    else  if(this.id=='3') {
      idStatus=0;
      TypeCode='XYK' ;
      strSelect = ` and TypeCode eq 'XYK' and StatusID eq '0'`;
    }
      //Đã cho ý kiến
    else  if(this.id=='4' ){
      idStatus=1;
      TypeCode='XYK';
      strSelect = ` and TypeCode eq 'XYK' and StatusID eq '1'`;
    }
      let strFilter = `?$select=*,Author/Id,Author/Title,UserApprover/Id,UserApprover/Title&$expand=Author,UserApprover`
     +`&$filter=UserApprover/Id eq '`+this.currentUserId+`'` + strSelect + `&$orderby=Created desc`;
     console.log('strSelect='+strSelect);
    try {
      this.ListDocumentGo = [];
      this.resServices.getItemList('ListProcessRequestGo',strFilter).subscribe(itemValue => {
        let item = itemValue["value"] as Array<any>;
        item.forEach(element => {
          if(this.ListDocumentGo.findIndex(e => e.ID === element.DocumentGoID) < 0) {
            this.ListDocumentGo.push({
              ID: element.DocumentGoID,
              NumberGo: this.docServices.formatNumberGo(element.NumberGo),
              DocTypeName: this.CheckNull(element.DocTypeName),
              NumberSymbol:this.CheckNull(element.Title),
              Compendium: this.CheckNull(element.Compendium),
              UserCreateName: element.Author == undefined ? '' : element.Author.Title,
              DateCreated: this.formatDateTime(element.DateCreated),
              UserOfHandleName: element.UserApprover == undefined ? '' : element.UserApprover.Title,
              Deadline: this.formatDateTime(element.Deadline),
              StatusName: this.CheckNull(element.StatusName),
              BookTypeName: '',
              UnitCreateName: '',
              RecipientsInName: '',
              RecipientsOutName: '',
              SecretLevelName: '',
              UrgentLevelName: '',
              MethodSendName: '',
              DateIssued:'',
              SignerName: '',
              Note:'',
              NumOfPaper :'',
              link: this.getLinkItemByRole(this.id, element.TaskTypeCode, element.DocumentGoID, element.IndexStep)
            })
          }
        })
      },
        error => console.log(error),
        () => {
          console.log("get success");
          this.dataSource = new MatTableDataSource<ItemDocumentGo>(this.ListDocumentGo);
          this.ref.detectChanges();
          this.dataSource.paginator = this.paginator;
        });
    } catch (error) {
      console.log(error);
    }
  }
  
  //  /** Whether the number of selected elements matches the total number of rows. */
  //  isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  // checkboxLabel(row?: PeriodicElement): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getLinkItemByRole(type, taskType, id, step) {
    let link = '';
    if(type === "1") {
      if(taskType === 'XLC' || taskType === 'TL') {
        link = '../../documentgo-detail/' + id + '/' + step;
      } else {
        link = '../../documentgo-detail/' + id;
      }
    } else {
      link = '../../documentgo-detail/' + id;
    }
    return link;
  }
}
