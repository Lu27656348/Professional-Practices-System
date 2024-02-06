import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { EvaluateIntershipReportRequest } from 'src/app/interfaces/requests/EvaluateIntershipReportRequest';
import { DocumentService } from 'src/app/services/document.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-cargar-evaluaciones-dialog',
  templateUrl: './cargar-evaluaciones-dialog.component.html',
  styleUrls: ['./cargar-evaluaciones-dialog.component.css']
})
export class CargarEvaluacionesDialogComponent {

  pasantiaForm;
  inputdata: any = null

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  academicTutorFile: any = null;
  corporateTutorFile: any = null;

  studentData: any = null;
  academicTutorData: any = null;
  corportateTutorData: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private pasantiaService: PasantiaService,
    private userService: UsersService,
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

    console.log(this.data)
    this.inputdata = this.data
    this.pasantiaForm = this.formBuilder.group({
      notaTutorAcademico: ['', Validators.required],
      archivoTutorAcademico: ['', Validators.required],
      notaTutorEmpresarial: ['', Validators.required],
      archivoTutorEmpresarial: ['', Validators.required],
    })
  }
  cargarEvaluaciones(){
    console.log("cargarEvaluaciones")
    if(this.pasantiaForm.valid && this.academicTutorFile && this.corporateTutorFile){
      if(this.academicTutorFile.type != "application/pdf"){
        this._snackBar.open("La planilla de evaluación del Tutor académico debe ser en PDF", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        throw new Error("La planilla de evaluación del Tutor académico debe ser en PDF")
      }
      if(this.corporateTutorFile.type != "application/pdf"){
        this._snackBar.open("La planilla de evaluación del Tutor empresarial debe ser en PDF", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        throw new Error("La planilla de evaluación del Tutor académico debe ser en PDF")
      }
      console.log(this.pasantiaForm.value)
      console.log(this.academicTutorFile)
      console.log(this.corporateTutorFile)
      console.log(this.inputdata)
      const body: EvaluateIntershipReportRequest = {
        intershipId: this.inputdata.pasantia.intershipId,
        evaluacionTutorAcademico: parseInt(this.pasantiaForm.value.notaTutorAcademico as string),
        evaluacionTutorEmpresarial: parseInt(this.pasantiaForm.value.notaTutorEmpresarial as string)
      }
      console.log(this.inputdata.pasantia)
      this.userService.getUserData(this.inputdata.pasantia.studentDNI)
      .pipe(
        switchMap(
          (studentData)=> {
          console.log(studentData)
          this.studentData = studentData
          return this.userService.getUserData(this.inputdata.pasantia.academicTutorDNI)
        }),
        switchMap(
          (academicTutorData)=> {
          this.academicTutorData = academicTutorData
          const academicTutorFormattedFileName = `${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} Evaluación Pasantía Tutor Académico ${this.academicTutorData.userLastName.split(" ")[0]}${this.academicTutorData.userFirstName.split(" ")[0]}.pdf`
          return this.documentService.copyFileAndRename(this.academicTutorFile as File,academicTutorFormattedFileName)
        }),
        switchMap(
          (academicTutorFile)=> {
          
          return this.pasantiaService.cargarPropuestaPasantia(academicTutorFile,{
            userDNI: this.studentData.userDNI,
            userFirstName: this.studentData.userFirstName,
            userLastName: this.studentData.userLastName
          })
        }),
        switchMap(
          (uploadResult)=> {
            console.log(uploadResult)
            return this.userService.getUserData(this.inputdata.pasantia.corporateTutorDNI)
        }),
        switchMap(
          (corporateTutorData)=> {
            this.corportateTutorData = corporateTutorData
            const corporateTutorFormattedFileName = `${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} Evaluación Pasantía Tutor Empresarial ${this.corportateTutorData.userLastName.split(" ")[0]}${this.corportateTutorData.userFirstName.split(" ")[0]}.pdf`
            return this.documentService.copyFileAndRename(this.corporateTutorFile as File,corporateTutorFormattedFileName)
        }),
        switchMap(
          (corporateTutorFile)=> {
            return this.pasantiaService.cargarPropuestaPasantia(corporateTutorFile,{
              userDNI: this.studentData.userDNI,
              userFirstName: this.studentData.userFirstName,
              userLastName: this.studentData.userLastName
            })
          })

      )
      .subscribe({
        next: (uploadResult) => {
            console.log("Todo bien")
        },
        complete: () => {
          this.pasantiaService.evaluarInformePasantia(body).subscribe({
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
      this._snackBar.open("Debe cargar todos los datos", "cerrar", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  }

  onAcademicTutorFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.academicTutorFile = file
    }
  }

  onCorporateTutorFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.corporateTutorFile = file
    }
  }
}
