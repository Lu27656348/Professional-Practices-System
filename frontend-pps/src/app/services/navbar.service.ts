import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NavbarService implements OnInit{

  behaviorSubject = new BehaviorSubject<boolean>(false);
  roleSubject = new BehaviorSubject<string>('');
  pathSubject = new BehaviorSubject<string>('');
  previousPathSubject = new BehaviorSubject<string>('');
  isDashBoardSubject = new BehaviorSubject<boolean>(true);

  isRoleSelected: boolean = false;

  roleSelectedNavBar: string | null = null; 

  constructor(private router: Router) { 

  }

  changeIsDashBoard() {
    this.isDashBoardSubject.next(false)
  }

  getIsDashBoard(){
    return this.isDashBoardSubject.asObservable();
  }

  ngOnInit() : void {
  }

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

  setPath(data: string){
    this.pathSubject.next(data);
  }

  getPath(){
    return this.pathSubject.asObservable();
  }

  setPreviousPath(data: string){
    this.previousPathSubject.next(data);
  }

  getPreviousPath(){
    return this.previousPathSubject.asObservable();
  }
}
