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
var http_1 = require('@angular/http');
var SelfieComponent = (function () {
    function SelfieComponent(http) {
        this.http = http;
        this.canUpload = false;
    }
    SelfieComponent.prototype.ngOnInit = function () {
        this.canvas = document.getElementById('canvas');
        this.uploadBtn = document.querySelector('.upload');
        this.uploadBtn.style.display = 'none';
    };
    SelfieComponent.prototype.onChange = function (event) {
        var _this = this;
        if (event.target.files.length === 1 && event.target.files[0].type.indexOf('image/') === 0) {
            var file_1 = event.target.files[0];
            var options_1 = {
                maxWidth: 300,
                maxHeight: 300,
                crop: true,
                downsamplingRatio: 0.05
            };
            loadImage.parseMetaData(file_1, function (data) {
                if (data.exif) {
                    options_1['orientation'] = data.exif.get('Orientation');
                }
                loadImage(file_1, function (data) {
                    console.log(data);
                    _this.canvas.parentNode.replaceChild(data, _this.canvas);
                    _this.canvas = data;
                    _this.canUpload = true;
                    _this.uploadBtn.style.display = 'block';
                }, options_1);
            });
        }
    };
    SelfieComponent.prototype.upload = function () {
        var image = this.canvas.toDataURL('image/jpeg', 0.1);
        var body = JSON.stringify({
            image: image,
            id: localStorage.getItem('id') || null
        });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = 'http://localhost:8081/upload';
        this.http.post(url, body, options)
            .toPromise()
            .then(function (res) {
            var data = res.json();
            localStorage.setItem('id', data.id);
        });
    };
    SelfieComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-selfie',
            host: { 'class': 'dark-bg' },
            templateUrl: 'selfie.component.html',
            styleUrls: ['selfie.component.css'],
            providers: [http_1.HTTP_PROVIDERS]
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SelfieComponent);
    return SelfieComponent;
}());
exports.SelfieComponent = SelfieComponent;
//# sourceMappingURL=selfie.component.js.map