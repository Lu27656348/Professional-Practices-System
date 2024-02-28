import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { CreateCommitteeRequest } from 'src/app/interfaces/requests/CreateCommitteeRequest';
import { CommitteeService } from 'src/app/services/committee.service';
import { DocumentService } from 'src/app/services/document.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-comite-dialog',
  templateUrl: './comite-dialog.component.html',
  styleUrls: ['./comite-dialog.component.css']
})
export class ComiteDialogComponent {

  comiteForm: FormGroup = new FormGroup({
    committeeId: new FormControl('',Validators.required),
    committeeDate: new FormControl('',Validators.required),
    committeeFile: new FormControl('',Validators.required)
  })

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  isEditMode: boolean = false;

  currentFile: any = null
  cargadoArchivos: boolean = false

  userData: any = null
  escuela: any = null
  
  constructor(
    private _snackBar: MatSnackBar,
    private comiteService: CommitteeService,
    private userService: UsersService,
    private dialog: MatDialog,
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      this.userService.getUserData(localUserData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
          if(this.userData.schoolName == 'Ing. Informatica'){
            this.escuela = 'Informatica'
          }else{
            this.escuela = "Civil"
          }
        }
      })

    }
    if(this.data != null){
      console.log("Hay datos")
      console.log(this.data)
      this.isEditMode = true
      this.comiteForm.setValue({
        committeeId: this.data.data.committeeId,
        committeeDate: new Date(this.data.data.committeeDate),
        committeeFile: null
      })
    }else{
      console.log("No hay datos")
    }
  }

  agregarComite(){
    if(this.comiteForm.valid){
      this.cargadoArchivos = true
      const comiteData: CreateCommitteeRequest = {
        committeeId: this.comiteForm.value.committeeId,
        committeeDate: this.comiteForm.value.committeeDate,
        schoolName: this.userData.schoolName
      }
      this.documentService.copyFileAndRename(this.currentFile as File, `${this.comiteForm.value.committeeId} - Acta de Comite.pdf`)
      .pipe(
        switchMap(
          (newFile) => {
            return this.comiteService.cargarActaDeComite(this.comiteForm.value.committeeId,newFile,this.escuela)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            return this.comiteService.createCommittee(comiteData)
          }
        ),
      )
      .subscribe({
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
        verticalPosition: this.verticalPosition
      })
    }
    
  }

  modificarComite(){
    if(this.comiteForm.valid){
      const comiteData: CreateCommitteeRequest = {
        committeeId: this.comiteForm.value.committeeId,
        committeeDate: this.comiteForm.value.committeeDate,
        schoolName: this.userData.schoolName
      }
      this.comiteService.updateCommittee(this.data.data.committeeId,comiteData).subscribe({
        next: (result) => {
          console.log(result)
          window.location.href = window.location.href
        }
      })
    }else{
      this._snackBar.open("Debe llenar todos los campos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
  }
}
