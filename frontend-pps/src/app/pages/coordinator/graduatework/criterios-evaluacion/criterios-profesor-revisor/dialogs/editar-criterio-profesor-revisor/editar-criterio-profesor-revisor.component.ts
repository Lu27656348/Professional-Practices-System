import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-editar-criterio-profesor-revisor',
  templateUrl: './editar-criterio-profesor-revisor.component.html',
  styleUrls: ['./editar-criterio-profesor-revisor.component.css']
})
export class EditarCriterioProfesorRevisorComponent {
  userData: any = null
  criteriaForm: any = this.formBuilder.group({
    reviewerCriteriaId: new FormControl(),
    reviewerCriteriaDescription: new FormControl(),
  });
  reviewerCriteriaDescription: any = ""
  constructor(
    private userService: UsersService,
    private graduateWorkServiceService: GraduateworkService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private formBuilder: FormBuilder,
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
          console.log(this.data)
          this.criteriaForm = this.formBuilder.group({
            reviewerCriteriaId: new FormControl(this.data.data.reviewerCriteriaId),
            reviewerCriteriaDescription: new FormControl(this.data.data.reviewerCriteriaDescription),
          })
          this.reviewerCriteriaDescription = this.data.data.reviewerCriteriaDescription
        }
      })
    }
  }

  cargadoArchivos: boolean = false


  crearSeccion(){
    if(this.criteriaForm.valid){
      this.cargadoArchivos = true
      console.log(this.criteriaForm.value)
      
      this.graduateWorkServiceService.updateReviewerCriteria({
        reviewerCriteriaId: this.criteriaForm.value.reviewerCriteriaId,
        reviewerCriteriaDescription: this.criteriaForm.value.reviewerCriteriaDescription,
        schoolName: this.userData.schoolName,
        criteriaModel: this.data.data.schoolName
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
