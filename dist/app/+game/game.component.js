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
var GameComponent = (function () {
    function GameComponent() {
        var _this = this;
        this.score = 0;
        this.teamScore = 0;
        this.ws = new WebSocket('ws://localhost:8081/game');
        this.currentState = 'title';
        this.ws.onopen = function (event) {
            console.log(event);
        };
        this.ws.onclose = function (event) {
            console.log('web socket closed', event);
        };
        this.ws.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if (data.type === 'state') {
                _this.currentState = data.state;
                switch (_this.currentState) {
                    case 'title':
                        _this.game.state.start('Title');
                        break;
                    case 'play':
                        _this.game.state.start('Play');
                        break;
                    case 'pause':
                        _this.game.paused = !_this.game.paused;
                        break;
                    case 'game-over':
                        _this.game.state.start('GameOver');
                        break;
                }
            }
            if (data.type === 'team-score') {
                _this.teamScore = data.score;
            }
            if (data.type === 'configuration') {
                localStorage.setItem('player-id', data.playerId);
                if (_this.game.stage && data.configuration.backgroundColor) {
                    _this.game.stage.backgroundColor = data.configuration.backgroundColor;
                }
            }
        };
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game', null, true);
        var fireRate = 100;
        var numBalloons = 4;
        var balloonRotationSpeed = 100;
        var balloons = null;
        var explosions = null;
        var nextFire = 0;
        var TitleState = {
            create: function () {
                _this.game.stage.disableVisibilityChange = true;
            }
        };
        var PlayState = {
            preload: function () {
                _this.game.load.atlas('balloons', './app/+game/assets/balloons.png', './app/+game/assets/balloons.json');
                _this.game.load.spritesheet('explosion', './app/+game/assets/explosion.png', 128, 128, 10);
            },
            create: function () {
                _this.game.physics.arcade.gravity.y = 300;
                balloons = _this.game.add.group();
                balloons.enableBody = true;
                balloons.physicsBodyType = Phaser.Physics.ARCADE;
                for (var i = 0; i < numBalloons; i += 1) {
                    balloons.create(0, 0, 'balloons', i, false);
                }
                balloons.setAll('checkWorldBounds', true);
                balloons.setAll('outOfBoundsKill', true);
                balloons.setAll('blendMode', Phaser.blendModes.OVERLAY);
                balloons.setAll('alpha', 0.85);
                balloons.children.forEach(function (balloon) {
                    balloon.scale.setTo(0.3);
                    balloon.anchor.setTo(0.5);
                    balloon.inputEnabled = true;
                    balloon.events.onInputDown.add(function () {
                        balloon.kill();
                        _this.score += 1;
                        var explosion = explosions.getFirstExists(false);
                        explosion.reset(balloon.body.x, balloon.body.y);
                        explosion.play('explode', 30, false, true);
                        _this.ws.send(JSON.stringify({
                            type: 'score'
                        }));
                    });
                });
                explosions = _this.game.add.group();
                explosions.createMultiple(4, 'explosion');
                explosions.children.forEach(function (explosion) {
                    explosion.anchor.set(-0.125);
                    explosion.animations.add('explode');
                });
                PlayState.throwObject();
            },
            update: function () {
                PlayState.throwObject();
            },
            throwObject: function () {
                if (_this.game.time.now > nextFire && balloons.countDead() > 0) {
                    if (balloons.countDead() > 0) {
                        nextFire = _this.game.time.now + fireRate;
                        PlayState.throwGoodObject();
                    }
                }
            },
            throwGoodObject: function () {
                var obj = balloons.getFirstDead();
                obj.reset(_this.game.world.centerX + _this.game.rnd.integerInRange(-75, 75), _this.game.world.height);
                obj.body.angularVelocity = (Math.random() - 0.5) * balloonRotationSpeed;
                _this.game.physics.arcade.moveToXY(obj, _this.game.world.centerX + _this.game.rnd.integerInRange(-50, 50), _this.game.world.centerY, (_this.game.world.height + 56 - 568) * 0.5 + 450);
            }
        };
        var GameOverState = {
            create: function () {
                console.log('GameOverState');
            }
        };
        this.game.state.add('Title', TitleState);
        this.game.state.add('Play', PlayState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.start('Title');
    };
    GameComponent.prototype.ngOnDestroy = function () {
        this.game.destroy();
    };
    GameComponent.prototype.nameLoaded = function (event) {
        event.target.classList.add('loaded');
        event.target.classList.remove('loading');
    };
    GameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-game',
            templateUrl: 'game.component.html',
            styleUrls: ['game.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map