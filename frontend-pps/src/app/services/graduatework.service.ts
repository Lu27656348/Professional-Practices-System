import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,of } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateCoordinatorRequest } from '../interfaces/requests/CreateCoordinatorRequest';
import { GenerateCoordinatorRequest } from '../interfaces/requests/GenerateCoordinatorRequest';
import { CreateReviewerCriteriaRequest } from '../interfaces/requests/CreateReviewerCriteriaRequest';
import { CreateReviewerEvaluationRequest } from '../interfaces/requests/CreateReviewerEvaluationRequest';
import { CreateReviewerEvaluationCriteriaRequest } from '../interfaces/requests/CreateReviewerEvaluationCriteriaRequest';
import { SetReviewerEvaluationRequest } from '../interfaces/requests/SetReviewerEvaluationRequest';
import { SetReviewerEvaluationCriteriaRequest } from '../interfaces/requests/SetReviewerEvaluationCriteriaRequest';
import { AddJuryEvaluationNote } from '../interfaces/requests/AddJuryEvaluationNoteRequest';
import { GetJuryEvaluationNoteRequest } from '../interfaces/requests/GetJuryEvaluationNoteRequest';

@Injectable({
  providedIn: 'root'
})
export class GraduateworkService {

  constructor(private http: HttpClient) { }

