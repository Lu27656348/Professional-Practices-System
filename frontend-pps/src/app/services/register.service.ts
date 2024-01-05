import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegisterRequest } from '../interfaces/RegisterRequest'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  registerSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  setData(data: any){
    this.registerSubject.next(data);
  }

  getData(){
    return this.registerSubject.asObservable();
  }

  registration(registerRequest: RegisterRequest) : Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8081/users/registration`,registerRequest,{headers});
  }
}
