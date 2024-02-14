import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,90).subscribe({
      next: (result) => {
        console.log(result)
      },
      complete: () => {
        window.location.href = window.location.href
      }
    })
  }
}
