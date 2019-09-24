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
  currentUserName = '';
  RoleApprover = [];
  RoleCombine = [];
  RoleKnow = [];
  ItemAttachments: AttachmentsObject[] = [];
  urlAttachment = environment.proxyUrl.split('/sites/', 1);
  listName = 'ListDocumentTo';
  outputFile = [];
  outputFileHandle = [];
  displayFile = '';
  closeResult = '';
  historyId = 0;
  buffer;
  index = 0;
  overlayRef;
  selectedKnower = []; selectedCombiner = []; selectedApprover;
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
    this.GetItemDetail();
    this.GetHistory();
    this.GetAllUser();
    this.getCurrentUser();
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
      this.OpenRotiniPanel();
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
          signer: itemList[0].Signer,
          created: itemList[0].Author.Id
        };
        this.ref.detectChanges();
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
      console.log("Load detail item: " + error);
      this.CloseRotiniPanel();
    }
    );
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
            status: element.StatusID === 0? 'Chờ xử lý' : 'Đã xử lý',
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
            numberTo: element.Title,
            link: ''
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
        this.docTo.getHistoryStep(this.IncomingDocID).subscribe((itemValue: any[]) => {
          let item = itemValue['value'] as Array<any>;
          this.historyId = item[0].ID;
        },
        error => {
          console.log("Load history id item: " + error);
          this.CloseRotiniPanel();
        })
      }
      );
  }

  GetAllUser() {
    this.services.getListDepartment().subscribe((itemValue: any[]) => {
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
          this.ListUserChoice.push({
            Id: element.User.Id,
            DisplayName: element.User.Title,
            Email: element.User.Name.split('|')[2],
            DeCode: element.DepartmentCode,
            DeName: element.DepartmentName,
            RoleCode: element.RoleCode,
            RoleName: element.RoleName
          });
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
            if(this.IndexStep > 0) {     
              this.GetUserApprover();
            }
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
    //this.notificationService.warn('Chọn người xử lý tiếp theo');
    this.bsModalRef = this.modalService.show(template, {class: 'modal-lg'});
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

  validation() {
    if (this.docTo.CheckNull(this.selectedApprover) === '') {
      alert("Bạn chưa chọn người xử lý chính! Vui lòng kiểm tra lại");
      return false;
    }
    else if (this.docTo.CheckNull(this.content) === '') {
      alert("Bạn chưa nhập nội dung xử lý! Vui lòng kiểm tra lại");
      return false;
    }
    else if (this.docTo.CheckNull(this.deadline) === '') {
      alert("Bạn chưa nhập hạn xử lý! Vui lòng kiểm tra lại");
      return false;
    } else {
      return true;
    }
  }
  // Add phiếu xử lý
  AddListTicket() {
    if(!this.validation) {
      return;
    }
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
          'Add item of approval user to list ListHistoryRequestTo successfully!'
        );
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
          this.callbackFunc(this.IncomingDocID);
          // this.CloseRotiniPanel();     
          // this.notificationService.success('Cập nhật thông tin xử lý thành công.');  
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
            this.AddHistoryStep();
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
      Deadline: this.deadline,
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

  callbackFunc(id) {
    if (this.outputFileHandle.length > 0) {
      this.saveItemAttachment(0, id, this.outputFileHandle);
    } else {
      this.routes.navigate(['examples/doc-detail/' + id]);
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

  CheckUserNotHandle1(code, isCheck) {
    console.log(code);
    if(isCheck){
      this.ListUserOfDepartment.forEach(element => {
        if(element.Code === code){
          if(code.includes('|')) {
            this.selectedCombiner.push(element.Code);
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

  CheckUserNotHandle2(code, isCheck) {
    console.log(code);
    if(isCheck){
      this.ListUserOfDepartment.forEach(element => {
        if(element.Code === code){
          if(code.includes('|')) {
            this.selectedKnower.push(element.Code);
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
      if(sts === 0) {
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
      } else {
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
      }
    } catch (error) {
      console.log('addAttachmentFile error: ' + error);
    }
  }

  removeAttachmentFile(index, sts) {
    try {
      if(sts === 0) {
        console.log(this.outputFile.indexOf(index))
        this.outputFile.splice(this.outputFile.indexOf(index), 1);
      } else {
        console.log(this.outputFileHandle.indexOf(index))
        this.outputFileHandle.splice(this.outputFileHandle.indexOf(index), 1);
      }
    } catch (error) {
      console.log("removeAttachmentFile error: " + error);
    }
  }

  saveItemAttachment(index, idItem, arr) {
    try {
      this.buffer = this.getFileBuffer(arr[index]);
      this.buffer.onload = (e: any) => {
        console.log(e.target.result);
        const dataFile = e.target.result;
        this.services.inserAttachmentFile(dataFile, arr[index].name, 'ListDocumentTo', idItem).subscribe(
          itemAttach => {
            console.log('inserAttachmentFile success');
          },
          error => console.log(error),
          () => {
            console.log('inserAttachmentFile successfully');
            if (Number(index) < (arr.length - 1)) {
              this.saveItemAttachment((Number(index) + 1), idItem, arr);
            }
            else {
              // this.outputFile = [];
              // this.CloseRotiniPanel();
              this.routes.navigate(['examples/doc-detail/' + idItem]);
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

