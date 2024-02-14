import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CreateCouncilRequest } from 'src/app/interfaces/requests/CreateCouncilRequest';
import { CouncilService } from 'src/app/services/council.service';

@Component({
  selector: 'app-consejo-dialog',
  templateUrl: './consejo-dialog.component.html',
  styleUrls: ['./consejo-dialog.component.css']
})
export class ConsejoDialogComponent {
  councilForm: FormGroup = new FormGroup({
    schoolCouncilId: new FormControl('',Validators.required),
    schoolCouncilDate: new FormControl('',Validators.required),
    schoolCouncilType: new FormControl('',Validators.required)
  })

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  isEditMode: boolean = false

  constructor(private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: any, private councilService: CouncilService){
    console.log(this.data)
    if( this.data != null ){
      console.log("Hay datos")
      this.councilForm.setValue({
      
        schoolCouncilId: this.data.data.schoolCouncilId,
        schoolCouncilDate: new Date(this.data.data.schoolcouncildate),
        schoolCouncilType: this.data.data.schoolSchoolType
      })
      this.isEditMode = true
    }else{
      console.log("No hay datos")
    }
  }

  agregarConsejo(){
    if(this.councilForm.valid){
      console.log(this.councilForm.value)
      const councilData: CreateCouncilRequest = {
        schoolCouncilId: this.councilForm.value.schoolCouncilId,
        schoolcouncildate: this.councilForm.value.schoolCouncilDate,
        schoolSchoolType: this.councilForm.value.schoolCouncilType
      }
      this.councilService.createCouncil(councilData).subscribe({
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
  
  modificarConsejo(){
    if(this.councilForm.valid){
      console.log(this.councilForm.value)
      const councilData: CreateCouncilRequest = {
        schoolCouncilId: this.councilForm.value.schoolCouncilId,
        schoolcouncildate: this.councilForm.value.schoolCouncilDate,
        schoolSchoolType: this.councilForm.value.schoolCouncilType
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
