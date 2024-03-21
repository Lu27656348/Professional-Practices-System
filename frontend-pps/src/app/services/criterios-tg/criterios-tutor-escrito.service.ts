import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Criteria } from 'src/app/form-generator/interfaces/criteria';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CriteriosTutorEscritoService {

  constructor(private http: HttpClient) { }

  getTutorEscritoCriteria() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita/escuela/{schoolName}/modelo/{criteriaModel}/seccion`,{headers});
  }

  getTutorEscritoSeccionByModelAndSchool(schoolName: string, criteriaModel: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita/escuela/${schoolName}/modelo/${criteriaModel}/seccion`,{headers});
  }

  getTutorEscritoCriteriaByModelAndSchool(schoolName: string, criteriaModel: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita/escuela/${schoolName}/modelo/${criteriaModel}`,{headers});
  }

  getTutorEscritoCriteriaBySeccion(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita/by/seccion/${seccionId}`,{headers});
  }

  createTutorEscritoSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.post(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita/seccion`,seccionData,{headers});
  }

  changeTutorEscritoSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.put(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita/seccion`,seccionData,{headers});
  }


  createTutorEscritoCriteria(criteriaData: Criteria){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.post(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita`,criteriaData,{headers});
  }

  changeTutorEscritoCriteria(criteriaData: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.put(`${environment.apiUrl}/criterios/tutor/evaluacion/escrita`,criteriaData,{headers});
  }

}
