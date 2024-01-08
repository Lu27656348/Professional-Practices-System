import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraduateworkService {

  constructor(private http: HttpClient) { }

  getProposals():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/proposals`,{headers});
  }

  getGraduateWorkById(graduateWorkId: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/data/${graduateWorkId}`,{headers});
  }

  getCurrentGraduateWork( studentDNI: string ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/proposal/student/${studentDNI}`,{headers});
  }

  getReviewers():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/proposals/reviewers`,{headers});
  }

  getReviewersPending():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/proposals/reviewers/pending`,{headers});
  }

  getJuryPending() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/jury/pending`,{headers});
  }

  getDefensePending( ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/defense/pending`,{headers});
    
  }

  changeStatus(graduateWorkId: string, statusCode: number):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "estatusCode": statusCode,
      "graduateWorkId": graduateWorkId
    }
    return this.http.put(`http://localhost:8081/graduate-work/change/estatus`,body,{headers});
  }

  getCriteria():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/criteria`,{headers});
  }

  sendProposalToReviewer(data: any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`http://localhost:8081/graduate-work/proposals/reviewers`,data,{headers});
  }

  getCouncilPending():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/council/pending`,{headers});
  }

  getFinalDefensePending(professorDNI: string) : Observable <any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/final/defense/pending/${professorDNI}`,{headers});
  }

  setGraduateWorkCouncil(data: any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`http://localhost:8081/graduate-work/council`,data,{headers});
  }

  uploadProposalFile(file: any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8082/upload`,file,{headers});
  }

  uploadRevision(file: any) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`http://localhost:8082/upload/graduatework/revision`,formData,{headers});
  }

  uploadFinalSubmittion ( file : any) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`http://localhost:8082/upload/graduatework/final`,formData,{headers});
  }

  downloadProposalFile(fileName: string):Observable<any>{

    const body = {
      "fileName": fileName
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8082/download`,body,{headers});
  }

  listProposalFiles():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8082/list`,{headers});
  }

  listFinalFiles() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8082/graduatework/final/files`,{headers});
  }

  getGraduateWorkFileNames() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8082/graduatework/files`,{headers});
  }

  getGraduateWorProposalsFileNames() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8082/graduatework/proposals/files`,{headers});
  }

  getGraduateWorReviewsFileNames() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8082/graduatework/reviews/files`,{headers});
  }

  downloadGraduateWorkFile( fileName: string ) : Observable<any> {
    const body = {
      "fileName": fileName
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8082/download/graduatework`,body,{headers});
  }

  getAcademicTutorGraduateWork( professorDNI: string ) : Observable<any> {
    const body = {
      "professorDNI": professorDNI
    }
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8081/graduate-work/professor/tutor/graduatework`,body,{headers});
  }

  getGraduateWorkStudents( graduateWorkId: string ) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/students/${graduateWorkId}`,{headers});
  }

  getRemainingDays( graduateWorkId: string ) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/remaining/days/${graduateWorkId}`,{headers});
  }

  createJury( professorDNI: string,graduateWorkId: string, juryType: number) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "graduateWorkId": graduateWorkId,
      "professorDNI": professorDNI,
      "juryType": juryType
    } 
    console.log(body)
    return this.http.post(`http://localhost:8081/graduate-work/create/jury`,body,{headers});
  }

  setDefenseDate (date: Date, graduateWorkId: string) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const body = {
      "graduateWorkId": graduateWorkId,
      "graduateWorkDefenseDate": date
    } 
    console.log(body)
    return this.http.put(`http://localhost:8081/graduate-work/change/defense/date`,body,{headers});
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
    return this.http.post(`http://localhost:8081/graduate-work/final/defense/note`,body,{headers});
  }
}
