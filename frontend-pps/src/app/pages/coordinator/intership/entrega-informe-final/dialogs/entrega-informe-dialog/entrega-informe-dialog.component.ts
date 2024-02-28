import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { of, switchMap } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-entrega-informe-dialog',
  templateUrl: './entrega-informe-dialog.component.html',
  styleUrls: ['./entrega-informe-dialog.component.css']
})
export class EntregaInformeDialogComponent {

  currentFile: any = null
  inputdata: any = null
  studentData: any = null;

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  userData: any = null

  cargadoArchivos: boolean = false

  constructor(
    private _snackBar: MatSnackBar, 
    private pasantiaService: PasantiaService, 
    private documentService: DocumentService,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    console.log(this.data)
    this.inputdata = this.data
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      console.log(localUserData)
      this.userService.getUserData(localUserData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
        }
      })
    }
  }

  cargarEvaluacionFinal(){
    if(this.currentFile as File){
      console.log("cargarEvaluacionFinal")

      if(this.currentFile.type != "application/pdf"){
        this._snackBar.open("El archivo debe ser en formato PDF", "cerrar",{
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("El archivo debe ser en formato PDF")
      }
      this.cargadoArchivos = true
      this.userService.getUserData(this.inputdata.pasantia.studentDNI)
      .pipe(
        switchMap(
          (studentData) => {
            console.log(studentData)
            this.studentData = studentData
            const formattedFileName = `${studentData.userLastName.split(" ")[0]}${studentData.userFirstName.split(" ")[0]} Informe Pasantía.pdf`
            return this.documentService.copyFileAndRename(this.currentFile,formattedFileName)
          }
        ),
        switchMap(
          (newFile) => {
            let escuela;
            if(this.userData.schoolName == 'Ing. Informatica'){
              escuela = "Informática"
            }else{
              escuela = "Civil"
            }
            return this.pasantiaService.cargarPropuestaPasantia(newFile,this.studentData,escuela)
          }
        ),
        switchMap(
          (fileUploadResult) => {
            console.log(fileUploadResult)
            return this.pasantiaService.cambiarEstadoPasantia(this.inputdata.pasantia.intershipId,100)
          }
        )

      )
      .subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
      //this.documentService.copyFileAndRename(this.currentFile,)
    }else{
      this._snackBar.open("No ha seleccionado un archivo", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file
    }
  }
}
