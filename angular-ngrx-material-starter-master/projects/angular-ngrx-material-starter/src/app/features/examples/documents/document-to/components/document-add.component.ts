import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {IncomingDoc, ItemSeleted, IncomingDocService} from '../incoming-doc.service'
import {ResApiService} from '../../../services/res-api.service'
import { element } from 'protractor';

@Component({
  selector: 'anms-document-add',
  templateUrl: './document-add.component.html',
  styleUrls: ['./document-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentAddComponent implements OnInit {
  inDocs$: IncomingDoc[]= [];
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<IncomingDoc>();
  selection = new SelectionModel<IncomingDoc>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText = '';
  date = new FormControl(new Date());
  addNew = false;
  showList = true;
  IncomingDocform: FormGroup;
  ListBookType: ItemSeleted[] = [];
  ListDocType: ItemSeleted[]= [];
  ListSecret: ItemSeleted[] = [];
  ListUrgent: ItemSeleted[]= [];
  ListMethodReceipt : ItemSeleted[] = [];

  constructor(private fb: FormBuilder, private docTo: IncomingDocService, private services: ResApiService) {}

  ngOnInit() {
    this.docTo.inDocs$.subscribe(itemValue => {
      let array = itemValue as Array<any>
      array.forEach(element => {
        this.inDocs$.push(element);
      })
    });
    this.dataSource = new MatTableDataSource<IncomingDoc>(this.inDocs$);
    this.dataSource.paginator = this.paginator;
    // this.services.getListBookType();
    this.getBookType();
    this.getDocType();
    this.getSecretLevel();
    this.getUrgentLevel();
    this.getMethodReceipt();

    this.IncomingDocform = this.fb.group({
      bookType: 'DT',
      numberTo: ['', [Validators.required]],
      numberToSub: '',
      numberOfSymbol: '',
      source: '',
      docType: '',
      promulgatedDate: null,
      dateTo: null,
      compendium: ['', [Validators.required]],
      secretLevel: '',
      urgentLevel: '',
      deadline: null,
      numberOfCopies: '',
      methodReceipt: '',
      userHandle: '',
      note: '',
      isRespinse: false,
      isSendMail: false,
      signer: '',
      //surname: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: IncomingDoc): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.numberTo}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getBookType() {
    this.services.getListBookType().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListBookType.push({
          id: element.ID,
          title: element.Title,
          code: element.Code
        })
      });
    })
  }

  getDocType() {
    this.services.getListDocType().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListDocType.push({
          id: element.ID,
          title: element.Title,
          code: ''
        })
      });
    })
  }

  getSecretLevel() {
    this.services.getListSecret().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListSecret.push({
          id: element.ID,
          title: element.Title,
          code: ''
        })
      });
    })
  }

  getUrgentLevel() {
    this.services.getListUrgent().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListUrgent.push({
          id: element.ID,
          title: element.Title,
          code: ''
        })
      });
    })
  }

  getMethodReceipt() {
    this.services.getListMethodSend().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListMethodReceipt.push({
          id: element.ID,
          title: element.Title,
          code: ''
        })
      });
    })
  }

  AddNewItem(sts) {
    if (this.IncomingDocform.valid) {
      const dataForm = this.IncomingDocform.getRawValue();
      let bookT = this.docTo.FindItemByCode(this.ListBookType, dataForm.bookType);
      let docT = this.docTo.FindItemById(this.ListDocType, dataForm.docType);
      let secretL = this.docTo.FindItemById(this.ListSecret, dataForm.secretLevel);
      let urgentL = this.docTo.FindItemById(this.ListUrgent, dataForm.urgentLevel);
      let method = this.docTo.FindItemById(this.ListMethodReceipt, dataForm.methodReceipt);
      const data = {
        __metadata: { type: 'SP.Data.ListDocumentToListItem' },
        Title: dataForm.bookType,
        BookTypeCode: dataForm.bookType,
        BookTypeName: bookT === undefined ? '' : bookT.title,
        NumberTo: dataForm.numberTo,
        NumberToSub: dataForm.numberToSub,
        NumberOfSymbol: dataForm.numberOfSymbol,
        Source: dataForm.source,
        DocTypeID: dataForm.docType,
        DocTypeName: docT === undefined ? '' : docT.title,
        PromulgatedDate: dataForm.promulgatedDate,
        DateTo: dataForm.dateTo,
        DateCreated: new Date(),
        Compendium: dataForm.compendium,
        SecretLevelID: dataForm.secretLevel,
        SecretLevelName: secretL === undefined ? '' : secretL.title,
        UrgentLevelID: dataForm.urgentLevel,
        UrgentLevelName: urgentL === undefined ? '' : urgentL.title,
        Deadline: dataForm.deadline,
        NumOfCopies: dataForm.numberOfCopies,
        MethodReceiptID: dataForm.methodReceipt,
        MethodReceipt: method === undefined ? '' : method.title,
        UserOfHandle: dataForm.userHandle,
        Note: dataForm.note,
        IsResponse: dataForm.IsResponse ? 1 : 0,
        IsRetrieve: dataForm.IsRetrieve ? 1 : 0,
        StatusID: sts,
        StatusName: sts === 0 ? "Chờ xử lý" : "Lưu tạm",
        Signer: dataForm.signer
      }
      this.services.AddItemToList('ListDocumentTo', data).subscribe(
        item => {},
        error => console.log("error when add item to list ListDocumentTo: "+ error),
        () => {
          console.log("Add item of approval user to list ListDocumentTo successfully!");
        });
    }
  }

}
