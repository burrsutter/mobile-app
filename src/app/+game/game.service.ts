import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class GameService {
  private _usernameKey: string = 'username';
  private _playerIdKey: string = 'player-id';
  private _playerScoreKey: string = 'player-score';
  private _playerTeamKey: string = 'player-team';

  ws: any;
  currentState: string = 'title';
  teamScore: number = 0;
  playerUsername: string = localStorage.getItem(this._usernameKey);
  playerScore: number = parseInt(localStorage.getItem(this._playerScoreKey), 10) || 0;
  playerId: string = localStorage.getItem(this._playerIdKey);
  playerTeam: string = localStorage.getItem(this._playerTeamKey);
  configuration: Object = {};

  @Output() stateChange = new EventEmitter();
  @Output() configurationChange = new EventEmitter();

  constructor() {
    this.ws = new WebSocket('ws://localhost:9001/game');
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
  }

  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }

  private onOpen(evt) {
    const message = {
      type: 'register'
    };

    if (this.playerId) {
      message['id'] = this.playerId;
    }

    if (this.playerTeam) {
      message['team'] = this.playerTeam;
    }

    if (this.playerUsername) {
      message['username'] = this.playerUsername;
    }

    this.ws.send(JSON.stringify(message));
  }

  private onClose(evt) {
    console.log('web socket closed', evt);
  }

  private onMessage(evt) {
    const data = JSON.parse(evt.data);

    if (data.type === 'state') {
      this.currentState = data.state;
      this.stateChange.emit({
        state: this.currentState
      });

      return;
    }

    if (data.type === 'team-score') {
      this.teamScore = data.score;
      return;
    }

    if (data.type === 'id') {
      localStorage.setItem(this._playerIdKey, data.id);
    }

    if (data.type === 'configuration') {
      if (data.username) {
        localStorage.setItem(this._usernameKey, data.username);
        this.playerUsername = data.username;
      }

      if (data.team) {
        localStorage.setItem(this._playerTeamKey, data.team);
        this.playerTeam = data.team;
      }

      this.configuration = data.configuration;

      this.configurationChange.emit({
        configuration: this.configuration
      });
    }
  }

}
