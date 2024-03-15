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
export class CriteriosTutorEmpresarialService {

  constructor(private http: HttpClient) { }

  obtenerCriteriosTutorEmpresarial() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/empresarial`,{headers});
  }

  obtenerCriteriosTutorEmpresarialPorEscuela(schoolName: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criterios/tutor/empresarial/by/school/${schoolName}`,{headers});
  }

  crearCriterioTutorEmpresarial(criteriaData: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.post(`${environment.apiUrl}/criterios/tutor/empresarial`,criteriaData,{headers});
  }

  cambiarCriterioTutorEmpresarial(criteriaData: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(criteriaData)
    return this.http.put(`${environment.apiUrl}/criterios/tutor/empresarial`,criteriaData,{headers});
  }
}
