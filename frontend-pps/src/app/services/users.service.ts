import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateUserRequest } from '../interfaces/requests/CreateUserRequest';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private mode: string = '';

  constructor(private http: HttpClient) { }

  getUserRoles(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/users/roles/${userDNI}`,{headers});
  }

  getUserData(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/users/${userDNI}`,{headers});
  }

  createUser( userData: CreateUserRequest ){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/users/create`,userData,{headers});
  }

  updateUser( userData: CreateUserRequest ){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/users/put`,userData,{headers});
  }

  getMode(){
    return this.mode;
  }

  setMode(mode: string ){
    this.mode = mode;
  }

  deleteUserById(userDNI: string) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${environment.apiUrl}/users/${userDNI}`,{headers});
  }
}
