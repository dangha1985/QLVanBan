import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../core/core.module';

import { ExamplesComponent } from './examples/examples.component';
import { ParentComponent } from './theming/parent/parent.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { TodosContainerComponent } from './todos/components/todos-container.component';
import { StockMarketContainerComponent } from './stock-market/components/stock-market-container.component';
import { CrudComponent } from './crud/components/crud.component';
import { FormComponent } from './form/components/form.component';
import { NotificationsComponent } from './notifications/components/notifications.component';
import { UserComponent } from './simple-state-management/components/user.component';
import { ElementsComponent } from './elements/elements.component';
import {DocumentGoComponent }from './documents/document-go/document-go.component';
import {DocumentAddComponent} from './documents/document-to/components/document-add.component'
import {DocumentDetailComponent} from './documents/document-to/components/document-detail.component'
import { DocumentWaitingComponent } from './documents/document-to/components/document-waiting.component'
import {ReportComponent} from './documents/document-to/components/report.component'
import {ReportAdvanceComponent} from './documents/document-to/components/report-advance.component'
const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        redirectTo: 'doc-to',
        pathMatch: 'full'
      },
      {
        path: 'doc-to',
        component: DocumentAddComponent,
        data: { title: 'Tiếp nhận văn bản' }
      },
      {
        path: 'doc-list/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Chờ xử lý' }
      },
      {
        path: 'doc-list-approved/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Đã xử lý' }
      },
      {
        path: 'doc-list-waiting-comment/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Chờ xin ý kiến' }
      },
      {
        path: 'doc-list-response-comment/:id',
        component: DocumentWaitingComponent,
        data: { title: 'Đã cho ý kiến' }
      },
      {
        path: 'report-list',
        component: ReportComponent,
        data: { title: 'Báo cáo, thống kê' }
      },
      {
        path: 'report-advance',
        component: ReportAdvanceComponent,
        data: { title: 'Tra cứu văn bản' }
      },
      {
        path: 'doc-detail/:id',
        component: DocumentDetailComponent,
        data: { title: 'Xem chi tiết' }
      },
      {
        path: 'doc-detail/:id/:step',
        component: DocumentDetailComponent,
        data: { title: 'Xử lý' }
      },
      {
        path: 'todos',
        component: TodosContainerComponent,
        data: { title: 'Todos' }
      },
      {
        path: 'stock-market',
        component: StockMarketContainerComponent,
        data: { title: 'anms.examples.menu.stocks' }
      },
      {
        path: 'theming',
        component: ParentComponent,
        data: { title: 'anms.examples.menu.theming' }
      },
      {
        path: 'crud',
        redirectTo: 'crud/',
        pathMatch: 'full'
      },
      {
        path: 'crud/:id',
        component: CrudComponent,
        data: { title: 'anms.examples.menu.crud' }
      },
      {
        path: 'simple-state-management',
        component: UserComponent,
        data: { title: 'anms.examples.menu.simple-state-management' }
      },
      {
        path: 'form',
        component: FormComponent,
        data: { title: 'anms.examples.menu.form' }
      },
      // {
      //   path: 'documentgo',
      //   component: DocumentGoComponent,
      //   data: { title: 'documentgo' }
      // },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: { title: 'anms.examples.menu.notifications' }
      },
      {
        path: 'elements',
        component: ElementsComponent,
        data: { title: 'anms.examples.menu.elements' }
      },
      {
        path: 'authenticated',
        component: AuthenticatedComponent,
        canActivate: [AuthGuardService],
        data: { title: 'anms.examples.menu.auth' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
