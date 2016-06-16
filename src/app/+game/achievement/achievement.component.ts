import { Component, Input, OnChanges, SimpleChange, ElementRef } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  moduleId: module.id,
  selector: 'app-achievement',
  templateUrl: 'achievement.component.html',
  styleUrls: ['achievement.component.css']
})
export class AchievementComponent {
  element: ElementRef;
  achievements: Array<any> = [];

  constructor(private _element: ElementRef, private gameService: GameService) {
    this.element = _element;

    this.achievementChangeHandler = this.achievementChangeHandler.bind(this);
    this.animationEndHandler = this.animationEndHandler.bind(this);
    this.transitionEndHandler = this.transitionEndHandler.bind(this);

    this.gameService.achievementsChange.subscribe(this.achievementChangeHandler);
    this.element.nativeElement.addEventListener(this.whichAnimationEvent(), this.animationEndHandler);
    this.element.nativeElement.addEventListener(this.whichTransitionEvent(), this.transitionEndHandler);
  }

  achievementChangeHandler(achievement) {
    this.achievements.push(achievement);
    this.showAchievement();
  }

  showAchievement() {
    this.element.nativeElement.classList.add('visible');
  }

  animationEndHandler(evt) {
    if (evt.target.classList.contains('visible')) {
      setTimeout(() => {
        evt.target.classList.remove('visible');
      }, 3000);
    }
  }

  transitionEndHandler(evt) {
    this.achievements.shift();

    if (this.achievements.length > 0) {
      this.showAchievement();
    }
  }

  whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for (t in transitions){
      if ( el.style[t] !== undefined ) {
        return transitions[t];
      }
    }
  }

  whichAnimationEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'animation':'animationend',
      'OAnimation':'oAnimationEnd',
      'MozAnimation':'animationend',
      'WebkitAnimation':'webkitAnimationEnd'
    }

    for (t in transitions){
      if ( el.style[t] !== undefined ) {
        return transitions[t];
      }
    }
  }

}
