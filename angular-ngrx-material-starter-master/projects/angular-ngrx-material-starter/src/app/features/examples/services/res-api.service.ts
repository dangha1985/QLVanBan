import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResApiService {
  private restUrl = environment.proxyUrl;
  private restAPI = 'https://tsgvietnam.sharepoint.com/sites/dev/Ha_Document';
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
      'Content-Type': 'application/json;odata=verbose',
      // "x-requestdigest": window['__frmSPDigest']
    })
  }
  httpOptionsFile = {
    headers: new HttpHeaders({
      'accept': 'application/json;odata=verbose',
      // 'dataType': 'json',
      'Content-Type': 'application/json;odata=verbose',
      // "x-requestdigest": window['__frmSPDigest']
    })
  }
  httpOptionsUpdate = {
    headers: new HttpHeaders({
      'accept': 'application/json;odata=verbose',
      'dataType': 'json',
      'Content-Type': 'application/json;odata=verbose',
      // "x-requestdigest": window['__frmSPDigest'],
      "X-HTTP-Method": "MERGE",
      "IF-MATCH": "*",
    })
  }
  
  getCurrentUser(){
    return this. http.get(`${this.restUrl}${this.currentUserAPI}`);
  }
  getUserInfo(loginName){
    // loginName = 'i:0%23.f|membership|tuyen.nguyen@tsg.net.vn';
    return this.http.get(`${this.restUrl}${this.urlUserInfo}` + `'` + loginName + `'`);
  }
  getListDepartment() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListDepartment')/items`);
  }
  getListUrgent() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListUrgent')/items`);
  }
  getListSecret() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListSecret')/items`);
  }
  getListBookType() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListBookType')/items`);
  }
  getListDocType() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListDocType')/items`);
  }
  getListRole() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListRole')/items`);
  }
  getListStatus() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListStatus')/items`);
  }
  getListStatusType() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListStatusType')/items`);
  }
  getListMethodSend() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMethodSend')/items`);
  }
  getListSourceAddress() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListSourceAddress')/items`);
  }
  getListTaskType() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListTaskType')/items`);
  }
  getListMapEmployee() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMapEmployee')/items`);
  }
  getListTotalStep() : Observable<any> {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListTotalStep')/items`);
  }

  AddItemToList(listName, data){
    return this.http.post(`${this.restUrl}/_api/web/lists/getbytitle('`+ listName +`')/items`, data, this.httpOptions);
  }

  //attachment file
  inserAttachmentFile(data, filename, listName, indexItem) {
    return this.http.post(`${this.restUrl}/_api/web/lists/GetByTitle('`+ listName +`')/items(`+ indexItem +`)/AttachmentFiles/add(FileName='` + filename + `')`,data, this.httpOptionsFile);
  }

  urlInforApproval =
  "/_api/web/lists/getbytitle('ListConfig')/items?$select=*&$filter=BookTypeCode eq ";
  getInforApprovalByStep(typeCode, step) {
    return this.http.get(`${this.restUrl}${this.urlInforApproval}` + `'` + typeCode + `' and IndexStep eq '` + step + `'`);
  }

  getDepartmnetOfUser(userId) {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMapEmployee')/items?$select=*,User/Id,User/Title,User/Name&$expand=User&$filter=User/Id eq '` + userId + `'`);
  }

  getUserByRole(role) {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMapEmployee')/items?$select=*,User/Id,User/Title,User/Name&$expand=User&$filter=RoleCode eq '` + role + `'`);
  }

  getUserByRole2(strFilter) {
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMapEmployee')/items?$select=*,User/Id,User/Title,User/Name&$expand=User` + strFilter);
  }

  updateListById(listName, data, id) {
    return this.http.post(`${this.restUrl}/_api/web/lists/getbytitle('` + listName + `')/items` + `(` + id + `)`, data, this.httpOptionsUpdate);
  }
}
