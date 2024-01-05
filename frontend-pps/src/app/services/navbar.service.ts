import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  behaviorSubject = new BehaviorSubject<boolean>(false);
  roleSubject = new BehaviorSubject<string>('');

  constructor() { }

  setRole(data: string){
    this.roleSubject.next(data);
  }

  getRole(){
    return this.roleSubject.asObservable();
  }

  setData(data: any){
    this.behaviorSubject.next(data);
  }

  getData(){
    return this.behaviorSubject.asObservable();
  }
}
