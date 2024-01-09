import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { createProfessorRequest } from '../interfaces/CreateProfessorRequest';

@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {

  constructor(private http: HttpClient) { }

  getProfessors():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/professors/data`,{headers});
  }

  createProfessors(createProfessorRequest: createProfessorRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8081/professors`,createProfessorRequest,{headers});
  }
}
