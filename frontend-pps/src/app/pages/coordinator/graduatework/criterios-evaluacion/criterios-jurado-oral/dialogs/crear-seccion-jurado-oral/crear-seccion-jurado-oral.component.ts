import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriosJuradoOralService } from 'src/app/services/criterios-tg/criterios-jurado-oral.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-crear-seccion-jurado-oral',
  templateUrl: './crear-seccion-jurado-oral.component.html',
  styleUrls: ['./crear-seccion-jurado-oral.component.css']
})
export class CrearSeccionJuradoOralComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private seccionService: CriteriosJuradoOralService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
        }
      })
    }
  }

  cargadoArchivos: boolean = false

  SeccionForm: FormGroup = new FormGroup({
    seccionName: new FormControl('',Validators.required),
    maxNote: new FormControl('',Validators.required)
  })

  crearSeccion(){
    if(this.SeccionForm.valid){
      this.cargadoArchivos = true
      console.log(this.SeccionForm.value)
      this.seccionService.createJuradoOralSeccion({
        seccionName: this.SeccionForm.value.seccionName,
        maxNote: this.SeccionForm.value.maxNote,
        schoolName: this.userData.schoolName,
        criteriaModel: this.data.model,
        seccionId: 0
      }
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
    }else{

    }
  }
}
