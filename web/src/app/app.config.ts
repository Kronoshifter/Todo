import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from '@angular/common/http'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { LuxonDateAdapter, MAT_LUXON_DATE_FORMATS } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      }
    },
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_LUXON_DATE_FORMATS
    },
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      // withFetch()
    ),
  ]
};
