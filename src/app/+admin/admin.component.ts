import { Component, AfterViewInit } from '@angular/core';

declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css']
})

export class AdminComponent implements AfterViewInit {
  ws;
  currentSelfieState;
  currentGameState;
  configuration = null;
  opacity: number = 85;
  size: number = 0.3;
  isPaused: boolean = false;
  isPlaying: boolean = false;
  selfieStates = [
    {
      name: 'open',
      display: 'Open'
    },
    {
      name: 'closed',
      display: 'Closed'
    }
  ];
  gameStates = [
    {
      name: 'title',
      display: 'Title'
    },
    {
      name: 'demo',
      display: 'Demo'
    },
    {
      name: 'play',
      display: 'Start Game'
    },
    {
      name: 'pause',
      display: 'Pause'
    },
    {
      name: 'game-over',
      display: 'Game Over'
    }
  ];

  constructor() {
    this.currentGameState = {
      name: null,
      display: null
    };

    this.ws = new WebSocket('ws://localhost:9001/game/admin');
    // this.ws = new WebSocket('ws://localhost:8081/game/admin');
    // this.ws = new WebSocket('ws://game-server-demo.apps.demo.aws.paas.ninja/game/admin');
    this.ws.onopen = event => {
      console.log(event);

      let message = {
        type: 'register'
      };

      this.ws.send(JSON.stringify(message));
    };

    this.ws.onmessage = event => {
      let message = JSON.parse(event.data);

      if (message.type === 'state') {
        this.gameStates.forEach(gameState => {
          if (message.state === gameState.name) {
            this.currentGameState = gameState;
          }
        });

        if (message.state === 'play') {
          this.isPaused = false;
          this.isPlaying = true;
        }

        if (message.state === 'pause') {
          this.isPaused = true;
          this.isPlaying = false;
        }
      }

      if (message.type === 'selfie-state') {
        this.currentSelfieState = message.state;
      }

      if (message.type === 'configuration') {
        this.configuration = message.configuration;

        setTimeout(() => {
          componentHandler.upgradeDom();
        }, 0);
      }
    }
  }

  ngAfterViewInit() {
    componentHandler.upgradeDom();
  }

  updateOpacity(evt) {
    this.configuration.opacity = evt.target.value;
    this.publishConfigurationChange();
  }

  updateScale(evt) {
    this.configuration.scale = evt.target.value;
    this.publishConfigurationChange();
  }

  updateBackground(evt) {
    this.configuration.background = evt.target.value;
    this.publishConfigurationChange();
  }

  updateSpeed(evt) {
    this.configuration.speed = evt.target.value;
    this.publishConfigurationChange();
  }

  updatePoints() {
    setTimeout(() => {
      this.publishConfigurationChange();
    }, 0);
  }

  updateGoldenSnitch(evt) {
    this.configuration.goldenSnitch = evt.target.checked;
    this.publishConfigurationChange();
  }

  changeState(state) {
    if (state !== 'pause') {
      this.isPaused = false;
    }

    if (state === 'play') {
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
    }

    if (state === 'pause' && !this.isPaused) {
      this.isPaused = true;
    } else if (state === 'pause' && this.isPaused) {
      this.isPaused = false;
      this.isPlaying = true;
      state = 'play';
    }

    this.currentGameState = state;

    const message = {
      type: 'state-change',
      state: state
    };

    this.ws.send(JSON.stringify(message));
  }

  changeSelfieState(state) {
    const message = {
      type: 'selfie-state-change',
      state: state.name
    };

    this.ws.send(JSON.stringify(message));
  }

  publishConfigurationChange() {
    const message = {
      type: 'configuration',
      configuration: this.configuration
    };

    this.ws.send(JSON.stringify(message));
  }
}
