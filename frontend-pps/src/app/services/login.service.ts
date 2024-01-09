import { Injectable } from '@angular/core';
import { LoginRequest} from '../interfaces/LoginRequest'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

interface UserData {
  userDNI: string;
  mode: string;
}


@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private loginData: UserData = {
    userDNI: '',
    mode: ''
  };

  private isRoleSelectedService: boolean = false;
  constructor(private http: HttpClient) { }

  getLoginData(){
    return this.loginData
  }

  setLoginData(datos: UserData){
    this.loginData = datos;
  }

  login(credentials: LoginRequest):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/users/validate`,credentials,{headers});
  }

  getIsRoleSelected(){
    return this.isRoleSelectedService;
  }

  setIsRoleSelected(newValue: boolean){
    this.isRoleSelectedService = newValue
  }
}
