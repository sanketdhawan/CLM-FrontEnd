import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  apiUrl = 'http://mediumvioletred-swallow-606356.hostingersite.com/web_api/';

  constructor(private http: HttpClient) {}

  loadProductsList(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'view.php');
  }
}
