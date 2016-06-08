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
  imageUploaded: boolean = false;
  error: boolean = false;
  uploading: boolean = false;
  canUpload: boolean = false;

  constructor(private http: Http) {}

  ngOnInit() {
    // this.canvas = document.getElementById('canvas');
    // this.uploadBtn = document.querySelector('.upload');
    // this.uploadBtn.style.display = 'none';
  }

  onChange(event) {
    const self = this;

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
          self.canUpload = true;
          setTimeout(() => {
            self.canvas = document.getElementById('canvas');
            self.canvas.parentNode.replaceChild(data, this.canvas);
            self.canvas = data;
          }, 0);
        }, options);
      });
    }
  }

  upload() {
    let image = this.canvas.toDataURL('image/jpeg', 0.1);
    let body = JSON.stringify({
      image: image,
      id: localStorage.getItem('id') || null
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = 'http://localhost:8085/upload';

    this.uploading = true;

    this.http.post(url, body, options)
      .toPromise()
      .then(res => {
        let data = res.json();
        this.uploading = false;

        if (data.success) {
          this.imageUploaded = true;
          localStorage.setItem('id', data.id);
        }
      })
      .catch(err => {
        this.uploading = false;
        this.imageUploaded = true;
        this.error = true;
      });
  }

  tryAgain() {
    this.canUpload = false;
    this.imageUploaded = false;
    this.error = false;
    this.uploading = false;
  }
}
