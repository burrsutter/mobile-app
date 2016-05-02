import { Component, OnInit, OnDestroy } from 'angular2/core';

declare var Phaser: any;

@Component({
    template: `
<!--
TODO kyle the options are:
team-teal
team-green
team-violet
team-orange
AND
build-green
build-blue
build-canary
-->

        <ul class="game-score team-teal build-canary">
          <li>Build <span>Canary</span></li>
          <li>
            <span>
              <strong>1st place</strong>
              Teal Team
            </span>
            {{teamScore}}
          </li>
          <li><span>You</span>{{score}}</li>
        </ul>
        <div id="game" class="game"></div>
    `
})

export class GameComponent implements OnInit, OnDestroy {
    game;
    score = 0;
    teamScore = 0;
    ws;

    constructor() {
        this.ws = new WebSocket('ws://localhost:8081/game');
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
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game', null, true);
        const fireRate = 100;
        const numBalloons = 4;
        let balloons = null;
        let explosions = null;
        let nextFire = 0;

        let TitleState = {
            preload: () => {
                this.game.load.image('btn-start', './app/game/assets/btn-start.png');
            },
            create: () => {
                let btnStart = this.game.add.sprite(Math.floor(this.game.world.width / 2), Math.floor(this.game.world.height / 2), 'btn-start');
                btnStart.anchor.setTo(0.5);
                btnStart.scale.setTo(0.5);
                btnStart.inputEnabled = true;
                btnStart.events.onInputDown.add(() => {
                    this.game.state.start('Ninja');
                });
            }
        };

        let NinjaState = {
            preload: () => {
                this.game.load.atlas('balloons', './app/game/assets/balloons.png', './app/game/assets/balloons.json');
                this.game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
            },
            create: () => {
                this.game.physics.arcade.gravity.y = 300;

                balloons = this.game.add.group();
                balloons.enableBody = true;
                balloons.physicsBodyType = Phaser.Physics.ARCADE;
                for (var i = 0; i < numBalloons; i += 1) {
                    balloons.create(0, 0, 'balloons', i, false);
                }

                balloons.setAll('checkWorldBounds', true);
                balloons.setAll('outOfBoundsKill', true);

                balloons.children.forEach(balloon => {
                    balloon.scale.setTo(0.3);
                    balloon.anchor.setTo(0.5);
                    balloon.inputEnabled = true;
                    balloon.events.onInputDown.add(() => {
                        balloon.kill();

                        this.score += 1;

                        var explosion = explosions.getFirstExists(false);
                        explosion.reset(balloon.body.x, balloon.body.y);
                        explosion.play('explode', 30, false, true);

                        this.ws.send(JSON.stringify({
                            message: 'score'
                        }));
                    });
                });

                explosions = this.game.add.group();
                explosions.createMultiple(4, 'explosion');
                explosions.children.forEach(explosion => {
                    explosion.anchor.set(-0.125);
                    explosion.animations.add('explode');
                });

                NinjaState.throwObject();
            },
            update: () => {
                NinjaState.throwObject();
            },
            throwObject: () => {
                if (this.game.time.now > nextFire && balloons.countDead() > 0) {
                    if (balloons.countDead() > 0) {
                        nextFire = this.game.time.now + fireRate;
                        NinjaState.throwGoodObject();
                    }
                }
            },
            throwGoodObject: () => {
                var obj = balloons.getFirstDead();
                obj.reset(this.game.world.centerX + this.game.rnd.integerInRange(-75, 75), this.game.world.height);
                this.game.physics.arcade.moveToXY(obj, this.game.world.centerX + this.game.rnd.integerInRange(-50, 50), this.game.world.centerY, (this.game.world.height + 56 - 568) * 0.5 + 450);
            }
        };

        this.game.state.add('Title', TitleState);
        this.game.state.add('Ninja', NinjaState);
        this.game.state.start('Title');
    }

    ngOnDestroy () {
        console.log('on destroy');
        this.game.destroy();
    }
}
