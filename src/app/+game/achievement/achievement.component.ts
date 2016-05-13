import { Component, Input, OnChanges, SimpleChange, ElementRef } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-achievement',
  templateUrl: 'achievement.component.html',
  styleUrls: ['achievement.component.css']
})
export class AchievementComponent {
  element: ElementRef;
  @Input() achievements: any;

  constructor(private _element: ElementRef) {
    this.element = _element;

    this.element.nativeElement.addEventListener('animationend', event => {
      if (event.target.classList.contains('visible')) {
        setTimeout(() => {
          event.target.classList.remove('visible');
        }, 3000);
      }
    });
  }

  ngOnChanges(changes: {[achievements: string]: SimpleChange}) {
    if (changes['achievements'].currentValue.length > 0) {
      this.element.nativeElement.classList.add('visible');
    }
  }

}
