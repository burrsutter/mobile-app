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
  speed;
  goldenSnitch;
  goldenSnitchCreated = false;
  goldenSnitchChance = 0.1;
  background;
  balloons;
  explosions;
  pointsHash;

  constructor() {
    /*
     * stage device that receives blue, green and canary
     * if ?stage=true&latest=true
     *
     * stage devices
     * if ?stage=true
     */
    // this.ws = new WebSocket('ws://localhost:9001/game');
    this.ws = new WebSocket('ws://localhost:8081/game');
    // this.ws = new WebSocket('ws://game-server-demo.apps.demo.aws.paas.ninja/game');
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

        if (data.configuration.speed) {
          this.speed = parseInt(data.configuration.speed, 10);
        }

        if (data.configuration.background) {
          this.background = data.configuration.background;
        }

        if ('goldenSnitch' in data.configuration) {
          this.goldenSnitch = data.configuration.goldenSnitch;
        }

        if (data.configuration.points) {
          this.pointsHash = {
            'balloon_red': data.configuration.points.red,
            'balloon_blue': data.configuration.points.blue,
            'balloon_yellow': data.configuration.points.yellow,
            'balloon_green': data.configuration.points.green,
            'balloon_golden': data.configuration.points.goldenSnitch,
          }
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

        this.balloons.children.forEach(PlayState.setupBalloon);

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
      setupBalloon: balloon => {
        balloon.checkWorldBounds = true;
        balloon.outOfBoundsKill = true;
        balloon.scale.setTo(this.scale);
        balloon.anchor.setTo(0.5);
        balloon.inputEnabled = true;
        balloon.events.onOutOfBounds.add(() => {
          if (balloon.frameName === 'balloon_golden') {
            this.balloons.remove(balloon);
            this.goldenSnitchCreated = false;
          }
          consecutive = 0;
        });

        balloon.events.onInputDown.add(evt => {
          balloon.kill();

          if (balloon.frameName === 'balloon_golden') {
            this.balloons.remove(balloon);
            this.goldenSnitchCreated = false;
          }

          consecutive += 1;
          this.score += this.pointsHash[balloon.frameName];

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
        let obj;

        if (this.goldenSnitch && Math.random() < this.goldenSnitchChance && !this.goldenSnitchCreated) {
          obj = this.balloons.create(0, 0, 'balloons', 4, false);
          PlayState.setupBalloon(obj);
          this.goldenSnitchCreated = true;
        } else {
          obj = this.balloons.getFirstDead();
        }

        obj.reset(this.game.world.centerX + this.game.rnd.integerInRange(-75, 75), this.game.world.height);
        obj.body.angularVelocity = (Math.random() - 0.5) * balloonRotationSpeed;

        if (this.opacity) {
          obj.alpha = this.opacity / 100;
        }

        if (this.scale) {
          obj.scale.x = this.scale;
          obj.scale.y = this.scale;
        }

        const speed = (this.game.world.height + 56 - 568) * 0.5 + (450 + (this.speed - 50) * 5);

        this.game.physics.arcade.moveToXY(obj, this.game.world.centerX + this.game.rnd.integerInRange(-50, 50), this.game.world.centerY, speed);
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
