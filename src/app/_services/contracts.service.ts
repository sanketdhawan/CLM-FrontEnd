import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'https://api.auctapace.com/clm/v1/contract';
  private submitUrl = 'https://api.auctapace.com/clm/v1/mis/submit01';

  constructor(private http: HttpClient) {}

  fetchContracts(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fetch`, userData);
  }

  initiateContract(contractData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/init`, contractData);
  }

  fetchContractDetails(body: { contractID: number }): Observable<any> { // Changed 'contractId' to 'contractID' in the type definition
    return this.http.post(`${this.apiUrl}/fetch-details`, body);
  }

  updateContractDetails(contractData: any): Observable<any> {
    return this.http.post<any>(this.submitUrl, contractData);
  }

  submitContractDetails(submitData: any): Observable<any> {
    console.log(submitData)
    return this.http.post(this.submitUrl, submitData);
  }
}