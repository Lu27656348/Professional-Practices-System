import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(file:File,from: string, to: string): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData()
    formData.append('file', file)
    formData.append('emailFrom', from)
    formData.append('emailTo', to)
    return this.http.post(`${environment.emailAPI}/email/send/file`,formData,{headers});
  }

  sendMultipleEmail(file:File[],from: string, to: string): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData()
    file.forEach(archivo => formData.append('file', archivo));
    formData.append('emailFrom', from)
    formData.append('emailTo', to)
    return this.http.post(`${environment.emailAPI}/email/send/multiple/file`,formData,{headers});
  }
}
