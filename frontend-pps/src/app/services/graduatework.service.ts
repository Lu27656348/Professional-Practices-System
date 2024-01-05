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
}
