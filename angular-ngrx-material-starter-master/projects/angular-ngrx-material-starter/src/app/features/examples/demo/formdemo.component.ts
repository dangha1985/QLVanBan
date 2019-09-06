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

import { State } from '../examples.state';
import { actionFormReset, actionFormUpdate } from '../form/form.actions';
import { selectFormState } from '../form/form.selectors';


import { Form}from './../form/form.model';
@Component({
  selector: 'anms-formdemo',
  templateUrl: './formdemo.component.html',
  styleUrls: ['./formdemo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormdemoComponent implements OnInit {
  form = this.fb.group({
    autosave: false,
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    requestGift: [''],
    birthday: ['', [Validators.required]],
    rating: [0, Validators.required]
  });
  formValueChanges$: Observable<Form>;
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    
  }

}
