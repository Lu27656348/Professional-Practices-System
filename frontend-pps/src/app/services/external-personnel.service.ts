import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateExternalRequest } from '../interfaces/requests/CreateExternalRequest';

@Injectable({
  providedIn: 'root'
})
export class ExternalPersonnelService {

  constructor(private http: HttpClient) { }

  getInTutors():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/company/tutors`,{headers});
  }

  getAllExternal():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/external`,{headers});
  }

  getExternalById(externalPersonnelDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/external/${externalPersonnelDNI}`,{headers});
  }

  getExternalPersonnelByEnterpriseId(enterpriseId: number) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/external/enterprise/${enterpriseId}`,{headers});
  }

  createExternal( externalData: CreateExternalRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/external`,externalData,{headers});
  }

}