  getProposals():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/proposals`,{headers});
  }

  getGraduateWorkById(graduateWorkId: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/data/${graduateWorkId}`,{headers});
  }

  getGraduateWorkByStatus(statusCode: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/by/status/${statusCode}`,{headers});
  }

  getGraduateWorkStudentData(graduateWorkId: string) : Observable <any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/student/data/${graduateWorkId}`,{headers});
  }
  getCurrentGraduateWork( studentDNI: string ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/proposal/student/${studentDNI}`,{headers});
  }

  getCoordinatorEvaluationStatus( graduateWorkId: string ){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/coordinator/proposal/evaluation/status/${graduateWorkId}`,{headers});
  }

  approveCoordinatorEvaluation ( profesorDNI: string, graduateWorkId: string ) : Observable<any>{ 
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "professorDNI": profesorDNI,
      "graduateWorkId": graduateWorkId
    }
    console.log(body)
    return this.http.post(`${environment.apiUrl}/graduate-work/coordinator/proposal/evaluation/status/approve`,body,{headers});
  }

  getReviewers():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/proposals/reviewers`,{headers});
  }

  addAcademicTutorEvaluation(professorDNI:string,graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      professorDNI: professorDNI,
      graduateWorkId: graduateWorkId
    }
    console.log(body)
    return this.http.post(`${environment.apiUrl}/graduate-work/add/tutor/revision`,body,{headers});
  }

  getReviewersPending():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/proposals/reviewers/pending`,{headers});
  }

  getJuryPending() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/jury/pending`,{headers});
  }

  getDefensePending( ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/defense/pending`,{headers});
    
  }

  changeStatus(graduateWorkId: string, statusCode: number):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "estatusCode": statusCode,
      "graduateWorkId": graduateWorkId
    }
    return this.http.put(`${environment.apiUrl}/graduate-work/change/estatus`,body,{headers});
  }

  getCriteria():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criteria`,{headers});
  }

  getGraduateWorkReviewer( graduateWorkId: string ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/reviewer`,{"graduateWorkId": graduateWorkId},{headers});
  }

  getReviewerEvaluationCriteria(reviewerEvaluation: { graduateWorkId: string, professorDNI: string }) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/list/reviewer/evaluation/criteria`,reviewerEvaluation,{headers});
  }

  getRevierwerCriteriaByModelAndSchool(schoolName: string, criteriaModel: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/criteria/escuela/${schoolName}/modelo/${criteriaModel}`,{headers});
  }

  approveReviewerEvaluation(reviewerEvaluation: SetReviewerEvaluationRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/reviewer/evaluation/approve`,reviewerEvaluation,{headers});
  }

  reproveReviewerEvaluation(reviewerEvaluation: SetReviewerEvaluationRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/reviewer/evaluation/reprove`,reviewerEvaluation,{headers});
  }

  approveReviewerEvaluationCriteria(reviewerEvaluationCriteria: SetReviewerEvaluationCriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/reviewer/evaluation/criteria/approve`,reviewerEvaluationCriteria,{headers});
  }

  reproveReviewerEvaluationCriteria(reviewerEvaluationCriteria: SetReviewerEvaluationCriteriaRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/reviewer/evaluation/criteria/reprove`,reviewerEvaluationCriteria,{headers});
  }

  createReviewerCriteria (criteriaData: CreateReviewerCriteriaRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/criteria`,criteriaData,{headers});
  }

  updateReviewerCriteria (criteriaData: CreateReviewerCriteriaRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/criteria`,criteriaData,{headers});
  }

  createReviewerEvaluation (reviewerEvaluation: CreateReviewerEvaluationRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/create/reviewer/evaluation`,reviewerEvaluation,{headers});
  }

  createReviewerEvaluationCriteria (reviewerEvaluationCriteria: CreateReviewerEvaluationCriteriaRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/create/reviewer/evaluation/criteria`,reviewerEvaluationCriteria,{headers});
  }

  sendProposalToReviewer(data: any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/graduate-work/proposals/reviewers`,data,{headers});
  }

  getCouncilPending():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/council/pending`,{headers});
  }

  getFinalDefensePending(professorDNI: string) : Observable <any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/final/defense/pending/${professorDNI}`,{headers});
  }

  setGraduateWorkCouncil(data: any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/graduate-work/council`,data,{headers});
  }

  uploadProposalFile(file: any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.amazonS3}/upload`,file,{headers});
  }

  getCoordinatorEvaluationCount( graduateWorkId: string ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/reviewer/count/${graduateWorkId}`,{headers});
  }

  uploadProposalCoordinatorEvaluationFile(file: File, studentData: any,coordinatorData: any) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();

    console.log(studentData)
    console.log(coordinatorData)

    formData.append('file', file);
    formData.append('studentData', JSON.stringify(studentData));
    formData.append('coordinatorData', JSON.stringify(coordinatorData));

    return this.http.post(`${environment.amazonS3}/upload/graduatework/coordinator/evaluation`,formData,{headers});
  }

  downloadProposalCoordinatorEvaluationFile(fileName: string) : Observable<any> {
    const body = {
      "fileName": fileName
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.amazonS3}/download/proposal/evaluation`,body,{headers});
  }

  approveLastCoordinatorEvaluation(graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/coordinator/proposal/evaluation/approve/last`,body,{headers});
  }

  uploadRevision(file: any,studentData: any) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentData', JSON.stringify(studentData));
    return this.http.post(`${environment.amazonS3}/upload/graduatework/revision`,formData,{headers});
  }

  approveAcademicTutorRevision(professorDNI: string,graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      professorDNI: professorDNI,
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/professor/tutor/graduatework/revision/approve`,body,{headers});
  }

  getAcademicTutorGraduateWorksCount(professorDNI: string,graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      professorDNI: professorDNI,
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/tutor/revision/count`,body,{headers});
  }

  uploadFinalSubmittion ( file : any, studentData: any,escuela: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('escuela', escuela);
    formData.append('studentData', JSON.stringify(studentData));
    return this.http.post(`${environment.amazonS3}/upload/graduatework/final`,formData,{headers});
  }

  downloadProposalFile(fileName: string):Observable<any>{

    const body = {
      "fileName": fileName
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.amazonS3}/download`,body,{headers});
  }

  listProposalFiles(schoolName: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.amazonS3}/list/${schoolName}`,{headers});
  }

  listFinalFiles() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.amazonS3}/graduatework/final/files`,{headers});
  }

  getGraduateWorkFileNames() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.amazonS3}/graduatework/files`,{headers});
  }

  getGraduateWorProposalsFileNames() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.amazonS3}/graduatework/proposals/files`,{headers});
  }

  getGraduateWorReviewsFileNames() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.amazonS3}/graduatework/reviews/files`,{headers});
  }

  downloadGraduateWorkFile( fileName: string ) : Observable<any> {
    const body = {
      "fileName": fileName
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.amazonS3}/download/graduatework`,body,{headers});
  }

  getAcademicTutorGraduateWork( professorDNI: string ) : Observable<any> {
    const body = {
      "professorDNI": professorDNI
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/professor/tutor/graduatework`,body,{headers});
  }

  verifyAcademicTutorRevisionPending(professorDNI: string, graduateWorkId: string) : Observable<any> {
    const body = {
      "professorDNI": professorDNI,
      "graduateWorkId": graduateWorkId
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/verify/tutor/revision/pending`,body,{headers});
  }

  getAcademicTutorRevisionCount(professorDNI: string, graduateWorkId: string) : Observable<any> {
    const body = {
      "professorDNI": professorDNI,
      "graduateWorkId": graduateWorkId
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/tutor/revision/count`,body,{headers});

  }

  getGraduateWorkStudents( graduateWorkId: string ) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/students/${graduateWorkId}`,{headers});
  }

  getRemainingDays( graduateWorkId: string ) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/remaining/days/${graduateWorkId}`,{headers});
  }

  createJury( professorDNI: string,schoolCouncilId: string, graduateWorkId: string, juryType: string = 'PRINCIPAL') : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "graduateWorkId": graduateWorkId,
      "schoolCouncilId": schoolCouncilId,
      "professorDNI": professorDNI,
      "juryType": juryType
    } 
    console.log(body)
    return this.http.post(`${environment.apiUrl}/graduate-work/create/jury`,body,{headers});
  }

  setDefenseDate (date: Date,location: string, graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "graduateWorkId": graduateWorkId,
      "graduateWorkDefenseDate": date,
      "graduateWorkDefenseLocation": location
    } 
    console.log(body)
    return this.http.put(`${environment.apiUrl}/graduate-work/change/defense/date`,body,{headers});
  } 

  setDefenseNote(graduateWorkId: string, professorDNI: string, note: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "graduateWorkId": graduateWorkId,
      "professorDNI": professorDNI,
      "note": note
    } 
    console.log(body)
    return this.http.post(`${environment.apiUrl}/graduate-work/final/defense/note`,body,{headers});
  }

  createCoordinatorEvaluation(coordinatorEvaluation: CreateCoordinatorRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/coordinator/proposal/evaluation`,coordinatorEvaluation,{headers});
  }

  generateCoordinatorEvaluation(coordinatorEvaluation: GenerateCoordinatorRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/coordinator/proposal/evaluation/create`,coordinatorEvaluation,{headers});
  }

  getJuryisPresent(juryDNI: string, graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI,
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/ispresent`,body,{headers});
  }

  setJuryisPresent(juryDNI: string, graduateWorkId: string, isPresent: boolean) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI,
      graduateWorkId: graduateWorkId,
      isPresent: isPresent
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/ispresent/set`,body,{headers});
  }

  designateJuryPresident(juryDNI: string, graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI,
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/designate/president`,body,{headers});
  }

  getJuryData(juryDNI: string, graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI,
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/data`,body,{headers});
  }

  /* Zona de Criterios y Secciones de Trabajo de Grado */
    /* Evaluaciones de Jurado Principal en Trabajo de Grado Experimental */
  getJuryReportExperimentalCriteria(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/report/criteria/experimental/${schoolName}`,{headers});
  }

  getJuryReportExperimentalSeccion(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/report/seccion/experimental/${schoolName}`,{headers});
  }

  getJuryOralExperimentalCriteria(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/oral/criteria/experimental/${schoolName}`,{headers});
  }

  getJuryOralExperimentalSeccion(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/oral/seccion/experimental/${schoolName}`,{headers});
  }



    /* Evaluaciones de Jurado Principal en Trabajo de Grado Instrumental */
    getJuryReportInstrumentalCriteria(schoolName: string){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(`${environment.apiUrl}/graduate-work/juries/report/criteria/instrumental/${schoolName}`,{headers});
    }
  
    getJuryReportInstrumentalSeccion(schoolName: string){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(`${environment.apiUrl}/graduate-work/juries/report/seccion/instrumental/${schoolName}`,{headers});
    }
  
    getJuryOralInstrumentalCriteria(schoolName: string){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(`${environment.apiUrl}/graduate-work/juries/oral/criteria/instrumental/${schoolName}`,{headers});
    }
  
    getJuryOralInstrumentalSeccion(schoolName: string){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');
      return this.http.get(`${environment.apiUrl}/graduate-work/juries/oral/seccion/instrumental/${schoolName}`,{headers});
    }












  getTutorOraltExperimentalCriteria(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/oral/criteria/experimental/${schoolName}`,{headers});
  }
  getTutorReportExperimentalCriteria(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/report/criteria/experimental/${schoolName}`,{headers});
  }

  getTutorReportExperimentalSeccion(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/report/seccion/experimental/${schoolName}`,{headers});
  }

  getTutorOralInstrumentalCriteria(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/oral/criteria/instrumental/${schoolName}`,{headers});
  }

  getTutorOralInstrumentalSeccion(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/oral/seccion/instrumental/${schoolName}`,{headers});
  }


  getTutorReportInstrumentalCriteria(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/report/criteria/instrumental/${schoolName}`,{headers});
  }

  getTutorReportInstrumentalSeccion(schoolName: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/juries/tutor/report/seccion/instrumental/${schoolName}`,{headers});
  }












  /* Zona de Notas de Trabajo de Grado*/
  setTutorOralFinalNote(juryDNI: string, studentDNI: string, graduateWorkId: string, evaluationNote: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI, 
      studentDNI: studentDNI, 
      graduateWorkId: graduateWorkId, 
      evaluationNote: evaluationNote
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/set/oral/note`,body,{headers});
  }

  setTutorReportFinalNote(juryDNI: string, studentDNI: string, graduateWorkId: string, evaluationNote: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI, 
      studentDNI: studentDNI, 
      graduateWorkId: graduateWorkId, 
      evaluationNote: evaluationNote
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/set/report/note`,body,{headers});
  }

  setJuryOralFinalNote(juryDNI: string, studentDNI: string, graduateWorkId: string, evaluationNote: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI, 
      studentDNI: studentDNI, 
      graduateWorkId: graduateWorkId, 
      evaluationNote: evaluationNote
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/principal/set/oral/note`,body,{headers});
  }

  setJuryReportFinalNote(juryDNI: string, studentDNI: string, graduateWorkId: string, evaluationNote: number){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI, 
      studentDNI: studentDNI, 
      graduateWorkId: graduateWorkId, 
      evaluationNote: evaluationNote
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/principal/set/report/note`,body,{headers});
  }

  getHasTutorSubmittedFinalNote(juryDNI: string,graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI, 
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/get/submmitted`,body,{headers});
  }

  getHasjurySubmittedFinalNote(juryDNI: string,graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      juryDNI: juryDNI, 
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/get/submmitted`,body,{headers});
  }

  getHasjuryPresident(graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/validate/president`,body,{headers});
  }

  getAllNotesValidation(graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/validate/all`,body,{headers});
  }

  getJuryOralNotes(graduateWorkId: string,juryDNI: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryDNI: juryDNI
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/get/oral/note`,body,{headers});
  }

  getJuryReportNotes(graduateWorkId: string,juryDNI: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryDNI: juryDNI
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/get/report/note`,body,{headers});
  }

  getTutorOralNotes(graduateWorkId: string,juryDNI: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryDNI: juryDNI
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/get/oral/note`,body,{headers});
  }

  getTutorReportNotes(graduateWorkId: string,juryDNI: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryDNI: juryDNI
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/get/report/note`,body,{headers});
  }

  getPresidentOralNotes(graduateWorkId: string,juryDNI: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryDNI: juryDNI
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/president/get/oral/note`,body,{headers});
  }

  getPresidentReportNotes(graduateWorkId: string,juryDNI: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryDNI: juryDNI
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/president/get/report/note`,body,{headers});
  }

  getGraduateWorkJuries(graduateWorkId: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/get`,body,{headers});
  }

  addJuryOralEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/add/criteria/note/oral`,juryEvaluationData,{headers});
  }

  addJuryReportEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/add/criteria/note/report`,juryEvaluationData,{headers});
  }

  addTutorOralEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/add/criteria/note/oral`,juryEvaluationData,{headers});
  }

  addTutorReportEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/add/criteria/note/report`,juryEvaluationData,{headers});
  }

  getTutorOralEvaluationNote(juryEvaluationData: GetJuryEvaluationNoteRequest) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/get/criteria/note/oral`,juryEvaluationData,{headers});
  }

  getTutorReportEvaluationNote(juryEvaluationData: GetJuryEvaluationNoteRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/tutor/get/criteria/note/report`,juryEvaluationData,{headers});
  }

  getJuryReportEvaluationNote(juryEvaluationData: GetJuryEvaluationNoteRequest) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/get/criteria/note/report`,juryEvaluationData,{headers});
  }

  getJuryOralEvaluationNote(juryEvaluationData: GetJuryEvaluationNoteRequest) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/get/criteria/note/oral`,juryEvaluationData,{headers});
  }

  getGraduateWorkJuryByRol(graduateWorkId: string, juryType: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      juryType: juryType
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/juries/jury/get/data`,body,{headers});
  }

  changeTutorOralEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/graduate-work/juries/tutor/get/criteria/note/oral`,juryEvaluationData,{headers});
  }

  changeTutorReportEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/graduate-work/juries/tutor/get/criteria/note/report`,juryEvaluationData,{headers});
  }

  changeJuryReportEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/graduate-work/juries/jury/get/criteria/note/report`,juryEvaluationData,{headers});
  }

  changeJuryOralEvaluationNote(juryEvaluationData: AddJuryEvaluationNote) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/graduate-work/juries/jury/get/criteria/note/oral`,juryEvaluationData,{headers});
  }

  chargeFinalNote( graduateWorkId: string, finalNote: number, mention: string ){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      graduateWorkId: graduateWorkId,
      finalNote: finalNote,
      mention: mention
    }
    return this.http.post(`${environment.apiUrl}/graduate-work/final/note/charge`,body,{headers});
  }

  isCulminated(studentDNI: string) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/culminated/${studentDNI}`,{headers});
  }

  
}
