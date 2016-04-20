import { Component } from 'angular2/core';

@Component({
    template: `
        <div class="mdl-grid main">
        <h4>Hello!</h4>

        <div class="mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">Game</h2>
          </div>
          <div class="mdl-card__supporting-text">
          <!-- TODO write good a text -->
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenan convallis.
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Play Game
            </a>
          </div>
        </div>

        <div class="mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title mdl-card--expand">
            <h2 class="mdl-card__title-text">Selfie</h2>
          </div>
          <div class="mdl-card__supporting-text">
            <!-- TODO write good a text -->
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenan convallis.
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Take a Selfie
            </a>
          </div>
        </div>


        </div>
    `
})

export class MainComponent {}
