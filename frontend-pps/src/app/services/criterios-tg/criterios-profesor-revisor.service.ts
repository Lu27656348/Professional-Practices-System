import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CriteriosProfesorRevisorService {

  constructor(private http: HttpClient) { }


  changeProfesorRevisorCriteriaStatus(criteriaId: number) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/criteria/${criteriaId}/status`,{headers});
  }
}
