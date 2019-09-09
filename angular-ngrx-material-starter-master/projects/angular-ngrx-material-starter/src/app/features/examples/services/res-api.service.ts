import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResApiService {
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
  getCurrentUser(){
    return this. http.get(`${this.restUrl}${this.currentUserAPI}`);
  }
  getUserInfo(loginName){
    // loginName = 'i:0%23.f|membership|tuyen.nguyen@tsg.net.vn';
    return this.http.get(`${this.restUrl}${this.urlUserInfo}` + `'` + loginName + `'`);
  }
  getListDepartment(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListDepartment')/items`);
  }
  getListUrgent(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListUrgent')/items`);
  }
  getListSecret(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListSecret')/items`);
  }
  getListBookType(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListBookType')/items`);
  }
  getListDocType(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListDocType')/items`);
  }
  getListRole(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListRole')/items`);
  }
  getListStatus(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListStatus')/items`);
  }
  getListStatusType(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListStatusType')/items`);
  }
  getListMethodSend(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMethodSend')/items`);
  }
  getListTaskType(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListTaskType')/items`);
  }
  getListMapEmployee(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListMapEmployee')/items`);
  }
  getListTotalStep(){
    return this.http.get(`${this.restUrl}/_api/web/lists/getbytitle('ListTotalStep')/items`);
  }
}
