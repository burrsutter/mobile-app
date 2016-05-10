"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var AdminComponent = (function () {
    function AdminComponent() {
        var _this = this;
        this.selfieStates = [
            {
                name: 'open',
                display: 'Open'
            },
            {
                name: 'close',
                display: 'Close'
            }
        ];
        this.gameStates = [
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
        this.ws = new WebSocket('ws://localhost:8081/game/admin');
        this.ws.onmessage = function (event) {
            var message = JSON.parse(event.data);
            if (message.type === 'state') {
                _this.currentGameState = message.state;
            }
        };
    }
    AdminComponent.prototype.changeState = function (state) {
        this.currentGameState = state.name;
        var message = {
            type: 'state-change',
            state: state.name
        };
        this.ws.send(JSON.stringify(message));
    };
    AdminComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-admin',
            templateUrl: 'admin.component.html',
            styleUrls: ['admin.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], AdminComponent);
    return AdminComponent;
}());
exports.AdminComponent = AdminComponent;
//# sourceMappingURL=admin.component.js.map