System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var SelfieComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SelfieComponent = (function () {
                function SelfieComponent() {
                    this.canTakePicture = false;
                    this.width = null;
                    this.height = null;
                    this.video = null;
                    this.canvas = null;
                    this.stream = null;
                    this.videoBtnTakeText = 'Take a Selfie';
                    this.videoBtnStopText = 'Stop Camera';
                    this.videoBtnText = this.videoBtnTakeText;
                    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
                    if (navigator.getMedia) {
                        this.canTakePicture = true;
                    }
                }
                SelfieComponent.prototype.ngOnInit = function () {
                };
                SelfieComponent.prototype.ngOnDestroy = function () {
                    this.stopVideo();
                };
                SelfieComponent.prototype.toggleVideo = function () {
                    if (this.stream) {
                        this.stopVideo();
                        this.videoBtnText = this.videoBtnTakeText;
                        return;
                    }
                    this.videoBtnText = this.videoBtnStopText;
                    this.startVideo();
                };
                SelfieComponent.prototype.startVideo = function () {
                    var _this = this;
                    this.video = document.getElementById('video');
                    this.canvas = document.getElementById('canvas');
                    navigator.getMedia({
                        video: true,
                        audio: false
                    }, function (stream) {
                        _this.stream = stream;
                        if (navigator.mozGetUserMedia) {
                            _this.video.mozSrcObject = stream;
                        }
                        else {
                            var vendorURL = window.URL || window.webkitURL;
                            _this.video.src = vendorURL.createObjectURL(stream);
                        }
                        _this.video.play();
                    }, function (err) {
                        console.log("An error occured! " + err);
                    });
                    this.video.addEventListener('canplay', function () {
                        _this.width = _this.video.videoWidth;
                        _this.height = _this.video.videoHeight;
                        _this.canvas.setAttribute('width', _this.width);
                        _this.canvas.setAttribute('height', _this.height);
                    });
                };
                SelfieComponent.prototype.stopVideo = function () {
                    if (this.stream) {
                        this.stream.getVideoTracks()[0].stop();
                        this.stream = null;
                    }
                };
                SelfieComponent.prototype.capturePhoto = function () {
                    var context = this.canvas.getContext('2d');
                    context.drawImage(this.video, 0, 0);
                    document.getElementById('photo').src = this.canvas.toDataURL('image/webp');
                };
                SelfieComponent = __decorate([
                    core_1.Component({
                        template: "<div class=\"mdl-grid\">\n                   <div *ngIf=\"canTakePicture\">\n                       <button class=\"mdl-button mdl-js-button mdl-button--raised\" (click)=\"toggleVideo()\">{{videoBtnText}}</button>\n                       <button class=\"mdl-button mdl-js-button mdl-button--raised\" (click)=\"capturePhoto($event)\" *ngIf=\"stream\">Take Photo</button>\n                       <div>\n                           <video id=\"video\" class=\"responsive-video\">Video stream not available.</video>\n                       </div>\n                       <canvas id=\"canvas\"></canvas>\n                       <div>\n                           <img id=\"photo\">\n                       </div>\n                   </div>\n                   <div *ngIf=\"!canTakePicture\">\n                       <input type=\"file\" accept=\"image/*\">\n                   </div>\n               </div>",
                        styles: ["\n        canvas {\n            display: none;\n        }\n\n        .responsive-video {\n            max-width: 100%;\n            height: auto;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SelfieComponent);
                return SelfieComponent;
            }());
            exports_1("SelfieComponent", SelfieComponent);
        }
    }
});
//# sourceMappingURL=selfie.component.js.map