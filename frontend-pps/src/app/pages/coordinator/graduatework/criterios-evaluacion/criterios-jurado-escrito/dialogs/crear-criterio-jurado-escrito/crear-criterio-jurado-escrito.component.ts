import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { CriteriosJuradoOralService } from 'src/app/services/criterios-tg/criterios-jurado-oral.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-crear-criterio-jurado-escrito',
  templateUrl: './crear-criterio-jurado-escrito.component.html',
  styleUrls: ['./crear-criterio-jurado-escrito.component.css']
})
export class CrearCriterioJuradoEscritoComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private seccionService: CriteriosJuradoEscritoService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ){
    console.log(this.data)
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

  CriteriaForm: FormGroup = new FormGroup({
    criteriaName: new FormControl('',Validators.required),
    maxNote: new FormControl('',Validators.required)
  })

  crearSeccion(){
    if(this.CriteriaForm.valid){
      this.cargadoArchivos = true
      console.log(this.CriteriaForm.value)
      this.seccionService.createJuradoEscritoCriteria({
        criteriaName: this.CriteriaForm.value.criteriaName,
        maxNote: this.CriteriaForm.value.maxNote,
        schoolName: this.userData.schoolName,
        criteriaModel: "EXPERIMENTAL",
        model: "EXPERIMENTAL",
        seccionId: this.data.data.seccionId,
        criteriaId: 0,
        criteriaDescription: ""
      }
      ).subscribe({
        complete: () => {
          console.log("Completado")
        }
      })
    }else{

    }
  }
}
