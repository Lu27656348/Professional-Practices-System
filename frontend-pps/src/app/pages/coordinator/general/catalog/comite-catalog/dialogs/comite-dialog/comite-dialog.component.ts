import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CreateCommitteeRequest } from 'src/app/interfaces/requests/CreateCommitteeRequest';
import { CommitteeService } from 'src/app/services/committee.service';

@Component({
  selector: 'app-comite-dialog',
  templateUrl: './comite-dialog.component.html',
  styleUrls: ['./comite-dialog.component.css']
})
export class ComiteDialogComponent {

  comiteForm: FormGroup = new FormGroup({
    committeeId: new FormControl('',Validators.required),
    committeeDate: new FormControl('',Validators.required)
  })

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  isEditMode: boolean = false;
  
  constructor(
    private _snackBar: MatSnackBar,
    private comiteService: CommitteeService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    if(this.data != null){
      console.log("Hay datos")
      console.log(this.data)
      this.isEditMode = true
      this.comiteForm.setValue({
        committeeId: this.data.data.committeeId,
        committeeDate: new Date(this.data.data.committeeDate)
      })
    }else{
      console.log("No hay datos")
    }
  }

  agregarComite(){
    if(this.comiteForm.valid){
      const comiteData: CreateCommitteeRequest = {
        committeeId: this.comiteForm.value.committeeId,
        committeeDate: this.comiteForm.value.committeeDate
      }
      this.comiteService.createCommittee(comiteData).subscribe({
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

  modificarComite(){
    if(this.comiteForm.valid){
      const comiteData: CreateCommitteeRequest = {
        committeeId: this.comiteForm.value.committeeId,
        committeeDate: this.comiteForm.value.committeeDate
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
}
