import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material';
import {FormControl, FormBuilder, FormGroup, FormGroupDirective, Validators, NgForm} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {IncomingDoc, ItemSeleted, IncomingDocService, ApproverObject} from '../incoming-doc.service'
import {ResApiService} from '../../../services/res-api.service'
import {ErrorStateMatcher} from '@angular/material/core';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../../core/core.module';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'anms-document-add',
  templateUrl: './document-add.component.html',
  styleUrls: ['./document-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentAddComponent implements OnInit {
  listTitle = "ListDocumentTo";
  inDocs$: IncomingDoc[]= [];
  displayedColumns: string[] = ['select', 'numberTo', 'bookType', 'compendium', 'dateTo']; //'select'
  dataSource = new MatTableDataSource<IncomingDoc>();
  selection = new SelectionModel<IncomingDoc>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText = '';
  date = new FormControl(new Date());
  addNew = false;
  showList = true;
  userApproverId = '';
  currentUserName = '';
  currentUserId = '';
  userApproverEmail = '';
  currentNumberTo = 0;
  IncomingDocform: FormGroup;
  ListBookType: ItemSeleted[] = [];
  ListDocType: ItemSeleted[]= [];
  ListSecret: ItemSeleted[] = [];
  ListUrgent: ItemSeleted[]= [];
  ListMethodReceipt : ItemSeleted[] = [];
  ListSource: ItemSeleted[] = [];
  ApproverStep: ApproverObject[] = [];
  DocumentID = 0;
  outputFile = []; 
  displayFile = ''; 
  buffer;

  constructor(private fb: FormBuilder, private docTo: IncomingDocService, 
              private services: ResApiService, private ref: ChangeDetectorRef,
              private readonly notificationService: NotificationService) {}

  ngOnInit() {
    this.getCurrentUser();
    this.getBookType();
    this.getDocType();
    this.getSecretLevel();
    this.getUrgentLevel();
    this.getMethodReceipt();
    this.getSourceAddress();
    this.getUserApprovalList("GĐ");

    this.IncomingDocform = this.fb.group({
      bookType: ['DT', [Validators.required]],
      numberTo: ['', [Validators.required]],
      numberToSub: '',
      numberOfSymbol: '',
      source: '',
      docType: '',
      promulgatedDate: null,
      dateTo: new Date(),
      compendium: ['', [Validators.required]],
      secretLevel: '',
      urgentLevel: '',
      deadline: null,
      numberOfCopies: '',
      methodReceipt: '',
      userHandle: ['', [Validators.required]],
      note: '',
      isResponse: false,
      isRetrieve: false,
      signer: '',
      //surname: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  getAllListDocument() {
    this.docTo.getListDocumentTo(this.currentUserId).subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;     
      this.inDocs$ = []; 
      item.forEach(element => {
        this.inDocs$.push({
          bookType: element.BookTypeName, 
          numberTo: this.docTo.formatNumberTo(element.NumberTo), 
          numberToSub: element.NumberToSub, 
          numberOfSymbol: element.NumberOfSymbol, 
          source: element.Source, 
          docType: element.DocTypeName, 
          promulgatedDate: this.docTo.CheckNull(element.PromulgatedDate) === '' ? '' : moment(element.PromulgatedDate).format('DD/MM/YYYY'), 
          dateTo: this.docTo.CheckNull(element.DateTo) === '' ? '' : moment(element.DateTo).format('DD/MM/YYYY'), 
          compendium: element.Compendium, 
          secretLevel: element.SecretLevelName, 
          urgentLevel: element.UrgentLevelName, 
          deadline: this.docTo.CheckNull(element.Deadline) === '' ? '' : moment(element.Deadline).format('DD/MM/YYYY'), 
          numberOfCopies: element.NumOfCopies, 
          methodReceipt: element.MethodReceipt, 
          userHandle: element.UserOfHandle !== undefined ? element.UserOfHandle.Title : '', 
          note: element.Note, 
          isResponse: element.IsResponse === 0 ? "Không" : "Có", 
          isSendMail: "Có", 
          isRetrieve: element.IsRetrieve=== 0 ? "Không" : "Có", 
          signer: element.signer
        })
      })
      this.dataSource = new MatTableDataSource<IncomingDoc>(this.inDocs$);
      this.ref.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.currentNumberTo = this.docTo.getNumberToMax(this.inDocs$);
      this.IncomingDocform.controls['numberTo'].setValue(this.docTo.formatNumberTo(++this.currentNumberTo));
      this.IncomingDocform.controls['numberOfSymbol'].setValue(this.docTo.formatNumberTo(this.currentNumberTo) + '/VBĐ');
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

  getCurrentUser(){
    this.services.getCurrentUser().subscribe(
      itemValue => {
          this.currentUserId = itemValue["Id"];
          this.currentUserName = itemValue["Title"];
        },
      error => console.log("error: " + error),
      () => {
        console.log("Current user email is: \n" + "Current user Id is: " + this.currentUserId + "\n" + "Current user name is: " + this.currentUserName );
        this.getAllListDocument();
      }
      );
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

  getSourceAddress() {
    this.services.getListSourceAddress().subscribe((itemValue: any[]) => {
      let item = itemValue["value"] as Array<any>;
      item.forEach(element => {
        this.ListSource.push({
          id: element.ID,
          title: element.Title,
          code: element.Address
        })
      });
    })
  }

  getUserApprovalList(role){
    this.docTo.getUserApprover(role).subscribe(items =>{
      let itemUserMember = items["value"] as Array<any>;
      itemUserMember.forEach(element =>{
        this.ApproverStep.push({
          UserId: element.User.Id,
          UserName: element.User.Title,
          UserEmail: element.User.Name.split("|")[2]
        })
      })
    })
  }

  splitDataUserApprover(value){
    this.userApproverId = value.split("|")[0];
    this.userApproverEmail = value.split("|")[1];
  }

  AddNewItem(sts) {
    if (this.IncomingDocform.valid) {
      const dataForm = this.IncomingDocform.getRawValue();
      let bookT = this.docTo.FindItemByCode(this.ListBookType, dataForm.bookType);
      let docT = this.docTo.FindItemById(this.ListDocType, dataForm.docType);
      let secretL = this.docTo.FindItemById(this.ListSecret, dataForm.secretLevel);
      let urgentL = this.docTo.FindItemById(this.ListUrgent, dataForm.urgentLevel);
      let method = this.docTo.FindItemById(this.ListMethodReceipt, dataForm.methodReceipt);
      let sourceT = this.docTo.FindItemById(this.ListSource, dataForm.source);
      this.splitDataUserApprover(dataForm.userHandle);
      const data = {
        __metadata: { type: 'SP.Data.ListDocumentToListItem' },
        Title: dataForm.bookType,
        BookTypeCode: dataForm.bookType,
        BookTypeName: bookT === undefined ? '' : bookT.title,
        NumberTo: dataForm.numberTo,
        NumberToSub: this.docTo.CheckNullSetZero(dataForm.numberToSub),
        NumberOfSymbol: dataForm.numberOfSymbol,
        SourceID: this.docTo.CheckNullSetZero(dataForm.source),
        Source: sourceT === undefined ? '' : sourceT.title,
        DocTypeID: this.docTo.CheckNullSetZero(dataForm.docType),
        DocTypeName: docT === undefined ? '' : docT.title,
        PromulgatedDate: dataForm.promulgatedDate,
        DateTo: dataForm.dateTo,
        DateCreated: new Date(),
        Compendium: dataForm.compendium,
        SecretLevelID: this.docTo.CheckNullSetZero(dataForm.secretLevel),
        SecretLevelName: secretL === undefined ? '' : secretL.title,
        UrgentLevelID: this.docTo.CheckNullSetZero(dataForm.urgentLevel),
        UrgentLevelName: urgentL === undefined ? '' : urgentL.title,
        Deadline: dataForm.deadline,
        NumOfCopies: this.docTo.CheckNullSetZero(dataForm.numberOfCopies),
        MethodReceiptID: this.docTo.CheckNullSetZero(dataForm.methodReceipt),
        MethodReceipt: method === undefined ? '' : method.title,
        UserOfHandleId: this.userApproverId,
        Note: dataForm.note,
        IsResponse: dataForm.isResponse ? 1 : 0,
        IsRetrieve: dataForm.isRetrieve ? 1 : 0,
        StatusID: sts,
        StatusName: sts === 0 ? "Chờ xử lý" : "Lưu tạm",
        Signer: dataForm.signer
      }
      this.services.AddItemToList(this.listTitle, data).subscribe(
        item => {
          this.DocumentID = item['d'].Id;
        },
        error => {
          console.log("error when add item to list " + this.listTitle + ": "+ error.error.error.message.value),
          this.notificationService.error('Thêm văn bản đến thất bại');
          },
        () => {
          console.log("Add item of approval user to list " + this.listTitle + " successfully!");
          if(sts === 0) {
            this.AddListTicket();
          } else {
            this.saveItemAttachment(0, this.DocumentID)
          }
        });
    }
  }

  AddListTicket() {
    const dataForm = this.IncomingDocform.getRawValue();
    let sourceT = this.docTo.FindItemById(this.ListSource, dataForm.source);
    const data = {
      __metadata: { type: 'SP.Data.ListProcessRequestToListItem' },
      Title: dataForm.numberTo,
      DateCreated: new Date(),
      NoteBookID: this.DocumentID,
      UserRequestId: this.currentUserId,
      UserApproverId: this.userApproverId,
      Deadline: dataForm.deadline,
      StatusID: 0,
      StatusName: "Đang xử lý",
      Source: sourceT === undefined ? '' : sourceT.title,
      Destination: '',
      TaskTypeCode: 'XLC',
      TaskTypeName: 'Xử lý chính',
      TypeCode: 'CXL',
      TypeName: 'Chuyển xử lý',
      Content: dataForm.note,
      IndexStep: 1,
      Compendium: dataForm.compendium,
    }
    this.services.AddItemToList('ListProcessRequestTo', data).subscribe(
      item => {},
      error => {
        console.log("error when add item to list ListProcessRequestTo: "+ error.error.error.message.value),
        this.notificationService.error('Thêm phiếu xử lý thất bại');
      },
      () => {
        console.log("Add item of approval user to list ListProcessRequestTo successfully!");
        this.saveItemAttachment(0, this.DocumentID);
      });
  }

  reset() {
    this.IncomingDocform.reset();
    this.IncomingDocform.clearValidators();
    this.IncomingDocform.clearAsyncValidators();
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

  isNotNull(str) {
    return (str !== null && str !== "" && str !== undefined);
  }

  saveItemAttachment(index, idItem){
    try {
      this.buffer = this.getFileBuffer(this.outputFile[index]);
      this.buffer.onload = (e: any) => {
        console.log(e.target.result);
        const dataFile = e.target.result;
        this.services.inserAttachmentFile(dataFile, this.outputFile[index].name, this.listTitle, idItem).subscribe(
          itemAttach => {
            console.log('inserAttachmentFile success');
          },
          error => console.log(error),
          () => {
            console.log('inserAttachmentFile successfully');
            if(Number(index) < (this.outputFile.length-1)){
              this.saveItemAttachment((Number(index)+ 1), idItem);
            }
            else{
              //alert("Save request successfully");
              this.callbackfunc();
            }
          }
        )
      }
    } catch (error) {
      console.log("saveItemAttachment error: "+error);
    }
  }

  getFileBuffer(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return reader;
  }

  callbackfunc(){
    // window.location.href = '/workflows/LeaveofAbsence/detail/'+ id;
    this.notificationService.success('Thêm văn bản đến thành công');
    this.getAllListDocument();
    this.addNew = !this.addNew;
    this.showList = !this.showList;
  }

}
