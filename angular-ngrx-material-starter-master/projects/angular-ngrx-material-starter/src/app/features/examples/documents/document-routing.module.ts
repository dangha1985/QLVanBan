import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../core/core.module';

import { ExamplesComponent } from './../examples/examples.component';
import { NotificationsComponent } from './../notifications/components/notifications.component';
import { ElementsComponent } from './../elements/elements.component';
import { DocumentComponent } from '../../../features/examples/documents/document-go/document.component';
import { IncomingDocumentComponent } from '../../../features/examples/documents/document-to/components/incoming-document.component';
import { DocumentGoComponent } from './document-go/document-go.component';
import { DocumentGoDetailComponent } from './document-go/document-go-detail.component';
import { DocumentGoWaitingComponent } from './document-go/document-go-waiting.component';
import {ReportDGComponent} from '../documents/document-go/report.component';
import {ReportAdvanceDGComponent} from '../documents/document-go/report-advance.component';
import { CommentComponent }from './document-go/comment.component';

import {DocumentAddComponent} from './document-to/components/document-add.component';
import {DocumentDetailComponent} from './document-to/components/document-detail.component';
import { DocumentWaitingComponent } from './document-to/components/document-waiting.component';
import {ReportComponent} from './document-to/components/report.component';
import {ReportAdvanceComponent} from './document-to/components/report-advance.component';

import { from } from 'rxjs';
const routes: Routes = [
  {
    path: '',
    component: DocumentComponent,
    children: [
      {
        path: '',
        redirectTo: 'documentgo',
        pathMatch: 'full'
      },
      {
        path: 'documentgo',
        component: DocumentGoComponent,
        data: { title: 'Văn bản trình ký' }
      },
      {
        path: 'documentgo-waiting-process/:id',
        component: DocumentGoWaitingComponent,
        data: { title: 'Chờ xử lý' }
      },
      {
        path: 'documentgo-process/:id',
        component: DocumentGoWaitingComponent,
        data: { title: 'Đã xử lý' }
      },
      {
        path: 'documentgo-waiting-comment/:id',
        component: DocumentGoWaitingComponent,
        data: { title: 'Chờ xin ý kiến' }
      },
      {
        path: 'documentgo-comment/:id',
        component: DocumentGoWaitingComponent,
        data: { title: 'Đã cho ý kiến' }
      },
      {
        path: 'documentgo-detail/:id',
        component: DocumentGoDetailComponent,
        data: { title: 'Xem chi tiết' }
      },
      {
        path: 'documentgo-detail/:id/:step',
        component: DocumentGoDetailComponent,
        data: { title: 'Xử lý' }
      },
      {
        path: 'reportDocGo',
        component: ReportDGComponent,
        data: { title: 'Báo cáo, thống kê' }
      },
      {
        path: 'reportAdvanceDocGo',
        component: ReportAdvanceDGComponent,
        data: { title: 'Tra cứu văn bản' }
      },
    ]
  },
  {
    path: 'IncomingDoc',
    component: IncomingDocumentComponent,
    children: [
      {
        path: '',
        redirectTo: 'documentto',
        pathMatch: 'full'
      },
      {
        path: 'documentto',
        component: DocumentAddComponent,
        data: { title: 'Tiếp nhận văn bản' }
      },
      {
        path: 'docTo-list/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Chờ xử lý' }
      },
      {
        path: 'docTo-list-approved/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Đã xử lý' }
      },
      {
        path: 'docTo-list-waiting-comment/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Chờ xin ý kiến' }
      },
      {
        path: 'docTo-list-response-comment/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Đã cho ý kiến' }
      },
      {
        path: 'reportDocTo',
        component: ReportComponent,
        data: { title: 'Báo cáo, thống kê' }
      },
      {
        path: 'reportAdvanceDocTo',
        component: ReportAdvanceComponent,
        data: { title: 'Tra cứu văn bản' }
      },
      {
        path: 'docTo-detail/:id',
        component: DocumentDetailComponent,
        data: { title: 'Xem chi tiết' }
      },
      {
        path: 'docTo-detail/:id/:step',
        component: DocumentDetailComponent,
        data: { title: 'Xử lý' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
