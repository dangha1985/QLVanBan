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
      'Content-Type': 'application/json;odata=verbose'
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
}
