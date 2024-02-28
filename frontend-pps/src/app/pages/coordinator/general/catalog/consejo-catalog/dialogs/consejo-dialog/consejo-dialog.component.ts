import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { CreateCouncilRequest } from 'src/app/interfaces/requests/CreateCouncilRequest';
import { CouncilService } from 'src/app/services/council.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-consejo-dialog',
  templateUrl: './consejo-dialog.component.html',
  styleUrls: ['./consejo-dialog.component.css']
})
export class ConsejoDialogComponent {

  cargadoArchivos: boolean = false
  currentFile: any = null;

  councilForm: FormGroup = new FormGroup({
    schoolCouncilId: new FormControl('',Validators.required),
    schoolCouncilDate: new FormControl('',Validators.required),
    schoolCouncilType: new FormControl('',Validators.required),
    councilFile: new FormControl('',Validators.required),
  })

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  isEditMode: boolean = false

  inputdata: any = null

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private councilService: CouncilService,
    private documentService: DocumentService
  ){
    console.log(this.data)
    if( this.data != null ){
      console.log("Hay datos")
      this.inputdata = this.data
      if(this.data.mode == "EDITAR"){
        this.councilForm.setValue({
      
          schoolCouncilId: this.data.data.schoolCouncilId,
          schoolCouncilDate: new Date(this.data.data.schoolcouncildate),
          schoolCouncilType: this.data.data.schoolSchoolType,
          councilFile: null
        })
        this.isEditMode = true
      }
      
    }else{
      console.log("No hay datos")
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
  }

  agregarConsejo(){
    if(this.councilForm.valid){
      console.log(this.councilForm.value)

      this.cargadoArchivos = true;

      const councilData: CreateCouncilRequest = {
        schoolCouncilId: this.councilForm.value.schoolCouncilId,
        schoolcouncildate: this.councilForm.value.schoolCouncilDate,
        schoolSchoolType: this.councilForm.value.schoolCouncilType,
        schoolName: this.data.user.schoolName
      }
      this.documentService.copyFileAndRename(this.currentFile, `${this.councilForm.value.schoolCouncilId}  - Acta de Consejo.pdf`)
      .pipe(
        switchMap(
          (newFile) => {
            let schoolName;
            if(this.inputdata.user.schoolName == 'Ing. Informatica'){
              schoolName = "Informática"
            }else{
              schoolName = "Civil"
            }

            return this.councilService.cargarActaDeConsejo(this.councilForm.value.schoolCouncilId,newFile as File,schoolName)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            return this.councilService.createCouncil(councilData)
          }
        ) 
      )
      .subscribe({ 
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
  
  modificarConsejo(){
    if(this.councilForm.valid){
      console.log(this.councilForm.value)
      const councilData: CreateCouncilRequest = {
        schoolCouncilId: this.councilForm.value.schoolCouncilId,
        schoolcouncildate: this.councilForm.value.schoolCouncilDate,
        schoolSchoolType: this.councilForm.value.schoolCouncilType,
        schoolName: this.data.user.schoolName
      }
      this.councilService.updateCouncil(this.data.data.schoolCouncilId,councilData).subscribe({
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
}
