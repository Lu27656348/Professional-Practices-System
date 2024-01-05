import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  isProcessActive(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/validate/user/${userDNI}`,{headers});
  }

  createProposal(data:any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8081/graduate-work/create/proposal`,data,{headers});
  }

  upload(file: File):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post(`http://localhost:8082/upload`,formData,{headers});
  }

  getStudentGraduateWork(studentDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/students/graduate-work/${studentDNI}`,{headers});
  }

  getStudentCoordinator(studentDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/students/coordinator/${studentDNI}`,{headers});
  }

}
