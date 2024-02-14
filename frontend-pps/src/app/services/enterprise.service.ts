import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateEnterpriseRequest } from '../interfaces/requests/CreateEnterpriseRequest';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  constructor(private http: HttpClient) { }

  getEnterprises():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/enterprises`,{headers});
  }

  getEnterpriseById(id: number):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/enterprises/${id}`,{headers});
  }

  createEnterprise(enterpriseData: CreateEnterpriseRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/enterprises`,enterpriseData,{headers});
  }

  updateEnterprise(enterpriseId: number, enterpriseData: CreateEnterpriseRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/enterprises/${enterpriseId}`,enterpriseData,{headers});
  }

  deleteEnterpriseById(enterpriseId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${environment.apiUrl}/enterprises/${enterpriseId}`,{headers});
  }
}
