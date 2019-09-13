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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { BrowserModule } from '@angular/platform-browser';
import {DocumentRoutingModule} from './document-routing.module';
import { DocumentGoComponent }from './document-go/document-go.component';
import { DocumentComponent } from './document-go/document.component';
import { DocumentGoDetailComponent } from './document-go/document-go-detail.component';
import { DocumentGoWaitingComponent } from './document-go/document-go-waiting.component';

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
  // CommonModule,
    //BrowserModule,
   // CoreModule,
  //  EffectsModule,
    //BrowserAnimationsModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
      TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        isolate: true
      }),
//  EffectsModule.forFeature([
//     ExamplesEffects,
//     TodosEffects,
//     StockMarketEffects,
//     BooksEffects,
//     FormEffects
//   ]),
  MatTableModule,
  FlexLayoutModule,
],
  declarations: [
    DocumentComponent,
      DocumentGoComponent,
      DocumentGoDetailComponent,
      DocumentGoWaitingComponent
  ],
  providers: []
})
export class DocumentsModule {
  constructor() {}
}
