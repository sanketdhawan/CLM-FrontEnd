import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private baseUrl =
    'https://darkgrey-hornet-514092.hostingersite.com/api/media.php';
  constructor(private http: HttpClient) {}
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.baseUrl, formData);
  }
  deleteFile(id: number): Observable<any> {
    const url = `${this.baseUrl}?id=${id}`;
    return this.http.delete<any>(url);
  }
  getMedia(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
