
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { filter, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../core/core.module';

import { State } from '../../examples/examples.state';
import { actionFormReset, actionFormUpdate } from '../../examples/form/form.actions';
import { selectFormState } from '../../examples/form/form.selectors';


import { ListDocumentGo,DocumentGo, ListDocType}from './../models/document-go';
@Component({
  selector: 'anms-document-go',
  templateUrl: './document-go.component.html',
  styleUrls: ['./document-go.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentGoComponent implements OnInit {
  form = this.fb.group({
    NumSymbol: ['', [Validators.required]],
   // password: ['', [Validators.required]],
   // email: ['', [Validators.required, Validators.email]],
    Compendium: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    // requestGift: [''],
    // birthday: ['', [Validators.required]],
    // rating: [0, Validators.required]
  });
  formValueChanges$: Observable<DocumentGo>;
  ListDocType = ListDocType;
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    
  }

}

