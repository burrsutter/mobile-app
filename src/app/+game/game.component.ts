import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AchievementComponent } from './achievement/achievement.component';

declare var Phaser: any;

@Component({
  moduleId: module.id,
  selector: 'app-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css'],
  directives: [AchievementComponent]
})

export class GameComponent implements OnInit, OnDestroy {
  currentState;
  game;
  score = 0;
  teamScore = 0;
  ws;
  achievements = [];
  username;
  opacity;
  scale;
  background;
  balloons;
  explosions;

  constructor() {
    // this.ws = new WebSocket('ws://localhost:9001/game');
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
            this.game.paused = false;
            break;

          case 'play':
            this.game.state.start('Play');
            this.game.paused = false;
            break;

          case 'pause':
            this.game.paused = !this.game.paused;
            break;

          case 'game-over':
            this.game.state.start('GameOver');
            this.game.paused = false;
            break;
        }
      }

      if (data.type === 'team-score') {
        this.teamScore = data.score;
      }

      if (data.type === 'configuration') {
        localStorage.setItem('player-id', data.playerId);
        localStorage.setItem('username', data.username);

        if (data.username) {
          this.username = data.username;
        }

        if (data.configuration.opacity) {
          this.opacity = parseInt(data.configuration.opacity, 10);
        }

        if (data.configuration.scale) {
          this.scale = parseFloat(data.configuration.scale);
        }

        if (data.configuration.background) {
          this.background = data.configuration.background;
        }
      }
    };

    this.ws.onmessage = this.ws.onmessage.bind(this);
  }

  ngOnInit() {
    this.game = new Phaser.Game(window.innerWidth, window.innerHeight - 56, Phaser.AUTO, 'game', null, true);

    const fireRate = 100;
    const numBalloons = 4;
    const balloonRotationSpeed = 100;
    let nextFire = 0;
    let consecutive = 0;

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
        this.game.stage.disableVisibilityChange = true;
        this.game.physics.arcade.gravity.y = 300;

        this.balloons = this.game.add.group();
        this.balloons.enableBody = true;
        this.balloons.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < numBalloons; i += 1) {
          this.balloons.create(0, 0, 'balloons', i, false);
        }

        this.balloons.setAll('checkWorldBounds', true);
        this.balloons.setAll('outOfBoundsKill', true);
        this.balloons.setAll('blendMode', Phaser.blendModes.OVERLAY);
        this.balloons.setAll('alpha', this.opacity);

        this.balloons.children.forEach(balloon => {
          balloon.scale.setTo(this.scale);
          balloon.anchor.setTo(0.5);
          balloon.inputEnabled = true;
          balloon.events.onOutOfBounds.add(() => {
            consecutive = 0;
          });

          balloon.events.onInputDown.add(evt => {
            balloon.kill();

            consecutive += 1;
            this.score += 1;

            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(evt.world.x, evt.world.y);
            explosion.play('explode', 30, false, true);

            this.ws.send(JSON.stringify({
              type: 'score',
              score: this.score,
              consecutive: consecutive
            }));

            // purely for demo purposes
            if (consecutive % 5 === 0) {
              this.achievements = [{
                type: 'consecutive',
                message: `Nice job! ${consecutive} pops in a row!`
              }];
            }
          });
        });

        this.explosions = this.game.add.group();
        this.explosions.createMultiple(4, 'explosion');
        this.explosions.children.forEach(explosion => {
          explosion.anchor.set(0.5);
          explosion.animations.add('explode');
        });

        PlayState.throwObject();
      },
      update: () => {
        PlayState.throwObject();
      },
      throwObject: () => {
        if (this.game.time.now > nextFire && this.balloons.countDead() > 0) {
          if (this.balloons.countDead() > 0) {
            nextFire = this.game.time.now + fireRate;
            PlayState.throwGoodObject();
          }
        }
      },
      throwGoodObject: () => {
        var obj = this.balloons.getFirstDead();

        obj.reset(this.game.world.centerX + this.game.rnd.integerInRange(-75, 75), this.game.world.height);
        obj.body.angularVelocity = (Math.random() - 0.5) * balloonRotationSpeed;

        if (this.opacity) {
          obj.alpha = this.opacity / 100;
        }

        if (this.scale) {
          obj.scale.x = this.scale;
          obj.scale.y = this.scale;
        }

        this.game.physics.arcade.moveToXY(obj, this.game.world.centerX + this.game.rnd.integerInRange(-50, 50), this.game.world.centerY, (this.game.world.height + 56 - 568) * 0.5 + 450);
      }
    };

    let GameOverState = {
      create: () => {}
    };

    this.game.state.add('Title', TitleState);
    this.game.state.add('Play', PlayState);
    this.game.state.add('GameOver', GameOverState);
    this.game.state.start('Title');

    PlayState.throwGoodObject = PlayState.throwGoodObject.bind(this);
  }

  ngOnDestroy() {
    this.game.destroy();
  }

  nameLoaded(event) {
    event.target.classList.add('loaded');
    event.target.classList.remove('loading');
  }
}
