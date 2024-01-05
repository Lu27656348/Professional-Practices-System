import { Component,OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { NavbarService } from '../../services/navbar.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit{

  roleSelected: any;
  user: any = {};
  roles: string[] = [];
  localUser: any;
  data: any = null;
  
  isRoleSelected: boolean = false


  dataBs: any;
  dataService$: Subscription = new Subscription();

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService,private dataService: NavbarService){
    this.dataService.getData().subscribe({
      next: (data: any) => {
        this.dataBs = data;
        console.log(this.dataBs)
      },
      error: (error: any) => {
        this.dataBs = '';
        console.log("error")
      }
    })
  }

  

  ngOnInit(){
    this.loginService.setIsRoleSelected(false);
    const userString = localStorage.getItem('user');
    const rolesString = localStorage.getItem('roles');

    if(userString && rolesString){
      console.log("LOCAL STORAGE")
      this.localUser = JSON.parse(userString);
      this.userService.getUserData(this.localUser.userDNI).subscribe({
        next: (userData) => {
          console.log("userData")
          console.log(userData)
          this.user = {...userData}
        },
        error: (errorData) => {
          console.log("errorData")
          console.log(errorData)
        },
        complete: () => {
          console.log("login completo")
        }
      })
      const rolesRequest = JSON.parse(rolesString);
      console.log(rolesRequest)
      for (let i = 0; i < rolesRequest.length; i++) {
        this.roles.push(rolesRequest[i]);
      }
      console.log(this.localUser.userDNI);
    }else{
      this.router.navigateByUrl("");
    }

  }

  onSelectionChange(){
    this.loginService.setIsRoleSelected(true);
    this.dataService.setData(true);
    this.dataService.setRole(this.roleSelected);
    this.userService.setMode(this.roleSelected);
    console.log(this.roleSelected);
  }

  logOut(){
    this.roleSelected = '';
    this.isRoleSelected = false;
    this.data = null;
    this.roles = [];
    this.dataService.setData(false);
    localStorage.removeItem("roles");
    localStorage.removeItem("user");
    this.router.navigateByUrl("");
  }
}
