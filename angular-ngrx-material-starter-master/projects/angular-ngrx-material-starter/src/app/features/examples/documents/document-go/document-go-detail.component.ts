import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
//import { IncomingDoc, AttachmentsObject, IncomingDocService, IncomingTicket} from '../incoming-doc.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material';
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
import { ResApiService } from '../../services/res-api.service'
import { DocumentGoService } from './document-go.service';
import { ItemDocumentGo, ListDocType, ItemSeleted, ItemSeletedCode,ItemUser,DocumentGoTicket,AttachmentsObject } from './../models/document-go';

@Component({
  selector: 'anms-document-go-detail',
  templateUrl: './document-go-detail.component.html',
  styleUrls: ['./document-go-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentGoDetailComponent implements OnInit {
  itemDoc: ItemDocumentGo;
  isDisplay: boolean = false;
  ItemId;
  ItemAttachments: AttachmentsObject[] = [];
  urlAttachment = environment.proxyUrl.split("/sites/", 1)
  listName = 'ListDocumentTo';
  outputFile = []; 
  displayFile = '';
  buffer;
  strFilter='';
  displayedColumns: string[] = ['stt','created' , 'userRequest', 'userApprover', 'deadline','status', 'taskType']; //'select'
  ListItem: DocumentGoTicket[] = [];
  dataSource = new MatTableDataSource<DocumentGoTicket>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private docServices: DocumentGoService, private services: ResApiService, 
              private route: ActivatedRoute, private readonly notificationService: NotificationService,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
   this.GetItemDetail();
   this.GetHistory();
  }

  GetItemDetail() {
    this.route.paramMap.subscribe(parames => {
      this.ItemId = parames.get('id');
      this.docServices.getListDocByID(this.ItemId).subscribe(items => {
        console.log('items: ' + items);
        let itemList = items["value"] as Array<any>;
        this.isDisplay = true;
        if (itemList[0].AttachmentFiles.length > 0) {
          itemList[0].AttachmentFiles.forEach(element => {
            this.ItemAttachments.push({
              name: element.FileName,
              urlFile: this.urlAttachment + element.ServerRelativeUrl
            })
          });
        }

        this.itemDoc = {
            ID: itemList[0].ID,
            NumberGo: itemList[0].NumberGo === 0 ? '' : itemList[0].NumberGo , 
          //  NumberToSub: itemList[0].NumberToSub === 0 ? '' : itemList[0].NumberToSub , 
            DocTypeName: this.docServices.checkNull(itemList[0].DocTypeName),
            NumberSymbol: this.docServices.checkNull(itemList[0].NumberSymbol),
            Compendium: this.docServices.checkNull(itemList[0].Compendium),
            UserCreateName: itemList[0].Author == undefined ? '' : itemList[0].Author.Title,
            DateCreated: this.docServices.formatDateTime(itemList[0].DateCreated),
            UserOfHandleName: itemList[0].UserOfHandle == undefined ? '' : itemList[0].UserOfHandle.Title,
           
            Deadline: this.docServices.formatDateTime(itemList[0].Deadline),
            StatusName: this.docServices.checkNull(itemList[0].StatusName),
            BookTypeName: itemList[0].BookTypeName,
            UnitCreateName: itemList[0].UnitCreateName,
            RecipientsInName: itemList[0].RecipientsInName,
            RecipientsOutName: itemList[0].RecipientsOutName,
            SecretLevelName: itemList[0].SecretLevelName,
            UrgentLevelName: itemList[0].UrgentLevelName,
            MethodSendName: itemList[0].MethodSendName,
            DateIssued: this.docServices.formatDateTime(itemList[0].DateIssued),
           SignerName: itemList[0].Signer==undefined?'':itemList[0].Signer.Title,
           NumOfPaper : itemList[0].NumOfPaper ,
           Note: itemList[0].Note,
            
          // numberTo: this.docTo.formatNumberTo(itemList[0].NumberTo), 
          // deadline: this.docTo.CheckNull(itemList[0].Deadline) === '' ? '' : moment(itemList[0].Deadline).format('DD/MM/YYYY'), 
          // numberOfCopies: itemList[0].NumOfCopies, 
          // methodReceipt: itemList[0].MethodReceipt, 
          // userHandle: itemList[0].UserOfHandle !== undefined ? itemList[0].UserOfHandle.Title : '', 
          // note: itemList[0].Note, 
          // isResponse: itemList[0].IsResponse === 0 ? "Không" : "Có",
          // isSendMail: "Có", 
          // isRetrieve: itemList[0].IsRetrieve === 0 ? "Không" : "Có", 
          // signer: itemList[0].signer
        };
        this.ref.detectChanges();
      })
    })
  }

  GetHistory() {
    this.strFilter = `&$filter=DocumentGoID eq '`+ this.ItemId+`'`;
    this.docServices.getListRequestGoByDocID(this.strFilter).subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;     
      this.ListItem = []; 
      item.forEach(element => {
        this.ListItem.push({
          documentID: element.NoteBookID, 
          compendium: element.Compendium, 
          userRequest: element.UserRequest !== undefined ? element.UserRequest.Title : '',
          userApprover: element.UserApprover !== undefined ? element.UserApprover.Title : '',
          deadline: this.docServices.formatDateTime(element.Deadline),
          status: element.StatusName,
          source: '',
          destination: '',
          taskType: '',
          typeCode: '',
          content: this.docServices.checkNull(element.Content),
          indexStep: element.IndexStep,
          created: this.docServices.formatDateTime(element.DateCreated),
          numberTo: element.ID
        })
      })
      this.dataSource = new MatTableDataSource<DocumentGoTicket>(this.ListItem);
      this.ref.detectChanges();
      this.dataSource.paginator = this.paginator;
    });   
  }

  gotoBack() {
    window.history.back()
  }
 
  AddNewComment() {
    this.notificationService.info('Chờ xin ý kiến');
  }

  NextApprval() {
    this.notificationService.warn('Chọn người xử lý tiếp theo');
  }

  ReturnRequest() {
    this.notificationService.warn('Chọn phòng ban để trả lại');
  }
}


