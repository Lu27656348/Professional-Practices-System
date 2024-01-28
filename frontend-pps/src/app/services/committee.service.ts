import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateCommitteeRequest } from '../interfaces/requests/CreateCommitteeRequest';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {

  constructor(private http: HttpClient) { }

  getCommittees():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/committees`,{headers});
  }

  createCommittee(committeeData: CreateCommitteeRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/committees`,committeeData,{headers});
  }
}
