System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var GameComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GameComponent = (function () {
                function GameComponent() {
                    var _this = this;
                    this.score = 0;
                    this.teamScore = 0;
                    this.ws = new WebSocket('ws://localhost:8000/');
                    this.ws.onopen = function (event) {
                        console.log(event);
                    };
                    this.ws.onmessage = function (event) {
                        var data = JSON.parse(event.data);
                        if (data.message === 'team-score') {
                            _this.teamScore = data.score;
                        }
                        if (data.message === 'configuration') {
                            if (_this.game.stage && data.configuration.backgroundColor) {
                                _this.game.stage.backgroundColor = data.configuration.backgroundColor;
                            }
                        }
                    };
                }
                GameComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game');
                    var goodObjects = null;
                    var explosions = null;
                    var fireRate = 100;
                    var nextFire = 0;
                    var TitleState = {
                        update: function () {
                            var text = _this.game.add.text(Math.floor(_this.game.world.width / 2), Math.floor(_this.game.world.height / 2), 'Tap to Start', {
                                font: '25px Arial',
                                align: 'center',
                                fill: '#fff'
                            });
                            text.anchor.setTo(0.5);
                            _this.game.input.onTap.add(function () {
                                _this.game.state.start('Ninja');
                            });
                        }
                    };
                    var PlayState = {
                        preload: function () {
                            _this.game.load.image('ball', './app/game/assets/ball.png');
                            _this.game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
                        },
                        create: function () {
                            _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                            _this.game.scale.pageAlignHorizontally = true;
                            _this.game.scale.pageAlignVertically = true;
                            _this.game.scale.setScreenSize = true;
                            _this.game.scale.minWidth = 320;
                            _this.game.scale.minHeight = 480;
                            _this.game.scale.forceOrientation(false, true);
                            _this.game.world.setBounds(0, 0, _this.game.world.width, _this.game.world.height);
                            _this.game.physics.startSystem(Phaser.Physics.ARCADE);
                            _this.game.physics.arcade.gravity.y = 300;
                            PlayState.updateNextEvent();
                        },
                        generateBall: function () {
                            var ball = _this.game.add.sprite(_this.game.rnd.integerInRange(0, _this.game.width), 0, 'ball');
                            ball.scale.setTo(0.4);
                            ball.anchor.setTo(0.5);
                            ball.inputEnabled = true;
                            ball.checkWorldBounds = true;
                            ball.events.onOutOfBounds.add(PlayState.ballOut, _this);
                            ball.events.onInputDown.add(PlayState.handleTap, _this);
                            _this.game.physics.enable(ball, Phaser.Physics.ARCADE);
                            ball.body.velocity.setTo(0, 200);
                        },
                        ballOut: function (ball) {
                            ball.kill();
                        },
                        handleTap: function (ball) {
                            ball.kill();
                            var explosion = _this.game.add.sprite(ball.body.x, ball.body.y, 'explosion');
                            explosion.anchor.set(0.25);
                            explosion.animations.add('explode');
                            explosion.animations.play('explode', 30, false, true);
                        },
                        update: function () {
                            if (_this.game.time.now > _this.game.nextEvent) {
                                PlayState.updateNextEvent();
                                PlayState.generateBall();
                            }
                        },
                        updateNextEvent: function () {
                            _this.game.nextEvent = _this.game.time.now + _this.game.rnd.realInRange(0.5, 1) * Phaser.Timer.SECOND;
                        }
                    };
                    var NinjaState = {
                        preload: function () {
                            _this.game.time.advancedTiming = true;
                            _this.game.load.image('ball', './app/game/assets/ball.png');
                            _this.game.load.image('fruit', './app/game/assets/fruit.png');
                            _this.game.load.atlas('kitten', './app/game/assets/kitten-sprite.png', './app/game/assets/kitten-sprite.json');
                            _this.game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
                        },
                        create: function () {
                            _this.game.physics.arcade.gravity.y = 300;
                            goodObjects = NinjaState.createGroup(4, 'ball');
                            // goodObjects = NinjaState.createGroup(4, 'fruit');
                            explosions = _this.game.add.group();
                            explosions.createMultiple(4, 'explosion');
                            explosions.children.forEach(function (explosion) {
                                explosion.anchor.set(-0.125);
                                // for kittens and fruit
                                // explosion.anchor.set(0.5);
                                explosion.animations.add('explode');
                            });
                            NinjaState.throwObject();
                        },
                        update: function () {
                            NinjaState.throwObject();
                        },
                        render: function () {
                            _this.game.debug.text(_this.game.time.fps, 2, 14, "#00ff00");
                        },
                        createGroup: function (numItems, sprite) {
                            var group = _this.game.add.group();
                            group.enableBody = true;
                            group.physicsBodyType = Phaser.Physics.ARCADE;
                            group.createMultiple(numItems, sprite);
                            // group.createMultiple(numItems, 'kitten');
                            group.setAll('checkWorldBounds', true);
                            group.setAll('outOfBoundsKill', true);
                            group.children.forEach(function (obj) {
                                // kittens
                                // obj.animations.add('forward', Phaser.Animation.generateFrameNames('cat_right', 0, 2, '', 1), 7, true);
                                // obj.animations.play('forward');
                                // obj.scale.setTo(1.5);
                                // fruit
                                // obj.scale.setTo(1.3);
                                // basketballs
                                obj.scale.setTo(0.3);
                                obj.anchor.setTo(0.5);
                                obj.inputEnabled = true;
                                obj.events.onInputDown.add(function () {
                                    obj.kill();
                                    _this.score += 1;
                                    var explosion = explosions.getFirstExists(false);
                                    explosion.reset(obj.body.x, obj.body.y);
                                    explosion.play('explode', 30, false, true);
                                    _this.ws.send(JSON.stringify({
                                        message: 'score'
                                    }));
                                });
                            });
                            return group;
                        },
                        throwObject: function () {
                            if (_this.game.time.now > nextFire && goodObjects.countDead() > 0) {
                                if (goodObjects.countDead() > 0) {
                                    nextFire = _this.game.time.now + fireRate;
                                    NinjaState.throwGoodObject();
                                }
                            }
                        },
                        throwGoodObject: function () {
                            var obj = goodObjects.getFirstDead();
                            obj.reset(game.world.centerX + Math.random() * 100 - Math.random() * 100, game.world.height);
                            game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, (game.world.height + 56 - 568) * 0.5 + 450);
                        }
                    };
                    this.game.state.add('Play', PlayState);
                    this.game.state.add('Title', TitleState);
                    this.game.state.add('Ninja', NinjaState);
                    this.game.state.start('Title');
                };
                GameComponent = __decorate([
                    core_1.Component({
                        template: "<div style=\"position: absolute; z-index: 1; color: white; right: 0;\">\n                   <p>Team Score: {{teamScore}}</p>\n                   <p>Your Score: {{score}}</p>\n               </div>\n               <div id=\"game\"></div>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], GameComponent);
                return GameComponent;
            }());
            exports_1("GameComponent", GameComponent);
        }
    }
});
//# sourceMappingURL=game.component.js.map