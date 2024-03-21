import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriosTutorEscritoService } from 'src/app/services/criterios-tg/criterios-tutor-escrito.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-crear-criterio-tutor-escrito',
  templateUrl: './crear-criterio-tutor-escrito.component.html',
  styleUrls: ['./crear-criterio-tutor-escrito.component.css']
})
export class CrearCriterioTutorEscritoComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private seccionService: CriteriosTutorEscritoService,
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
      this.seccionService.createTutorEscritoCriteria({
        criteriaName: this.CriteriaForm.value.criteriaName,
        maxNote: this.CriteriaForm.value.maxNote,
        schoolName: this.userData.schoolName,
        criteriaModel: this.data.data.criteriaModel,
        model: this.data.data.criteriaModel,
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
