import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginRequest } from '../../interfaces/LoginRequest'
import { LoginService } from '../../services/login.service'
import { UsersService } from '../../services/users.service'
import { RegisterService } from '../../services/register.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  dataBs: any;
  dataService$: Subscription = new Subscription();

  loginForm = this.formBuilder.group({
    userDNI: ['',[Validators.required]],
    password: ['',Validators.required]
  })

  ngOnInit(): void {}

  constructor(private formBuilder: FormBuilder, private router: Router, private LoginService: LoginService, private UserService: UsersService, private registerService: RegisterService){}

  get userDNI(){
    return this.loginForm.controls.userDNI;
  }

  get password(){
    return this.loginForm.controls.password;
  }

 login(){

    if(this.loginForm.valid){
      const body = this.loginForm.value
      this.LoginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData)
          if(userData){
            this.LoginService.setLoginData({
              userDNI: body.userDNI as string,
              mode: ''
            })
            this.UserService.getUserRoles(body.userDNI as string).subscribe({
              next: (userData) => {

                let data: any = this.LoginService.getLoginData();
                const dataRequest = this.LoginService.getLoginData();
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('roles', JSON.stringify(userData[0]));
                this.router.navigateByUrl("dashboard");
                this.loginForm.reset();
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
