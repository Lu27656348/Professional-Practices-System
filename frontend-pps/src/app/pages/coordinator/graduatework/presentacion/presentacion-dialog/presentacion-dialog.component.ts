import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { DocumentService } from 'src/app/services/document.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-presentacion-dialog',
  templateUrl: './presentacion-dialog.component.html',
  styleUrls: ['./presentacion-dialog.component.css']
})
export class PresentacionDialogComponent {

  inputdata: any = null;
  cargadoArchivos: boolean = false

  constructor(
    private documentService: DocumentService,
    private formService: EvaluationFormGeneratorService,
    private userService: UsersService,
    private graduateWorkService: GraduateworkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
  ){
    this.inputdata = this.data
    console.log(this.inputdata)
  }

  graduateWorkForm  = new FormGroup({
    file: new FormControl()
  });

  currentFile: any = null;
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
  }

  cargarActaEstudiante(){
    if(this.graduateWorkForm.valid){
      this.cargadoArchivos = true
      let formattedFileName = '';
      if(this.inputdata.studentData.length > 1){
        formattedFileName = `${this.inputdata.studentData[0].userLastName.split(" ")[0]}${this.inputdata.studentData[0].userFirstName.split(" ")[0]} ${this.inputdata.studentData[1].userLastName.split(" ")[0]}${this.inputdata.studentData[1].userFirstName.split(" ")[0]} Informe TG.pdf`
      }else{
        formattedFileName = `${this.inputdata.studentData[0].userLastName.split(" ")[0]}${this.inputdata.studentData[0].userFirstName.split(" ")[0]} Informe TG.pdf`
      }
      this.documentService.copyFileAndRename(this.currentFile as File,formattedFileName).pipe(
        switchMap(
          (newFile) => {
            return this.graduateWorkService.uploadFinalSubmittion(newFile,this.inputdata.studentData)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            return this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,90)
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
      
    }
    
  }
}
