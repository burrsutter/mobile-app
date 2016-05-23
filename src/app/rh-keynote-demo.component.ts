import { Component, OnInit } from '@angular/core';
import { Routes, Route, Router, ROUTER_DIRECTIVES} from '@angular/router';
import { GameComponent } from './+game';
import { SelfieComponent } from './+selfie';
import { HomeComponent } from './+home';
import { AdminComponent } from './+admin';
import { LeaderboardComponent } from './+leaderboard';

declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'rh-keynote-demo-app',
  templateUrl: 'rh-keynote-demo.component.html',
  styleUrls: ['rh-keynote-demo.component.css'],
  directives: [ROUTER_DIRECTIVES]
})

@Routes([
  {path: '/game', component: GameComponent},
  {path: '/selfie', component: SelfieComponent},
  {path: '/leaderboard', component: LeaderboardComponent},
  {path: '/admin', component: AdminComponent},
  {path: '/', component: HomeComponent},
  {path: '*', component: HomeComponent}
])

export class RhKeynoteDemoAppComponent implements OnInit {
  title = 'Something';
  constructor(private router: Router) {}

  ngOnInit() {
    componentHandler.upgradeDom();
  }

  closeDrawer() {
    const matches = document.querySelectorAll('.mdl-layout__drawer, .mdl-layout__obfuscator');
    [].forEach.call(matches, element => {
      element.classList.remove('is-visible');
    });
  }
}
