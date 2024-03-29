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
import { ActivatedRoute, Router} from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../../core/core.module';
import { StringNullableChain } from 'lodash';
import { element } from 'protractor';

export interface PeriodicElement {
  name: string;
  position: number;
  process: boolean;
  combine: boolean;
  know: boolean
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', process: false, combine: false, know: false},
  {position: 2, name: 'Helium', process: false, combine: false, know: false},
  {position: 3, name: 'Lithium', process: false, combine: false, know: false},
];

export class UserOfDepartment {
  STT: Number;
  IsDepartment: boolean;
  Code: string;
  Name: string;
  Role: string;
  IsHandle: boolean;
  IsCombine: boolean;
  IsKnow : boolean;
  Icon: string;
  Class: string;
}

export class UserChoice {
  STT: Number;
  Id: Number;
  Email: string;
  DisplayName: string;
  DeCode: string;
  DeName: string;
  RoleCode: string;
  RoleName: string;
}

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
  isExecution: boolean = false;
  isFinish: boolean = false;
  isReturn: boolean = false;
  ArrayItemId = []; IncomingDocID;
  IndexStep = 0;
  DepartmentCode = [];
  RoleCode = [];
  ListDepartment = [];
  ListUserApprover = [];
  ListUserChoice: UserChoice[] = [];
  ListUserOfDepartment: UserOfDepartment[] = [];
  ListUserCombine = [];
  ListUserKnow = [];
  currentUserId = 0;
  assetFolder = environment.assetFolder;
  currentUserName = '';
  currentUserEmail = '';
  RoleApprover = [];
  RoleCombine = [];
  RoleKnow = [];
  ItemAttachments: AttachmentsObject[] = [];
  urlAttachment = environment.proxyUrl.split('/sites/', 1);
  listName = 'ListDocumentTo';
  outputFile = [];
  outputFileHandle = [];
  outputFileReturn = [];
  displayFile = '';
  closeResult = '';
  imgUserDefault = '../../../../' + this.assetFolder + '/img/profile.jpg'
  historyId = 0;
  buffer;
  index = 0;
  totalStep = 0;
  overlayRef;
  selectedKnower = []; selectedCombiner = []; selectedApprover;
  UserAppoverName = '';
  EmailConfig;
  ReasonReturn;
  content;deadline;
  displayedColumns: string[] = [
    'stt',
    'created',
    'userRequest',
    'userApprover',
    'deadline',
    'status',
    'taskType',
    '_content',
    'type'
  ]; //'select'
  ListItem = [];
  dataSource = new MatTableDataSource<IncomingTicket>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns2 = ['person', 'role', 'process', 'combine', 'know'];
  //dataSource2 = ELEMENT_DATA;
  dataSource2 = new MatTableDataSource<UserOfDepartment>();
  selection = new SelectionModel<UserOfDepartment>(true, []);

  constructor(
    private docTo: IncomingDocService,
    private services: ResApiService,
    private route: ActivatedRoute,
    private routes: Router,
    private readonly notificationService: NotificationService,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService,
    public overlay: Overlay, 
    public viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.GetTotalStep();
    this.GetAllUser();
    this.getCurrentUser();
    this.getListEmailConfig();
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

  GetTotalStep() {
    this.route.paramMap.subscribe(parames => {
      this.IncomingDocID = parseInt(parames.get('id'));
      this.IndexStep = parseInt(parames.get('step'));
      this.GetHistory();
      this.getComment();
      this.services.getListTotalStep('DT').subscribe(items => {
        let itemList = items['value'] as Array<any>;
        if(itemList.length > 0){
          this.totalStep = itemList[0].TotalStep;
        }
      },
      error => {
        console.log("Load total step error: " + error);
        this.CloseRotiniPanel();
      },
      () => {
        this.GetItemDetail();
      }
      )
    })
  }

  GetItemDetail() {
    this.route.paramMap.subscribe(parames => {
      if(this.IndexStep > 0) {
        this.isExecution = true;
        this.isReturn = true;
        if(this.IndexStep >= this.totalStep) {
          this.isExecution = false;
          this.isFinish = true;
        } else {
          this.isExecution = true;
          this.isFinish = false;
        }
      }
      this.OpenRotiniPanel();       
      // Load thong tin van ban
      this.docTo.getListDocByID(this.IncomingDocID).subscribe(items => {
        console.log('items: ' + items);
        this.ItemAttachments=[];
        let itemList = items['value'] as Array<any>;
        if(itemList.length > 0){
          if (itemList[0].AttachmentFiles.length > 0) {
            itemList[0].AttachmentFiles.forEach(element => {
              this.ItemAttachments.push({
                name: element.FileName,
                urlFile: this.urlAttachment + element.ServerRelativeUrl
              });
            });
          }
          this.UserAppoverName = itemList[0].ListUserApprover;
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
            signer: itemList[0].Signer,
            created: itemList[0].Author.Id
          };
        }
        this.ref.detectChanges();
        this.CloseRotiniPanel();
      });

      // Load list config by step
      // if(this.IndexStep > 0) {
      //   this.isExecution = true;
      //   this.services.getInforApprovalByStep('DT',this.IndexStep + 1).subscribe(valueItem => {
      //     let item = valueItem['value'] as Array<any>;
      //     item.forEach(element => {
      //       if(this.docTo.CheckNull(element.RoleCode) !== '') {
      //         let arr = element.RoleCode.split(',');
      //         arr.forEach(element => {
      //           this.RoleApprover.push(element);
      //         });
      //       }
      //       if(this.docTo.CheckNull(element.RoleCodeCombine) !== '') {
      //         let arr = element.RoleCodeCombine.split(',');
      //         arr.forEach(element => {
      //         this.RoleCombine.push(element);
      //         })
      //       }
      //       if(this.docTo.CheckNull(element.RoleCodeKnow) !== '') {
      //         let arr = element.RoleCodeKnow.split(',');
      //         arr.forEach(element => {
      //         this.RoleKnow.push(element);
      //         })
      //       }
      //     })        
      //     this.getCurrentUser();
      //   });
      // } else {
      //   this.getCurrentUser();
      // }
    },
    error => {
      console.log("Load item detail : " + error);
      this.CloseRotiniPanel();
    },
    () => {}
    );
  }

  GetHistory() {
    this.docTo
      .getListRequestByDocID(this.IncomingDocID)
      .subscribe((itemValue: any[]) => {
        let item = itemValue['value'] as Array<any>;
        this.ListItem = [];
        item.forEach(element => {
          if(element.IndexStep === this.IndexStep) {
            if(element.TypeCode === "TL") {
              this.isReturn = false;
            } else {
              this.isReturn = true;
            }
          }
          this.ListItem.push({
            STT: this.ListItem.length + 1,
            ID: element.ID,
            documentID: element.NoteBookID,
            compendium: element.Compendium,
            userRequest:
              element.UserRequest !== undefined
                ? element.UserRequest.Title
                : '',
            userRequestId: element.UserRequest !== undefined ? element.UserRequest.Id : 0,
            userApprover:
              element.UserApprover !== undefined
                ? element.UserApprover.Title
                : '',
            deadline:
              this.docTo.CheckNull(element.Deadline) === ''
                ? ''
                : moment(element.Deadline).format('DD/MM/YYYY'),
            status: element.StatusID === 0? 'Chờ xử lý' : 'Đã xử lý',
            source: '',
            destination: '',
            taskType: element.TaskTypeCode === 'XLC'? "Xử lý chính" : element.TaskTypeCode === 'PH'? 'Phối hợp' : 'Nhận để biết',
            typeCode: this.GetTypeCode(element.TypeCode),
            content: this.docTo.CheckNull(element.Content),
            indexStep: element.IndexStep,
            created:
              this.docTo.CheckNull(element.DateCreated) === ''
                ? ''
                : moment(element.DateCreated).format('DD/MM/YYYY'),
            numberTo: element.Title,
            link: '',
            stsClass: element.StatusID === 0? 'Ongoing' : 'Approved',
            stsTypeCode: element.TypeCode,
          });
        });
        this.dataSource = new MatTableDataSource<IncomingTicket>(this.ListItem);
        this.ref.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.ArrayItemId = this.ListItem.filter(e => e.indexStep === this.IndexStep);
      },
      error => {
        console.log("Load history item: " + error);
        this.CloseRotiniPanel();
      },
      () => {
        this.docTo.getHistoryStep(this.IncomingDocID, this.IndexStep).subscribe((itemValue: any[]) => {
          let item = itemValue['value'] as Array<any>;
          if(item.length > 0) {
            this.historyId = item[0].ID;
          }
        },
        error => {
          console.log("Load history id item: " + error);
          this.CloseRotiniPanel();
        })
      }
      );
  }

  // Load all user approval
  GetAllUser() {
    this.services.getList('ListDepartment').subscribe((itemValue: any[]) => {
      let item = itemValue['value'] as Array<any>;
      this.ListDepartment = [];
      item.forEach(element => {
        this.ListDepartment.push({
          Id: element.ID,
          Code: element.Code,
          Name: element.Title
        })
      })
    },
    error => {
      console.log("get list department error: " + error);
    }, 
    () => {
      this.docTo.getAllUser().subscribe((itemValue: any[]) => {
        let item = itemValue['value'] as Array<any>;
        let ListDe = [];
        this.ListUserChoice = [];
        item.forEach(element => {
          if(this.ListUserChoice.findIndex(i => i.Id === element.User.Id) < 0) {
            this.ListUserChoice.push({
              STT: this.ListUserChoice.length + 1,
              Id: element.User.Id,
              DisplayName: element.User.Title,
              Email: element.User.Name.split('|')[2],
              DeCode: element.DepartmentCode,
              DeName: element.DepartmentName,
              RoleCode: element.RoleCode,
              RoleName: element.RoleName
            });
          }
          if(ListDe.indexOf(element.DepartmentCode) < 0) {
            ListDe.push(element.DepartmentCode);
          }
        })
        console.log("array " + ListDe);
        ListDe.forEach(element => {
          let DeName = '';
          let itemDe = this.ListDepartment.find(d => d.Code === element);
          if(itemDe !== undefined) {
            DeName = itemDe.Name;
          }
          this.ListUserOfDepartment.push({
            STT: 0,
            IsDepartment: true,
            Code: element,
            Name: DeName,
            Role: '',
            IsHandle: false,
            IsCombine: false,
            IsKnow: false,
            Icon: 'apartment',
            Class: 'dev'
          })
          this.ListUserChoice.forEach(user => {
            if(user.DeCode === element) {
              this.ListUserOfDepartment.push({
                IsDepartment: false,
                STT: user.STT,
                Code: user.Id + '|' + user.Email + '|' + user.DisplayName,
                Name: user.DisplayName,
                Role: user.RoleName,
                IsHandle: false,
                IsCombine: false,
                IsKnow: false,
                Icon: 'person',
                Class: 'user-choice'
              })
            }
          })
        })
        console.log("List User " + this.ListUserOfDepartment);
        this.dataSource2 = new MatTableDataSource<UserOfDepartment>(this.ListUserOfDepartment);
        this.ref.detectChanges();        
      },
      error => {
        console.log("Load all user error " + error);
        this.CloseRotiniPanel();
      },
      () =>{}
      )
    })
  }

  gotoBack() {
    window.history.back();
  }

  getCurrentUser(){
    this.services.getCurrentUser().subscribe(
      itemValue => {
          this.currentUserId = itemValue["Id"];
          this.currentUserName = itemValue["Title"];
          this.currentUserEmail = itemValue["Email"];
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
            // if(this.IndexStep > 0) {     
            //   this.GetUserApprover();
            // }
          },
          error => { 
            console.log("Load department code error: " + error);
            this.CloseRotiniPanel();
          }
        )
      }
      );
  }

  AddNewComment(template: TemplateRef<any>) {
    // this.notificationService.info('Chờ xin ý kiến');
    this.bsModalRef = this.modalService.show(template, { class: 'modal-md' });
    this.contentComment ='';
    this.outputFileAddComment = [];
    this.selectedUserComment = null;
  }

  NextApprval(template: TemplateRef<any>) {
    //this.notificationService.warn('Chọn người xử lý tiếp theo');
    this.bsModalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  ReturnRequest(template: TemplateRef<any>) {
    //this.notificationService.warn('Chọn phòng ban để trả lại');
    this.bsModalRef = this.modalService.show(template, {class: 'modal-md'});
  }

  ViewHistory(template: TemplateRef<any>) {
    this.notificationService.warn("Xem luồng có ở bản verson 2");
    // this.bsModalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  getListEmailConfig() {
    const str = `?$select=*&$filter=Title eq 'DT'&$top=1`;
    this.EmailConfig = null;
    this.services.getItem('ListEmailConfig', str).subscribe((itemValue: any[]) => {
      let item = itemValue['value'] as Array<any>;
      if (item.length > 0) {
          item.forEach(element => {
          this.EmailConfig = {
            FieldMail: element.FieldMail,
            NewEmailSubject: element.NewRequestSubject,
            NewEmailBody: element.NewRequestBody,
            ApprovedEmailSubject: element.ApprovedRequestSubject,
            ApprovedEmailBody: element.ApprovedRequestBody,
            AssignEmailSubject: element.AssignRequestSubject,
            AssignEmailBody: element.AssignRequestBody,
            FinishEmailSubject: element.FinishRequestSubject,
            FinishEmailBody: element.FinishRequestBody,
            CommentSubject:element.CommentRequestSubject,
            CommentBody:element.CommentRequestBody
          }
      })
      }
    });
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
    });
  }

  validation() {
    if (this.docTo.CheckNull(this.selectedApprover) === '') {
      this.notificationService.warn("Bạn chưa chọn Người xử lý chính! Vui lòng kiểm tra lại");
      return false;
    }
    else if (this.docTo.CheckNull(this.content) === '') {
      this.notificationService.warn("Bạn chưa nhập Nội dung xử lý! Vui lòng kiểm tra lại");
      return false;
    }
    // else if (this.docTo.CheckNull(this.deadline) === '') {
    //   this.notificationService.warn("Bạn chưa nhập Hạn xử lý! Vui lòng kiểm tra lại");
    //   return false;
    // } 
    else {
      return true;
    }
  }

  AddTicketReturn() {
    try {
      if (this.docTo.CheckNull(this.ReasonReturn) === '') {
        this.notificationService.warn("Bạn chưa nhập Lý do trả lại! Vui lòng kiểm tra lại");
        return;
      }
      this.bsModalRef.hide();
      this.OpenRotiniPanel();
      let item  = this.ListItem.find(i => i.indexStep === this.IndexStep);
      let approver;
      if(item !== undefined) {
        approver = item.userRequestId;
      }

      const data = {
        __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
        Title: this.itemDoc.numberTo,
        DateCreated: new Date(),
        NoteBookID: this.IncomingDocID,
        UserRequestId: this.currentUserId,
        UserApproverId: approver,
        // Deadline: this.deadline,
        StatusID: 0,
        StatusName: 'Chờ xử lý',
        Source: '',
        Destination: '',
        TaskTypeCode: 'XLC',
        TaskTypeName: 'Xử lý chính',
        TypeCode: 'TL',
        TypeName: 'Trả lại',
        Content: this.ReasonReturn,
        IndexStep: this.IndexStep - 1,
        Compendium: this.itemDoc.compendium,
        IndexReturn: this.IndexStep + '_' + (this.IndexStep - 1)
      };
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
            'Add item of approval user to list ListHistoryRequestTo successfully!'
          );
          // update user approver
          this.UserAppoverName += ';' + this.selectedApprover.split('|')[0] + '_' + this.selectedApprover.split('|')[2];
          const data = {
            __metadata: { type: 'SP.Data.ListDocumentToListItem' },
            ListUserApprover: this.UserAppoverName
          };
          this.services.updateListById('ListDocumentTo', data, this.IncomingDocID).subscribe(
            item => {},
            error => {
              this.CloseRotiniPanel();
              console.log(
                'error when update item to list ListDocumentTo: ' +
                  error.error.error.message.value
              );
            },
            () => {
              console.log(
                'Update user approver name successfully!'
              );
            }
          )

          if(this.historyId > 0) {
            const dataTicket = {
              __metadata: { type: 'SP.Data.ListHistoryRequestToListItem' },
              StatusID: -1, StatusName: "Đã trả lại",
            };
            this.services.updateListById('ListHistoryRequestTo', dataTicket, this.historyId).subscribe(
              item => {},
              error => {
                this.CloseRotiniPanel();
                console.log(
                  'error when update item to list ListHistoryRequestTo: ' +
                    error.error.error.message.value
                );
              },
              () => {}
            );
          }
          this.UpdateStatus(0);
        }
      );
    } catch (err) {
      console.log("try catch AddTicketReturn error: " + err.message);
      this.CloseRotiniPanel();
    }
  }

  // Add phiếu xử lý
  AddListTicket() {
    try {
      if(this.validation()) {
      
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
          Deadline: this.docTo.CheckNull(this.deadline) === '' ? null : this.deadline,
          StatusID: 0,
          StatusName: 'Chờ xử lý',
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
              'Add item of approval user to list ListHistoryRequestTo successfully!'
            );

            // update user approver
            this.UserAppoverName += ';' + this.selectedApprover.split('|')[0] + '_' + this.selectedApprover.split('|')[2];
            const data = {
              __metadata: { type: 'SP.Data.ListDocumentToListItem' },
              ListUserApprover: this.UserAppoverName
            };
            this.services.updateListById('ListDocumentTo', data, this.IncomingDocID).subscribe(
              item => {},
              error => {
                this.CloseRotiniPanel();
                console.log(
                  'error when update item to list ListDocumentTo: ' +
                    error.error.error.message.value
                );
              },
              () => {
                console.log(
                  'Update user approver name successfully!'
                );
              }
            )

            if(this.historyId > 0) {
              const dataTicket = {
                __metadata: { type: 'SP.Data.ListHistoryRequestToListItem' },
                StatusID: 1, StatusName: "Đã xử lý",
              };
              this.services.updateListById('ListHistoryRequestTo', dataTicket, this.historyId).subscribe(
                item => {},
                error => {
                  this.CloseRotiniPanel();
                  console.log(
                    'error when update item to list ListHistoryRequestTo: ' +
                      error.error.error.message.value
                  );
                },
                () => {}
              );
            }
            this.UpdateStatus(1);
          }
        );
      }
    } catch(err) {
      console.log("try catch AddListTicket error: " + err.message);
      this.CloseRotiniPanel();
    }
  }

  AddUserCombine() {
    const data = {
      __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
      Title: this.itemDoc.numberTo,
      DateCreated: new Date(),
      NoteBookID: this.IncomingDocID,
      UserRequestId: this.currentUserId,
      UserApproverId: this.selectedCombiner[this.index].split('|')[0],
      Deadline: this.docTo.CheckNull(this.deadline) === '' ? null : this.deadline,
      StatusID: 0,
      StatusName: 'Chờ xử lý',
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
            this.callbackFunc(this.IncomingDocID);
            // this.CloseRotiniPanel();     
            // this.notificationService.success('Cập nhật thông tin xử lý thành công.');
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
      Deadline: this.docTo.CheckNull(this.deadline) === '' ? null : this.deadline,
      StatusID: 0,
      StatusName: 'Chờ xử lý',
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
          this.callbackFunc(this.IncomingDocID);
          // this.CloseRotiniPanel();     
          // this.notificationService.success('Cập nhật thông tin xử lý thành công.');  
        }
      }
    );
  }

  UpdateStatus(sts) {
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
            this.UpdateStatus(sts);
          }
          else {
            this.index = 0;
            if(sts === 0) {
              this.callbackFunc(this.IncomingDocID);
            } else if(sts === 1) {
              this.AddHistoryStep();
            }
          }
        }
      );
    }
  }

  AddHistoryStep() {
    const data = {
      __metadata: { type: 'SP.Data.ListHistoryRequestToListItem' },
      Title: this.itemDoc.numberTo,
      DateCreated: new Date(),
      NoteBookID: this.itemDoc.ID,
      UserRequestId: this.currentUserId,
      UserApproverId: this.selectedApprover.split('|')[0],
      Deadline: this.docTo.CheckNull(this.deadline) === '' ? null : this.deadline,
      StatusID: 0,
      StatusName: 'Chờ xử lý',
      Content: this.content,
      IndexStep: this.IndexStep + 1,
      Compendium: this.itemDoc.compendium,
      StatusApproval: "1_0"
    };
    this.services.AddItemToList('ListHistoryRequestTo', data).subscribe(
      item => {},
      error => {
        this.CloseRotiniPanel();
        console.log(
          'error when add item to list ListHistoryRequestTo: ' +
            error.error.error.message.value
        ),
          this.notificationService.error('Thêm phiếu xử lý thất bại');
      },
      () => {
        console.log(
          'Add item of approval user to list ListHistoryRequestTo successfully!'
        );
        // gui mail
        this.addItemSendMail();

        // Luu phieu cho nguoi phoi hop va nhan de biet
        if(this.selectedCombiner !== undefined && this.selectedCombiner.length > 0) {
          this.AddUserCombine();
        } else if(this.selectedKnower !== undefined && this.selectedKnower.length > 0) {
          this.AddUserKnow();
        } else {
          this.callbackFunc(this.IncomingDocID);
          // this.CloseRotiniPanel();
          // this.notificationService.success('Cập nhật thông tin xử lý thành công.');
        }
      }
    );
  }

  FinishRequest() {
    this.OpenRotiniPanel();
    const data = {
      __metadata: { type: 'SP.Data.ListDocumentToListItem' },
      StatusID: 1, StatusName: "Đã xử lý",
    };
    this.services.updateListById('ListDocumentTo', data, this.IncomingDocID).subscribe(
      item => {},
      error => {
        this.CloseRotiniPanel();
        console.log(
          'error when update item to list ListDocumentTo: ' +
            error.error.error.message.value
        );
      },
      () => {
        if(this.historyId > 0) {
          const dataTicket = {
            __metadata: { type: 'SP.Data.ListHistoryRequestToListItem' },
            StatusID: 1, StatusName: "Đã xử lý",
          };
          this.services.updateListById('ListHistoryRequestTo', dataTicket, this.historyId).subscribe(
            item => {},
            error => {
              this.CloseRotiniPanel();
              console.log(
                'error when update item to list ListHistoryRequestTo: ' +
                  error.error.error.message.value
              );
            },
            () => {
              this.UpdateStatus(0);
            }
          );
        } else {
          this.UpdateStatus(0);
        }
      }
    );
  }

  callbackFunc(id) {
    if (this.outputFileHandle.length > 0) {
      this.saveItemAttachment(0, id, this.outputFileHandle,'ListDocumentTo',null);
    }
    else if (this.outputFile.length > 0) {
      this.saveItemAttachment(0, id, this.outputFile,'ListDocumentTo',null);
    }
    else if (this.outputFileReturn.length > 0) {
      this.saveItemAttachment(0, id, this.outputFileReturn,'ListDocumentTo',null);
    }
    else {
      this.CloseRotiniPanel();
      this.routes.navigate(['Documnets/IncomingDoc/docTo-detail/' + id]);
    }
  }

  CheckUserHandle(code, isCheck) {
    console.log(code);
    if(isCheck) {
      this.ListUserOfDepartment.forEach(element => {
        if(element.Code !== code){
          element.IsHandle = false;
          // element.IsCombine = false;
          // element.IsKnow = false;
        } else {
          this.selectedApprover = element.Code;
          element.IsCombine = false;
          element.IsKnow = false;

          let index = this.selectedCombiner.indexOf(code);
          if(index >= 0){
            this.selectedCombiner.splice(index, 1);
          }

          let index2 = this.selectedKnower.indexOf(code);
          if(index2 >= 0){
            this.selectedKnower.splice(index2, 1);
          }
        }
      })
    } else {
      this.selectedApprover = '';
    }
  }

  CheckUserNotHandle1(code, stt, isCheck) {
    console.log(code);
    if(isCheck){
      this.ListUserOfDepartment.forEach(element => {
        if(element.Code === code && element.STT === stt){
          if(code.includes('|') && this.selectedCombiner.indexOf(code) < 0) {
            this.selectedCombiner.push(element.Code);
          } else if(this.selectedCombiner.indexOf(code) >= 0) {
            element.IsCombine = false;
          }
          element.IsHandle = false;
          element.IsKnow = false;

          if(this.selectedApprover === code) {
            this.selectedApprover = '';
          }

          let index2 = this.selectedKnower.indexOf(code);
          if(index2 >= 0){
            this.selectedKnower.splice(index2, 1);
          }
        }       
      }) 
    } else {
      let index = this.selectedCombiner.indexOf(code);
      if(index >= 0){
        this.selectedCombiner.splice(index, 1);
      }
    }   
  }

  CheckUserNotHandle2(code, stt, isCheck) {
    console.log(code);
    if(isCheck){
      this.ListUserOfDepartment.forEach(element => {
        if(element.Code === code && element.STT === stt){
          if(code.includes('|') && this.selectedKnower.indexOf(code) < 0) {
            this.selectedKnower.push(element.Code);
          } else if(this.selectedCombiner.indexOf(code) >= 0) {
            element.IsKnow = false;
          }
          element.IsCombine = false;
          element.IsHandle = false;

          if(this.selectedApprover === code) {
            this.selectedApprover = '';
          }
          let index = this.selectedCombiner.indexOf(code);
          if(index >= 0){
            this.selectedCombiner.splice(index, 1);
          }
        }       
      }) 
    } else {
      let index = this.selectedKnower.indexOf(code);
      if(index >= 0){
        this.selectedKnower.splice(index, 1);
      }
    }
  }


  addAttachmentFile(sts) {
    try {
      if (sts === 0) {
        const inputNode: any = document.querySelector('#fileAttachment');
        if (this.docTo.CheckNull(inputNode.files[0]) !== '') {
          console.log(inputNode.files[0]);
          if (this.outputFile.length > 0) {
            if (
              this.outputFile.findIndex(
                index => index.name === inputNode.files[0].name
              ) === -1
            ) {
              this.outputFile.push(inputNode.files[0]);
            }
          } else {
            this.outputFile.push(inputNode.files[0]);
          }
        }
      } else if (sts === 1) {
        const inputNode: any = document.querySelector('#fileAttachmentHandle');
        if (this.docTo.CheckNull(inputNode.files[0]) !== '') {
          console.log(inputNode.files[0]);
          if (this.outputFileHandle.length > 0) {
            if (
              this.outputFileHandle.findIndex(
                index => index.name === inputNode.files[0].name
              ) === -1
            ) {
              this.outputFileHandle.push(inputNode.files[0]);
            }
          } else {
            this.outputFileHandle.push(inputNode.files[0]);
          }
        }
      } else if (sts === 2) {
        const inputNode: any = document.querySelector('#fileAttachmentReturn');
        if (this.docTo.CheckNull(inputNode.files[0]) !== '') {
          console.log(inputNode.files[0]);
          if (this.outputFileReturn.length > 0) {
            if (
              this.outputFileReturn.findIndex(
                index => index.name === inputNode.files[0].name
              ) === -1
            ) {
              this.outputFileReturn.push(inputNode.files[0]);
            }
          } else {
            this.outputFileReturn.push(inputNode.files[0]);
          }
        }
      }
      else if (sts === 3) {//dùng trong ý kiến xử lý
        const inputNode: any = document.querySelector('#fileAttachmentComment');
        if (this.docTo.CheckNull(inputNode.files[0]) !== '') {
          console.log(inputNode.files[0]);
          if (this.outputFileComment.length > 0) {
            if (
              this.outputFileComment.findIndex(
                index => index.name === inputNode.files[0].name
              ) === -1
            ) {
              this.outputFileComment.push(inputNode.files[0]);
            }
          } else {
            this.outputFileComment.push(inputNode.files[0]);
          }
        }
      }
      else if (sts === 4) {//dùng trong modal xin ý kiến 
        const inputNode: any = document.querySelector('#fileAttachmentAddComment');
        if (this.docTo.CheckNull(inputNode.files[0]) !== '') {
          console.log(inputNode.files[0]);
          if (this.outputFileAddComment.length > 0) {
            if (
              this.outputFileAddComment.findIndex(
                index => index.name === inputNode.files[0].name
              ) === -1
            ) {
              this.outputFileAddComment.push(inputNode.files[0]);
            }
          } else {
            this.outputFileAddComment.push(inputNode.files[0]);
          }
        }
      }
    } catch (error) {
      console.log('addAttachmentFile error: ' + error);
    }
  }

  removeAttachmentFile(index, sts) {
    try {
      if (sts === 0) {
        console.log(this.outputFile.indexOf(index))
        this.outputFile.splice(this.outputFile.indexOf(index), 1);
      } else if (sts === 1) {
        console.log(this.outputFileHandle.indexOf(index))
        this.outputFileHandle.splice(this.outputFileHandle.indexOf(index), 1);
      } else if (sts === 2) {
        console.log(this.outputFileReturn.indexOf(index))
        this.outputFileReturn.splice(this.outputFileReturn.indexOf(index), 1);
      }
      else if (sts === 3) {
        console.log(this.outputFileComment.indexOf(index))
        this.outputFileComment.splice(this.outputFileComment.indexOf(index), 1);
      }
      else if (sts === 3) {
        console.log(this.outputFileAddComment.indexOf(index))
        this.outputFileAddComment.splice(this.outputFileAddComment.indexOf(index), 1);
      }
    } catch (error) {
      console.log("removeAttachmentFile error: " + error);
    }
  }

  saveItemAttachment(index, idItem, arr, listName,indexUserComment) {
    try {
      this.buffer = this.getFileBuffer(arr[index]);
      this.buffer.onload = (e: any) => {
        console.log(e.target.result);
        const dataFile = e.target.result;
        this.services.inserAttachmentFile(dataFile, arr[index].name, listName, idItem).subscribe(
          itemAttach => {
            console.log('inserAttachmentFile success');
          },
          error => console.log(error),
          () => {
            console.log('inserAttachmentFile successfully');
            if (Number(index) < (arr.length - 1)) {
              this.saveItemAttachment((Number(index) + 1), idItem, arr, listName,indexUserComment);
            }
            else {
              // this.outputFile = [];
              // this.CloseRotiniPanel();
              if (listName == 'ListComments') {
                this.CloseRotiniPanel();
                this.getComment();
                if(indexUserComment!=null && indexUserComment==this.listUserIdSelect.length-1)
                {
                  this.outputFileAddComment = [];
                  this.notificationService.success('Bạn gửi xin ý kiến thành công');
                  this.GetItemDetail();
                  this.GetHistory();
                  this.bsModalRef.hide();
                }
                else{
                  this.outputFileComment = [];
                  this.notificationService.success('Bạn gửi bình luận thành công');
                }
              }
              else {
                arr = [];
                this.CloseRotiniPanel();
                this.routes.navigate(['/Documnets/IncomingDoc/docTo-detail/' + idItem]);
              }
            }
          }
        )
      }
    } catch (error) {
      console.log("saveItemAttachment error: " + error);
    }
  } 
  getFileBuffer(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return reader;
  }

  GetTypeCode(code) {
    if (this.docTo.CheckNull(code) === '') {
      return '';
    }
    else if (code === "CXL") {
      return 'Chuyển xử lý';
    }
    else if (code === "TL") {
      return 'Trả lại';
    }
    else if (code === "XYK") {
      return 'Xin ý kiến';
    }
  }

  //comment
  Reply(i, j) {
    if (j == undefined) {
      this.listCommentParent[i].DisplayReply = "flex";
    }
    else {

      this.listCommentParent[i].children[j].DisplayReply = "flex";
    }
  }

  isNotNull(str) {
    return (str !== null && str !== "" && str !== undefined);
  }

  //luu comment (lưu comment xin ý kiến và bình luận ở ý kiến xử lý)
  saveComment(content,isAddComment,index) {
    try {
      this.OpenRotiniPanel();
      if (this.isNotNull(content)) {
        const dataComment = {
          __metadata: { type: 'SP.Data.ListCommentsListItem' },
          Title: "ListDocumentTo_" + this.IncomingDocID,
          Chat_Comments: content,
          KeyList: "ListDocumentTo_" + this.IncomingDocID,
          ProcessID:isAddComment==true? this.idItemProcess:null,
          UserApproverId:isAddComment==true? this.listUserIdSelect[index]:null,
        }
        if (this.isNotNull(this.pictureCurrent)) {
          Object.assign(dataComment, { userPicture: this.pictureCurrent });
        }
        this.services.AddItemToList('ListComments', dataComment).subscribe(
          itemComment => {
            this.indexComment = itemComment['d'].Id;
          },
          error => {
            console.log(error);
            this.notificationService.error('Bạn gửi bình luận thất bại');
          },
          () => {
            if(isAddComment==false){     
              this.Comments = null;
              if (this.outputFileComment.length > 0) {
                this.saveItemAttachment(0, this.indexComment, this.outputFileComment, 'ListComments',null);
              }
              else {
                this.CloseRotiniPanel();
                this.notificationService.success('Bạn gửi bình luận thành công');
                this.getComment();
              }
            }
            else  if(isAddComment==true){  //xin ý kiến
              if (this.outputFileAddComment.length > 0) {
                this.saveItemAttachment(0, this.indexComment,this.outputFileAddComment, 'ListComments',index);
              }
              else {
                this.CloseRotiniPanel();
                console.log('Bạn gửi xin ý kiến thành công');
                //kt nếu lưu đến người cuối cùng rồi thì đóng modal
                if(index==this.listUserIdSelect.length-1){
                  this.notificationService.success('Bạn gửi xin ý kiến thành công');
                  this.bsModalRef.hide();
                  this.GetHistory();
                  this.getComment();
                }
              }
            }
          }
        )
      }
      else {
        this.CloseRotiniPanel();
        alert("Bạn chưa nhập nội dung ");
      }
    } catch (error) {
      console.log("SendComment error: " + error);
    }
  }

  //lưu comment trả lời
  saveCommentReply(i, j) {
    try {
      this.OpenRotiniPanel();
      let content = '';
      if (j == undefined) {
        content = this.listCommentParent[i].Content;
      }
      else {
        content = this.listCommentParent[i].children[j].Content;
      }
      if (this.isNotNull(content)) {
        const dataComment = {
          __metadata: { type: 'SP.Data.ListCommentsListItem' },
          Title: "ListDocumentTo_" + this.IncomingDocID,
          Chat_Comments: content,
          KeyList: "ListDocumentTo_" + this.IncomingDocID,
          ParentID: this.listCommentParent[i].ParentID == null ? this.listCommentParent[i].ID : this.listCommentParent[i].ParentID,
        }
        if (this.isNotNull(this.pictureCurrent)) {
          Object.assign(dataComment, { userPicture: this.pictureCurrent });
        }
        this.services.AddItemToList('ListComments', dataComment).subscribe(
          itemComment => {
            this.indexComment = itemComment['d'].Id;
          },
          error => {
            console.log(error);
            this.notificationService.error('Bạn gửi trả lời thất bại');
          },
          () => {
            // if (this.outputFile.length > 0) {
            //   this.saveItemAttachment(0, this.indexComment);
            // }
            // else {
            this.CloseRotiniPanel();
            this.notificationService.success('Bạn gửi trả lời thành công');
            //update lại trạng thái cho phiếu xin ý kiến
            if (this.isNotNull(this.listCommentParent[i].ProcessID)) {
              this.updateProcess(this.listCommentParent[i].ProcessID);
            }
            this.getComment();
            // }
          }
        )
      }
      else {
        this.CloseRotiniPanel();
        alert("Bạn chưa nhập nội dung trả lời");
      }
    } catch (error) {
      console.log("saveCommentReply error: " + error);
    }
  }

  updateProcess(id) {
    try {
      const dataProcess = {
        __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
        StatusID: 1,
        StatusName: "Đã cho ý kiến",
      }
      this.services.updateListById('ListProcessRequestTo', dataProcess, id).subscribe(
        itemComment => {
          //  this.indexComment = itemComment['d'].Id;
        },
        error => console.log(error),
        () => {
          // if (this.outputFile.length > 0) {
          //   this.saveItemAttachment(0, this.indexComment);
          // }
          // else {
          // this.closeCommentPanel();
          // alert('Bạn gửi trả lời thành công');
          this.GetHistory();
          // }
        }
      )

    } catch (error) {
      console.log("saveCommentReply error: " + error);
    }
  }

  listCommentParent = []; listComment = [];listUserIdSelect=[];
  outputFileComment: AttachmentsObject[] = []; AttachmentsComment: AttachmentsObject[] = [];
  outputFileAddComment:AttachmentsObject[]=[];
  Comments; pictureCurrent; indexComment;selectedUserComment;idItemProcess;contentComment;
  getComment(): void {
    const strComent = `?$select=ID,Chat_Comments,Created,userPicture,ParentID,ProcessID,Author/Title,UserApprover/Id,UserApprover/Title,AttachmentFiles`
      + `&$expand=Author/Id,UserApprover,AttachmentFiles&$filter=KeyList eq 'ListDocumentTo_` + this.IncomingDocID + `'&$orderby=Created desc`
    this.services.getItem("ListComments", strComent).subscribe(itemValue => {
      this.listComment = [];
      this.listCommentParent = [];
      let itemList = itemValue["value"] as Array<any>;
      itemList.forEach(element => {
        let picture;
        if (element.userPicture !== null && element.userPicture !== '' && element.userPicture !== undefined) {
          picture = element.userPicture;
        }
        else {
          picture = '../../../../' + this.assetFolder + '/img/default-user-image.png';
        }
        if (this.isNotNull(element.AttachmentFiles)) {
          this.AttachmentsComment = [];
          element.AttachmentFiles.forEach(elementss => {
            this.AttachmentsComment.push({
              name: elementss.FileName,
              urlFile: this.urlAttachment + elementss.ServerRelativeUrl
            })
          });
        }
        this.listComment.push({
          ID: element.ID,
          Author: element.Author.Title,
          Chat_Comments: element.Chat_Comments,
          Created: moment(element.Created).format('DD/MM/YYYY HH:mm:ss'),
          userPicture: picture,
          UserApprover: element.UserApprover != null ? element.UserApprover.Title : '',
          XinYKien: ' xin ý kiến ',
          ParentID: element.ParentID,
          ProcessID: element.ProcessID,
          itemAttach: this.AttachmentsComment,
          Content: '',
          DisplayReply: "none",
        })
      })
      this.listComment.forEach(item => {
        if (item.ParentID == null) {
          let lstChild = this.listComment.filter(element => element.ParentID == item.ID);
          if (lstChild == undefined) {
            lstChild = [];
          }
          item.children = lstChild;
          this.listCommentParent.push(item);
        }
      });
    },
    error => {},
    () => {
      this.ref.detectChanges();
    }
    )
  }

  //xin ý kiến
  saveItem() {
    try {
      if (this.isNotNull(this.contentComment)) {
        this.listUserIdSelect = [];
        let id = this.selectedUserComment.split('|')[0];
        this.listUserIdSelect.push(id);

        this.OpenRotiniPanel();
        //lưu attach file vào văn bản
        // if (this.outputFileAddComment.length > 0) {
        //   this.saveItemAttachment(0, this.IncomingDocID, this.outputFileAddComment, 'ListDocumentTo', null);
        // }
        //lưu phiếu xin ý kiến và lưu comment
        for(let i = 0; i < this.listUserIdSelect.length; i++){
          this.saveItemListProcess(i);
        }
      }
      else {
        alert("Bạn chưa nhập nội dung xin ý kiến");
      }
    } catch (error) {
      console.log('saveItem error: ' + error.message);
    }
  }

  saveItemListProcess(index) {
    try {
      const dataProcess = {
        __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
        Title: this.itemDoc.numberTo,
        DateCreated: new Date(),
        NoteBookID: this.itemDoc.ID,
        UserRequestId: this.currentUserId,
        UserApproverId: this.listUserIdSelect[index],
        StatusID: 0,
        StatusName: "Chờ xin ý kiến",
        TypeCode: 'XYK',
        TypeName: 'Xin ý kiến',
        TaskTypeCode: 'XLC',
        TaskTypeName: 'Xử lý chính',
        Content: this.contentComment,
        Compendium: this.itemDoc.compendium,
      }
      this.services.AddItemToList('ListProcessRequestTo', dataProcess).subscribe(
        items => {
          console.log(items);
          this.idItemProcess = items['d'].Id;
        },
        error => {console.log(error);
          this.CloseRotiniPanel();
        },
        () => {
          this.CloseRotiniPanel();
          this.saveComment(this.contentComment,true,index);
          // gui mail
          const dataSendUser = {
            __metadata: { type: 'SP.Data.ListRequestSendMailListItem' },
            Title: this.listName,
            IndexItem: this.IncomingDocID,
            Step: 1,
            KeyList: this.listName +  '_' + this.IncomingDocID,
            SubjectMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.CommentSubject),
            BodyMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.CommentBody),
            SendMailTo: this.selectedUserComment.split('|')[1],
          }
          this.services.AddItemToList('ListRequestSendMail', dataSendUser).subscribe(
            itemRoomRQ => {
              console.log(itemRoomRQ['d']);
            },
            error => {
              console.log(error);
              this.CloseRotiniPanel();
            },
            () => {
              console.log('Save item success');
            });
        }
      )
    } catch (error) {
      console.log('saveItemListProcess error: ' + error.message);
    }
  }

  addItemSendMail() {
    try {
      // send mail user created
      const dataSendUser = {
        __metadata: { type: 'SP.Data.ListRequestSendMailListItem' },
        Title: this.listName,
        IndexItem: this.IncomingDocID,
        Step: 1,
        KeyList: this.listName +  '_' + this.IncomingDocID,
        SubjectMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.NewEmailSubject),
        BodyMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.NewEmailBody),
        SendMailTo: this.currentUserEmail,
      }
      this.services.AddItemToList('ListRequestSendMail', dataSendUser).subscribe(
        itemRoomRQ => {
          console.log(itemRoomRQ['d']);
        },
        error => {
          console.log(error);
          this.CloseRotiniPanel();
        },
        () => {
          console.log('Save item success');

          const dataSendApprover = {
            __metadata: { type: 'SP.Data.ListRequestSendMailListItem' },
            Title: this.listName,
            IndexItem: this.IncomingDocID,
            Step: 1,
            KeyList: this.listName +  '_' + this.IncomingDocID,
            SubjectMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.AssignEmailSubject),
            BodyMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.AssignEmailBody),
            SendMailTo: this.selectedApprover.split('|')[1]
          }
          this.services.AddItemToList('ListRequestSendMail', dataSendApprover).subscribe(
            itemCarRQ => {
              console.log(itemCarRQ['d']);
            },
            error => {
              console.log(error);
              this.CloseRotiniPanel();
            },
            () => {
              console.log('Add email success');
              if(this.selectedCombiner.length > 0) {
                this.SendMailCombiner(0);
              }
              if(this.selectedKnower.length > 0) {
                this.SendMailKnower(0);
              }
            }
          )
        }
      )
    } catch (error) {
      console.log('addItemSendMail error: ' + error.message);
    }
  }

  SendMailCombiner(index) {
    var user = this.selectedCombiner[index];
    const dataSendUser = {
      __metadata: { type: 'SP.Data.ListRequestSendMailListItem' },
      Title: this.listName,
      IndexItem: this.IncomingDocID,
      Step: 1,
      KeyList: this.listName +  '_' + this.IncomingDocID,
      SubjectMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.AssignEmailSubject),
      BodyMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.AssignEmailSubject),
      SendMailTo: user.split('|')[1],
    }
    this.services.AddItemToList('ListRequestSendMail', dataSendUser).subscribe(
      itemRoomRQ => {
        console.log(itemRoomRQ['d']);
      },
      error => {
        console.log(error);
        this.CloseRotiniPanel();
      },
      () => {
        index ++;
        if(index < this.selectedCombiner.length) {
          this.SendMailCombiner(index);
        }
      }
    );
  }

  SendMailKnower(index) {
    var user = this.selectedKnower[index];
    const dataSendUser = {
      __metadata: { type: 'SP.Data.ListRequestSendMailListItem' },
      Title: this.listName,
      IndexItem: this.IncomingDocID,
      Step: 1,
      KeyList: this.listName +  '_' + this.IncomingDocID,
      SubjectMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.AssignEmailSubject),
      BodyMail: this.Replace_Field_Mail(this.EmailConfig.FieldMail, this.EmailConfig.AssignEmailSubject),
      SendMailTo: user.split('|')[1],
    }
    this.services.AddItemToList('ListRequestSendMail', dataSendUser).subscribe(
      itemRoomRQ => {
        console.log(itemRoomRQ['d']);
      },
      error => {
        console.log(error);
        this.CloseRotiniPanel();
      },
      () => {
        index ++;
        if(index < this.selectedKnower.length) {
          this.SendMailKnower(index);
        }
      }
    );
  }

  Replace_Field_Mail(FieldMail, ContentMail) {
    try {
      if (this.isNotNull(FieldMail) && this.isNotNull(ContentMail)) {
        let strContent = FieldMail.split(",");
        console.log("ContentMail before: " + ContentMail);
        for (let i = 0; i < strContent.length; i++) {
          switch (strContent[i]) {
            case 'NumberTo':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.itemDoc.numberTo);
              break;
            case 'Compendium':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.docTo.CheckNull(this.itemDoc.compendium));
              break;
            case 'Content':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.docTo.CheckNull(this.content));
              break;
            case 'UserRequest':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.currentUserName);
              break;
            case 'Author':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.currentUserName);
              break;
            case 'ContentComment':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.contentComment);
              break;
            case 'userComment':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.selectedUserComment.split('|')[2]);
              break;
            case 'userStep':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.UserAppoverName);
              break;
            case 'UserApprover':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", this.UserAppoverName);
              break;
            case 'ItemUrl':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", window.location.href.split('#/')[0]+ '/#/Documnets/IncomingDoc/docTo-detail/' + this.IncomingDocID);
              break;
            case 'TaskUrl':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", window.location.href.split('#/')[0] + '/#/Documnets/IncomingDoc/docTo-detail/' + this.IncomingDocID + '/' + (this.IndexStep + 1));
              break;
            case 'HomeUrl':
              ContentMail = ContentMail.replace("{" + strContent[i] + "}", window.location.href.split('#/')[0] + '/#/Documnets/IncomingDoc');
              break;
          }
        }
        console.log("ContentMail after: " + ContentMail);
        return ContentMail;
      }
      else {
        console.log("Field or Body email is null or undefined ")
      }
    }
    catch (err) {
      console.log("Replace_Field_Mail error: " + err.message);
    }
  }
}

