import { Component, OnInit, OnDestroy } from 'angular2/core';

@Component({
    template: `<div class="mdl-grid">
                   <div *ngIf="canTakePicture">
                       <button class="mdl-button mdl-js-button mdl-button--raised" (click)="toggleVideo()">{{videoBtnText}}</button>
                       <button class="mdl-button mdl-js-button mdl-button--raised" (click)="capturePhoto($event)" *ngIf="stream">Take Photo</button>
                       <div>
                           <video id="video" class="responsive-video">Video stream not available.</video>
                       </div>
                       <canvas id="canvas"></canvas>
                       <div>
                           <img id="photo">
                       </div>
                   </div>
                   <div *ngIf="!canTakePicture">
                       <input type="file" accept="image/*">
                   </div>
               </div>`,
    styles: [`
        canvas {
            display: none;
        }

        .responsive-video {
            max-width: 100%;
            height: auto;
        }
    `]
})

export class SelfieComponent implements OnInit, OnDestroy {
    canTakePicture = false;
    width = null;
    height = null;
    video = null;
    canvas = null;
    stream = null;
    videoBtnTakeText = 'Take a Selfie';
    videoBtnStopText = 'Stop Camera';
    videoBtnText = this.videoBtnTakeText;

    constructor() {
        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getMedia) {
            this.canTakePicture = true;
        }
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.stopVideo();
    }

    toggleVideo() {
        if (this.stream) {
            this.stopVideo();
            this.videoBtnText = this.videoBtnTakeText;
            return;
        }

        this.videoBtnText = this.videoBtnStopText;
        this.startVideo();
    }

    startVideo() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');

        navigator.getMedia({
            video: true,
            audio: false
        }, stream => {
            this.stream = stream;

            if (navigator.mozGetUserMedia) {
                this.video.mozSrcObject = stream;
            } else {
                let vendorURL = window.URL || window.webkitURL;
                this.video.src = vendorURL.createObjectURL(stream);
            }

            this.video.play();
        }, err => {
            console.log("An error occured! " + err);
        });

        this.video.addEventListener('canplay', () => {
            this.width = this.video.videoWidth;
            this.height = this.video.videoHeight;

            this.canvas.setAttribute('width', this.width);
            this.canvas.setAttribute('height', this.height);
        });
    }

    stopVideo() {
        if (this.stream) {
            this.stream.getVideoTracks()[0].stop();
            this.stream = null;
        }
    }

    capturePhoto() {
        let context = this.canvas.getContext('2d');

        context.drawImage(this.video, 0, 0);
        document.getElementById('photo').src = this.canvas.toDataURL('image/webp');
    }
}
