import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-crear-criterio-profesor-revisor',
  templateUrl: './crear-criterio-profesor-revisor.component.html',
  styleUrls: ['./crear-criterio-profesor-revisor.component.css']
})
export class CrearCriterioProfesorRevisorComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private graduateWorkServiceService: GraduateworkService,
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
    reviewerCriteriaDescription: new FormControl('',Validators.required),
  })

  crearSeccion(){
    if(this.criteriaForm.valid){
      this.cargadoArchivos = true
      console.log(this.criteriaForm.value)
      this.graduateWorkServiceService.createReviewerCriteria({
        reviewerCriteriaId: null,
        reviewerCriteriaDescription: this.criteriaForm.value.reviewerCriteriaDescription,
        schoolName: this.userData.schoolName,
        criteriaModel: this.data.model
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
