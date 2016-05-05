import { bootstrap } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app-component/app.component';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';

import 'rxjs/Rx';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS
]);
