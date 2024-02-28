import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-academic-tutor-seccion',
  templateUrl: './create-academic-tutor-seccion.component.html',
  styleUrls: ['./create-academic-tutor-seccion.component.css']
})
export class CreateAcademicTutorSeccionComponent {

  userData: any = null

  constructor(
    private userService: UsersService,
    private seccionService: CriteriosTutorAcademicoService
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

  academicSeccionForm: FormGroup = new FormGroup({
    seccionName: new FormControl('',Validators.required),
    maxNote: new FormControl('',Validators.required)
  })

  crearSeccion(){
    if(this.academicSeccionForm.valid){
      this.cargadoArchivos = true
      console.log(this.academicSeccionForm.value)
      this.seccionService.createAcademicTutorSeccion(
        this.academicSeccionForm.value.seccionName,
        this.academicSeccionForm.value.maxNote,
        this.userData.schoolName
      ).subscribe({
        complete: () => {
          window.location.href = window.location.href
        }
      })
    }else{

    }
  }
}
