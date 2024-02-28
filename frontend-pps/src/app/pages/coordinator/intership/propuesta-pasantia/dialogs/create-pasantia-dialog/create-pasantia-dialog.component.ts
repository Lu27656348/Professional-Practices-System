import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, forkJoin, of, switchMap, throwError } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-create-pasantia-dialog',
  templateUrl: './create-pasantia-dialog.component.html',
  styleUrls: ['./create-pasantia-dialog.component.css']
})
export class CreatePasantiaDialogComponent {
 
  pasantiaForm: any = null;

  cargadoArchivos: boolean = false

  enterpriseSelected: any = null;
  externalSelected: any = null;
  studentSelected: any = null;

  enterpriseList: any = null;
  externalList: any = null;
  studentList: any = null;
  
  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  currentFile: any = null

  studentData: any = null;

  userData: any = null
  

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  fechaFinValidator(control: FormControl): {[key: string]: any} | null {
    const fechaInicio = control.parent?.get('fechaInicio')?.value;
    const fechaFin = control.value;
  
    if (!fechaInicio || !fechaFin) {
      return null;
    }
  
    const diferenciaSemanas = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24 * 7));
  
    if (diferenciaSemanas < 6 || diferenciaSemanas > 8) {
      return { 'fechaFinInvalida': true };
    }
  
    return null;
  }

  constructor(
    private formBuilder: FormBuilder, 
    private externalService: ExternalPersonnelService, 
    private studentService: StudentService,
    private professorService: ProfessorsService, 
    private enterpriseService: EnterpriseService,
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private pasantiaService: PasantiaService,
    private documentService: DocumentService
  ){

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
    this.pasantiaForm = this.formBuilder.group({
      titulo: ['',Validators.required],
      estudiante: ['',Validators.required],
      tutorEmpresarial: ['',Validators.required],
      fechaInicio: ['',Validators.required],
      fechaFin: ['',[Validators.required,this.fechaFinValidator]],
      empresa: ['',Validators.required],
      file: ['',Validators.required]
    })

    this.pasantiaService.obtenerEstudiantesPendientesPorPasantia().pipe(
      switchMap(
        (result: any) => {
          console.log(result)
          const observables: Observable<any>[] = []
          result.forEach( (element: any) => {
            observables.push(this.userService.getUserData(element))
          }); 
          return forkJoin(observables)
        }
      )
    ).subscribe(
      {
        next: (result: any) => {
          console.log(result)
          this.studentList = result
        }
      }
    )
    /*
    this.studentService.getStudentsData().subscribe({
      next: (studentData) => {
        console.log(studentData)
        this.studentList = studentData
      }
    })
    */

    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseList) => {
        console.log(enterpriseList)
        this.enterpriseList = enterpriseList
      }
    })
  }

  onSelectionChange(){
    this.externalService.getExternalPersonnelByEnterpriseId(this.enterpriseSelected).pipe(
      switchMap(
        (externalList) => {
          console.log(externalList)
          const observables: Observable<any>[] = []
          externalList.forEach( (external: any) => {
            observables.push(this.userService.getUserData(external.externalPersonnelDNI))
          })
          return forkJoin(observables)
        }
      )
      
    ).subscribe({
      next: (externalList) => {
        console.log(externalList)
        this.externalList = externalList
      }
    })
  }

  cargarPropuesta(){
    console.log(this.pasantiaForm.value)
    console.log(this.pasantiaForm.value)
    console.log(this.enterpriseSelected)
    console.log(this.externalSelected)
    console.log(this.studentSelected)
    if(this.pasantiaForm.valid){
      console.log("Valido")
      this.cargadoArchivos = true;
    
      this.userService.getUserData(this.pasantiaForm.value.estudiante)
      .pipe(
        switchMap(
          (studentData) => {
            this.studentData = studentData
            if(this.currentFile.type != "application/pdf"){
              this._snackBar.open("El archivo debe ser en formato PDF", "cerrar",{
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              })
              return throwError( () => {return new Error("El archivo debe ser en formato PDF")})
            }
            const formattedFileName = `${studentData.userLastName.split(' ')[0]}${studentData.userFirstName.split(' ')[0]} Propuesta Pasantía.pdf`;
            return this.documentService.copyFileAndRename(this.currentFile as File, formattedFileName)
          }
        ),
        switchMap(
          (newFile: File) => {
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
          (result) => {
            console.log(result)
            const body = {
              intershipTitle: this.pasantiaForm.value.titulo,
              intershipStartDate: this.pasantiaForm.value.fechaInicio,
              intershipCompletionDate: this.pasantiaForm.value.fechaFin,
              studentDNI: this.pasantiaForm.value.estudiante,
              corporateTutorDNI: this.pasantiaForm.value.tutorEmpresarial,
              enterpriseId: this.pasantiaForm.value.empresa
            }
            console.log(body)
            return this.pasantiaService.createPasantia(body)
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

    }else{
      this._snackBar.open("Todos los campos tienen que estar llenos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
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
