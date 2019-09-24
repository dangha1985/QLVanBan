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
    { link: 'documentgo-waiting', label: 'Chờ xử lý' },
    { link: 'documentgo-comment', label: 'Xin ý kiến' },
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}

