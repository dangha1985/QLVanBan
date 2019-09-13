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
  selector: 'anms-document-go',
  templateUrl: './document-go.component.html',
  styleUrls: ['./document-go.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentGoComponent implements OnInit {
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
        //hiện nút thêm mới

        // danh mục
        this.getListBookType();
        this.getListDepartment();
        this.getListDocType();
        this.getListMethodSend();
        this.getListSecret();
        this.getListUrgent();
        this.getSourceAddress();
        this.getUserApproverStep();
        this.getUserSigner();
        this.getUserCreate();
    //  }
      //Load ds văn bản
      this.getListDocumentGo();
   // });
  }
  //lấy ds văn bản
  getListDocumentGo() {
    this.strFilter = `&$filter=ID ne ''`;
  //  if (this.idStatus == '1') {//chờ xử lý
      this.strFilter += `and StatusCode eq 'VBDT'`;
  //  }
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
  // danh mục phong ban
  getListDepartment() {
    this.services.getListDepartment().subscribe(itemValue => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListDepartment.push({
          ID: element.ID,
          Title: element.Title,
        })
      });
    })
  }
  // danh mục loại văn bản
  getListDocType() {
    this.services.getListDocType().subscribe(itemValue => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListDocType.push({
          ID: element.ID,
          Title: element.Title,
        })
      });
    })
  }
  // danh mục sổ văn bản
  getListBookType() {
    this.services.getListBookType().subscribe(itemValue => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListBookType.push({
          ID: element.ID,
          Title: element.Title,
          Code: element.Code
        })
      });
    })
  }
  //dm độ mật
  getListSecret() {
    this.services.getListSecret().subscribe(itemValue => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListSecret.push({
          ID: element.ID,
          Title: element.Title
        })
      })
    });
  }
  //dm độ khẩn
  getListUrgent() {
    this.services.getListUrgent().subscribe(itemValue => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListUrgent.push({
          ID: element.ID,
          Title: element.Title
        })
      })
    });
  }
  //dm phương thức gửi
  getListMethodSend() {
    this.services.getListMethodSend().subscribe(itemValue => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListMethodSend.push({
          ID: element.ID,
          Title: element.Title
        })
      })
    });
  }
  //dm đơn vị ngoài
  getSourceAddress() {
    this.services.getListSourceAddress().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListSource.push({
          ID: element.ID,
          Title: element.Title,
          Code: element.Address
        })
      });
    })
  }
  //danh sách người xử lý
  getUserApproverStep() {
    let strFilterUser = `&$filter=RoleCode eq 'TP'`;
    this.docServices.getUser(strFilterUser).subscribe(items => {
      let itemUserMember = items["value"] as Array<any>;
      itemUserMember.forEach(element => {
        this.ListApproverStep.push({
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split("|")[2]
        })
      })
    })
  }
  //danh sách người ký
  getUserSigner() {
    let strFilterUser = `&$filter=RoleCode eq 'GĐ'`;
    this.docServices.getUser(strFilterUser).subscribe(items => {
      let itemUserMember = items["value"] as Array<any>;
      itemUserMember.forEach(element => {
        this.ListUserSigner.push({
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split("|")[2]
        })
      })
    })
  }
  //danh sách tạo
  getUserCreate() {
    this.docServices.getUser('').subscribe(items => {
      let itemUserMember = items["value"] as Array<any>;
      itemUserMember.forEach(element => {
        this.ListUserCreate.push({
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split("|")[2]
        })
      })
    })
  }
  //lấy ra id , email 
  splitDataUserApprover(value) {
    this.userApproverId = value.split("|")[0];
    this.userApproverEmail = value.split("|")[1];
  }

  //Thêm mới văn bản đi
  save(isChuyenXL) {
    try {
     
      const dataForm = this.form.getRawValue();
      if (this.form.valid) {
        let itemBookType = this.docServices.FindItemByCode(this.ListBookType, this.form.get('BookType').value);
        let itemDocType = this.docServices.FindItemById(this.ListDocType, this.form.get('DocType').value);
        let itemRecipientsIn = this.docServices.FindItemById(this.ListDepartment, this.form.get('RecipientsIn').value);
        let itemRecipientsOut = this.docServices.FindItemById(this.ListSource, this.form.get('RecipientsOut').value);
        let itemSecretLevel = this.docServices.FindItemById(this.ListSecret, this.form.get('SecretLevel').value);
        let itemUrgentLevel = this.docServices.FindItemById(this.ListUrgent, this.form.get('UrgentLevel').value);
        let itemMethodSend = this.docServices.FindItemById(this.ListMethodSend, this.form.get('MethodSend').value);
        let itemUnitCreate = this.docServices.FindItemById(this.ListDepartment, this.form.get('UnitCreate').value);
        // console.log('UserCreate:'+this.form.get('UserCreate').value);
        // console.log('DocTypeID:'+this.form.get('DocType').value);
        //  console.log('UserOfHandle:'+ this.form.get('UserOfHandle').value);
        // console.log('UserOfHandle:'+ dataForm.UserOfHandle);
        let UserCreate = (dataForm.UserCreate == null || dataForm.UserCreate == 0) ? null : dataForm.UserCreate.split("|")[0];
        let UserOfHandle = (dataForm.UserOfHandle == null || dataForm.UserOfHandle == 0) ? null : dataForm.UserOfHandle.split("|")[0];
        let UserOfCombinate = (dataForm.UserOfCombinate == null || dataForm.UserOfCombinate == 0) ? null : dataForm.UserOfCombinate.split("|")[0];
        let UserOfKnow = (dataForm.UserOfKnow == null || dataForm.UserOfKnow == 0) ? null : dataForm.UserOfKnow.split("|")[0];
        let Signer = (dataForm.Signer == null || dataForm.Signer == 0) ? null : dataForm.Signer.split("|")[0];

        // BookTypeCode:,BookTypeName:,NumberGo:Number,NumberSymbol:,DocTypeID:Number,DocTypeName:,Compendium:Note,SecretLevelID:Number,SecretLevelName:,
        // UrgentLevelID:Number,UrgentLevelName:,Deadline:DateTime,NumOfPaper:Number,NumOfElectronic:Number,UserOfHandle:User,UserOfCombinate:UserMulti,
        // UserOfKnow:UserMulti,StatusCode:,StatusName:,RecipientsInName:,RecipientsInID:Number,RecipientsOutID:Number,RecipientsOutName:,Signer:User,DateCreated:DateTime,
        // DateIssued:DateTime,UnitCreateID:Number,UnitCreateName:,UserCreate:User,MethodSendID:Number,MethodSendName:Text,isRespinse:Number,isSendMail:Number

        const data = {
          __metadata: { type: 'SP.Data.ListDocumentGoListItem' },
          Title: 'Văn bản đi',
          BookTypeName: itemBookType == undefined ? '' : itemBookType.Title,
          BookTypeCode: this.form.get('BookType').value,
          NumberGo: this.form.get('NumberGo').value,
          NumberSymbol: this.form.get('NumberSymbol').value,
          DocTypeID: this.form.get('DocType').value,
          Compendium: this.form.get('Compendium').value,
          RecipientsInID: this.form.get('RecipientsIn').value,
          RecipientsOutID: this.form.get('RecipientsOut').value,
          UserOfHandleId: UserOfHandle,
          // UserOfCombinateId:UserOfCombinate,
          // UserOfKnowId:UserOfKnow,
          UserCreateId: UserCreate,
          SignerId: Signer,
          SecretLevelID: this.form.get('SecretLevel').value,
          UrgentLevelID: this.form.get('UrgentLevel').value,
          MethodSendID: this.form.get('MethodSend').value,
          DocTypeName: itemDocType == undefined ? '' : itemDocType.Title,
          RecipientsInName: itemRecipientsIn == undefined ? '' : itemRecipientsIn.Title,
          RecipientsOutName: itemRecipientsOut == undefined ? '' : itemRecipientsOut.Title,
          SecretLevelName: itemSecretLevel == undefined ? '' : itemSecretLevel.Title,
          UrgentLevelName: itemUrgentLevel == undefined ? '' : itemUrgentLevel.Title,
          MethodSendName: itemMethodSend == undefined ? '' : itemMethodSend.Title,
          UnitCreateName: itemUnitCreate == undefined ? '' : itemUnitCreate.Title,

          UnitCreateID: this.form.get('UnitCreate').value,
          NumOfPaper: this.form.get('NumOfPaper').value,
          DateCreated: this.date.value,
          Deadline: this.form.get('Deadline').value,
          DateIssued: this.form.get('DateIssued').value,
          isRespinse: this.form.get('isRespinse').value == true ? 1 : 0,
          isSendMail: this.form.get('isSendMail').value == true ? 1 : 0,
          StatusCode:  isChuyenXL==0?'VBDT':'VBCXL',
          StatusName: isChuyenXL==0?'Dự thảo':'Chờ xử lý',
        }
        console.log('data=' + data);
        // console.log('DocTypeID:'+this.form.get('DocType').value);
        // console.log('DocTypeID:'+this.form.get('DocType'));
        // console.log('NumberGo:'+ this.form.get('NumberGo').value),
        this.docServices.createDocumentGo(data).subscribe(
          item => {
            console.log("add success !");
            this.notificationService.success('Thêm mới thành công!');
          },
          error => {
            console.log("error add:" + error);
            this.notificationService.error("Thêm mới thất bại.");
          },
          () => {
            //load lại ds văn bản
            this.getListDocumentGo();
            this.reset();
          }
        );
      }
    }
    catch (error) {
      console.log("error add:" + error);
    }
  }
  ChuyenXuLy(isChuyenXL) {
    this.save(isChuyenXL);
    this.notificationService.info('Chuyển xử lý');
  }
  reset() {
    this.form.reset();
    this.form.clearValidators();
    this.form.clearAsyncValidators();
    this.store.dispatch(actionFormReset());
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
