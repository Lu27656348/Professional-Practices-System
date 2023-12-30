import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  behaviorSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  setData(data: any){
    this.behaviorSubject.next(data);
  }

  getData(){
    return this.behaviorSubject.asObservable();
  }
}
