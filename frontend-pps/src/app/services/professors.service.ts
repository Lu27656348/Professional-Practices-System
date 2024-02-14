import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { createProfessorRequest } from '../interfaces/CreateProfessorRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessorsService {

  constructor(private http: HttpClient) { }

  getProfessors():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/professors/data`,{headers});
  }

  getProfessorById( professorDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/professors/${professorDNI}`,{headers});
  }

  createProfessors(createProfessorRequest: createProfessorRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/professors`,createProfessorRequest,{headers});
  }

  getProfessorsData():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/professors/data/all`,{headers});
  }

  deleteProfessorById(professorDNI: string) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${environment.apiUrl}/professors/${professorDNI}`,{headers});
  }
}
