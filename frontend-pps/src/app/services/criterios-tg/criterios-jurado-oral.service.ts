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
export class CriteriosJuradoOralService {

  constructor(private http: HttpClient) { }

  createJuradoOralSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.post(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/seccion`,seccionData,{headers});
  }

  changeJuradoOralSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.put(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/seccion`,seccionData,{headers});
  }

  getJuradoOralSeccionByModelAndSchool(schoolName: string, criteriaModel: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/escuela/${schoolName}/modelo/${criteriaModel}/seccion`,{headers});
  }

  getJuradoOralCriteriaByModelAndSchool(schoolName: string, criteriaModel: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/escuela/${schoolName}/modelo/${criteriaModel}`,{headers});
  }

  getJuradoOralCriteriaBySeccion(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/by/seccion/${seccionId}`,{headers});
  }

  createJuradoOralCriteria(criteriaData: Criteria){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.post(`${environment.apiUrl}/criterios/jurado/evaluacion/oral`,criteriaData,{headers});
  }

  changeJuradoOralCriteria(criteriaData: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.put(`${environment.apiUrl}/criterios/jurado/evaluacion/oral`,criteriaData,{headers});
  }

  obtenerCriteriosPresentacionJurado(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/${schoolName}`,{headers});
  }

  changeJuradoOralSeccionStatus(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/seccion/${seccionId}/status`,{headers});
  }

  changeJuradoOralCriteriaStatus(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/criterios/jurado/evaluacion/oral/${seccionId}/status`,{headers});
  }

}
