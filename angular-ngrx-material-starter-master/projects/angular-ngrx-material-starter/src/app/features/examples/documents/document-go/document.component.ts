import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../../core/core.module';

import { State } from '../../examples.state';

@Component({
  selector: 'anms-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  documents = [
    
   // { link: 'demo', label: 'demo' },
    { link: 'documentgo', label: 'văn bản trình' },
    { link: 'documentgo-waiting-process/1', label: 'Chờ xử lý' },
    { link: 'documentgo-process/2', label: 'Đã xử lý' },
    { link: 'documentgo-waiting-comment/3', label: 'Chờ xin ý kiến' },
    { link: 'documentgo-comment/4', label: 'Đã cho ý kiến' },
    { link: 'reportDocGo', label: 'Báo cáo, thống kê'},
    { link: 'reportAdvanceDocGo', label: 'Tra cứu văn bản'}
  ];
  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}

