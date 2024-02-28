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

  previousPath: string | null = null;
  isDashboard: boolean = true;

  roleSelected: any = "Coordinator";
  user: any = {};
  roles: string[] = [];
  localUser: any;
  data: any = null;
  
  isRoleSelected: boolean = false
  userData: any = null


  dataBs: any;
  dataService$: Subscription = new Subscription();

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService,private dataService: NavbarService){
    const localUserRoles = localStorage.getItem('roles')
    const localUserData = localStorage.getItem('user')
    if(localUserRoles && localUserData){
      const roles = JSON.parse(localUserRoles);
      const userData = JSON.parse(localUserData);
      this.dataService.setRole(roles);
      this.userService.getUserData(userData.userDNI).subscribe(
        {
          next: (userData) =>{
            this.userData = userData
            console.log(userData)
          }
        }
      )
    }
    
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

    this.dataService.getIsDashBoard().subscribe({
      next: (isDashboard) => {
        this.isDashboard = isDashboard
      }
    })
    this.dataService.getPreviousPath().subscribe({
      next: (previousPath) => {
        console.log("previousPath " + previousPath)
        this.previousPath = previousPath;
      }
    });
    const userString = localStorage.getItem('user');
    const rolesString = localStorage.getItem('roles');

    console.log("%cExtrayendo del localStorage", 'color: red')
    console.log(userString)
    console.log(rolesString)

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

      this.roleSelected = rolesRequest[0]

      for (let i = 0; i < rolesRequest.length; i++) {
        this.roles.push(rolesRequest[i]);
      }
    }else{
      this.router.navigateByUrl("");
    }

  }

  onSelectionChange(){
    this.loginService.setIsRoleSelected(true);
    this.dataService.setData(true);
    this.dataService.setRole(this.roleSelected);
    this.userService.setMode(this.roleSelected);

    const userString = localStorage.getItem('user');
    if(userString){
      const userObject = JSON.parse(userString);
      userObject.mode = this.roleSelected
      console.log(userObject)
      localStorage.setItem('user', JSON.stringify(userObject));
    }
    console.log(this.roleSelected);
  }

  goBack(){
      this.dataService.getPreviousPath().subscribe({
      next: (previousPath) => {
        console.log(previousPath)
        //window.location.href = previousPath
        const fragment = previousPath.split("/")[3];
        console.log(fragment)
        this.router.navigateByUrl("/" + fragment)
      }
    })
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
