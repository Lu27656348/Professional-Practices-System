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
  /* Por Escuela */
  getAllAcademicTutorCriteriaBySchool(schoolName: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/criterios/academico/get/by/school/${schoolName}`,{headers});
  }

  getAllAcademicTutorSeccionBySchool(schoolName: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/secciones/academico/get/by/school/${schoolName}`,{headers});
  }
  /********************************************************************************************/
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

  changeAcademicTutorCriteria(criteriaId: number, criteria: CriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrlPasantia}/pasantia/criterios/academico/put/${criteriaId}`,criteria,{headers});
  }

  createAcademicTutorSeccion(seccionName: string, maxNote: number, schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      seccionName: seccionName,
      maxNote: maxNote,
      schoolName: schoolName
    }
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/secciones/academico/post`,body,{headers});
  }

  createAcademicTutorCriteria(criteriaName: string, maxNote: number, schoolName: string, seccionId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      criteriaName: criteriaName,
      maxNote: maxNote,
      schoolName: schoolName,
      seccionId: seccionId
    }
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/criterios/academico/post`,body,{headers});
  }


}
