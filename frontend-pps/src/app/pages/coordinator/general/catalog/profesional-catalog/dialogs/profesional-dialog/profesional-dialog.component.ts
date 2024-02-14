import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { createProfessorRequest } from 'src/app/interfaces/CreateProfessorRequest';
import { CreateExternalRequest } from 'src/app/interfaces/requests/CreateExternalRequest';
import { CreateUserRequest } from 'src/app/interfaces/requests/CreateUserRequest';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profesional-dialog',
  templateUrl: './profesional-dialog.component.html',
  styleUrls: ['./profesional-dialog.component.css']
})
export class ProfesionalDialogComponent {
  userForm: FormGroup = new FormGroup({
    cedula: new FormControl('',Validators.required),
    nombres: new FormControl('',Validators.required),
    apellidos: new FormControl('',Validators.required),
    correoElectronico: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required)
  })

  externalForm: FormGroup = new FormGroup({
      empresa: new FormControl('',Validators.required),
      profesion: new FormControl('',Validators.required),
      experiencia: new FormControl('',Validators.required),
      graduacion: new FormControl('',Validators.required),
      oficina: new FormControl('')
      
  })

  nextStep: boolean = false
  emailFormatSelected: string = "@gmail.com"

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  enterpriseList: any = null;

  constructor(private _snackBar: MatSnackBar,private userService: UsersService, private externalService: ExternalPersonnelService,@Inject(MAT_DIALOG_DATA) public data: any, private enterpriseService: EnterpriseService){
    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseList) => {
        this.enterpriseList = enterpriseList
      }
    })

    if(this.data != null){
      console.log("%cHay datos","color: green")
      console.log(data)
      this.userForm.setValue({
        cedula: this.data.data.userDNI,
        nombres: this.data.data.userFirstName,
        apellidos: this.data.data.userLastName,
        correoElectronico: this.data.data.userEmail,
        telefono: this.data.data.userPhone
      })
      
      this.externalForm.setValue({
        empresa: this.data.data.enterpriseData.enterpriseid,
        profesion: this.data.data.externalData.externalPersonnelProfession,
        experiencia: this.data.data.externalData.externalPersonnelWorkExperience,
        graduacion: new Date(this.data.data.externalData.externalPersonnelGraduationYear),
        oficina: this.data.data.externalData.externalPersonnelOffice
      })
      
    }else{
      console.log("%cNO hay datos","color: red")
    }
  }

  siguientePagina(){
    if(this.userForm.valid){
      this.nextStep = true
    }else{
      this._snackBar.open("Debe llenar todos los campos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
    
  }

  agregarProfesional(){
    if(this.externalForm.valid){
      console.log(this.userForm.value)
      console.log(this.externalForm.value)
      const userData: CreateUserRequest = {
        userDNI: "V-" + this.userForm.value.cedula,
	      userPassword: "Hola",
        userFirstName: this.userForm.value.nombres,
        userLastName: this.userForm.value.apellidos,
        userEmail: this.userForm.value.correoElectronico + this.emailFormatSelected,
        userPhone: this.userForm.value.telefono,
        userEmailAlt: null
      }
      const externalData: CreateExternalRequest = {
        externalPersonnelDNI: "V-" + this.userForm.value.cedula,
        externalPersonnelEnterpriseId: this.externalForm.value.empresa,
        externalPersonnelProfession: this.externalForm.value.profesion,
        externalPersonnelOffice: this.externalForm.value.oficina,
        externalPersonnelWorkExperience: this.externalForm.value.experiencia,
        externalPersonnelGraduationYear: this.externalForm.value.graduacion,
      }
      console.log(userData)
      console.log(externalData)
      this.userService.createUser(userData).pipe(
        switchMap(
          (userResult) => {
            return this.externalService.createExternal(externalData)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
    }else{
      this._snackBar.open("Debe llenar todos los campos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  }

  modificarProfesional(){
    if(this.externalForm.valid){
      console.log(this.userForm.value)
      console.log(this.externalForm.value)
      const userData: CreateUserRequest = {
        userDNI: this.userForm.value.cedula,
	      userPassword: "Hola",
        userFirstName: this.userForm.value.nombres,
        userLastName: this.userForm.value.apellidos,
        userEmail: this.userForm.value.correoElectronico,
        userPhone: this.userForm.value.telefono,
        userEmailAlt: null
      }
      const professorData: CreateExternalRequest = {
        externalPersonnelDNI: this.userForm.value.cedula,
        externalPersonnelEnterpriseId: this.externalForm.value.empresa,
        externalPersonnelProfession: this.externalForm.value.profesion,
        externalPersonnelOffice: this.externalForm.value.oficina,
        externalPersonnelWorkExperience: this.externalForm.value.experiencia,
        externalPersonnelGraduationYear: this.externalForm.value.graduacion,
      }
      console.log(userData)
      console.log(professorData)
      this.userService.createUser(userData).pipe(
        switchMap(
          (userResult) => {
            return this.externalService.createExternal(professorData)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
    }else{
      this._snackBar.open("Debe llenar todos los campos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  }

}
