"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var _game_1 = require('./+game');
var _selfie_1 = require('./+selfie');
var _home_1 = require('./+home');
var _admin_1 = require('./+admin');
var RhKeynoteDemoAppComponent = (function () {
    function RhKeynoteDemoAppComponent(router) {
        this.router = router;
        this.title = 'Something';
    }
    RhKeynoteDemoAppComponent.prototype.ngOnInit = function () {
        componentHandler.upgradeDom();
    };
    RhKeynoteDemoAppComponent.prototype.closeDrawer = function () {
        var matches = document.querySelectorAll('.mdl-layout__drawer, .mdl-layout__obfuscator');
        [].forEach.call(matches, function (element) {
            element.classList.remove('is-visible');
        });
    };
    RhKeynoteDemoAppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'rh-keynote-demo-app',
            templateUrl: 'rh-keynote-demo.component.html',
            styleUrls: ['rh-keynote-demo.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES]
        }),
        router_1.Routes([
            new router_1.Route({ path: '/game', component: _game_1.GameComponent }),
            new router_1.Route({ path: '/selfie', component: _selfie_1.SelfieComponent }),
            new router_1.Route({ path: '/admin', component: _admin_1.AdminComponent }),
            new router_1.Route({ path: '/', component: _home_1.HomeComponent }),
            new router_1.Route({ path: '*', component: _home_1.HomeComponent })
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], RhKeynoteDemoAppComponent);
    return RhKeynoteDemoAppComponent;
}());
exports.RhKeynoteDemoAppComponent = RhKeynoteDemoAppComponent;
//# sourceMappingURL=rh-keynote-demo.component.js.map