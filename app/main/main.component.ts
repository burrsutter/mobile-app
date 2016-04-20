import { Component } from 'angular2/core';

@Component({
    template: `
        <div class="main">
          <button class="mdl-button mdl-js-button app-icon">
            <i class="material-icons">videogame_asset</i>
            <span>Play Game</span>
          </button>

          <button class="mdl-button mdl-js-button app-icon">
            <i class="material-icons">photo</i>
            <span>Take a Selfie</span>
          </button>
        </div>
    `
})

export class MainComponent {}
