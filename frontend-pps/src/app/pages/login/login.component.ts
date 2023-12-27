import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { LoginRequest } from '../../interfaces/LoginRequest'
import { LoginService } from '../../services/login.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    email: ['',[Validators.required,Validators.email,Validators.pattern('^(.+)@(?:est\.ucab\.edu\.ve|gmail\.com|ucab\.edu\.ve)$')]],
    password: ['',Validators.required]
  })

  ngOnInit(): void {}

  constructor(private formBuilder: FormBuilder, private router: Router, private LoginService: LoginService){}

  get email(){
    return this.loginForm.controls.email;
  }

  get password(){
    return this.loginForm.controls.password;
  }

 login(){
    if(this.loginForm.valid){
      this.LoginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData)
        },
        error: (errorData) => {
          console.log(errorData)
        },
        complete: () => {
          console.log("login completo")
        }
      })
      console.log("Llamar al servicio de Login");
      this.router.navigateByUrl("dashboard");
      this.loginForm.reset();
    }else{
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos");
    }
  }
}
