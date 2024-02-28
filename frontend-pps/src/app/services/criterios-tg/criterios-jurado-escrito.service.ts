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
export class CriteriosJuradoEscritoService {

  constructor(private http: HttpClient) { }

  getJuradoEscritoCriteria() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita/escuela/{schoolName}/modelo/{criteriaModel}/seccion`,{headers});
  }

  getJuradoEscritoSeccionByModelAndSchool(schoolName: string, criteriaModel: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita/escuela/${schoolName}/modelo/${criteriaModel}/seccion`,{headers});
  }

  getJuradoEscritoCriteriaBySeccion(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita/by/seccion/${seccionId}`,{headers});
  }

  createJuradoEscritoSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.post(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita/seccion`,seccionData,{headers});
  }

  changeJuradoEscritoSeccion(seccionData: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(seccionData)
    return this.http.put(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita/seccion`,seccionData,{headers});
  }


  createJuradoEscritoCriteria(criteriaData: Criteria){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.post(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita`,criteriaData,{headers});
  }

  changeJuradoEscritoCriteria(criteriaData: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.put(`${environment.apiUrl}/criterios/jurado/evaluacion/escrita`,criteriaData,{headers});
  }


}
