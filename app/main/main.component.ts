import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: `
        <div class="main">
          <a [routerLink]="['Game']" class="mdl-button mdl-js-button app-icon">
            <i class="material-icons">videogame_asset</i>
            <span>Play Game</span>
          </a>

          <a [routerLink]="['Selfie']" class="mdl-button mdl-js-button app-icon">
            <i class="material-icons">photo</i>
            <span>Take a Selfie</span>
          </a>
        </div>
    `
})

export class MainComponent {}
