import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { provideHttpClient, withFetch } from '@angular/common/http'
import { AutoAnimateModule } from '@formkit/auto-animate/angular'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      // withFetch()
    ),
  ]
};
