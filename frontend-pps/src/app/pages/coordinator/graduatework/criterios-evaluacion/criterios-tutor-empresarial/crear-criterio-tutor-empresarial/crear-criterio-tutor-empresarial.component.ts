import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriosTutorEmpresarialService } from 'src/app/services/criterios-tg/criterios-tutor-empresarial.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-crear-criterio-tutor-empresarial',
  templateUrl: './crear-criterio-tutor-empresarial.component.html',
  styleUrls: ['./crear-criterio-tutor-empresarial.component.css']
})
export class CrearCriterioTutorEmpresarialComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private graduateWorkServiceService: GraduateworkService,
    private criteriaService: CriteriosTutorEmpresarialService,
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

  criteriaForm: FormGroup = new FormGroup({
    criteriaName: new FormControl('',Validators.required),
    maxNote: new FormControl('',Validators.required),
  })

  crearSeccion(){
    if(this.criteriaForm.valid){
      this.cargadoArchivos = true
      console.log(this.criteriaForm.value)
      this.criteriaService.crearCriterioTutorEmpresarial({
        criteriaId: 0,
        criteriaName: this.criteriaForm.value.criteriaName,
        maxNote: this.criteriaForm.value.maxNote,
        schoolName: this.userData.schoolName
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
