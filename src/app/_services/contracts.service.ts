import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  // private apiUrl = `${environment.endpoint}clm/v1/user`; // Corrected URL
  // https://api.auctapace.com/clm/v1/user/login
  private apiUrl = 'https://api.auctapace.com/clm/v1/contract';
  constructor(private http: HttpClient) {}

  fetchContracts(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fetch`, userData);
  }


  
}
