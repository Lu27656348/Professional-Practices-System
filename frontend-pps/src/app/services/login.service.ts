import { Injectable } from '@angular/core';
import { LoginRequest} from '../interfaces/LoginRequest'
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest):Observable<any>{
    return this.http.get("./data.json");
    console.log(credentials);
  }
}
