import { Component, OnInit } from 'angular2/core';

@Component({
    template: `<div style="position: absolute; z-index: 1; color: white; right: 0;">
                   <p>Team Score: {{teamScore}}</p>
                   <p>Your Score: {{score}}</p>
               </div>
               <div id="game"></div>`
})

export class GameComponent implements OnInit {
    game;
    score = 0;
    teamScore = 0;
    ws;

    constructor() {
        this.ws = new WebSocket('ws://localhost:8000/');
        this.ws.onopen = event => {
            console.log(event);
        };

        this.ws.onmessage = event => {
            let data = JSON.parse(event.data);

            if (data.message === 'team-score') {
                this.teamScore = data.score;
            }

            if (data.message === 'configuration') {
                if (this.game.stage && data.configuration.backgroundColor) {
                    this.game.stage.backgroundColor = data.configuration.backgroundColor;
                }
            }
        };
    }

    ngOnInit() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game');
        let goodObjects = null;
        let explosions = null;
        let fireRate = 100;
        let nextFire = 0;

        let TitleState = {
            update: () => {
                let text = this.game.add.text(Math.floor(this.game.world.width / 2), Math.floor(this.game.world.height / 2), 'Tap to Start', {
                    font: '25px Arial',
                    align: 'center',
                    fill: '#fff'
                });

                text.anchor.setTo(0.5);

                this.game.input.onTap.add(() => {
                    this.game.state.start('Ninja')
                });
            }
        };

        let PlayState = {
            preload: () => {
                this.game.load.image('ball', './app/game/assets/ball.png');
                this.game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
            },
            create: () => {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.setScreenSize = true;
                this.game.scale.minWidth = 320;
                this.game.scale.minHeight = 480;
                this.game.scale.forceOrientation(false, true);

                this.game.world.setBounds(0, 0, this.game.world.width, this.game.world.height);
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.game.physics.arcade.gravity.y = 300;

                PlayState.updateNextEvent();
            },
            generateBall: () => {
                let ball = this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.width), 0, 'ball');
                ball.scale.setTo(0.4);
                ball.anchor.setTo(0.5);

                ball.inputEnabled = true;
                ball.checkWorldBounds = true;
                ball.events.onOutOfBounds.add(PlayState.ballOut, this);
                ball.events.onInputDown.add(PlayState.handleTap, this);

                this.game.physics.enable(ball, Phaser.Physics.ARCADE);
                ball.body.velocity.setTo(0, 200);
            },
            ballOut: ball => {
                ball.kill();
            },
            handleTap: ball => {
                ball.kill();

                let explosion = this.game.add.sprite(ball.body.x, ball.body.y, 'explosion');
                explosion.anchor.set(0.25);
                explosion.animations.add('explode');
                explosion.animations.play('explode', 30, false, true);
            },
            update: () => {
                if (this.game.time.now > this.game.nextEvent) {
                    PlayState.updateNextEvent();
                    PlayState.generateBall();
                }
            },
            updateNextEvent: () => {
                this.game.nextEvent = this.game.time.now + this.game.rnd.realInRange(0.5, 1) * Phaser.Timer.SECOND;
            }
        };

        let NinjaState = {
            preload: () => {
                this.game.time.advancedTiming = true;
                this.game.load.image('ball', './app/game/assets/ball.png');
                this.game.load.image('fruit', './app/game/assets/fruit.png');
                this.game.load.atlas('kitten', './app/game/assets/kitten-sprite.png', './app/game/assets/kitten-sprite.json');
                this.game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
            },
            create: () => {
                this.game.physics.arcade.gravity.y = 300;
                goodObjects = NinjaState.createGroup(4, 'ball');
                // goodObjects = NinjaState.createGroup(4, 'fruit');

                explosions = this.game.add.group();
                explosions.createMultiple(4, 'explosion');
                explosions.children.forEach(explosion => {
                    explosion.anchor.set(-0.125);
                    // for kittens and fruit
                    // explosion.anchor.set(0.5);
                    explosion.animations.add('explode');
                });

                NinjaState.throwObject();
            },
            update: () => {
                NinjaState.throwObject();
            },
            render: () => {
                this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
            },
            createGroup: (numItems, sprite) => {
                let group = this.game.add.group();
                group.enableBody = true;
                group.physicsBodyType = Phaser.Physics.ARCADE;
                group.createMultiple(numItems, sprite);
                // group.createMultiple(numItems, 'kitten');
                group.setAll('checkWorldBounds', true);
                group.setAll('outOfBoundsKill', true);

                group.children.forEach(obj => {
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
                    obj.events.onInputDown.add(() => {
                        obj.kill();

                        this.score += 1;

                        var explosion = explosions.getFirstExists(false);
                        explosion.reset(obj.body.x, obj.body.y);
                        explosion.play('explode', 30, false, true);

                        this.ws.send(JSON.stringify({
                            message: 'score'
                        }));
                    });
                });

                return group;
            },
            throwObject: () => {
                if (this.game.time.now > nextFire && goodObjects.countDead() > 0) {
                    if (goodObjects.countDead() > 0) {
                        nextFire = this.game.time.now + fireRate;
                        NinjaState.throwGoodObject();
                    }
                }
            },
            throwGoodObject: () => {
                var obj = goodObjects.getFirstDead();

                obj.reset(this.game.world.centerX + Math.random() * 100 - Math.random() * 100, this.game.world.height);
                this.game.physics.arcade.moveToXY(obj, this.game.world.centerX, this.game.world.centerY, (this.game.world.height + 56 - 568) * 0.5 + 450);
            }
        };

        this.game.state.add('Play', PlayState);
        this.game.state.add('Title', TitleState);
        this.game.state.add('Ninja', NinjaState);
        this.game.state.start('Title');
    }
}
