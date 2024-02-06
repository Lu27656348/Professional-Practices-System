import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { EmailService } from 'src/app/services/email.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-desarrollo-pasantia',
  templateUrl: './desarrollo-pasantia.component.html',
  styleUrls: ['./desarrollo-pasantia.component.css']
})
export class DesarrolloPasantiaComponent {
  intershipData: any[] = []

  studentData: any = null;
  corporateTutorData: any = null;
  academicTutorData: any = null;
  enterpriseData: any = null
  corporateCriteriaList: any = null;
  academicCriteriaList: any = null;
  corporateSeccionList: any = null;
  academicSeccionList: any = null;

  academicTutorEvaluation: any = null
  corporateTutorEvaluation: any = null

  localUserData: any = null;

  displayedColumns: string[] = ['intershipId', 'intershipTitle', 'author', 'startDate','endDate','check']

  constructor(
    
    private pasantiaService: PasantiaService,
    private dialog: MatDialog,
    private userService: UsersService, 
    private formGenerator: EvaluationFormGeneratorService,
    private enterpriseService: EnterpriseService,
    private academicTutorCriteriaService: CriteriosTutorAcademicoService,
    private emailService: EmailService,
    private corporateTutorCriteriaService: CriteriosTutorEmpresarialService
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI).subscribe({
        next: (localUserData) => {
          this.localUserData = localUserData
          console.log(this.localUserData)
        }
      })

    }
  }
  ngOnInit(): void {
    this.pasantiaService.getPasantiasByStatus(20).pipe(
      switchMap(
        (intershipList) => {
          console.log(intershipList)
          const observables: Observable<any>[] = []

          intershipList.forEach( (pasantia: any,index: number) => {

            let fechaInicio = new Date(pasantia.intershipStartDate as number);
            let fechaFinal = new Date(pasantia.intershipCompletionDate as number);
            let fechaComienzo = new Date();
            intershipList[index].diferencia = Math.floor((fechaFinal.getTime() - fechaComienzo.getTime()) / (1000 * 60 * 60 * 24));
            observables.push(this.userService.getUserData(pasantia.studentDNI))
          })
          this.intershipData = intershipList
          return forkJoin(observables)
        }
      ),
      switchMap( (studentData) => {
        console.log(studentData)
        this.intershipData.forEach( (pasantia:any , index: number) => {
          this.intershipData[index].author = studentData[index].userLastName + ", " + studentData[index].userFirstName
          this.intershipData[index].intershipStartDate = new Date(this.intershipData[index].intershipStartDate).toLocaleDateString()
          this.intershipData[index].intershipCompletionDate = new Date(this.intershipData[index].intershipCompletionDate).toLocaleDateString()
        })
        return of(null)
      })
    ).subscribe({
      complete: () => {
        console.log("completado")
      }
    })
  }

  enviarPlanillas(element: any){
    console.log(element)
    this.userService.getUserData(element.studentDNI).pipe(
      switchMap(
        (studentData) => {
          this.studentData = studentData
          return this.userService.getUserData(element.corporateTutorDNI)
        }
      ),
      switchMap(
        (corporateTutorData) => {
          this.corporateTutorData = corporateTutorData
          return this.userService.getUserData(element.academicTutorDNI)
        }
      ),
      switchMap(
        (academicTutorData) => {
          this.academicTutorData = academicTutorData
          return this.enterpriseService.getEnterpriseById(element.enterpriseId)
        }
      ),
      switchMap(
        (enterpriseData) => {
          this.enterpriseData = enterpriseData
          return this.corporateTutorCriteriaService.getAllEnterpriseTutorCriteria()
          //return this.formGenerator.convertDocumentToBlob(this.formGenerator.generateIntershipAcademicTutorEvaluationForm())
          //return of(null)
        }
      ),
      switchMap(
        (corporateTutorCriteriaList) => {
          this.corporateCriteriaList = corporateTutorCriteriaList
          return this.academicTutorCriteriaService.getAllAcademicTutorCriteria()
        }
      ),
      switchMap(
        (academicTutorCriteriaList) => {
          this.academicCriteriaList = academicTutorCriteriaList
          return this.academicTutorCriteriaService.getAllAcademicTutorSeccion()
        }
      ),
      switchMap(
        (academicTutorSeccionList) => {
          this.academicSeccionList = academicTutorSeccionList
          return this.corporateTutorCriteriaService.getAllEnterpriseTutorSeccion()
        }
      ),
      switchMap(
        (corporateTutorSeccionList) => {
          this.corporateSeccionList = corporateTutorSeccionList
          const tableData = {
            nombreAlumno: this.studentData.userLastName + ", " + this.studentData.userFirstName, 
            cedulaAlumno: this.studentData.userDNI, 
            empresa: this.enterpriseData.enterpriseName, 
            nombreTutor: this.corporateTutorData.userLastName + ", " + this.corporateTutorData.userFirstName
          }
          return this.formGenerator.convertDocumentToBlob(this.formGenerator.generateIntershipCorporateTutorEvaluationForm(this.corporateCriteriaList,this.corporateSeccionList,tableData))
        }
      ),
      switchMap(
        (corporateTutorEvaluationForm) => {
          this.corporateTutorEvaluation = corporateTutorEvaluationForm
          const tableData = {
            nombreAlumno: this.studentData.userLastName + ", " + this.studentData.userFirstName, 
            cedulaAlumno: this.studentData.userDNI, 
            empresa: this.enterpriseData.enterpriseName, 
            nombreTutor: this.academicTutorData.userLastName + ", " + this.academicTutorData.userFirstName
          }
          return this.formGenerator.convertDocumentToBlob(this.formGenerator.generateIntershipAcademicTutorEvaluationForm(this.academicCriteriaList,this.academicSeccionList,tableData))
        }
      ),
      switchMap(
        (academicTutorEvaluationForm) => {
          this.academicTutorEvaluation = academicTutorEvaluationForm
          const observables: Observable<any>[] = []
          console.log(this.academicTutorEvaluation)
          console.log(this.corporateTutorEvaluation)
          observables.push(this.emailService.sendEmail(this.corporateTutorEvaluation as File,this.localUserData.userEmail,this.corporateTutorData.userEmail));
          observables.push(this.emailService.sendEmail(this.academicTutorEvaluation as File,this.localUserData.userEmail,this.academicTutorData.userEmail))
          return forkJoin(observables)
        }
      )

    ).subscribe(
      {
        next: (result) => {
          console.log(result)
          this.pasantiaService.cambiarEstadoPasantia(element.intershipId,30).subscribe({
            complete: () => {
              window.location.href = window.location.href
            }
          })
        }
      }
    )
    //this.pasantiaService.cambiarEstadoPasantia()
  }
}
