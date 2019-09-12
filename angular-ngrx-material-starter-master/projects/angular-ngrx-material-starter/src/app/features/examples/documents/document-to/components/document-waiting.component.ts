import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormBuilder} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import * as moment from 'moment';
import {IncomingDoc, ItemSeleted, IncomingDocService, IncomingTicket} from '../incoming-doc.service'
import {ResApiService} from '../../../services/res-api.service';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../../core/core.module';

@Component({
  selector: 'anms-document-waiting',
  templateUrl: './document-waiting.component.html',
  styleUrls: ['./document-waiting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentWaitingComponent implements OnInit {

  listTitle = "ListProcessRequestTo";
  inDocs$: IncomingTicket[]= [];
  displayedColumns: string[] = ['numberTo', 'created', 'userRequest', 'userApprover', 'deadline','compendium', 'content']; //'select'
  dataSource = new MatTableDataSource<IncomingTicket>();
  selection = new SelectionModel<IncomingTicket>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText = '';
  date = new FormControl(new Date());
  DocumentID = 0;
  currentUserId;
  currentUserName;
  strFilter = '';

  constructor(private fb: FormBuilder, private docTo: IncomingDocService, 
              private services: ResApiService, private ref: ChangeDetectorRef,
              private readonly notificationService: NotificationService) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getAllListRequest() {
    this.strFilter = `&$filter=UserRequest/Id eq ` + this.currentUserId + ` and TypeCode eq 'CXL' and StatusID eq '0'`;
    this.docTo.getListRequestTo(this.strFilter).subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;     
      this.inDocs$ = []; 
      item.forEach(element => {
        this.inDocs$.push({
          documentID: element.NoteBookID, 
          compendium: element.Compendium, 
          userRequest: element.UserRequest !== undefined ? element.UserRequest.Title : '',
          userApprover: element.UserApprover !== undefined ? element.UserApprover.Title : '',
          deadline: this.docTo.CheckNull(element.Deadline) === '' ? '' : moment(element.Deadline).format('DD/MM/YYYY'),
          status: 'Chờ xử lý',
          source: '',
          destination: '',
          taskType: '',
          typeCode: '',
          content: this.docTo.CheckNull(element.Content),
          indexStep: element.IndexStep,
          created: this.docTo.CheckNull(element.DateCreated) === '' ? '' : moment(element.DateCreated).format('DD/MM/YYYY'),
          numberTo: element.Title
        })
      })
      this.dataSource = new MatTableDataSource<IncomingTicket>(this.inDocs$);
      this.ref.detectChanges();
      this.dataSource.paginator = this.paginator;
    });   
  }

  getCurrentUser(){
    this.services.getCurrentUser().subscribe(
      itemValue => {
          this.currentUserId = itemValue["Id"];
          this.currentUserName = itemValue["Title"];
        },
      error => console.log("error: " + error),
      () => {
        console.log("Current user email is: \n" + "Current user Id is: " + this.currentUserId + "\n" + "Current user name is: " + this.currentUserName );
        this.getAllListRequest();
      }
      );
  }
}
