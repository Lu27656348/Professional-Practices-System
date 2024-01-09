import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private mode: string = '';

  constructor(private http: HttpClient) { }

  getUserRoles(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/${userDNI}`,{headers});
  }

  getUserData(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/users/${userDNI}`,{headers});
  }

  getMode(){
    return this.mode;
  }

  setMode(mode: string ){
    this.mode = mode;
  }
}
