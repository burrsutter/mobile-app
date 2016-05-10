import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css']
})

export class AdminComponent {
  ws;
  currentGameState;
  selfieStates = [
    {
      name: 'open',
      display: 'Open'
    },
    {
      name: 'close',
      display: 'Close'
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
      display: 'Play'
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
    this.ws = new WebSocket('ws://localhost:8081/game/admin');
    this.ws.onmessage = event => {
      let message = JSON.parse(event.data);

      if (message.type === 'state') {
        this.currentGameState = message.state;
      }
    }
  }

  changeState(state) {
    this.currentGameState = state.name;

    const message = {
      type: 'state-change',
      state: state.name
    };

    this.ws.send(JSON.stringify(message));
  }
}
