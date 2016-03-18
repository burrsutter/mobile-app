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
                    this.score = 0;
                }
                GameComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game');
                    var goodObjects = null;
                    var explosions = null;
                    var fireRate = 100;
                    var nextFire = 0;
                    var TitleState = {
                        update: function () {
                            var text = game.add.text(Math.floor(game.world.width / 2), Math.floor(game.world.height / 2), 'Tap to Start', {
                                font: '25px Arial',
                                align: 'center',
                                fill: '#fff'
                            });
                            text.anchor.setTo(0.5);
                            game.input.onTap.add(function () {
                                game.state.start('Ninja');
                            });
                        }
                    };
                    var PlayState = {
                        preload: function () {
                            game.load.image('ball', './app/game/assets/ball.png');
                            game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
                        },
                        create: function () {
                            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                            game.scale.pageAlignHorizontally = true;
                            game.scale.pageAlignVertically = true;
                            game.scale.setScreenSize = true;
                            game.scale.minWidth = 320;
                            game.scale.minHeight = 480;
                            game.scale.forceOrientation(false, true);
                            game.world.setBounds(0, 0, game.world.width, game.world.height);
                            game.physics.startSystem(Phaser.Physics.ARCADE);
                            game.physics.arcade.gravity.y = 300;
                            PlayState.updateNextEvent();
                        },
                        generateBall: function () {
                            var ball = game.add.sprite(game.rnd.integerInRange(0, game.width), 0, 'ball');
                            ball.scale.setTo(0.4);
                            ball.anchor.setTo(0.5);
                            ball.inputEnabled = true;
                            ball.checkWorldBounds = true;
                            ball.events.onOutOfBounds.add(PlayState.ballOut, _this);
                            ball.events.onInputDown.add(PlayState.handleTap, _this);
                            game.physics.enable(ball, Phaser.Physics.ARCADE);
                            ball.body.velocity.setTo(0, 200);
                        },
                        ballOut: function (ball) {
                            ball.kill();
                        },
                        handleTap: function (ball) {
                            ball.kill();
                            var explosion = game.add.sprite(ball.body.x, ball.body.y, 'explosion');
                            explosion.anchor.set(0.25);
                            explosion.animations.add('explode');
                            explosion.animations.play('explode', 30, false, true);
                        },
                        update: function () {
                            if (game.time.now > game.nextEvent) {
                                PlayState.updateNextEvent();
                                PlayState.generateBall();
                            }
                        },
                        updateNextEvent: function () {
                            game.nextEvent = game.time.now + game.rnd.realInRange(0.5, 1) * Phaser.Timer.SECOND;
                        }
                    };
                    var NinjaState = {
                        preload: function () {
                            game.time.advancedTiming = true;
                            game.load.image('ball', './app/game/assets/ball.png');
                            game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
                        },
                        create: function () {
                            game.physics.arcade.gravity.y = 300;
                            goodObjects = NinjaState.createGroup(4, 'ball');
                            explosions = game.add.group();
                            explosions.createMultiple(4, 'explosion');
                            explosions.children.forEach(function (explosion) {
                                explosion.anchor.set(-0.125);
                                explosion.animations.add('explode');
                            });
                            NinjaState.throwObject();
                        },
                        update: function () {
                            NinjaState.throwObject();
                        },
                        render: function () {
                            game.debug.text(game.time.fps, 2, 14, "#00ff00");
                        },
                        createGroup: function (numItems, sprite) {
                            var group = game.add.group();
                            group.enableBody = true;
                            group.physicsBodyType = Phaser.Physics.ARCADE;
                            group.createMultiple(numItems, sprite);
                            group.setAll('checkWorldBounds', true);
                            group.setAll('outOfBoundsKill', true);
                            group.children.forEach(function (obj) {
                                obj.anchor.setTo(0.5);
                                obj.scale.setTo(0.3);
                                obj.inputEnabled = true;
                                obj.events.onInputDown.add(function () {
                                    obj.kill();
                                    _this.score += 1;
                                    var explosion = explosions.getFirstExists(false);
                                    explosion.reset(obj.body.x, obj.body.y);
                                    explosion.play('explode', 30, false, true);
                                });
                            });
                            return group;
                        },
                        throwObject: function () {
                            if (game.time.now > nextFire && goodObjects.countDead() > 0) {
                                if (goodObjects.countDead() > 0) {
                                    nextFire = game.time.now + fireRate;
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
                    game.state.add('Play', PlayState);
                    game.state.add('Title', TitleState);
                    game.state.add('Ninja', NinjaState);
                    game.state.start('Title');
                };
                GameComponent = __decorate([
                    core_1.Component({
                        template: "<div style=\"position: absolute; z-index: 1; color: white; right: 0;\">{{score}}</div>\n               <div id=\"game\"></div>"
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