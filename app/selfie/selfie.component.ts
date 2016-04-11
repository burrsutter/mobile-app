import { Component, OnInit } from 'angular2/core';
import { Http, HTTP_PROVIDERS, Headers, RequestOptions } from 'angular2/http';

declare var loadImage: any;

@Component({
    providers: [ HTTP_PROVIDERS ],
    template: `
        <div class="mdl-grid">
           <div class="mdl-cell">
               <input type="file" capture="camera" accept="image/*" id="takePictureField" (change)="onChange($event)">
               <button (click)="upload()">Upload</button>
           </div>
       </div>
       <div class="mdl-grid">
           <div class="mdl-cell mdl-cell--12-col" id="canvasContainer" style="display: flex; justify-content: center;">
               <canvas id="canvas"></canvas>
           </div>
       </div>
    `,
    styles: [`
        #canvasContainer {
            display: -webkit-flex;
            diplay: flex;
            -webkit-justify-content: center;
            justify-content: center;
        }
    `]
})

export class SelfieComponent implements OnInit {
    canvas = null;

    constructor(private http: Http) {}

    ngOnInit() {
        this.canvas = document.getElementById('canvas');
    }

    onChange(event) {
        if (event.target.files.length === 1 && event.target.files[0].type.indexOf('image/') === 0) {
            let file = event.target.files[0];
            let options = {
                maxWidth: 300,
                maxHeight: 300,
                crop: true,
                downsamplingRatio: 0.05
            };

            loadImage.parseMetaData(file, data => {
                if (data.exif) {
                    options['orientation'] = data.exif.get('Orientation');
                }

                loadImage(file, data => {
                    this.canvas.parentNode.replaceChild(data, this.canvas);
                    this.canvas = data;
                }, options);
            });
        }
    }

    upload() {
        let image = this.canvas.toDataURL('image/jpeg', 0.1);
        let body = JSON.stringify({
            image: image ,
            id: localStorage.getItem('id') || null
        });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let url = 'http://localhost:8080/upload';

        this.http.post(url, body, options)
            .toPromise()
            .then(res => {
                let data = res.json();
                localStorage.setItem('id', data.id);
            });
    }
}
