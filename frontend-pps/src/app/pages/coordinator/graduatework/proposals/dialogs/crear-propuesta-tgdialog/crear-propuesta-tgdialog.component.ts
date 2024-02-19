import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-crear-propuesta-tgdialog',
  templateUrl: './crear-propuesta-tgdialog.component.html',
  styleUrls: ['./crear-propuesta-tgdialog.component.css']
})
export class CrearPropuestaTGDialogComponent implements OnInit{
  graduateWorkForm: any = null;

  enterpriseSelected: any = null;
  externalSelected: any = null;
  studentSelected: any = null;
  partnerSelected: any = null;

  enterpriseList: any = null;
  externalList: any = null;
  studentList: any = null;
  professorList: any = null;
  professorData: any = null;
  
  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  currentFile: any = null

  studentData: any = null;

  typeSelected: string = "EXPERIMENTAL"
  groupSelected: string = "INDIVIDUAL"

  nextStep: boolean = false;
  uploadProposal: boolean = false;

  coordinatorData: any = null

  cargadoArchivos: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private externalService: ExternalPersonnelService,
    private studentService: StudentService,
    private professorService: ProfessorsService, 
    private enterpriseService: EnterpriseService, 
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private graduateWorkService: GraduateworkService,
    private documentService: DocumentService
  ){
    this.graduateWorkForm = this.formBuilder.group({
      titulo: ['',Validators.required],
      tipo: ['',Validators.required],
      estudiante: ['',Validators.required],
      partner: [''],
      tutor: ['',Validators.required],
      empresa: ['',Validators.required],
      file: ['',Validators.required]
    })

    this.studentService.getStudentsData().subscribe({
      next: (studentData) => {
        console.log(studentData)
        this.studentList = studentData
      }
    })

    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseList) => {
        console.log(enterpriseList)
        this.enterpriseList = enterpriseList
      }
    })

    this.professorService.getProfessorsData().pipe(
      switchMap(
        (professorData) => {
          const observables: Observable<any>[] = []
          this.professorData = professorData
          console.log(professorData)
          professorData.forEach( (professor: any, index: number) => {
            observables.push(this.userService.getUserData(professor.professorDNI))
          })
          return forkJoin(observables)
        }
      )
    ).subscribe({
      next: (professorList) => {
        console.log(professorList)
        professorList.forEach( (professor: any, index: number) => {
          this.professorData.forEach( (professorData: any) => {
            if(professorData.professorDNI == professor.userDNI){
              professorList[index].professorData = professorData
            }
          })
        })

        this.professorList = professorList
        console.log(professorList)
      }
    })
  }

  ngOnInit(): void {
    
  }

  cargarArchivoPropuesta(){
    if(
      this.groupSelected && 
      this.graduateWorkForm.value.estudiante
    ){
      if(this.groupSelected == 'GRUPAL' && this.graduateWorkForm.value.partner){
        this.uploadProposal = true
      }else{
        if(this.groupSelected == 'GRUPAL' && this.graduateWorkForm.value.partner == ''){
          this.uploadProposal = false
        }
      }
      if(this.groupSelected == 'INDIVIDUAL' && this.graduateWorkForm.value.estudiante){
        this.uploadProposal = true
      }
      
    }else{
      this._snackBar.open("Debe llenar todos los campos" , " cerrar" , {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
  
  }

  cargarPropuesta(){
    
    if(this.graduateWorkForm.valid){
      this.cargadoArchivos = true
      if(this.groupSelected == "GRUPAL" && (this.graduateWorkForm.value.partner == null || this.graduateWorkForm.value.partner == '') ){
        this._snackBar.open("Los trabajos grupales deben tener dos estudiantes", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("Los trabajos grupales deben tener dos estudiantes")
      }
      if(this.groupSelected == "GRUPAL" && this.graduateWorkForm.value.partner == this.graduateWorkForm.value.estudiante){
        this._snackBar.open("Los estudiantes no pueden ser iguales", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("Los trabajos grupales deben tener dos estudiantes")
      }
      if(this.currentFile.type != "application/pdf"){
        this._snackBar.open("El archivo debe ser en formato PDF", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("El archivo debe estar en formato PDF")
      }

      console.log(this.graduateWorkForm.value)
      this.studentService.getStudentCoordinator(this.graduateWorkForm.value.estudiante).pipe(
        switchMap(
          (coordinatorData) => {
            console.log(coordinatorData)
            this.coordinatorData = coordinatorData
            return this.studentService.upload(this.currentFile as File, this.graduateWorkForm.value.estudiante as string, this.graduateWorkForm.value.partner)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            
            return this.studentService.createProposal({
              "studentDNI": this.graduateWorkForm.value.estudiante,
              "graduateWorkType": this.graduateWorkForm.value.tipo,
              "graduateWorkTitle": this.graduateWorkForm.value.titulo,
              "graduateWorkCoordinator": this.coordinatorData.professordni,
              "graduateWorkAcademicTutor": (this.typeSelected === 'INSTRUMENTAL') ? null : this.graduateWorkForm.value.tutor,
              "graduateWorkEnterprise": this.graduateWorkForm.value.empresa,
              "graduateWorkInCompanyTutor": (this.typeSelected === 'EXPERIMENTAL') ? null : this.graduateWorkForm.value.tutor,
              "studentDNI2": (this.graduateWorkForm.value.partner == '') ? null : this.graduateWorkForm.value.partner
            });
            
          }
        ),

      ).subscribe({
        complete: () => {
          console.log("todo bien")
          window.location.href = window.location.href
        },
        error: (error) => {
          
          this._snackBar.open("Ocurrio un error con la carga del archivo, refresque la pagina e intente de nuevo","cerrar",{
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
          })
          throw new Error(error)
        }

      })
  }
}

  

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
  }

  cargarDatosAlumno(){
    if(
      this.graduateWorkForm.value.titulo && 
      this.graduateWorkForm.value.tipo && 
      this.graduateWorkForm.value.empresa && 
      this.typeSelected && 
      this.graduateWorkForm.value.tutor
    ){
      this.nextStep = true
    }else{
      this._snackBar.open("Debe llenar todos los campos" , " cerrar" , {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
    
  }

  regresarDatosPropuesta(){

    this.nextStep = false
  }

  regresarDatosAlumno(){
    this.uploadProposal = false
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
}
