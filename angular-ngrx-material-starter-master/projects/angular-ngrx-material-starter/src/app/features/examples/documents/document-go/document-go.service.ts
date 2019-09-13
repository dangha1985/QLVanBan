import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ItemDocumentGo} from '../models/document-go'
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DocumentGoService {
  private restUrl = environment.proxyUrl;
  private urlAddDocumentGo="/_api/web/lists/getbytitle('ListDocumentGo')/items";
  private getDocumentGoAPI = "/_api/web/lists/getbytitle('ListDocumentGo')/items?$select=ID,NumberGo,DocTypeName,NumberSymbol,Compendium,DateCreated,Deadline,StatusName,UserCreate/Title,UserOfHandle/Title&$expand=UserCreate/Id,UserOfHandle/Id";
  private  urlGroupApprover = "/_api/web/lists/getbytitle('ListMapEmployee')/items?$select=User/Name,User/Title,User/Id&$expand=User"
//  private getHistoryStepAPI = "/_api/web/lists/getbytitle('ListHistoryStep')/items?$select=ID,Title,DateRequest,ListName,StatusName,IsFinnish,NameUserRequest";
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
   // format định dạng ngày    
   formatDateTime(date: Date): string {
    if (!date) {
      return '';
    }
    return moment(date).format('DD/MM/YYYY');
    //return moment(date).format('DD/MM/YYYY hh:mm A');
  }
  ISODateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getFullYear() + '-'
      + pad(d.getMonth() + 1) + '-'
      + pad(d.getDate()) + 'T'
      + pad(d.getHours()) + ':'
      + pad(d.getMinutes()) + ':'
      + pad(d.getSeconds()) + 'Z'
  }
   // format định dạng ngày    
   checkNull(value): string {
    if (!value) {
      return '';
    }
    return value;
  }
  FindItemById(array, id) {
    return array.find(i => parseInt(i.ID) === parseInt(id));
  }

  FindItemByCode(array, value) {
    return array.find(i => i.Code === value);

  }

  //thêm mới vbđi
  createDocumentGo(data) {
    return this.http.post(`${this.restUrl}${this.urlAddDocumentGo}`, data, this.httpOptions);
  }
//lấy ds vb đi
  getListDocumentGo(strFilter): Observable<any> {
    console.log(`${this.restUrl}${this.getDocumentGoAPI}`  + strFilter + `&$orderby=DateCreated desc`);
    return this.http.get(`${this.restUrl}${this.getDocumentGoAPI}`  + strFilter + `&$orderby=DateCreated desc`);
  }
 //lấy người dùng theo điều kiện tìm kiếm
  getUser(strFilter) {
    return this.http.get(`${this.restUrl}${this.urlGroupApprover}` + strFilter );
  }
  
//lấy ra số vb đi max 
  getNumberToMax(arr : ItemDocumentGo[]) {
    let result = Math.max.apply(Math, arr.map(function(element) {
      return element.NumberGo; 
    }))
    return result;
  }
  //get item by id in list document incoming  
  getListDocByID(id) {
    let urlDetailLeave = "/_api/web/lists/getbytitle('ListDocumentGo')/items?$select=* ,Author/Id,Author/Title,Author/Name,UserOfHandle/Id,UserOfHandle/Title,"
    + "AttachmentFiles&$expand=UserOfHandle,Author,AttachmentFiles&$filter=ID eq ";
    return this.http.get(`${this.restUrl}${urlDetailLeave}` + `'` + id + `'`);
  }
  // getHistoryStepItemComment(strFilter): Observable<any> {
  //   console.log(`${this.restUrl}${this.getHistoryStepAPI}`  + strFilter + `&$orderby=DateRequest desc`);
  //   console.log(this.http.get(`${this.restUrl}${this.getHistoryStepAPI}`  + strFilter + `&$orderby=DateRequest desc`));
    
  //   return this.http.get(`${this.restUrl}${this.getHistoryStepAPI}`  + strFilter + `&$orderby=DateRequest desc`);
  // }
}
