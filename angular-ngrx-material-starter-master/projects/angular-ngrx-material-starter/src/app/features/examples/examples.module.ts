import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import {MatTableModule} from '@angular/material/table';
// import {FlexLayoutModule} from '@angular/flex-layout';
// import {MatTreeModule} from '@angular/material/tree'
// import {MatAutocompleteModule} from '@angular/material';
// import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared/shared.module';
import { environment } from '../../../environments/environment';

import { FEATURE_NAME, reducers } from './examples.state';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent } from './examples/examples.component';
import { TodosContainerComponent } from './todos/components/todos-container.component';
import { TodosEffects } from './todos/todos.effects';
import { StockMarketContainerComponent } from './stock-market/components/stock-market-container.component';
import { StockMarketEffects } from './stock-market/stock-market.effects';
import { StockMarketService } from './stock-market/stock-market.service';
import { ParentComponent } from './theming/parent/parent.component';
import { ChildComponent } from './theming/child/child.component';
import { CrudComponent } from './crud/components/crud.component';
import { BooksEffects } from './crud/books.effects';
import { FormComponent } from './form/components/form.component';
import { FormEffects } from './form/form.effects';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { NotificationsComponent } from './notifications/components/notifications.component';
import { ExamplesEffects } from './examples.effects';
import { UserComponent } from './simple-state-management/components/user.component';
import { UserService } from './simple-state-management/user.service';
import { ElementsComponent } from './elements/elements.component';
//import {DocumentGoComponent }from './documents/document-go/document-go.component';
// import {DocumentAddComponent, RotiniPanel} from './documents/document-to/components/document-add.component'
// import {DocumentDetailComponent} from './documents/document-to/components/document-detail.component'
// import { DocumentWaitingComponent, ChecklistDatabase} from './documents/document-to/components/document-waiting.component'
// import { ReportComponent} from './documents/document-to/components/report.component'
// import { ReportAdvanceComponent} from './documents/document-to/components/report-advance.component'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    LazyElementsModule,
    SharedModule,
    ExamplesRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      ExamplesEffects,
      TodosEffects,
      StockMarketEffects,
      BooksEffects,
      FormEffects
    ]),
    //  MatTableModule,
    //  MatTreeModule,
    //  FlexLayoutModule,
    //  MatAutocompleteModule,
    //  ModalModule.forRoot(),
  ],
  declarations: [
    ExamplesComponent,
    TodosContainerComponent,
    StockMarketContainerComponent,
    ParentComponent,
    ChildComponent,
    AuthenticatedComponent,
    CrudComponent,
    FormComponent,
    NotificationsComponent,
    UserComponent,
    ElementsComponent,
   // DocumentGoComponent,
    // DocumentAddComponent,
    // DocumentDetailComponent,
    // DocumentWaitingComponent,
    // // ChecklistDatabase,
    // RotiniPanel,
    // ReportComponent,
    // ReportAdvanceComponent,
  ],
  providers: [StockMarketService, UserService],
  // entryComponents: [
  //   RotiniPanel,
  //   ],
})
export class ExamplesModule {
  constructor() {}
}
