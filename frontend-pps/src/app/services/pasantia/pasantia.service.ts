import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEvaluationCriteria } from 'src/app/interfaces/requests/CreateEvaluationCriteria';
import { EvaluateIntershipProposalRequest } from 'src/app/interfaces/requests/EvaluateIntershipProposalRequest';
import { EvaluateIntershipReportRequest } from 'src/app/interfaces/requests/EvaluateIntershipReportRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasantiaService {

  constructor(private http: HttpClient) { }

  getPasantiasByStatus(statuscode: number) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/status/${statuscode}`,{headers});
  }

  getPasantiasByStatusAndSchool(statuscode: number, schoolName: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/status/${statuscode}/school/${schoolName}`,{headers});
  }


  getPasantiaById( intershipId: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/get/${intershipId}`,{headers});
  }

  getStudentCurrentPasantia( studentDNI: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/get/by/student/${studentDNI}`,{headers});
  }

  createPasantia(pasantia : any ): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/create`,pasantia,{headers});
  }

  cargarPropuestaPasantia( file: File, userData: any, escuela: string ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    const studentData = {
      studentDNI: userData.userDNI,
      userFirstName: userData.userFirstName,
      userLastName: userData.userLastName
    }
    formData.append('file', file)
    formData.append('studentData', JSON.stringify(studentData))
    formData.append('escuela', escuela)
    return this.http.post(`${environment.amazonS3}/upload/pasantia/propuesta`,formData,{headers});
  }

  cambiarEstadoPasantia( intershipId: number, intershipStatusCode: number) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      intershipId: intershipId,
      intershipStatusCode: intershipStatusCode
    }
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/change/status`,body,{headers});
  }

  evaluarPropuestaPasantia( evaluation: EvaluateIntershipProposalRequest) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/evaluate/proposal`,evaluation,{headers});
  }
  evaluarInformePasantia ( evaluation: EvaluateIntershipReportRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/evaluate/report`,evaluation,{headers});
  }

  obtenerEstudiantesPendientesPorPasantia( schoolName: string ){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/proposal/pending/${schoolName}`,{headers});
  }

  asociarCriterioConEvaluacionDeTutorAcademico(criteriaEvaluationData: CreateEvaluationCriteria){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/generar/evaluacion/tutor/academico`,criteriaEvaluationData,{headers});
  }

  asociarCriterioConEvaluacionDeTutorEmpresarial(criteriaEvaluationData: CreateEvaluationCriteria){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrlPasantia}/pasantia/generar/evaluacion/tutor/empresarial`,criteriaEvaluationData,{headers});
  }

  obtenerCalificacionEvaluacionTutorEmpresarial(intershipId: number,tutorDNI: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/obtener/calificacion/evaluacion/tutor/empresarial/${intershipId}/${tutorDNI}`,{headers});
  }

  obtenerCalificacionEvaluacionTutorAcademico(intershipId: number,tutorDNI: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrlPasantia}/pasantia/obtener/calificacion/evaluacion/tutor/academico/${intershipId}/${tutorDNI}`,{headers});
  }
}
