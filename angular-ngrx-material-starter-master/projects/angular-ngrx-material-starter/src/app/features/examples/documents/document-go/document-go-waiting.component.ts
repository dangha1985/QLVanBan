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
import { ResApiService } from '../../services/res-api.service'
import { DocumentGoService } from './document-go.service';
import { ItemDocumentGo, ListDocType, ItemSeleted, ItemSeletedCode, ItemUser } from './../models/document-go';

@Component({
  selector: 'anms-document-go-waiting',
  templateUrl: './document-go-waiting.component.html',
  styleUrls: ['./document-go-waiting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentGoWaitingComponent implements OnInit {
  form = this.fb.group({
    // NumSymbol: ['', [Validators.required]],
    // password: ['', [Validators.required]],
    // email: ['', [Validators.required, Validators.email]],
    Compendium: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(1000)
      ]
    ],
    UnitCreate: null,
    UserCreate: null,
    BookType: ['DG', [Validators.required]],
    NumberGo: null,
    NumberSymbol: '',
    DocType: null,
    RecipientsIn: null,
    RecipientsOut: null,
    UserOfHandle: ['', [Validators.required]],
    UserOfCombinate: null,
    UserOfKnow: null,
    SecretLevel: null,
    UrgentLevel: null,
    MethodSend: null,
    Signer: null,
    Note: '',
    NumOfPaper: null,
    Deadline: null,
    DateIssued: null,
    isRespinse: false,
    isSendMail: false,
  });
  formValueChanges$: Observable<ItemDocumentGo>;
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private docServices: DocumentGoService,
    private services: ResApiService,
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
  ListBookType: ItemSeletedCode[] = [];
  ListDocType: ItemSeleted[] = [];
  ListSecret: ItemSeleted[] = [];
  ListUrgent: ItemSeleted[] = [];
  ListMethodSend: ItemSeleted[] = [];
  ListDepartment: ItemSeleted[] = [];
  ListSource: ItemSeletedCode[] = [];
  ListApproverStep: ItemUser[] = [];
  ListUserSigner: ItemUser[] = [];
  ListUserCreate: ItemUser[] = [];
  idStatus = '';
  strFilter = '';
  strFilterUser = '';
  userApproverId = '';
  userApproverEmail = '';
  ngOnInit() {

    //lấy tham số truyền vào qua url
    // this.route.paramMap.subscribe(parames => {
    //   this.idStatus = parames.get('idStatus');
    //   if (this.idStatus == '1') {//chờ xử lý
    //     //ẩn nút thêm mới

    //   }
    //   else {
    //     //hiện nút thêm mới

    //     // danh mục
       
    //   }
      //Load ds văn bản
      this.getListDocumentGo();
    //});
  }
  //lấy ds văn bản
  getListDocumentGo() {
      this.strFilter = `&$filter=ID ne ''and StatusCode eq 'VBCXL'`;
    try {
      this.ListDocumentGo = [];
      this.docServices.getListDocumentGo(this.strFilter).subscribe(itemValue => {
        let item = itemValue["value"] as Array<any>;
        item.forEach(element => {
          // console.log('UserCreate:'+ element.UserCreate.Title);
          // console.log('UserOfHandle:'+ element.UserOfHandle.Title);
          this.ListDocumentGo.push({
            ID: element.ID,
            NumberGo: this.docServices.checkNull(element.NumberGo),
            DocTypeName: this.docServices.checkNull(element.DocTypeName),
            NumberSymbol: this.docServices.checkNull(element.NumberSymbol),
            Compendium: this.docServices.checkNull(element.Compendium),
            UserCreateName: element.UserCreate == undefined ? '' : element.UserCreate.Title,
            DateCreated: this.docServices.formatDateTime(element.DateCreated),
            UserOfHandleName: element.UserOfHandle == undefined ? '' : element.UserOfHandle.Title,
            Deadline: this.docServices.formatDateTime(element.Deadline),
            StatusName: this.docServices.checkNull(element.StatusName),
            BookTypeName: '',
            UnitCreateName: '',
            RecipientsInName: '',
            RecipientsOutName: '',
            SecretLevelName: '',
            UrgentLevelName: '',
            MethodSendName: '',
          })
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
}
