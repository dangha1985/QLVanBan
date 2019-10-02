import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewContainerRef, TemplateRef, Input } from '@angular/core';
//import { IncomingDoc, AttachmentsObject, IncomingDocService, IncomingTicket} from '../incoming-doc.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';
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
import { DocumentGoPanel } from './document-go.component';
import { ItemDocumentGo, ListDocType, ItemSeleted, ItemSeletedCode, ItemUser, DocumentGoTicket, AttachmentsObject, UserProfilePropertiesObject } from './../models/document-go';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentComponent } from './comment.component';
export interface Comment { UserId: Number; Content: string, AttachFile: FileAttachment[] };
export interface FileAttachment { name?: string; urlFile?: string }
@Component({
  selector: 'anms-document-go-detail',
  templateUrl: './document-go-detail.component.html',
  styleUrls: ['./document-go-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [ChecklistDatabase]
})
export class DocumentGoDetailComponent implements OnInit {
  @Input() comments: Comment[];
  bsModalRef: BsModalRef;
  itemDoc: ItemDocumentGo;
  isDisplay: boolean = false;
  ItemId;
  ItemAttachments: AttachmentsObject[] = [];
  urlAttachment = environment.proxyUrl.split("/sites/", 1)
  listName = 'ListDocumentTo';
  outputFile = [];
  displayFile = '';
  buffer;
  strFilter = '';
  indexComment;
  Comments = null;
  listComment = [];
  AttachmentsComment: AttachmentsObject[] = [];
  overlayRef;
  assetFolder = environment.assetFolder+'/img';
  displayTime = 'none';
  displayedColumns: string[] = ['stt', 'created', 'userRequest', 'userApprover', 'deadline', 'status', 'taskType']; //'select'
  ListItem: DocumentGoTicket[] = [];
  currentUserId = '';
  currentUserName = '';
  currentUserEmail = '';
  pictureCurrent;
  ArrayUserPofile: UserProfilePropertiesObject[] = [];
  dataSource_Ticket = new MatTableDataSource<DocumentGoTicket>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ListDocument: ItemDocumentGo[] = [];
  constructor(private docServices: DocumentGoService, private resService: ResApiService,
    private route: ActivatedRoute, private readonly notificationService: NotificationService,
    private ref: ChangeDetectorRef
    , public overlay: Overlay, public viewContainerRef: ViewContainerRef
    , private modalService: BsModalService
    , private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getCurrentUser();
    this.GetItemDetail();
    this.GetHistory();
  }
  //Lấy người dùng hiện tại
  getCurrentUser() {
    this.resService.getCurrentUser().subscribe(
      itemValue => {
        this.currentUserId = itemValue["Id"];
        this.currentUserName = itemValue["Title"];
        this.currentUserEmail = itemValue["Email"];
        console.log("currentUserEmail: " + this.currentUserEmail);
      },
      error => {
        console.log("error: " + error);
        this.closeCommentPanel();
      },
      () => {
        console.log("Current user email is: \n" + "Current user Id is: " + this.currentUserId + "\n" + "Current user name is: " + this.currentUserName);
        this.getUserPofile(this.currentUserEmail);
      }
    );
  }
//lấy đường dẫn ảnh trên sharepoint
  getUserPofile(loginName) {
    try {
      this.resService.getUserInfo('i:0%23.f|membership|' + loginName).subscribe(
        itemss => {
          this.ArrayUserPofile = [];
          let kU = itemss['UserProfileProperties'] as Array<any>;
          kU.forEach(element => {
            this.ArrayUserPofile.push(
              { Key: element.Key, Value: element.Value }
            )
          })
        },
        error => console.log(error),
        () => {
          if (this.ArrayUserPofile.length > 0) {
            let pick = this.ArrayUserPofile.find(x => x.Key == "PictureURL");
            this.pictureCurrent = pick.Value
          }
        }
      )
    } catch (error) {
      console.log('getUsr error: ' + error.message);
    }
  }
  GetItemDetail() {
    this.ItemAttachments=[];
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
          NumberGo: itemList[0].NumberGo === 0 ? '' : itemList[0].NumberGo,
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
          SignerName: itemList[0].Signer == undefined ? '' : itemList[0].Signer.Title,
          NumOfPaper: itemList[0].NumOfPaper,
          Note: itemList[0].Note,
        };
        this.ref.detectChanges();
        this.getComment();
      })
    })
  }

  GetHistory() {
    this.strFilter = `&$filter=DocumentGoID eq '` + this.ItemId + `'&$orderby=Created desc`;
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
      this.dataSource_Ticket = new MatTableDataSource<DocumentGoTicket>(this.ListItem);
      this.dataSource_Ticket.paginator = this.paginator;
      this.ref.detectChanges();
     
    });
  }

  gotoBack() {
    window.history.back()
  }
  AddNewComment() {
    this.ListDocument.push(this.itemDoc);
    console.log(this.itemDoc);
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '50%', data: this.ListDocument
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      //Lấy lại thông tin sau khi đóng diglog
      this.GetItemDetail();
      this.GetHistory();
      this.getComment();
      // this.callbackfunc();
    });

  }

  // AddNewComment() {
  //   this.notificationService.info('Chờ xin ý kiến');
  // }

  NextApprval() {
    this.notificationService.warn('Chọn người xử lý tiếp theo');
  }

  ReturnRequest() {
    this.notificationService.warn('Chọn phòng ban để trả lại');
  }
  isNotNull(str) {
    return (str !== null && str !== "" && str !== undefined);
  }
  addAttachmentFile() {
    try {
      const inputNode: any = document.querySelector('#fileAttachment');
      if (this.isNotNull(inputNode.files[0])) {
        console.log(inputNode.files[0]);
        if (this.outputFile.length > 0) {
          if (this.outputFile.findIndex(index => index.name === inputNode.files[0].name) === -1) {
            this.outputFile.push(inputNode.files[0]);
          }
        }
        else {
          this.outputFile.push(inputNode.files[0]);
        }
      }
    } catch (error) {
      console.log("addAttachmentFile error: " + error);
    }
  }
  removeAttachmentFile(index) {
    try {
      console.log(this.outputFile.indexOf(index))
      this.outputFile.splice(this.outputFile.indexOf(index), 1);
    } catch (error) {
      console.log("removeAttachmentFile error: " + error);
    }
  }

  saveItemAttachment(index, idItem) {
    try {
      this.buffer = this.getFileBuffer(this.outputFile[index]);
      this.buffer.onload = (e: any) => {
        console.log(e.target.result);
        const dataFile = e.target.result;
        this.resService.inserAttachmentFile(dataFile, this.outputFile[index].name, 'ListComments', idItem).subscribe(
          itemAttach => {
            console.log('inserAttachmentFile success');
          },
          error => console.log(error),
          () => {
            console.log('inserAttachmentFile successfully');
            if (Number(index) < (this.outputFile.length - 1)) {
              this.saveItemAttachment((Number(index) + 1), idItem);
            }
            else {
              this.closeCommentPanel();
              this.outputFile=[];
              this.getComment();
            //  this.ref.detectChanges();
              alert('Bạn gửi bình luận thành công');
              // this.routes.navigate(['workflows/ListOnSite/detail/' + this.ItemId]);
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
  Reply(i, j) {
    if (j == undefined) {
      this.listCommentParent[i].DisplayReply = "flex";
    }
    else {

      this.listCommentParent[i].children[j].DisplayReply = "flex";
    }
  }
  //luu comment
  SendComment() {
    try {
      this.openCommentPanel();
      if (this.isNotNull(this.Comments)) {
        const dataComment = {
          __metadata: { type: 'SP.Data.ListCommentsListItem' },
          Title: "ListDocumentGo_" + this.ItemId,
          Chat_Comments: this.Comments,
          KeyList: "ListDocumentGo_" + this.ItemId
        }
        if (this.isNotNull(this.pictureCurrent)) {
          Object.assign(dataComment, { userPicture: this.pictureCurrent });
        }
        this.resService.AddItemToList('ListComments', dataComment).subscribe(
          itemComment => {
            this.indexComment = itemComment['d'].Id;
          },
          error =>  {
            console.log(error);
            this.notificationService.error('Bạn gửi bình luận thất bại');
          },
          () => {
            this.Comments = null;
            if (this.outputFile.length > 0) {
              this.saveItemAttachment(0, this.indexComment);
            }
            else {
              this.closeCommentPanel();
              this.notificationService.success('Bạn gửi bình luận thành công');
              this.getComment();
            }
          }
        )
      }
      else {
        this.closeCommentPanel();
        alert("Bạn chưa nhập nội dung bình luận");
      }
    } catch (error) {
      console.log("SendComment error: " + error);
    }
  }
  //lưu comment trả lời
  saveCommentReply(i, j) {
    try {
      this.openCommentPanel();
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
          Title: "ListDocumentGo_" + this.ItemId,
          Chat_Comments: content,
          KeyList: "ListDocumentGo_" + this.ItemId,
          ParentID: this.listCommentParent[i].ParentID == null ? this.listCommentParent[i].ID : this.listCommentParent[i].ParentID,
        }
        if (this.isNotNull(this.pictureCurrent)) {
          Object.assign(dataComment, { userPicture: this.pictureCurrent });
        }
        this.resService.AddItemToList('ListComments', dataComment).subscribe(
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
            this.closeCommentPanel();
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
        this.closeCommentPanel();
        alert("Bạn chưa nhập nội dung trả lời");
      }
    } catch (error) {
      console.log("saveCommentReply error: " + error);
    }
  }
  updateProcess(id) {
    try {
      const dataProcess = {
        __metadata: { type: 'SP.Data.ListProcessRequestGoListItem' },
        StatusID: 1,
        StatusName: "Đã cho ý kiến",
      }
      this.resService.updateListById('ListProcessRequestGo', dataProcess, id).subscribe(
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
  listCommentParent = [];
  listCommentChild = [];
  getComment(): void {
    const strComent = `?$select=ID,Chat_Comments,Created,userPicture,ParentID,ProcessID,Author/Title,UserApprover/Id,UserApprover/Title,AttachmentFiles`
      + `&$expand=Author/Id,UserApprover,AttachmentFiles&$filter=KeyList eq 'ListDocumentGo_` + this.ItemId + `'&$orderby=Created desc`
    this.docServices.getItem("ListComments", strComent).subscribe(itemValue => {
      this.listComment = [];
      this.listCommentParent = [];
      let itemList = itemValue["value"] as Array<any>;
      itemList.forEach(element => {
        let picture;
        if (element.userPicture !== null && element.userPicture !== '' && element.userPicture !== undefined) {
          picture = element.userPicture;
        }
        else {
          picture = '../../../../' + this.assetFolder + '/default-user-image.png';
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
          Author:element.Author.Title,//element.UserApprover!=null? (element.Author.Title +'<span> xin ý kiến </span>'+ element.UserApprover.Title):
          Chat_Comments: element.Chat_Comments,
          Created: moment(element.Created).format('DD/MM/YYYY HH:mm:ss'),
          userPicture: picture,
          UserApprover:element.UserApprover!=null?element.UserApprover.Title:'',
          XinYKien:' xin ý kiến ',
          ParentID: element.ParentID,
          ProcessID: element.ProcessID,
          itemAttach: this.AttachmentsComment,
          Content: '',
          DisplayReply: "none",
        //  fileAttachment:'fileAttachment'+this.listComment.length+1
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
      this.ref.detectChanges();
    })
  }
  // XinYKien(template: TemplateRef<any>) {
  //   //  this.notificationService.warn('Chọn người xử lý tiếp theo');
  //   this.bsModalRef = this.modalService.show(template);
  // }
  openCommentPanel() {
    let config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global().centerVertically().centerHorizontally();
    config.hasBackdrop = true;
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(new ComponentPortal(DocumentGoPanel, this.viewContainerRef));
  }

  closeCommentPanel() {
    this.overlayRef.dispose();
  }
  // //tree
  // /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  // flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  // /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  // nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  // /** A selected parent node to be inserted */
  // selectedParent: TodoItemFlatNode | null = null;

  // /** The new item's name */
  // newItemName = '';

  // treeControl: FlatTreeControl<TodoItemFlatNode>;

  // treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  // dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  // /** The selection for checklist */
  // checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  // // constructor(private _database: ChecklistDatabase) {
  // //   this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
  // //     this.isExpandable, this.getChildren);
  // //   this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
  // //   this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // //   _database.dataChange.subscribe(data => {
  // //     this.dataSource.data = data;
  // //   });
  // // }

  // getLevel = (node: TodoItemFlatNode) => node.level;

  // isExpandable = (node: TodoItemFlatNode) => node.expandable;

  // getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  // hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  // hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  // /**
  //  * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  //  */
  // transformer = (node: TodoItemNode, level: number) => {
  //   const existingNode = this.nestedNodeMap.get(node);
  //   const flatNode = existingNode && existingNode.item === node.item
  //       ? existingNode
  //       : new TodoItemFlatNode();
  //   flatNode.item = node.item;
  //   flatNode.level = level;
  //   flatNode.expandable = !!node.children;
  //   this.flatNodeMap.set(flatNode, node);
  //   this.nestedNodeMap.set(node, flatNode);
  //   return flatNode;
  // }

  // /** Whether all the descendants of the node are selected. */
  // descendantsAllSelected(node: TodoItemFlatNode): boolean {
  //   const descendants = this.treeControl.getDescendants(node);
  //   const descAllSelected = descendants.every(child =>
  //     this.checklistSelection.isSelected(child)
  //   );
  //   return descAllSelected;
  // }

  // /** Whether part of the descendants are selected */
  // descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
  //   const descendants = this.treeControl.getDescendants(node);
  //   const result = descendants.some(child => this.checklistSelection.isSelected(child));
  //   return result && !this.descendantsAllSelected(node);
  // }

  // /** Toggle the to-do item selection. Select/deselect all the descendants node */
  // todoItemSelectionToggle(node: TodoItemFlatNode): void {
  //   this.checklistSelection.toggle(node);
  //   const descendants = this.treeControl.getDescendants(node);
  //   this.checklistSelection.isSelected(node)
  //     ? this.checklistSelection.select(...descendants)
  //     : this.checklistSelection.deselect(...descendants);

  //   // Force update for the parent
  //   descendants.every(child =>
  //     this.checklistSelection.isSelected(child)
  //   );
  //   this.checkAllParentsSelection(node);
  // }

  // /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  // todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
  //   this.checklistSelection.toggle(node);
  //   this.checkAllParentsSelection(node);
  // }

  // /* Checks all the parents when a leaf node is selected/unselected */
  // checkAllParentsSelection(node: TodoItemFlatNode): void {
  //   let parent: TodoItemFlatNode | null = this.getParentNode(node);
  //   while (parent) {
  //     this.checkRootNodeSelection(parent);
  //     parent = this.getParentNode(parent);
  //   }
  // }

  // /** Check root node checked state and change it accordingly */
  // checkRootNodeSelection(node: TodoItemFlatNode): void {
  //   const nodeSelected = this.checklistSelection.isSelected(node);
  //   const descendants = this.treeControl.getDescendants(node);
  //   const descAllSelected = descendants.every(child =>
  //     this.checklistSelection.isSelected(child)
  //   );
  //   if (nodeSelected && !descAllSelected) {
  //     this.checklistSelection.deselect(node);
  //   } else if (!nodeSelected && descAllSelected) {
  //     this.checklistSelection.select(node);
  //   }
  // }

  // /* Get the parent node of a node */
  // getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
  //   const currentLevel = this.getLevel(node);

  //   if (currentLevel < 1) {
  //     return null;
  //   }

  //   const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

  //   for (let i = startIndex; i >= 0; i--) {
  //     const currentNode = this.treeControl.dataNodes[i];

  //     if (this.getLevel(currentNode) < currentLevel) {
  //       return currentNode;
  //     }
  //   }
  //   return null;
  // }

  // /** Select the category so we can insert the new item. */
  // addNewItem(node: TodoItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  // /** Save the node to database */
  // saveNode(node: TodoItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }
}
// @Component({
//   selector: 'onsite-request-panel',
//   template: '<p class="demo-rotini" style="padding: 10px; background-color: #F6753C !important;color:white;">Saving data....</p>'
// })
// export class OnsiteRequestPanel {

// }


