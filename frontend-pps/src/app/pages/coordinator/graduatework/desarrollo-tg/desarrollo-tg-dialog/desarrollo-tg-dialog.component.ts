import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { forkJoin, switchMap } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';
import { DialogCouncilComponent } from '../../council/dialog-council/dialog-council.component';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-desarrollo-tg-dialog',
  templateUrl: './desarrollo-tg-dialog.component.html',
  styleUrls: ['./desarrollo-tg-dialog.component.css']
})
export class DesarrolloTgDialogComponent {

  inputdata: any = null
  currentFile: any = null
  graduateWorkForm = this.formBuilder.group({
    file: ['',Validators.required]
  })

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(

    private userService: UsersService, 
    private graduateWorkService: GraduateworkService, 
    private dialog: MatDialog, 
    private studentService: StudentService,
    private documentService: DocumentService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

    this.inputdata = this.data
    console.log(this.inputdata)
  }
  cargarInformeFinal(){

    
    console.log("cargarInformeFinal()")
    if(this.graduateWorkForm.valid){
      if(this.currentFile.type != "application/pdf"){
        this._snackBar.open("El archivo debe estar en formato PDF", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("El archivo debe estar en formato PDF")
      }
    let formattedFileName;
    if(this.inputdata.userData.length > 1){
      formattedFileName = `${this.inputdata.userData[0].userLastName.split(" ")[0]}${this.inputdata.userData[0].userFirstName.split(" ")[0]} ${this.inputdata.userData[1].userLastName.split(" ")[0]}${this.inputdata.userData[1].userFirstName.split(" ")[0]} TG.pdf`
    }else{
      formattedFileName = `${this.inputdata.userData[0].userLastName.split(" ")[0]}${this.inputdata.userData[0].userFirstName.split(" ")[0]} TG.pdf`
    }
    this.documentService.copyFileAndRename(this.currentFile as File, formattedFileName).pipe(
      switchMap(
        (newFile) => {
          return this.graduateWorkService.uploadFinalSubmittion(newFile,this.inputdata.userData)
        }
      )
    )
    .subscribe({
      next: (result) => {
        console.log(result)
        this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,60).subscribe({
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            window.location.href = window.location.href  
          }
        })
      }
    })
    }else{
      this._snackBar.open("Debe cargar el archivo para poder aprobar o rechazar", "cerrar", {
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
