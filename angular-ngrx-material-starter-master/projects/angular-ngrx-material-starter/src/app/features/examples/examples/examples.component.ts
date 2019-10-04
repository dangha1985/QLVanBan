import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'anms-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'doc-to', label: 'Tiếp nhận văn bản' },
    { link: 'doc-list/1', label: 'Chờ xử lý' },
    { link: 'doc-list-approved/2', label: 'Đã xử lý' },
    { link: 'doc-list-waiting-comment/3', label: 'Chờ xin ý kiến' },
    { link: 'doc-list-response-comment/4', label: 'Đã cho ý kiến' },
    { link: 'report-list', label: 'Báo cáo, thống kế' },
    { link: 'report-advance', label: 'Tra cứu văn bản'},
    // { link: 'doc-detail/:id', label: 'Xem chi tiết' },
  //   { link: 'stock-market', label: 'anms.examples.menu.stocks' },
  //   { link: 'theming', label: 'anms.examples.menu.theming' },
  //   { link: 'crud', label: 'anms.examples.menu.crud' },
  //   {
  //     link: 'simple-state-management',
  //     label: 'anms.examples.menu.simple-state-management'
  //   },
  //   { link: 'form', label: 'anms.examples.menu.form' },
  //   { link: 'demo', label: 'demo' },
  //  // { link: 'documentgo', label: 'Document Go' },
  //   { link: 'notifications', label: 'anms.examples.menu.notifications' },
  //   { link: 'elements', label: 'anms.examples.menu.elements' },
  //   { link: 'authenticated', label: 'anms.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
