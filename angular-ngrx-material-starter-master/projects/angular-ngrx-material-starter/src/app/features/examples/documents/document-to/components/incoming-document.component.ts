import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../../../core/core.module';

import { State } from '../../../examples.state';

@Component({
  selector: 'anms-document',
  templateUrl: './incoming-document.component.html',
  styleUrls: ['./incoming-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomingDocumentComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'documentto', label: 'Tiếp nhận văn bản' },
    { link: 'docTo-list/1', label: 'Chờ xử lý' },
    { link: 'docTo-list-approved/2', label: 'Đã xử lý' },
    { link: 'docTo-list-waiting-comment/3', label: 'Chờ xin ý kiến' },
    { link: 'docTo-list-response-comment/4', label: 'Đã cho ý kiến' },
    { link: 'reportDocTo', label: 'Báo cáo, thống kế' },
    { link: 'reportAdvanceDocTo', label: 'Tra cứu văn bản'},
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}

