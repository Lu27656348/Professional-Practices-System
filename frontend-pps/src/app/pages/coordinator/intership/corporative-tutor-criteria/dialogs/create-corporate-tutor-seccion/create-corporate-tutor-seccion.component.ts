import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-corporate-tutor-seccion',
  templateUrl: './create-corporate-tutor-seccion.component.html',
  styleUrls: ['./create-corporate-tutor-seccion.component.css']
})
export class CreateCorporateTutorSeccionComponent {
  userData: any = null

  constructor(
    private userService: UsersService,
    private seccionService: CriteriosTutorEmpresarialService
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
      this.seccionService.createCorporativeTutorSeccion(
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
