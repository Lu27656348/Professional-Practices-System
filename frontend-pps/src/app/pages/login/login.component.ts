import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginRequest } from '../../interfaces/LoginRequest'
import { LoginService } from '../../services/login.service'
import { UsersService } from '../../services/users.service'
import { RegisterService } from '../../services/register.service'
import { NavbarService } from 'src/app/services/navbar.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  formatSelected : string = "V-"

  dataBs: any;
  dataService$: Subscription = new Subscription();

  loginForm = this.formBuilder.group({
    userDNI: ['',[Validators.required,Validators.pattern(/^[0-9]+$/)]],
    password: ['',Validators.required]
  })

  ngOnInit(): void {}

  constructor(private formBuilder: FormBuilder, private router: Router, private LoginService: LoginService, private UserService: UsersService, private registerService: RegisterService, private navbarService: NavbarService){
    this.LoginService.getWelcomeData().subscribe({
      next: (welcomeData) => {
        console.log(welcomeData)
      }
    })
    
  }

  get userDNI(){
    return this.loginForm.controls.userDNI;
  }

  get password(){
    return this.loginForm.controls.password;
  }

 login(){

    if(this.loginForm.valid){
      const body : LoginRequest = {
        userDNI: this.formatSelected + this.loginForm.value.userDNI as string,
        password: this.loginForm.value.password as string
      }
      console.log(body)
      
      this.LoginService.login(body as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData)
          if(userData){
            this.LoginService.setLoginData({
              userDNI: body.userDNI as string,
              mode: ''
            })
            this.UserService.getUserRoles(body.userDNI as string).subscribe({
              next: (userData) => {
                console.log(userData)
                if(userData[0].length > 1){
                  if(userData[0].indexOf('Coordinator')){
                    console.log("%cEL PROFESOR ES COORDINADOR", "color: red")
                    this.navbarService.setRole("Coordinator")
                    let data: any = this.LoginService.getLoginData();
                    localStorage.setItem('user', JSON.stringify(data));
                    localStorage.setItem('roles', JSON.stringify(['Coordinator']));
                    this.router.navigateByUrl("dashboard");
                    this.loginForm.reset();
                    return;
                  }
                }
                let data: any = this.LoginService.getLoginData();
                const dataRequest = this.LoginService.getLoginData();
                this.navbarService.setRole(userData[0])
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('roles', JSON.stringify(userData[0]));
                
                this.loginForm.reset();
              },
              error: (errorData) => {
                console.log("errorData")
                console.log(errorData)
              },
              complete: () => {
                console.log("login completo")
                this.router.navigateByUrl("dashboard");
              }
            })
          }else{
            this.loginForm.markAllAsTouched();
            alert("Usuario o clave incorrectos");
          }
        },
        error: (errorData) => {
          console.log("errorData")
          console.log(errorData)
        },
        complete: () => {
          console.log("login completo")
        }
      })
      
    }else{
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos");
    }
  }

  register(){

    console.log("Registrando")
    this.router.navigateByUrl("register");
    
  }
}
