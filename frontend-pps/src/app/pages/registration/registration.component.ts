import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RegisterService } from '../../services/register.service'
import { RegisterRequest } from '../../interfaces/RegisterRequest'



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  dataBs: any;
  dataService$: Subscription = new Subscription();

  registerForm = this.formBuilder.group({
    userDNI: ['',[Validators.required]],
    password: ['',Validators.required],
    userfirstname: ['',Validators.required],
    userlastname: ['',Validators.required],
    useremailucab: ['',Validators.required],
  })

 

  ngOnInit(): void {}

  constructor(private formBuilder: FormBuilder, private router: Router, private registerService: RegisterService){}

  validateEmail(email: string) : string {
    const regex = /@(.*)/;
    const match = email.match(regex);
    const domain = match?.[1];
    return (domain != null ) ? domain : '';
  }

  register(){
    console.log("Registrando")
    if(this.registerForm.valid){
      const body = this.registerForm.value;
      console.log(body);
      if(body.useremailucab){
        switch (this.validateEmail(body.useremailucab)) {
          case 'gmail.com':
            console.log("crear usuario foraneo")
            break;
          case 'ucab.edu.ve':
            console.log("crear usuario profesor")
            break;
          case 'est.ucab.edu.ve':
            console.log("crear usuario estudiante")
            break; 
          default:
            console.log("Error en tipo de usuario")
            break;
        }
        
        this.registerService.registration(body as RegisterRequest).subscribe({
          next: (userData) => {
            console.log("next")
            console.log(userData)
            this.router.navigateByUrl("login");
            this.registerForm.reset();
          },
          error: (errorData) => {
            console.log("error")
          }
        });
        

        
      }
      
      /*
    
      */
    }
  }
}
