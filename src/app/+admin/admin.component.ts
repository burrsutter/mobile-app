import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { GameService } from '../+game/service/game.service';
import { environment } from '../environment'

declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css']
})

export class AdminComponent implements AfterViewInit {
  private _reconnectInterval: number = 5000;
  ws;
  currentSelfieState;
  currentGameState;
  configuration: any = null;
  opacity: number = 85;
  size: number = 0.3;
  isPaused: boolean = false;
  isPlaying: boolean = false;
  socketUrl: string = (environment.production) ? 'wss://gamebus-production.apps-test.redhatkeynote.com/game/admin' : 'ws://localhost:9001/game/admin';
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

  constructor(private gameService: GameService, private elementRef: ElementRef) {
    this.currentGameState = {
      name: null,
      display: null
    };

    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.socketUrl);
    // this.ws = new WebSocket('ws://localhost:8081/game/admin');
    // this.ws = new WebSocket('ws://game-server-demo.apps.demo.aws.paas.ninja/game/admin');

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  onOpen(evt) {
    let message = {
      type: 'register'
    };

    this.ws.send(JSON.stringify(message));
  }

  onClose(evt) {
    let intervalHandler = () => {
      if (this.ws.readyState === WebSocket.CLOSED) {
        this.connect();
        return;
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        clearInterval(interval);
      }
    }

    intervalHandler = intervalHandler.bind(this);
    const interval = setInterval(intervalHandler, this._reconnectInterval);
  }

  onMessage(evt) {
    let message = JSON.parse(evt.data);

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

      const data = {
        message: 'Game Configuration Updated!'
      };

      this.elementRef.nativeElement.querySelector('#toast')
        .MaterialSnackbar.showSnackbar(data);
    }
  }

  ngAfterViewInit() {
    componentHandler.upgradeDom();
  }

  updateOpacity(evt) {
    this.configuration.opacity = evt.target.value;
  }

  updateScale(evt) {
    this.configuration.scale = evt.target.value;
  }

  updateBackground(evt) {
    this.configuration.background = evt.target.value;
  }

  updateSpeed(evt) {
    this.configuration.speed = evt.target.value;
  }

  updatePoints() {}

  updateGoldenSnitch(evt) {
    this.configuration.goldenSnitch = evt.target.checked;
  }

  updateCanary(evt) {
    this.gameService.setCanary(evt.target.checked);
  }

  updateDemo(evt) {
    this.gameService.setDemoDevice(evt.target.checked);
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

  clearLocalStorage() {
    localStorage.clear();
  }
}
