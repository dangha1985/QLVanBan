import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FEATURE_NAME, reducers } from '.././../examples/examples.state';
import {FlexLayoutModule} from '@angular/flex-layout'
import { SharedModule } from '../../../shared/shared.module';
import { environment } from '../../../../environments/environment';
import {MatTableModule} from '@angular/material/table';

import { FormEffects } from './../form/form.effects';
import { ExamplesEffects } from './../examples.effects';
import { TodosEffects } from './../todos/todos.effects';
import { BooksEffects } from './../crud/books.effects';
import { StockMarketEffects } from './../stock-market/stock-market.effects';
import { StockMarketService } from './../stock-market/stock-market.service';
import { UserService } from './../simple-state-management/user.service';

import {DocumentRoutingModule} from './document-routing.module';
import { DocumentGoComponent }from './document-go/document-go.component';
import { DocumentComponent } from './document-go/document.component';

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
    MatTableModule,
    SharedModule,
    DocumentRoutingModule,
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
  MatTableModule,
  FlexLayoutModule,
],
  declarations: [
    DocumentComponent,
      DocumentGoComponent
  ],
  providers: [StockMarketService, UserService]
})
export class DocumentsModule {
  constructor() {}
}
