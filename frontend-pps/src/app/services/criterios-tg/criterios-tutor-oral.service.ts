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
export class CriteriosTutorOralService {

  constructor(private http: HttpClient) { }

  getTutorOralCriteria() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/oral/escuela/{schoolName}/modelo/{criteriaModel}/seccion`,{headers});
  }

  getTutorOralSeccionByModelAndSchool(schoolName: string, criteriaModel: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/oral/escuela/${schoolName}/modelo/${criteriaModel}/seccion`,{headers});
  }

  getTutorOralCriteriaBySeccion(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/evaluacion/oral/by/seccion/${seccionId}`,{headers});
  }

  createTutorOralSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.post(`${environment.apiUrl}/criterios/tutor/evaluacion/oral/seccion`,seccionData,{headers});
  }

  changeTutorOralSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.put(`${environment.apiUrl}/criterios/tutor/evaluacion/oral/seccion`,seccionData,{headers});
  }


  createTutorOralCriteria(criteriaData: Criteria){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.post(`${environment.apiUrl}/criterios/tutor/evaluacion/oral`,criteriaData,{headers});
  }

  changeTutorOralCriteria(criteriaData: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.put(`${environment.apiUrl}/criterios/tutor/evaluacion/oral`,criteriaData,{headers});
  }
}
