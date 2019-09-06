import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FEATURE_NAME, reducers } from './../examples/examples.state';
//import { DocumentGoComponent }from './document-go/document-go.component';

// export function HttpLoaderFactory(http: HttpClient) {
//     return new TranslateHttpLoader(
//       http,
//       `${environment.i18nPrefix}/assets/i18n/examples/`,
//       '.json'
//     );
//   }
@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
      LazyElementsModule,
     
      StoreModule.forFeature(FEATURE_NAME, reducers),
    //   TranslateModule.forChild({
    //     loader: {
    //       provide: TranslateLoader,
    //       useFactory: HttpLoaderFactory,
    //       deps: [HttpClient]
    //     },
    //     isolate: true
    //   })
    ],
    declarations: [
      //  DocumentGoComponent
    ],
    providers: []
  })
  export class DocumentsModule {
    constructor() {}
  }