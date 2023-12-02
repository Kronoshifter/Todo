import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { provideHttpClient, withFetch } from '@angular/common/http'
import { AutoAnimateModule } from '@formkit/auto-animate/angular'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      }
    },
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      // withFetch()
    ),
  ]
};
