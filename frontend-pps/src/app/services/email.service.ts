import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SendEmailRequest } from '../interfaces/requests/SendEmailRequest';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmailMessage(emailData: SendEmailRequest): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.emailAPI}/email/send`,emailData,{headers});
  }

  sendEmail(file:File, emailData: SendEmailRequest): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData()
    formData.append('file', file)
    formData.append('emailData', JSON.stringify(emailData))
    return this.http.post(`${environment.emailAPI}/email/send/file`,formData,{headers});
  }

  sendMultipleEmail(file:File[], emailData: SendEmailRequest): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData()
    file.forEach(archivo => formData.append('file', archivo));
    formData.append('emailData', JSON.stringify(emailData))
    return this.http.post(`${environment.emailAPI}/email/send/multiple/file`,formData,{headers});
  }
}
