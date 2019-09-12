import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IncomingDoc, AttachmentsObject, IncomingDocService} from '../incoming-doc.service';
import { environment } from '../../../../../../environments/environment';
import {ResApiService} from '../../../services/res-api.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../../core/core.module';

@Component({
  selector: 'anms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDetailComponent implements OnInit {
  itemDoc: IncomingDoc;
  isDisplay: boolean = false;
  ItemId;
  ItemAttachments: AttachmentsObject[] = [];
  urlAttachment = environment.proxyUrl.split("/sites/", 1)
  listName = 'ListDocumentTo';
  outputFile = []; 
  displayFile = '';
  buffer;

  constructor(private docTo: IncomingDocService, private services: ResApiService, 
              private route: ActivatedRoute, private readonly notificationService: NotificationService) { }

  ngOnInit() {
    this.GetItemDetail();
  }

  GetItemDetail() {
    this.route.paramMap.subscribe(parames => {
      this.ItemId = parames.get('id');
      this.docTo.getListDocByID(this.ItemId).subscribe(items => {
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
          bookType: itemList[0].BookTypeName, 
          numberTo: this.docTo.formatNumberTo(itemList[0].NumberTo), 
          numberToSub: itemList[0].NumberToSub === 0 ? '' : itemList[0].NumberToSub , 
          numberOfSymbol: itemList[0].NumberOfSymbol, 
          source: itemList[0].Source, 
          docType: itemList[0].DocTypeName, 
          promulgatedDate: this.docTo.CheckNull(itemList[0].PromulgatedDate) === '' ? '' : moment(itemList[0].PromulgatedDate).format('DD/MM/YYYY'), 
          dateTo: this.docTo.CheckNull(itemList[0].DateTo) === '' ? '' : moment(itemList[0].DateTo).format('DD/MM/YYYY'), 
          compendium: itemList[0].Compendium, 
          secretLevel: itemList[0].SecretLevelName, 
          urgentLevel: itemList[0].UrgentLevelName, 
          deadline: this.docTo.CheckNull(itemList[0].Deadline) === '' ? '' : moment(itemList[0].Deadline).format('DD/MM/YYYY'), 
          numberOfCopies: itemList[0].NumOfCopies, 
          methodReceipt: itemList[0].MethodReceipt, 
          userHandle: itemList[0].UserOfHandle !== undefined ? itemList[0].UserOfHandle.Title : '', 
          note: itemList[0].Note, 
          isResponse: itemList[0].IsResponse === 0 ? "Không" : "Có",
          isSendMail: "Có", 
          isRetrieve: itemList[0].IsRetrieve === 0 ? "Không" : "Có", 
          signer: itemList[0].signer
        }
      })
    })
  }

}
