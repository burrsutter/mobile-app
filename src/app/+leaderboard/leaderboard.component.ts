import { Component } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
  moduleId: module.id,
  selector: 'app-leaderboard',
  templateUrl: 'leaderboard.component.html',
  styleUrls: ['leaderboard.component.css']
})
export class LeaderboardComponent {
  error:Boolean = false;
  playerId:String;
  achievementsUrl:String = 'http://achievement-server-demo.apps.demo.aws.paas.ninja/api/achievement';
  achievements:any[];
  playerAchievements:any[];
  topScores:any[] = [
    {
      "name": "Kyle",
      "points": "100"
    },
    {
      "name": "Joshua",
      "points": "90"
    },
    {
      "name": "Andres",
      "points": "85"
    },
    {
      "name": "Michael",
      "points": "80"
    },
    {
      "name": "Brian",
      "points": "75"
    },
    {
      "name": "Sally",
      "points": "70"
    },
    {
      "name": "Mark",
      "points": "65"
    },
    {
      "name": "Funny Face",
      "points": "60"
    },
    {
      "name": "Bugs Bunny",
      "points": "55"
    },
    {
      "name": "Mega Man",
      "points": "50"
    },
    {
      "name": "Professor X",
      "points": "45"
    }
  ];

  constructor(private http:Http) {
    let promises = [];

    promises.push(this.getAchievements());

    this.playerId = localStorage.getItem('player-id');

    if (this.playerId) {
      promises.push(this.getPlayerAchievements(this.playerId));
    }

    Promise.all(promises)
      .then(responses => {
        /*
         * responses will either have 1 or 2 items in the array
         *
         * we'll get two responses if we have a player id in localstorage
         * when the page loads
         *
         * responses[0] will be all of the achievements
         * if there is a player id, responses[1] will be the player's achievements
         */
        this.achievements = responses[0];

        if (responses[1]) {
          this.playerAchievements = responses[1];
          this.achievements.forEach(achievement => {
            this.playerAchievements.forEach(playerAchievement => {
              if (achievement.achievementType === playerAchievement.achievementType) {
                achievement.achieved = playerAchievement.achieved;
              }
            });
          });
        }
      }, () => {
        console.log('there was an error');
      });
  }

  getAchievements() {
    return this.http.get(`${this.achievementsUrl}`)
      .toPromise()
      .then(response => response.json());
  }

  getPlayerAchievements(playerId:String) {
    return this.http.get(`${this.achievementsUrl}/${playerId}`)
      .toPromise()
      .then(response => response.json());
  }

}
