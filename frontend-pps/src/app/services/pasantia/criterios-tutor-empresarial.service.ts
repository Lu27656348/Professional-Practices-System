import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Criteria } from 'src/app/form-generator/interfaces/criteria';
import { environment } from 'src/environments/environment';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';

@Injectable({
  providedIn: 'root'
})
export class CriteriosTutorEmpresarialService {

  constructor(private http: HttpClient) { }

  getAllEnterpriseTutorCriteria() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/criterios/empresarial/get`,{headers});
  }

  getAllEnterpriseTutorSeccion() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/secciones/empresarial/get`,{headers});
  }

  getEnterpriseTutorCriteriaBySeccion(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/criterios/empresarial/get/by/seccion/${seccionId}`,{headers});
  }

  changeEnterpriseTutorSeccion(seccionId: number, seccion: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrlPasantia}/pasantia/secciones/empresarial/put/${seccionId}`,seccion,{headers});
  }

  changeEnterpriseTutorCriteria(criteriaId: number, criteria: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrlPasantia}/pasantia/criterios/empresarial/put/${criteriaId}`,criteria,{headers});
  }
}
