import { Component, OnInit } from '@angular/core';
import { Routes, Route, Router, ROUTER_DIRECTIVES} from '@angular/router';
import { GameComponent } from './+game';
import { SelfieComponent } from './+selfie';
import { HomeComponent } from './+home';
import { AdminComponent } from './+admin';

declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'rh-keynote-demo-app',
  templateUrl: 'rh-keynote-demo.component.html',
  styleUrls: ['rh-keynote-demo.component.css'],
  directives: [ROUTER_DIRECTIVES]
})

@Routes([
  new Route({path: '/game', component: GameComponent}),
  new Route({path: '/selfie', component: SelfieComponent}),
  new Route({path: '/admin', component: AdminComponent}),
  new Route({path: '/', component: HomeComponent}),
  new Route({path: '*', component: HomeComponent})
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
