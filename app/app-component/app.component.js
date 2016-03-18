System.register(['angular2/core', 'angular2/router', '../main/main.component', '../game/game.component', '../selfie/selfie.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, main_component_1, game_component_1, selfie_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (main_component_1_1) {
                main_component_1 = main_component_1_1;
            },
            function (game_component_1_1) {
                game_component_1 = game_component_1_1;
            },
            function (selfie_component_1_1) {
                selfie_component_1 = selfie_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent.prototype.ngOnInit = function () {
                    componentHandler.upgradeDom();
                };
                AppComponent.prototype.closeDrawer = function () {
                    var matches = document.querySelectorAll('.mdl-layout__drawer, .mdl-layout__obfuscator');
                    [].forEach.call(matches, function (element) {
                        element.classList.remove('is-visible');
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'rh-keynote-app',
                        template: "<div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n                   <header class=\"mdl-layout__header\">\n                       <div aria-expanded=\"false\" role=\"button\" tabindex=\"0\" class=\"mdl-layout__drawer-button\">\n                           <i class=\"material-icons\">\uE5D2</i>\n                       </div>\n                       <div class=\"mdl-layout__header-row\">\n                           <span class=\"mdl-layout-title\">App</span>\n                           <div class=\"mdl-layout-spacer\"></div>\n                           <!--<nav class=\"mdl-navigation mdl-layout--large-screen-only\">\n                               <a class=\"mdl-navigation__link\" [routerLink]=\"['Main']\">Main</a>\n                               <a class=\"mdl-navigation__link\" [routerLink]=\"['Game']\">Game</a>\n                               <a class=\"mdl-navigation__link\" [routerLink]=\"['Selfie']\">Selfie</a>\n                           </nav>-->\n                       </div>\n                   </header>\n                   <div class=\"mdl-layout__drawer\">\n                       <span class=\"mdl-layout-title\">App</span>\n                       <nav class=\"mdl-navigation\">\n                           <a class=\"mdl-navigation__link\" [routerLink]=\"['Main']\" (click)=\"closeDrawer()\">Main</a>\n                           <a class=\"mdl-navigation__link\" [routerLink]=\"['Game']\" (click)=\"closeDrawer()\">Game</a>\n                           <a class=\"mdl-navigation__link\" [routerLink]=\"['Selfie']\" (click)=\"closeDrawer()\">Selfie</a>\n                       </nav>\n                   </div>\n                   <main class=\"mdl-layout__content\">\n                       <div class=\"page-content\">\n                           <router-outlet></router-outlet>\n                       </div>\n                   </main>\n               </div>",
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    router_1.RouteConfig([
                        { path: '/main', name: 'Main', component: main_component_1.MainComponent, useAsDefault: true },
                        { path: '/game', name: 'Game', component: game_component_1.GameComponent },
                        { path: '/selfie', name: 'Selfie', component: selfie_component_1.SelfieComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map