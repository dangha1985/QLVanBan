import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ViewContainerRef,
  TemplateRef
} from '@angular/core';
import {
  IncomingDoc,
  AttachmentsObject,
  IncomingDocService,
  IncomingTicket
} from '../incoming-doc.service';
import { environment } from '../../../../../../environments/environment';
import {RotiniPanel} from './document-add.component';
import {ResApiService} from '../../../services/res-api.service';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../../core/core.module';
import { isPlatformBrowser } from '@angular/common';
import { element } from 'protractor';

@Component({
  selector: 'anms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDetailComponent implements OnInit {
  bsModalRef: BsModalRef;
  itemDoc: IncomingDoc;
  isDisplay: boolean = false;
  ArrayItemId = []; IncomingDocID;
  IndexStep = 0;
  DepartmentCode = [];
  RoleCode = [];
  ListUserApprover = [];
  ListUserCombine = [];
  ListUserKnow = [];
  currentUserId = 0;
  currentUserName = '';
  RoleApprover = [];
  RoleCombine = [];
  RoleKnow = [];
  ItemAttachments: AttachmentsObject[] = [];
  urlAttachment = environment.proxyUrl.split('/sites/', 1);
  listName = 'ListDocumentTo';
  outputFile = [];
  displayFile = '';
  closeResult = '';
  buffer;
  index = 0;
  overlayRef;
  selectedKnower; selectedCombiner; selectedApprover;
  content;deadline;
  displayedColumns: string[] = [
    'stt',
    'created',
    'userRequest',
    'userApprover',
    'deadline',
    'status',
    'taskType'
  ]; //'select'
  ListItem: IncomingTicket[] = [];
  dataSource = new MatTableDataSource<IncomingTicket>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private docTo: IncomingDocService,
    private services: ResApiService,
    private route: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService,
    public overlay: Overlay, 
    public viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.GetItemDetail();
    this.GetHistory();
  }

  OpenRotiniPanel() {
    let config = new OverlayConfig();
    config.positionStrategy = this.overlay
      .position()
      .global()
      .centerVertically()
      .centerHorizontally();
    config.hasBackdrop = true;
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(
    new ComponentPortal(RotiniPanel, this.viewContainerRef)
    );
  }

  CloseRotiniPanel() {
    this.overlayRef.dispose();
  }

  GetItemDetail() {
    this.route.paramMap.subscribe(parames => {
      this.IncomingDocID = parames.get('id');
      this.IndexStep = parseInt(parames.get('step'));
      this.docTo.getListDocByID(this.IncomingDocID).subscribe(items => {
        console.log('items: ' + items);
        let itemList = items['value'] as Array<any>;
        if (itemList[0].AttachmentFiles.length > 0) {
          itemList[0].AttachmentFiles.forEach(element => {
            this.ItemAttachments.push({
              name: element.FileName,
              urlFile: this.urlAttachment + element.ServerRelativeUrl
            });
          });
        }

        this.itemDoc = {
          ID: itemList[0].ID,
          bookType: itemList[0].BookTypeName,
          numberTo: this.docTo.formatNumberTo(itemList[0].NumberTo),
          numberToSub:
            itemList[0].NumberToSub === 0 ? '' : itemList[0].NumberToSub,
          numberOfSymbol: itemList[0].NumberOfSymbol,
          source: itemList[0].Source,
          docType: itemList[0].DocTypeName,
          promulgatedDate:
            this.docTo.CheckNull(itemList[0].PromulgatedDate) === ''
              ? ''
              : moment(itemList[0].PromulgatedDate).format('DD/MM/YYYY'),
          dateTo:
            this.docTo.CheckNull(itemList[0].DateTo) === ''
              ? ''
              : moment(itemList[0].DateTo).format('DD/MM/YYYY'),
          compendium: itemList[0].Compendium,
          secretLevel: itemList[0].SecretLevelName,
          urgentLevel: itemList[0].UrgentLevelName,
          deadline:
            this.docTo.CheckNull(itemList[0].Deadline) === ''
              ? ''
              : moment(itemList[0].Deadline).format('DD/MM/YYYY'),
          numberOfCopies: itemList[0].NumOfCopies,
          methodReceipt: itemList[0].MethodReceipt,
          userHandle:
            itemList[0].UserOfHandle !== undefined
              ? itemList[0].UserOfHandle.Title
              : '',
          note: itemList[0].Note,
          isResponse: itemList[0].IsResponse === 0 ? 'Không' : 'Có',
          isSendMail: 'Có',
          isRetrieve: itemList[0].IsRetrieve === 0 ? 'Không' : 'Có',
          signer: itemList[0].signer
        };
        this.ref.detectChanges();
      });

      // Load list config by step
      this.services.getInforApprovalByStep('DT',this.IndexStep + 1).subscribe(valueItem => {
        let item = valueItem['value'] as Array<any>;
        item.forEach(element => {
          if(this.docTo.CheckNull(element.RoleCode) !== '') {
            let arr = element.RoleCode.split(',');
            arr.forEach(element => {
              this.RoleApprover.push(element);
            });
          }
          if(this.docTo.CheckNull(element.RoleCodeCombine) !== '') {
            let arr = element.RoleCodeCombine.split(',');
            arr.forEach(element => {
            this.RoleCombine.push(element);
            })
          }
          if(this.docTo.CheckNull(element.RoleCodeKnow) !== '') {
            let arr = element.RoleCodeKnow.split(',');
            arr.forEach(element => {
            this.RoleKnow.push(element);
            })
          }
        })        
        this.getCurrentUser();
      });
    });
  }

  GetHistory() {
    this.docTo
      .getListRequestByDocID(this.IncomingDocID)
      .subscribe((itemValue: any[]) => {
        let item = itemValue['value'] as Array<any>;
        this.ListItem = [];
        item.forEach(element => {
          this.ListItem.push({
            ID: element.ID,
            documentID: element.NoteBookID,
            compendium: element.Compendium,
            userRequest:
              element.UserRequest !== undefined
                ? element.UserRequest.Title
                : '',
            userApprover:
              element.UserApprover !== undefined
                ? element.UserApprover.Title
                : '',
            deadline:
              this.docTo.CheckNull(element.Deadline) === ''
                ? ''
                : moment(element.Deadline).format('DD/MM/YYYY'),
            status: 'Chờ xử lý',
            source: '',
            destination: '',
            taskType: element.TaskTypeCode === 'XLC'? "Xử lý chính" : element.TaskTypeCode === 'PH'? 'Phối hợp' : 'Nhận để biết',
            typeCode: '',
            content: this.docTo.CheckNull(element.Content),
            indexStep: element.IndexStep,
            created:
              this.docTo.CheckNull(element.DateCreated) === ''
                ? ''
                : moment(element.DateCreated).format('DD/MM/YYYY'),
            numberTo: element.Title
          });
        });
        this.dataSource = new MatTableDataSource<IncomingTicket>(this.ListItem);
        this.ref.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.ArrayItemId = this.ListItem.filter(e => e.indexStep === this.IndexStep);
      });
  }

  gotoBack() {
    window.history.back();
  }

  getCurrentUser(){
    this.services.getCurrentUser().subscribe(
      itemValue => {
          this.currentUserId = itemValue["Id"];
          this.currentUserName = itemValue["Title"];
        },
      error => { 
        console.log("error: " + error);
      },
      () => {
        console.log("Current user email is: \n" + "Current user Id is: " + this.currentUserId + "\n" + "Current user name is: " + this.currentUserName );
        this.services.getDepartmnetOfUser(this.currentUserId).subscribe(
          itemValue => {
            let item = itemValue['value'] as Array<any>;
            this.DepartmentCode = [];
            this.RoleCode = [];
            item.forEach(element => {
              this.DepartmentCode.push(element.DepartmentCode);
              this.RoleCode.push(element.RoleCode);
            });            
            this.GetUserApprover();
          },
          error => { 
            console.log("Load department code error: " + error);
          }
        )
      }
      );
  }

  AddNewComment() {
    this.notificationService.info('Chờ xin ý kiến');
  }

  NextApprval(template: TemplateRef<any>) {
    this.notificationService.warn('Chọn người xử lý tiếp theo');
    this.bsModalRef = this.modalService.show(template);
  }

  ReturnRequest() {
    this.notificationService.warn('Chọn phòng ban để trả lại');
  }

  GetUserApprover() {
    let strFilterApprover = `&$filter=RoleCode eq '` + this.RoleApprover[0] + `'`;
    if(this.RoleApprover.length > 1) {
      strFilterApprover = `&$filter=(`;
      this.RoleApprover.forEach(element => {
        strFilterApprover += ` RoleCode eq '` + element + `' or`;
      })
      strFilterApprover = strFilterApprover.substr(0, strFilterApprover.length-2) + `)`;
    }
    if(this.RoleCode.indexOf('VT') < 0 && this.RoleCode.indexOf('GĐ') < 0 && (this.RoleApprover.includes('NV') || this.RoleApprover.includes('TP'))) {
      strFilterApprover += `and (`;
      this.DepartmentCode.forEach(element => {
        strFilterApprover += ` DepartmentCode eq '` + element + `' or`;
      })
      strFilterApprover = strFilterApprover.substr(0, strFilterApprover.length-2) + `)`;
    }
    this.services.getUserByRole2(strFilterApprover).subscribe(valueItem => {
      let item = valueItem['value'] as Array<any>;
      this.ListUserApprover = [];
      item.forEach(element => {
        this.ListUserApprover.push({
          DepartmentCode: element.DepartmentCode,
          DepartmentName: element.DepartmentName,
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split('|')[2]
        })        
      })
      this.ref.detectChanges();
    });

    let strFilterCombine = `&$filter=(`;
    if(this.RoleCombine.length >= 1) {
      this.RoleCombine.forEach(element => {
        strFilterCombine += ` RoleCode eq '` + element + `' or`;
      })
      strFilterCombine = strFilterCombine.substr(0, strFilterCombine.length-2) + `)`;
    }
    this.services.getUserByRole2(strFilterCombine).subscribe(valueItem => {
      let item = valueItem['value'] as Array<any>;
      this.ListUserCombine = [];
      item.forEach(element => {
        this.ListUserCombine.push({
          DepartmentCode: element.DepartmentCode,
          DepartmentName: element.DepartmentName,
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split('|')[2]
        })        
      })
      this.ref.detectChanges();
    });

    let strFilterKnow = `&$filter=(`;
    if(this.RoleKnow.length >= 1) {
      this.RoleKnow.forEach(element => {
        strFilterKnow += ` RoleCode eq '` + element + `' or`;
      })
      strFilterKnow = strFilterKnow.substr(0, strFilterKnow.length-2) + `)`;
    }
    this.services.getUserByRole2(strFilterKnow).subscribe(valueItem => {
      let item = valueItem['value'] as Array<any>;
      this.ListUserKnow = [];
      item.forEach(element => {
        this.ListUserKnow.push({
          DepartmentCode: element.DepartmentCode,
          DepartmentName: element.DepartmentName,
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split('|')[2]
        })        
      })
      this.ref.detectChanges();
    });
  }

  // Add phiếu xử lý
  AddListTicket() {
    this.bsModalRef.hide();
    this.OpenRotiniPanel();
    //let data: Array<any> = [];
    const data = {
      __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
      Title: this.itemDoc.numberTo,
      DateCreated: new Date(),
      NoteBookID: this.IncomingDocID,
      UserRequestId: this.currentUserId,
      UserApproverId: this.selectedApprover.split('|')[0],
      Deadline: this.deadline,
      StatusID: 0,
      StatusName: 'Đang xử lý',
      Source: '',
      Destination: '',
      TaskTypeCode: 'XLC',
      TaskTypeName: 'Xử lý chính',
      TypeCode: 'CXL',
      TypeName: 'Chuyển xử lý',
      Content: this.content,
      IndexStep: this.IndexStep + 1,
      Compendium: this.itemDoc.compendium
    };
    // if(this.selectedCombiner !== undefined && this.selectedCombiner.length > 0) {
    //   this.selectedCombiner.forEach(element => {
    //     data.push({
    //       __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
    //       Title: this.itemDoc.numberTo,
    //       DateCreated: new Date(),
    //       NoteBookID: this.IncomingDocID,
    //       UserRequestId: this.currentUserId,
    //       UserApproverId: element.split('|')[0],
    //       Deadline: this.deadline,
    //       StatusID: 0,
    //       StatusName: 'Đang xử lý',
    //       Source: '',
    //       Destination: '',
    //       TaskTypeCode: 'PH',
    //       TaskTypeName: 'Phối hợp',
    //       TypeCode: 'CXL',
    //       TypeName: 'Chuyển xử lý',
    //       Content: this.content,
    //       IndexStep: this.IndexStep + 1,
    //       Compendium: this.itemDoc.compendium
    //     });
    //   });
    // }
    // if(this.selectedKnower !== undefined && this.selectedKnower.length > 0) {
    //   this.selectedKnower.forEach(element => {
    //     data.push({
    //       __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
    //       Title: this.itemDoc.numberTo,
    //       DateCreated: new Date(),
    //       NoteBookID: this.IncomingDocID,
    //       UserRequestId: this.currentUserId,
    //       UserApproverId: element.split('|')[0],
    //       Deadline: this.deadline,
    //       StatusID: 0,
    //       StatusName: 'Đang xử lý',
    //       Source: '',
    //       Destination: '',
    //       TaskTypeCode: 'NĐB',
    //       TaskTypeName: 'Nhận để biết',
    //       TypeCode: 'CXL',
    //       TypeName: 'Chuyển xử lý',
    //       Content: this.content,
    //       IndexStep: this.IndexStep + 1,
    //       Compendium: this.itemDoc.compendium
    //     });
    //   });
    // }
    this.services.AddItemToList('ListProcessRequestTo', data).subscribe(
      item => {},
      error => {
        this.CloseRotiniPanel();
        console.log(
          'error when add item to list ListProcessRequestTo: ' +
            error.error.error.message.value
        ),
          this.notificationService.error('Thêm phiếu xử lý thất bại');
      },
      () => {
        console.log(
          'Add item of approval user to list ListProcessRequestTo successfully!'
        );
        this.UpdateStatus();
      }
    );
  }

  AddUserCombine() {
    const data = {
      __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
      Title: this.itemDoc.numberTo,
      DateCreated: new Date(),
      NoteBookID: this.IncomingDocID,
      UserRequestId: this.currentUserId,
      UserApproverId: this.selectedCombiner[this.index].split('|')[0],
      Deadline: this.deadline,
      StatusID: 0,
      StatusName: 'Đang xử lý',
      Source: '',
      Destination: '',
      TaskTypeCode: 'PH',
      TaskTypeName: 'Phối hợp',
      TypeCode: 'CXL',
      TypeName: 'Chuyển xử lý',
      Content: this.content,
      IndexStep: this.IndexStep + 1,
      Compendium: this.itemDoc.compendium
    };
    this.services.AddItemToList('ListProcessRequestTo', data).subscribe(
      item => {},
      error => {
        this.CloseRotiniPanel();
        console.log(
          'error when add item to list ListProcessRequestTo: ' +
            error.error.error.message.value
        ),
          this.notificationService.error('Them phiếu xử lý thất bại');
      },
      () => {
        console.log(
          'update item ' + this.selectedCombiner[this.index] + ' of approval user to list ListProcessRequestTo successfully!'
        );
        this.index ++;
        if(this.index < this.selectedCombiner.length) {
          this.AddUserCombine();
        }
        else {
          this.index = 0;
          if(this.selectedKnower !== undefined && this.selectedKnower.length > 0) {
            this.AddUserKnow();
          } else {
            this.CloseRotiniPanel();     
            this.notificationService.success('Cập nhật thông tin xử lý thành công.');
          }
        }
      }
    );
  }

  AddUserKnow() {
    const data = {
      __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
      Title: this.itemDoc.numberTo,
      DateCreated: new Date(),
      NoteBookID: this.IncomingDocID,
      UserRequestId: this.currentUserId,
      UserApproverId: this.selectedCombiner[this.index].split('|')[0],
      Deadline: this.deadline,
      StatusID: 0,
      StatusName: 'Đang xử lý',
      Source: '',
      Destination: '',
      TaskTypeCode: 'NĐB',
      TaskTypeName: 'Nhận để biết',
      TypeCode: 'CXL',
      TypeName: 'Chuyển xử lý',
      Content: this.content,
      IndexStep: this.IndexStep + 1,
      Compendium: this.itemDoc.compendium
    };
    this.services.AddItemToList('ListProcessRequestTo', data).subscribe(
      item => {},
      error => {
        this.CloseRotiniPanel();
        console.log(
          'error when add item to list ListProcessRequestTo: ' +
            error.error.error.message.value
        ),
          this.notificationService.error('Them phiếu xử lý thất bại');
      },
      () => {
        console.log(
          'update item' + this.selectedKnower[this.index] + ' of approval user to list ListProcessRequestTo successfully!'
        );
        this.index ++;
        if(this.index < this.selectedKnower.length) {
          this.AddUserKnow();
        }
        else {
          this.index = 0;   
          this.CloseRotiniPanel();     
          this.notificationService.success('Cập nhật thông tin xử lý thành công.');  
        }
      }
    );
  }

  UpdateStatus() {
    if(this.ArrayItemId !== undefined && this.ArrayItemId.length > 0) {
      const dataTicket = {
        __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
        StatusID: 1, StatusName: "Đã xử lý",
      };
      this.services.updateListById('ListProcessRequestTo', dataTicket, this.ArrayItemId[this.index].ID).subscribe(
        item => {},
        error => {
          this.CloseRotiniPanel();
          console.log(
            'error when update item to list ListProcessRequestTo: ' +
              error.error.error.message.value
          ),
            this.notificationService.error('Cập nhật thông tin phiếu xử lý thất bại');
        },
        () => {
          console.log(
            'update item ' + this.ArrayItemId[this.index] + ' of approval user to list ListProcessRequestTo successfully!'
          );
          this.index ++;
          if(this.index < this.ArrayItemId.length) {
            this.UpdateStatus();
          }
          else {
            this.index = 0;
            if(this.selectedCombiner !== undefined && this.selectedCombiner.length > 0) {
              this.AddUserCombine();
            } else if(this.selectedKnower !== undefined && this.selectedKnower.length > 0) {
              this.AddUserKnow();
            } else {
              this.CloseRotiniPanel();
              this.notificationService.success('Cập nhật thông tin xử lý thành công.');
            }
          }
        }
      );
    }
  }
}

/* This is a component which we pass in modal*/
@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" fxLayout="column">
      <mat-form-field fxFlex="100">
        <mat-label>Người xử lý</mat-label>
        <mat-select>
            <mat-option>None</mat-option>
            <mat-option value="1">Loan</mat-option>
        </mat-select>
      </mat-form-field>
  
      <mat-form-field fxFlex="100">
        <mat-label>Người phối hợp</mat-label>
        <mat-select>
            <mat-option>None</mat-option>
            <mat-option *ngFor="let item of this.ListUserCombine" value="{{item.UserId}}|{{item.UserId}}">{{item.UserName}}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field fxFlex="100">
        <mat-label>Nhận để biết</mat-label>
        <mat-select>
            <mat-option>None</mat-option>      
            <mat-option *ngFor="let item of this.ListUserKnow" value="{{item.UserId}}|{{item.UserId}}">{{item.UserName}}</mat-option>     
        </mat-select>
      </mat-form-field>

      <mat-form-field fxFlex="100">
        <mat-label>Nội dung xử lý <span class="required-field">*</span></mat-label>
        <textarea matInput></textarea>
      </mat-form-field>

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
    </div>
  `,
})

export class ModalContentComponent {
  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(public bsModalRef: BsModalRef) {}
}

