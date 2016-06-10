import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { GameService } from './app/+game/game.service';
import { RhKeynoteDemoAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

import 'rxjs/Rx';

bootstrap(RhKeynoteDemoAppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  GameService
]);
