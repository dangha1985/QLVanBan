import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Model, ModelFactory } from '@angular-extensions/model';
import { environment } from '../../../../../environments/environment';

const ELEMENT_DATA: IncomingDoc[] = [
  { bookType: 'DT', numberTo: 1, numberToSub: 0, numberOfSymbol: '', source: 0, docType: 1, promulgatedDate: null, dateTo: null, 
    compendium: '123', secretLevel: 1, urgentLevel: 2, deadline: null, numberOfCopies: 2, methodReceipt: 1, userHandle: 12, note: '', 
    isRespinse: false, isSendMail: false, signer: '' },
  { bookType: 'DT', numberTo: 2, numberToSub: 0, numberOfSymbol: '', source: 0, docType: 1, promulgatedDate: null, dateTo: null, 
    compendium: '456', secretLevel: 1, urgentLevel: 2, deadline: null, numberOfCopies: 2, methodReceipt: 1, userHandle: 12, note: '', 
    isRespinse: false, isSendMail: false, signer: ''},
];

@Injectable({
  providedIn: 'root'
})
export class IncomingDocService {
  private model: Model<IncomingDoc[]>;
  inDocs$: Observable<IncomingDoc[]>;

  constructor(private modelFactory: ModelFactory<IncomingDoc[]>) {
    this.model = this.modelFactory.create([...ELEMENT_DATA]);
    this.inDocs$ = this.model.data$;
   }

   FindItemById(array, id) {
    return array.find(i => parseInt(i.id) === parseInt(id));
  }

  FindItemByCode(array, value) {
    return array.find(i => i.code === value);
  }
}

export interface IncomingDoc {
  bookType: string;
  numberTo: number;
  numberToSub: number;
  numberOfSymbol: string;
  source: number;
  docType: number;
  promulgatedDate: Date;
  dateTo: Date;
  compendium: string;
  secretLevel: number;
  urgentLevel: number;
  deadline: Date;
  numberOfCopies: number;
  methodReceipt: number;
  userHandle: number;
  note: string;
  isRespinse: boolean;
  isSendMail: boolean;
  signer: string;
}

export interface ItemSeleted {
  id: number;
  title: string;
  code: string;
}
