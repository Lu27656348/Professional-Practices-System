import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-academic-tutor-criteria',
  templateUrl: './create-academic-tutor-criteria.component.html',
  styleUrls: ['./create-academic-tutor-criteria.component.css']
})
export class CreateAcademicTutorCriteriaComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private criteriaService: CriteriosTutorAcademicoService,
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

  academicCriteriaForm: FormGroup = new FormGroup({
    criteriaName: new FormControl('',Validators.required),
    maxNote: new FormControl('',Validators.required)
  })

  crearSeccion(){
    if(this.academicCriteriaForm.valid){
      this.cargadoArchivos = true
      
      console.log(this.academicCriteriaForm.value)
      this.criteriaService.createAcademicTutorCriteria(
        this.academicCriteriaForm.value.criteriaName,
        this.academicCriteriaForm.value.maxNote,
        this.userData.schoolName,
        this.data.seccionId

      ).subscribe({
        complete: () => {
          console.log("Completado")
        }
      })
    }else{

    }
  }
}
