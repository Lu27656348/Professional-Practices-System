import { core } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { createProfessorRequest } from 'src/app/interfaces/CreateProfessorRequest';
import { CreateUserRequest } from 'src/app/interfaces/requests/CreateUserRequest';
import { ProfessorsService } from 'src/app/services/professors.service';
import { SchoolService } from 'src/app/services/school.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profesor-dialog',
  templateUrl: './profesor-dialog.component.html',
  styleUrls: ['./profesor-dialog.component.css']
})
export class ProfesorDialogComponent {

  userForm: FormGroup = new FormGroup({
    cedula: new FormControl('',Validators.required),
    nombres: new FormControl('',Validators.required),
    apellidos: new FormControl('',Validators.required),
    correoElectronico: new FormControl('',Validators.required),
    telefono: new FormControl('',Validators.required)
  })

  professorForm: FormGroup = new FormGroup({
      escuela: new FormControl('',Validators.required),
      profesion: new FormControl('',Validators.required),
      experiencia: new FormControl('',Validators.required),
      graduacion: new FormControl('',Validators.required),
      oficina: new FormControl('',[])
  })

  nextStep: boolean = false
  emailFormatSelected: string = "@gmail.com"

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  schoolList: any = null

  coordinatorData: any = null

  constructor(private _snackBar: MatSnackBar, private schoolService: SchoolService,private userService: UsersService, private professorService: ProfessorsService,@Inject(MAT_DIALOG_DATA) public data: any){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      this.userService.getUserData(localUserData.userDNI).subscribe({
        next: (coordinatorData) => {
          console.log(coordinatorData)
          this.coordinatorData = coordinatorData
        }
      })
    }
    this.schoolService.getSchools().subscribe({
      next: (schoolList) => [
        this.schoolList = schoolList
      ]
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
      this.userForm?.get('cedula')?.disable();
      this.professorForm.setValue({
        escuela: this.data.data.professorData.professorSchoolName,
        profesion: this.data.data.professorData.professorProfession,
        experiencia: this.data.data.professorData.professorWorkExperience,
        graduacion: new Date(this.data.data.professorData.professorGraduationYear),
        oficina: this.data.data.professorData.professorOffice
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

  agregarProfesor(){
    console.log( this.professorForm?.get('escuela'))
    console.log( this.professorForm?.get('profesion'))
    console.log( this.professorForm?.get('experiencia'))
    console.log( this.professorForm?.get('graduacion'))
    if(
      this.professorForm?.get('escuela') &&
      this.professorForm?.get('profesion') &&
      this.professorForm?.get('experiencia') &&
      this.professorForm?.get('graduacion')
    ){
      console.log(this.userForm.value)
      console.log(this.professorForm.value)
      const userData: CreateUserRequest = {
        userDNI: "V-" + this.userForm.value.cedula,
	      userPassword: "Hola",
        userFirstName: this.userForm.value.nombres,
        userLastName: this.userForm.value.apellidos,
        userEmail: this.userForm.value.correoElectronico + this.emailFormatSelected,
        userPhone: this.userForm.value.telefono,
        userEmailAlt: null,
        schoolName: this.coordinatorData.schoolName
      }
      const professorData: createProfessorRequest = {
        professorDNI: "V-" + this.userForm.value.cedula,
        professorSchoolName: this.coordinatorData.schoolName,
        professorProfession: this.professorForm.value.profesion,
        professorOffice: this.professorForm.value.oficina,
        professorWorkExperience: this.professorForm.value.experiencia,
        professorGraduationYear: this.professorForm.value.graduacion,
      }
      console.log(userData)
      console.log(professorData)
      this.userService.createUser(userData).pipe(
        switchMap(
          (userResult) => {
            return this.professorService.createProfessors(professorData)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        error: (error) => {
          console.log(error)
          this._snackBar.open("Error en la creacion de profesor", "cerrar",{
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
    }else{
      console.log("Error en agregar profesor")
      this._snackBar.open("Debe llenar todos los campos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  }

  modificarProfesor(){
    console.log(this.userForm?.get('cedula')?.value)
    if(
      this.professorForm?.get('escuela')?.valid &&
      this.professorForm?.get('profesion')?.valid &&
      this.professorForm?.get('experiencia')?.valid &&
      this.professorForm?.get('graduacion')?.valid
    ){
      console.log(this.userForm.value)
      console.log(this.professorForm.value)
      const userData: CreateUserRequest = {
        userDNI: this.userForm?.get('cedula')?.value,
	      userPassword: "Hola",
        userFirstName: this.userForm.value.nombres,
        userLastName: this.userForm.value.apellidos,
        userEmail: this.userForm.value.correoElectronico,
        userPhone: this.userForm.value.telefono,
        userEmailAlt: null,
        schoolName: this.coordinatorData.schoolName,
      }
      const professorData: createProfessorRequest = {
        professorDNI: this.userForm?.get('cedula')?.value,
        professorSchoolName: this.coordinatorData.schoolName,
        professorProfession: this.professorForm.value.profesion,
        professorOffice: this.professorForm.value.oficina,
        professorWorkExperience: this.professorForm.value.experiencia,
        professorGraduationYear: this.professorForm.value.graduacion,
      }
      console.log(userData)
      console.log(professorData)
      this.userService.updateUser(userData).pipe(
        switchMap(
          (userResult) => {
            return this.professorService.createProfessors(professorData)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
    }else{
      console.log("Error en modificar profesor")
      this._snackBar.open("Debe llenar todos los campos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  }

 
}
