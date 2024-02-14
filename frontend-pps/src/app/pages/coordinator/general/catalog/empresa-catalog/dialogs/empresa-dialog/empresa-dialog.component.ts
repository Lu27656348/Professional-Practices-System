import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EnterpriseService } from 'src/app/services/enterprise.service';

@Component({
  selector: 'app-empresa-dialog',
  templateUrl: './empresa-dialog.component.html',
  styleUrls: ['./empresa-dialog.component.css']
})
export class EmpresaDialogComponent {
  enterpriseForm: FormGroup = new FormGroup({
    enterpriseName: new FormControl('',Validators.required),
    enterpriseDescription: new FormControl(''),
    enterpriseAddress: new FormControl('')
})

horizontalPosition: MatSnackBarHorizontalPosition = "right";
verticalPosition: MatSnackBarVerticalPosition = 'bottom';

enterpriseList: any = null

constructor(private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: any, private enterpriseService: EnterpriseService){
    if(data!= null){
      console.log("Hay datos")
      console.log(data)
      this.enterpriseForm.setValue({
        enterpriseName: this.data.data.enterpriseName,
        enterpriseDescription: this.data.data.enterpriseDescription,
        enterpriseAddress: this.data.data.enterpriseAddress,
      })
    }else{
      console.log("No hay datos")
    }
  
}

nextStep: boolean = false

siguientePagina(){
  this.nextStep = true
}

agregarEmpresa(){
  if(this.enterpriseForm.valid){
    console.log(this.enterpriseForm.value)
    this.enterpriseService.createEnterprise(this.enterpriseForm.value).subscribe({
      next: (result) => {
        console.log(result)
        window.location.href = window.location.href
      }
    })
  }else{
    this._snackBar.open("Debe por lo menos darle un nombre a la empresa", "cerrar", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    })
  }
}

modificarEmpresa(){
  if(this.enterpriseForm.valid){
    console.log(this.enterpriseForm.value)
    
    this.enterpriseService.updateEnterprise(this.data.data.enterpriseid,this.enterpriseForm.value).subscribe({
      next: (result) => {
        console.log(result)
        window.location.href = window.location.href
      }
    })
    
  }else{
    this._snackBar.open("Debe por lo menos darle un nombre a la empresa", "cerrar", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    })
  }
}

}
