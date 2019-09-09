import { Component, OnInit, ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { filter, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import * as moment from 'moment';

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

import {ListDocumentGo, DocumentGo,ListDocType} from './../models/document-go';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
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
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    // requestGift: [''],
    // birthday: ['', [Validators.required]],
    // rating: [0, Validators.required]
    NumSymbol:new FormControl(),
      DocType:new FormControl(),
      RecipientsIn:new FormControl(),
      RecipientsOut:new FormControl(),
      UserOfHandle:new FormControl(),
      UserOfCombinate:new FormControl(),
      UserOfKnow:new FormControl(),
      Signer:new FormControl(),
      Note:new FormControl(),
      NumOfPaper :new FormControl(),
      Deadline:new FormControl(),
      DateIssued:new FormControl(),
  });
// form=new FormGroup({
//   NumSymbol:new FormControl(),
//   Compendium:new FormControl(),
//   DocType:new FormControl(),
//   RecipientsIn:new FormControl(),
//   RecipientsOut:new FormControl(),
//   UserOfHandle:new FormControl(),
//   UserOfCombinate:new FormControl(),
//   UserOfKnow:new FormControl(),
//   Signer:new FormControl(),
//   Note:new FormControl(),
// })
  

  formValueChanges$: Observable<DocumentGo>;
  ListDocType = ListDocType;
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {}

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText = '';
  date = new FormControl(new Date());
  addNew = false;
  showList = true;

  

  ngOnInit() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
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

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
