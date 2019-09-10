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
      bookType: '',
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
    console.warn(this.ListBookType);
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

  AddNewItem() {
    const data = {
      __metadata: { type: 'SP.Data.ListDocumentTo' },

    }
    this.services.AddItemToList('ListDocumentTo', data).subscribe(
      item => {},
      error => console.log("error when add item to list ListRequestSendMail: "+ error),
      () => {
        console.log("Add item of approval user to list ListRequestSendMail successfully!");
      });
  }

}
