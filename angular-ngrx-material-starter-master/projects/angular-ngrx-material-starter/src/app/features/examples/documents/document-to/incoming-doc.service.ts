import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Model, ModelFactory } from '@angular-extensions/model';
import { environment } from '../../../../../environments/environment';
import { MatListItem } from '@angular/material';
import { createAction, props } from '@ngrx/store';

export const actionFormReset = createAction('[Form] Reset');
const ELEMENT_DATA: IncomingDoc[] = [
  { bookType: 'DT', numberTo: '1', numberToSub: 0, numberOfSymbol: '', source: 0, docType: 1, promulgatedDate: null, dateTo: null, 
    compendium: '123', secretLevel: 1, urgentLevel: 2, deadline: null, numberOfCopies: 2, methodReceipt: 1, userHandle: 12, note: '', 
    isResponse: "Không", isSendMail: "Có", isRetrieve: 'Không', signer: '' },
  { bookType: 'DT', numberTo: '2', numberToSub: 0, numberOfSymbol: '', source: 0, docType: 1, promulgatedDate: null, dateTo: null, 
    compendium: '456', secretLevel: 1, urgentLevel: 2, deadline: null, numberOfCopies: 2, methodReceipt: 1, userHandle: 12, note: '', 
    isResponse: "Có", isSendMail: "Không", isRetrieve: 'Không', signer: ''},
];

@Injectable({
  providedIn: 'root'
})
export class IncomingDocService {
  private model: Model<IncomingDoc[]>;
  inDocs$: Observable<IncomingDoc[]>;

  private restUrl = environment.proxyUrl;
  private currentUserAPI = "/_api/web/currentUser";
  private urlUserInfo = "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=";

  constructor(private http: HttpClient) {
    if (environment.production) {
      http.options(this.restUrl,
        {
          headers: {
            "accept": 'application/json;odata=verbose',
          }
        });
    }
  }
  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json;odata=verbose',
      'dataType': 'json',
      'Content-Type': 'application/json;odata=verbose'
    })
  }

   FindItemById(array, id) {
    return array.find(i => parseInt(i.id) === parseInt(id));
  }

  FindItemByCode(array, value) {
    return array.find(i => i.code === value);
  }

  CheckNull(value) {
    if(value === undefined || value === null) {
      return '';
    } else {
      return value;
    }
  }

  CheckNullSetZero(value) {
    if(value === undefined || value === null) {
        return 0;
    } else if (isNaN(value)) {
        return 0;
    }
    else {
        return Number(value);
    }
}

  formatNumberTo(value) {
    return ('0000000' + value).slice(-4);
  }

  FormatDateShow(objDate, locale) {
    try {
        if (objDate === null) { return ""; }
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        if (locale === undefined) { locale = "en-GB"; }
        return objDate.toLocaleString(locale, options);
    } catch (err) {
        console.log("FormatDateShow1:" + err.message);
        return objDate;
    }
  }

  urlDocumentTo = "/_api/web/lists/getbytitle('ListDocumentTo')/items?$select=*,UserOfHandle/Title,UserOfHandle/Id,Author/Id&$expand=UserOfHandle,Author&$filter=Author/Id eq "
  getListDocumentTo(userId) : Observable<any> {
    return this.http.get(`${this.restUrl}${this.urlDocumentTo}` + `'` + userId + `'`);
  }

  urlRequestTo = "/_api/web/lists/getbytitle('ListProcessRequestTo')/items?$select=*, UserRequest/Title,UserRequest/Id,UserApprover/Title,UserApprover/Id&$expand=UserApprover,UserRequest"
  getListRequestTo(strFilter) : Observable<any> {
    return this.http.get(`${this.restUrl}${this.urlRequestTo}` + strFilter);
  }

  getListRequestByDocID(docId) : Observable<any> {
    return this.http.get(`${this.restUrl}${this.urlRequestTo}` + `&$filter=NoteBookID eq '` + docId + `'`);
  }

  urlGroupApprover = "/_api/web/lists/getbytitle('ListMapEmployee')/items?$select=User/Name,User/Title,User/Id&$expand=User&$filter=RoleCode eq "
  getUserApprover(role) {
    return this.http.get(`${this.restUrl}${this.urlGroupApprover}` + `'` + role + `'`);
  }

  getNumberToMax(arr : IncomingDoc[]) {
    let result = Math.max.apply(Math, arr.map(function(element) {
      return element.numberTo; 
    }))
    return result;
  }

  //get item by id in list document incoming  
  getListDocByID(id) {
    let urlDetailLeave = "/_api/web/lists/getbytitle('ListDocumentTo')/items?$select=* ,Author/Id,Author/Title,Author/Name,UserOfHandle/Id,UserOfHandle/Title,"
    + "AttachmentFiles&$expand=UserOfHandle,Author,AttachmentFiles&$filter=ID eq ";
    return this.http.get(`${this.restUrl}${urlDetailLeave}` + `'` + id + `'`);
  }
}

export interface IncomingDoc {
  bookType: string;
  numberTo: string;
  numberToSub: number;
  numberOfSymbol: string;
  source: number;
  docType: number;
  promulgatedDate: string;
  dateTo: string;
  compendium: string;
  secretLevel: number;
  urgentLevel: number;
  deadline: string;
  numberOfCopies: number;
  methodReceipt: number;
  userHandle: number;
  note: string;
  isResponse: string;
  isSendMail: string;
  isRetrieve: string;
  signer: string;
}

export interface IncomingTicket {
  compendium: string;
  documentID: number;
  userRequest: number;
  userApprover: string;
  deadline: string;
  status: string;
  source: string;
  destination: string;
  taskType: string;
  typeCode: string;
  content: string;
  indexStep: number;
  created: string;
  numberTo: string;
}

export interface ItemSeleted {
  id: number;
  title: string;
  code: string;
}

export class ApproverObject {
  UserId: Number;
  UserName: string;
  UserEmail: string;
}

export class AttachmentsObject {
  name: string;
  urlFile: string;
}
