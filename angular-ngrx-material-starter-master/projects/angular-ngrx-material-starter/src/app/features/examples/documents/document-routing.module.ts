import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../core/core.module';

import { ExamplesComponent } from './../examples/examples.component';
// import { ParentComponent } from './theming/parent/parent.component';
// import { AuthenticatedComponent } from './authenticated/authenticated.component';
// import { TodosContainerComponent } from './todos/components/todos-container.component';
// import { StockMarketContainerComponent } from './stock-market/components/stock-market-container.component';
// import { CrudComponent } from './crud/components/crud.component';
// import { FormComponent } from './form/components/form.component';
import { NotificationsComponent } from './../notifications/components/notifications.component';
// import { UserComponent } from './simple-state-management/components/user.component';
import { ElementsComponent } from './../elements/elements.component';
// import { FormdemoComponent } from './demo/formdemo.component';
import { DocumentComponent } from '../../../features/examples/documents/document-go/document.component'
import { DocumentGoComponent } from './document-go/document-go.component';
import { DocumentGoDetailComponent } from './document-go/document-go-detail.component';
import { DocumentGoWaitingComponent } from './document-go/document-go-waiting.component';
import { CommentComponent }from './document-go/comment.component';
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
        path: 'documentgo-waiting',
        component: DocumentGoWaitingComponent,
        data: { title: 'Chờ xử lý' }
      },
      {
        path: 'documentgo-detail/:id',
        component: DocumentGoDetailComponent,
        data: { title: 'Xem chi tiết' }
      },
      // {
      //   path: 'documentgo-comment',
      //   component: CommentComponent,
      //   data: { title: 'Xin ý kiến' }
      // },
    ]
  },
  // {
  //   path: 'documentgo/detail/:id',
  //   component: DocumentGoDetailComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
