import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../../services/login.service';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professor-gw',
  templateUrl: './professor-gw.component.html',
  styleUrls: ['./professor-gw.component.css']
})
export class ProfessorGWComponent implements OnInit{
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService){}

  ngOnInit(){
  }

  goBack(){
    this.router.navigateByUrl("/dashboard");
  }
}
