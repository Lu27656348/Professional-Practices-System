import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CriteriosTutorAcademicoService {

  constructor(private http: HttpClient) { }

  getAllAcademicTutorCriteria() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/criterios/academico/get`,{headers});
  }

  getAllAcademicTutorSeccion() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/secciones/academico/get`,{headers});
  }

  getAcademicTutorCriteriaBySeccion(seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/criterios/academico/get/by/seccion/${seccionId}`,{headers});
  }

  changeAcademicTutorSeccion(seccionId: number, seccion: SeccionInterface){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrlPasantia}/pasantia/secciones/academico/put/${seccionId}`,seccion,{headers});
  }

  changeEnterpriseTutorCriteria(criteriaId: number, criteria: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrlPasantia}/pasantia/criterios/academico/put/${criteriaId}`,criteria,{headers});
  }


}
