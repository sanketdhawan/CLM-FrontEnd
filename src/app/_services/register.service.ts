import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'https://darkgrey-hornet-514092.hostingersite.com/api/register.php';

  constructor(private http: HttpClient) { }

  registerUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    // Convert JSON object to `x-www-form-urlencoded` format
    const body = new URLSearchParams();
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        body.set(key, userData[key]);
      }
    }

    return this.http.post<any>(this.apiUrl, body.toString(), { headers });
  }
}
