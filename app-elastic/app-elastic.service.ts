import { Injectable } from '@angular/core';

@Injectable()
export class AppElasticService {

  constructor() { }

  search(url , param) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText));
            } else if (this.readyState === 4 && this.status !== 200) {
                reject('error');
            }
        };
        http.open('POST', url, true);
        http.send(JSON.stringify(param));
    });
  }

}
