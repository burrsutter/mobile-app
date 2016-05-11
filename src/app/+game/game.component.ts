import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

declare var Phaser: any;

@Component({
  moduleId: module.id,
  selector: 'app-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
  currentState;
  game;
  score = 0;
  teamScore = 0;
  ws;

  constructor() {
    this.ws = new WebSocket('ws://localhost:8081/game');
    this.currentState = 'title';

    this.ws.onopen = event => {
      console.log(event);
    };

    this.ws.onclose = event => {
      console.log('web socket closed', event);
    };

    this.ws.onmessage = event => {
      let data = JSON.parse(event.data);

      if (data.type === 'state') {
        this.currentState = data.state;

        switch (this.currentState) {
          case 'title':
            this.game.state.start('Title');
            break;

          case 'play':
            this.game.state.start('Play');
            break;

          case 'pause':
            this.game.paused = !this.game.paused;
            break;

          case 'game-over':
            this.game.state.start('GameOver');
            break;
        }
      }

      if (data.type === 'team-score') {
        this.teamScore = data.score;
      }

      if (data.type === 'configuration') {
        localStorage.setItem('player-id', data.playerId);

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
    const balloonRotationSpeed = 100;
    let balloons = null;
    let explosions = null;
    let nextFire = 0;

    let TitleState = {
      create: () => {
        this.game.stage.disableVisibilityChange = true;
      }
    };

    let PlayState = {
      preload: () => {
        this.game.load.atlas('balloons', './app/+game/assets/balloons.png', './app/+game/assets/balloons.json');
        this.game.load.spritesheet('explosion', './app/+game/assets/explosion.png', 128, 128, 10);
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
        balloons.setAll('blendMode', Phaser.blendModes.OVERLAY);
        balloons.setAll('alpha', 0.85);

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
              type: 'score'
            }));
          });
        });

        explosions = this.game.add.group();
        explosions.createMultiple(4, 'explosion');
        explosions.children.forEach(explosion => {
          explosion.anchor.set(-0.125);
          explosion.animations.add('explode');
        });

        PlayState.throwObject();
      },
      update: () => {
        PlayState.throwObject();
      },
      throwObject: () => {
        if (this.game.time.now > nextFire && balloons.countDead() > 0) {
          if (balloons.countDead() > 0) {
            nextFire = this.game.time.now + fireRate;
            PlayState.throwGoodObject();
          }
        }
      },
      throwGoodObject: () => {
        var obj = balloons.getFirstDead();
        obj.reset(this.game.world.centerX + this.game.rnd.integerInRange(-75, 75), this.game.world.height);
        obj.body.angularVelocity = (Math.random() - 0.5) * balloonRotationSpeed;
        this.game.physics.arcade.moveToXY(obj, this.game.world.centerX + this.game.rnd.integerInRange(-50, 50), this.game.world.centerY, (this.game.world.height + 56 - 568) * 0.5 + 450);
      }
    };

    let GameOverState = {
      create: () => {
        console.log('GameOverState');
      }
    };

    this.game.state.add('Title', TitleState);
    this.game.state.add('Play', PlayState);
    this.game.state.add('GameOver', GameOverState);
    this.game.state.start('Title');
  }

  ngOnDestroy() {
    this.game.destroy();
  }

  nameLoaded(event) {
    event.target.classList.add('loaded');
    event.target.classList.remove('loading');
  }
}
