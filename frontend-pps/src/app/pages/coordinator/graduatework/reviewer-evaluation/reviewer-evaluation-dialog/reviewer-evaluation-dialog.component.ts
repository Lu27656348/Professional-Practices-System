import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'app-reviewer-evaluation-dialog',
  templateUrl: './reviewer-evaluation-dialog.component.html',
  styleUrls: ['./reviewer-evaluation-dialog.component.css']
})
export class ReviewerEvaluationDialogComponent {
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
  
  inputdata: any = null
  graduateWorkData: any = null
  reviewerData: any = null

  constructor(
    private formBuilder: FormBuilder,
    private externalService: ExternalPersonnelService,
    private studentService: StudentService,
    private professorService: ProfessorsService, 
    private enterpriseService: EnterpriseService, 
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private graduateWorkService: GraduateworkService,
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.graduateWorkForm = this.formBuilder.group({
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

    this.inputdata = this.data
    console.log(this.inputdata)
    this.graduateWorkService.getGraduateWorkReviewer(this.inputdata.gw.graduateWorkId).pipe(
      switchMap(
        (reviewerDNI) => {
          return this.userService.getUserData(reviewerDNI.professorDNI)
        }
      )
    ).subscribe({
      next: (result) => {
        console.log(result)
        this.reviewerData = result
      }
    })
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
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

  aprobarPropuesta(){
    console.log("aprobarPropuesta()")
    if(this.graduateWorkForm.valid){
      if(this.currentFile.type != "application/pdf"){
        this._snackBar.open("El archivo debe ser en formato PDF", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("El archivo debe ser en formato PDF ")
      }
      
      this.graduateWorkService.approveReviewerEvaluation(
        {
          professorDNI: this.reviewerData.userDNI,
          graduateWorkId: this.inputdata.gw.graduateWorkId,
          comments: null
        }
      ).pipe(
        switchMap(
          (result) => {
            console.log(result)
            let fileNameFormatted;
            if(this.inputdata.user.length > 1){
              fileNameFormatted = `${this.inputdata.user[0].userLastName.split(" ")[0]}${this.inputdata.user[0].userFirstName.split(" ")[0]} ${this.inputdata.user[0].userLastName.split(" ")[1]}${this.inputdata.user[1].userFirstName.split(" ")[0]} Evaluación Propuesta ${this.reviewerData.userLastName.split(" ")[0]}${this.reviewerData.userFirstName.split(" ")[0]}.pdf`
            }else{
              fileNameFormatted = `${this.inputdata.user[0].userLastName.split(" ")[0]}${this.inputdata.user[0].userFirstName.split(" ")[0]} Evaluación Propuesta ${this.reviewerData.userLastName.split(" ")[0]}${this.reviewerData.userFirstName.split(" ")[0]}.pdf`
            }
           return this.documentService.copyFileAndRename(this.currentFile,fileNameFormatted)
          }
        ),
        switchMap(
          (newFile) => {
            if(this.inputdata.user.length > 1){
              const studentData = [
                {
                  userDNI: this.inputdata.user[0].userDNI,
                  userLastName: this.inputdata.user[0].userLastName,
                  userFirstName: this.inputdata.user[0].userFirstName
                },
                {
                  userDNI: this.inputdata.user[1].userDNI,
                  userLastName: this.inputdata.user[1].userLastName,
                  userFirstName: this.inputdata.user[1].userFirstName
                },
              ]
              return this.studentService.cargarArchivoPropuestaDoble(newFile as File, studentData)
            }
            const studentData = {
              userDNI: this.inputdata.user[0].userDNI,
              userLastName: this.inputdata.user[0].userLastName,
              userFirstName: this.inputdata.user[0].userFirstName
            }
            return this.studentService.cargarArchivoPropuesta(newFile as File, studentData)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href 
        }
      })
    
    }else{
      this._snackBar.open("Debe cargar el archivo para poder aprobar o rechazar", "cerrar", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
  }

  rechazarPropuesta(){
    console.log("rechazarPropuesta()")
    if(this.graduateWorkForm.valid){
      if(this.currentFile.type != "application/pdf"){
        this._snackBar.open("El archivo debe ser en formato PDF", "cerrar", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
        throw new Error("El archivo debe ser en formato PDF ")
      }

      this.graduateWorkService.reproveReviewerEvaluation(
        {
          professorDNI: this.reviewerData.userDNI,
          graduateWorkId: this.inputdata.gw.graduateWorkId,
          comments: null
        }
      )
    }else{
      this._snackBar.open("Debe cargar el archivo para poder aprobar o rechazar", "cerrar", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
  }
}
