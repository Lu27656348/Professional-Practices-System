import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private mode: string = '';

  constructor(private http: HttpClient) { }

  getUserRoles(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/users/roles/${userDNI}`,{headers});
  }

  getUserData(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/users/${userDNI}`,{headers});
  }

  getMode(){
    return this.mode;
  }

  setMode(mode: string ){
    this.mode = mode;
  }
}
