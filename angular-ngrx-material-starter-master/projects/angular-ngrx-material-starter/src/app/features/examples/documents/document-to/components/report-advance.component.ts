import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ViewContainerRef, Injectable } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormBuilder} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import * as moment from 'moment';
import {IncomingDoc, ItemSeleted, IncomingDocService, IncomingTicket, ApproverObject} from '../incoming-doc.service';
import {RotiniPanel} from './document-add.component';
import {ResApiService} from '../../../services/res-api.service';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../../core/core.module';

@Component({
  selector: 'anms-report-advance',
  templateUrl: './report-advance.component.html',
  styleUrls: ['./report-advance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportAdvanceComponent implements OnInit {
  listTitle = "ListProcessRequestTo";
  inDocs$ = [];
  displayedColumns: string[] = ['numberTo', 'numberSymbol' ,'created', 'userRequest', 'deadline','compendium', 'content', 'sts']; //'select', 'userApprover'
  dataSource = new MatTableDataSource<IncomingTicket>();
  selection = new SelectionModel<IncomingTicket>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText = '';
  date = new FormControl(new Date());
  DocumentID = 0;
  currentUserId;
  currentUserName;
  strFilter = '';
  overlayRef;
  promulgatedFrom = moment().subtract(30,'day').toDate();
  promulgatedTo = new Date();
  dateTo = new Date();
  dateFrom = moment().subtract(30,'day').toDate();
  showList = false;
  ListBookType = [
    {id: 0, Title: 'Chưa vào sổ'},
    {id: 1, Title: 'Văn bản đến'},
  ];
  ListDocType: ItemSeleted[] = [];
  ListSecret: ItemSeleted[] = [];
  ListUrgent: ItemSeleted[] = [];
  ApproverStep: ApproverObject[] = [];
  ListStatus = [
    {id: 0, Title: 'Tất cả'},
    {id: 1, Title: 'Chờ xử lý'},
    {id: 2, Title: 'Đang xử lý'},
    {id: 3, Title: 'Đã xử lý'},
    {id: 4, Title: 'Thu hồi'},
  ];
  bookType; numberTo; docType; numberOfSymbol; singer; source; urgentLevel; secretLevel;
  statusDoc; userApprover; compendium; isAttachment = false;

  constructor(private fb: FormBuilder, private docTo: IncomingDocService, 
              private services: ResApiService, private ref: ChangeDetectorRef,
              private readonly notificationService: NotificationService,
              public overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.getDocType();
    this.getBookType();
    this.getUrgentLevel();
    this.getSecretLevel();
    this.getAllListRequest();
    this.getCurrentUser();
  }
  
  getAllListRequest() {
    try{
      this.OpenRotiniPanel();
      let listName = '';
      this.strFilter = `&$filter=ID ne ''`;

      if(this.bookType === "DT") {
        listName = 'ListDocumentTo';
        if(this.docTo.CheckNull(this.numberTo) !== '') {
          this.strFilter += ` and NumberTo eq '` + this.docTo.CheckNullSetZero(this.numberTo) + `'`;
        }

        if(this.docTo.CheckNull(this.numberOfSymbol) !== '') {
          this.strFilter += ` and substringof('` + this.numberOfSymbol + `',NumberOfSymbol)`;
        }
  
        if(this.docTo.CheckNullSetZero(this.docType) > 0) {
          this.strFilter += ` and DocTypeID eq '` + this.docType +`'`;
        }
  
        if(this.docTo.CheckNull(this.promulgatedFrom) !== '') {
          this.promulgatedFrom = moment(this.promulgatedFrom).hours(0).minutes(0).seconds(0).toDate();
          this.strFilter += ` and (PromulgatedDate ge '` + this.ISODateStringUTC(this.promulgatedFrom) + `' or PromulgatedDate eq null)`;
        }
  
        if(this.docTo.CheckNull(this.promulgatedTo) !== '') {
          this.promulgatedTo = moment(this.promulgatedTo).hours(23).minutes(59).seconds(59).toDate();
          this.strFilter += ` and (PromulgatedDate le '` + this.ISODateStringUTC(this.promulgatedTo) + `' or PromulgatedDate eq null)`
        }
  
        if(this.docTo.CheckNull(this.dateFrom) !== '') {
          this.dateFrom = moment(this.dateFrom).hours(0).minutes(0).seconds(0).toDate();
          this.strFilter += ` and (DateTo ge '` + this.ISODateStringUTC(this.dateFrom) + `' or DateTo eq null)`;
        }
  
        if(this.docTo.CheckNull(this.dateTo) !== '') {
          this.dateTo = moment(this.dateTo).hours(23).minutes(59).seconds(59).toDate();
          this.strFilter += ` and (DateTo le '` + this.ISODateStringUTC(this.dateTo) + `' or DateTo eq null)`;
        }
      } else if(this.bookType === "DG") {
        listName = 'ListDocumentGo';
        
        if(this.docTo.CheckNull(this.numberTo) !== '') {
          this.strFilter += ` and NumberGo eq '` + this.docTo.CheckNullSetZero(this.numberTo) + `'`;
        }

        if(this.docTo.CheckNull(this.numberOfSymbol) !== '') {
          this.strFilter += ` and substringof('` + this.numberOfSymbol + `',NumberSymbol)`;
        }
  
        if(this.docTo.CheckNullSetZero(this.docType) > 0) {
          this.strFilter += ` and DocTypeID eq '` + this.docType +`'`;
        }

        if(this.docTo.CheckNull(this.promulgatedFrom) !== '') {
          this.promulgatedFrom = moment(this.promulgatedFrom).hours(0).minutes(0).seconds(0).toDate();
          this.strFilter += ` and (DateIssued ge '` + this.ISODateStringUTC(this.promulgatedFrom) + `' or DateIssued eq null)`;
        }

        if(this.docTo.CheckNull(this.promulgatedTo) !== '') {
          this.promulgatedTo = moment(this.promulgatedTo).hours(23).minutes(59).seconds(59).toDate();
          this.strFilter += ` and (DateIssued le '` + this.ISODateStringUTC(this.promulgatedTo) + `' or DateIssued eq null)`
        }

        if(this.docTo.CheckNull(this.dateFrom) !== '') {
          this.dateFrom = moment(this.dateFrom).hours(0).minutes(0).seconds(0).toDate();
          this.strFilter += ` and (DateTo ge '` + this.ISODateStringUTC(this.dateFrom) + `' or DateTo eq null)`;
        }

        if(this.docTo.CheckNull(this.dateTo) !== '') {
          this.dateTo = moment(this.dateTo).hours(23).minutes(59).seconds(59).toDate();
          this.strFilter += ` and (DateTo le '` + this.ISODateStringUTC(this.dateTo) + `' or DateTo eq null)`;
        }
      } else {
        listName = '';
      }
      
      this.docTo.getAllDocumentTo(this.strFilter).subscribe((itemValue: any[]) => {
        let item = itemValue["value"] as Array<any>;     
        this.inDocs$ = []; 
        item.forEach(element => {
          this.inDocs$.push({
            STT: this.inDocs$.length + 1,
            ID: element.ID,
            numberTo: this.docTo.formatNumberTo(element.NumberTo), 
            numberSub: element.NumberToSub,
            numberSymbol: element.NumberOfSymbol, 
            userRequest: element.Author.Title,
            userRequestId: element.Author.Id,
            userApprover: element.UserOfHandle !== undefined ? element.UserOfHandle.Title : '',
            deadline: this.docTo.CheckNull(element.Deadline) === '' ? '' : moment(element.Deadline).format('DD/MM/YYYY'),
            status: this.docTo.CheckNullSetZero(element.StatusID) === 0 ? 'Đang xử lý' : 'Đã xử lý',
            compendium: this.docTo.CheckNull(element.Compendium),
            note: this.docTo.CheckNull(element.Note),
            created: this.docTo.CheckNull(element.DateCreated) === '' ? '' : moment(element.DateCreated).format('DD/MM/YYYY'),
            sts: this.docTo.CheckNullSetZero(element.StatusID) === 0 ? 'Ongoing' : 'Approved',
            link: '/examples/doc-detail/' + element.ID
          })
        })   
        
        this.dataSource = new MatTableDataSource<IncomingTicket>(this.inDocs$);
        this.ref.detectChanges();
        this.CloseRotiniPanel();     
      },
      error => { 
        console.log("error: " + error);
        this.CloseRotiniPanel();
      },
      () => {}
      );   
    } catch(err) {
      console.log("Load all document to error:" + err.message);
      this.CloseRotiniPanel();
    }
  }

  resetForm() {
    this.numberTo = null;
    this.docType = null;
    this.promulgatedFrom = moment().subtract(30,'day').toDate();
    this.promulgatedTo = new Date();
    this.dateTo = new Date();
    this.dateFrom = moment().subtract(30,'day').toDate();
  }

  getCurrentUser(){
    this.services.getCurrentUser().subscribe(
      itemValue => {
          this.currentUserId = itemValue["Id"];
          this.currentUserName = itemValue["Title"];
        },
      error => { 
        console.log("error: " + error);
        this.CloseRotiniPanel();
      },
      () => {
        console.log("Current user email is: \n" + "Current user Id is: " + this.currentUserId + "\n" + "Current user name is: " + this.currentUserName );
      }
      );
  }

  getBookType() {
    this.services.getList('ListBookType').subscribe((itemValue: any[]) => {
      let item = itemValue['value'] as Array<any>;
      item.forEach(element => {
        this.ListBookType.push({
          id: element.ID,
          title: element.Title,
          code: element.Code
        });
      });
    });
  }

  getDocType() {
    this.services.getList('ListDocType').subscribe((itemValue: any[]) => {
      let item = itemValue['value'] as Array<any>;
      item.forEach(element => {
        this.ListDocType.push({
          id: element.ID,
          title: element.Title,
          code: ''
        });
      });
    });
  }

  getSecretLevel() {
    this.services.getList('ListSecret').subscribe((itemValue: any[]) => {
      let item = itemValue['value'] as Array<any>;
      item.forEach(element => {
        this.ListSecret.push({
          id: element.ID,
          title: element.Title,
          code: ''
        });
      });
    });
  }

  getUrgentLevel() {
    this.services.getList('ListUrgent').subscribe((itemValue: any[]) => {
      let item = itemValue['value'] as Array<any>;
      item.forEach(element => {
        this.ListUrgent.push({
          id: element.ID,
          title: element.Title,
          code: ''
        });
      });
    });
  }

  OpenRotiniPanel() {
    let config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global().centerVertically().centerHorizontally();
    config.hasBackdrop = true;
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(new ComponentPortal(RotiniPanel, this.viewContainerRef));
  }

  CloseRotiniPanel() {
    this.overlayRef.dispose();
  }

  ISODateStringUTC(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getUTCFullYear() + '-'
      + pad(d.getUTCMonth() + 1) + '-'
      + pad(d.getUTCDate()) + 'T'
      + pad(d.getUTCHours()) + ':'
      + pad(d.getUTCMinutes()) + ':'
      + pad(d.getUTCSeconds()) + 'Z'
  }

}
