import { Component, OnInit } from 'angular2/core';

@Component({
    template: `<div style="position: absolute; z-index: 1; color: white; right: 0;">{{score}}</div>
               <div id="game"></div>`
})

export class GameComponent implements OnInit {
    score = 0;

    ngOnInit() {
        let game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game');
        let goodObjects = null;
        let explosions = null;
        let fireRate = 100;
        let nextFire = 0;

        let TitleState = {
            update: () => {
                let text = game.add.text(Math.floor(game.world.width / 2), Math.floor(game.world.height / 2), 'Tap to Start', {
                    font: '25px Arial',
                    align: 'center',
                    fill: '#fff'
                });

                text.anchor.setTo(0.5);

                game.input.onTap.add(() => {
                    game.state.start('Ninja')
                });
            }
        };

        let PlayState = {
            preload: () => {
                game.load.image('ball', './app/game/assets/ball.png');
                game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
            },
            create: () => {
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
            generateBall: () => {
                let ball = game.add.sprite(game.rnd.integerInRange(0, game.width), 0, 'ball');
                ball.scale.setTo(0.4);
                ball.anchor.setTo(0.5);

                ball.inputEnabled = true;
                ball.checkWorldBounds = true;
                ball.events.onOutOfBounds.add(PlayState.ballOut, this);
                ball.events.onInputDown.add(PlayState.handleTap, this);

                game.physics.enable(ball, Phaser.Physics.ARCADE);
                ball.body.velocity.setTo(0, 200);
            },
            ballOut: ball => {
                ball.kill();
            },
            handleTap: ball => {
                ball.kill();

                let explosion = game.add.sprite(ball.body.x, ball.body.y, 'explosion');
                explosion.anchor.set(0.25);
                explosion.animations.add('explode');
                explosion.animations.play('explode', 30, false, true);
            },
            update: () => {
                if (game.time.now > game.nextEvent) {
                    PlayState.updateNextEvent();
                    PlayState.generateBall();
                }
            },
            updateNextEvent: () => {
                game.nextEvent = game.time.now + game.rnd.realInRange(0.5, 1) * Phaser.Timer.SECOND;
            }
        };

        let NinjaState = {
            preload: () => {
                game.time.advancedTiming = true;
                game.load.image('ball', './app/game/assets/ball.png');
                game.load.spritesheet('explosion', './app/game/assets/explosion.png', 128, 128, 10);
            },
            create: () => {
                game.physics.arcade.gravity.y = 300;
                goodObjects = NinjaState.createGroup(4, 'ball');

                explosions = game.add.group();
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
            render: () => {
                game.debug.text(game.time.fps, 2, 14, "#00ff00");
            },
            createGroup: (numItems, sprite) => {
                let group = game.add.group();
                group.enableBody = true;
                group.physicsBodyType = Phaser.Physics.ARCADE;
                group.createMultiple(numItems, sprite);
                group.setAll('checkWorldBounds', true);
                group.setAll('outOfBoundsKill', true);

                group.children.forEach(obj => {
                    obj.anchor.setTo(0.5);
                    obj.scale.setTo(0.3);
                    obj.inputEnabled = true;
                    obj.events.onInputDown.add(() => {
                        obj.kill();

                        this.score += 1;

                        var explosion = explosions.getFirstExists(false);
                        explosion.reset(obj.body.x, obj.body.y);
                        explosion.play('explode', 30, false, true);
                    });
                });

                return group;
            },
            throwObject: () => {
                if (game.time.now > nextFire && goodObjects.countDead() > 0) {
                    if (goodObjects.countDead() > 0) {
                        nextFire = game.time.now + fireRate;
                        NinjaState.throwGoodObject();
                    }
                }
            },
            throwGoodObject: () => {
                var obj = goodObjects.getFirstDead();
                obj.reset(game.world.centerX + Math.random() * 100 - Math.random() * 100, game.world.height);
                game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, (game.world.height + 56 - 568) * 0.5 + 450);
            }
        };

        game.state.add('Play', PlayState);
        game.state.add('Title', TitleState);
        game.state.add('Ninja', NinjaState);
        game.state.start('Title');
    }
}
