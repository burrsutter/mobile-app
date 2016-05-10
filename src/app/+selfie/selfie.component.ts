import { Component, OnInit } from '@angular/core';
import { Http, HTTP_PROVIDERS, Headers, RequestOptions } from '@angular/http';

declare var loadImage: any;

@Component({
  moduleId: module.id,
  selector: 'app-selfie',
  host: {'class': 'dark-bg'},
  templateUrl: 'selfie.component.html',
  styleUrls: ['selfie.component.css'],
  providers: [ HTTP_PROVIDERS ]
})

export class SelfieComponent implements OnInit {
  canvas;
  uploadBtn;
  canUpload = false;

  constructor(private http: Http) {}

  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    this.uploadBtn = document.querySelector('.upload');
    this.uploadBtn.style.display = 'none';
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
          console.log(data);
          this.canvas.parentNode.replaceChild(data, this.canvas);
          this.canvas = data;
          this.canUpload = true;

          this.uploadBtn.style.display = 'block';
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
    let url = 'http://localhost:8081/upload';

    this.http.post(url, body, options)
      .toPromise()
      .then(res => {
        let data = res.json();
        localStorage.setItem('id', data.id);
      });
  }
}
