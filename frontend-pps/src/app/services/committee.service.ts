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

  getCommitteeBySchool(schoolName: string ):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/committees/by/school/${schoolName}`,{headers});
  }

  createCommittee(committeeData: CreateCommitteeRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/committees`,committeeData,{headers});
  }

  updateCommittee(committeeId: string ,committeeData: CreateCommitteeRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/committees/${committeeId}`,committeeData,{headers});
  }

  deleteCommittee(committeeId: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${environment.apiUrl}/committees/${committeeId}`,{headers});
  }

  cargarActaDeComite(committeeId: string, committeeFile: File, escuela: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData()
    formData.append('file', committeeFile)
    formData.append('comite', committeeId)
    formData.append('escuela', escuela)
    return this.http.post(`${environment.amazonS3}/upload/comite`,formData,{headers});
  }
}
