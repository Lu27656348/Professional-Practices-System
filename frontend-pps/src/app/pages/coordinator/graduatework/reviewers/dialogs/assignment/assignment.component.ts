import { Component, OnInit,Inject } from '@angular/core';

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup,FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, catchError, concat, forkJoin, from, map, mergeMap, observable, of, switchMap, throwError } from 'rxjs';

/* Servicios */

import { GraduateworkService } from '../../../../../../services/graduatework.service';
import { ProfessorsService } from '../../../../../../services/professors.service';
import { CommitteeService } from '../../../../../../services/committee.service'
import { CreateReviewerEvaluationRequest } from 'src/app/interfaces/requests/CreateReviewerEvaluationRequest';
import { DocumentService } from 'src/app/services/document.service';
import { EmailService } from 'src/app/services/email.service';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { UsersService } from 'src/app/services/users.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';

interface Criteria {
  reviewerCriteriaId: number;
  reviewerCriteriaDescription: string
}
interface ResponseBlob<T> extends Response {
  blob(): Promise<Blob>;
}

function downloadFile(fileName: string, studentDNI: string | null, userFirstName: string | null, userLastName: string | null,escuela: string) : Observable<Blob> {
  return from(
    fetch(`${environment.amazonS3}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fileName: fileName,
        studentDNI: studentDNI,
        userFirstName: userFirstName,
        userLastName: userLastName,
        escuela: escuela
      }),
      })
  )
  .pipe(
    // Handle network errors
    catchError((error) => {
      console.error('Network error:', error);
      return throwError(() => new Error('Network error'));
    }),
    // Handle HTTP errors
    catchError((error) => {
      if (error.status >= 400) {
        console.error('HTTP error:', error);
        return throwError(() => new Error('HTTP error'));
      }
      throw error; // Re-throw other errors
    }),
    // Unwrap the Promise and emit the Blob
    mergeMap((response) => from(response.blob())),
    // Handle potential Blob extraction errors
    catchError((error) => {
      console.error('Error extracting Blob:', error);
      return throwError(() => new Error('Error extracting Blob'));
    })
  );
}
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit{

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  professorsList: any[] = [];
  committeeList: any[] = [];

  reviewerSelected: any = null;
  committeeSelected: any = null;

  selectedValues: any[] = [];

  inputdata: any;

  fileArray: File[] = []

  isCreateNewCommittee: boolean = false;
  newCommittee: string = '';

  isCreateNewReviewerCriteria : boolean = false;
  newReviewerCriteria: string = '';

  graduateWorkData: any = null;
  studentData: any = null;
  tutorData: any = null;
  reviewerData: any = null;
  enterpriseData: any = null;
  administratorData: any = null

  professorData: any = null;
  externalData: any = null;

  fileName: any = null

  cargadoArchivos: boolean = false;

  listaRevisores: any[] = []

  reviewerForm = this.formGroup.group({
    reviewer: ['', Validators.required]
  });

  committeeForm =  this.formGroup.group({
    committeeId: ['',Validators.required]
  }) 

  reviewerCriteriaForm =  this.formGroup.group({
    reviewerCriteriaDescription: ['']
  }) 

  criteria: any = [];

  criteriaForm = new FormGroup({});

  isCivil: boolean = false;
  reviewerEvaluationFormFile: any = null;
  reviewerNotificationFile: any = null;

  revisoresData: any = null

  userData: any = null
  constructor(
    private graduateWorkService: GraduateworkService,
    private professorService: ProfessorsService, 
    private committeeService: CommitteeService,
    private formGroup: FormBuilder,
    private userService: UsersService,
    private enterpriseService: EnterpriseService,
    private externalService: ExternalPersonnelService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService,
    private emailService: EmailService,
    private formService: EvaluationFormGeneratorService
  ){

    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      this.userService.getUserData(localUserData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
          this.committeeService.getCommitteeBySchool(this.userData.schoolName).subscribe({
            next: ( data:any ) => {
              this.committeeList = [...data]
              console.log(this.committeeList)
            }
          })
        }
      })
    }
    this.inputdata = this.data
    console.log(this.inputdata)
    if(this.inputdata?.user[0]?.schoolName == "Ing. Civil"){
      this.isCivil = true
      console.log(this.isCivil)
    }
    this.graduateWorkService.getCriteria().subscribe({
      next: (data) => {
        this.criteria = [...data]
        console.log(this.criteria)
        this.criteria.forEach((item: Criteria) => {
          this.criteriaForm.addControl(item.reviewerCriteriaId.toString(), new FormControl(false)); // Assuming initial value is false
        });
      }
    })
    this.userService.getUserData(this.inputdata.administrator.userDNI).subscribe({
      next: (administratorData) => {
        this.administratorData = administratorData
      }
    })

  }
  ngOnInit(){
    this.professorService.getProfessors().subscribe({
      next: ( data:any ) => {
        this.professorsList = [...data]
        console.log( this.professorsList)
      }
    })

  




  
  }

  onSelectionChange(){
    console.log(this.reviewerSelected)
    console.log(this.committeeSelected)
    console.log(this.reviewerForm.value.reviewer)
    this.reviewerSelected = this.reviewerForm.value.reviewer
  }

  agregarRevisor(){
    console.log("Agregar Revisor")
    console.log(this.reviewerSelected)
    if(this.reviewerSelected == null){
      this._snackBar.open("Debe seleccionar al revisor previo","cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }else{
      if(this.listaRevisores.length == 0){

        this.listaRevisores.push(this.reviewerSelected)
        this.reviewerSelected = null
        console.log(this.listaRevisores)
 
      }else{
      
        this.listaRevisores.push(this.reviewerSelected)
        this.reviewerSelected = null
        console.log(this.listaRevisores)
      }
    }
    
    
    
  }

  agregarRevisorALista( profesorRevisor: any ){
    console.log(profesorRevisor.value)
    this.reviewerSelected = profesorRevisor.value
  }

  generarPlanillaPorRevisor(){
    this.listaRevisores.push(this.reviewerSelected)
    console.log(this.listaRevisores)

    this.graduateWorkService.getGraduateWorkById(this.inputdata.gw.graduateWorkId).pipe(
      switchMap(
        (graduateWorkData) => {
          console.log(graduateWorkData)
          this.committeeSelected = this.committeeForm.value.committeeId
          this.graduateWorkData = graduateWorkData
          return this.enterpriseService.getEnterpriseById(this.graduateWorkData.graduateWorkEnterprise)
        }
      ),
      switchMap(
        (enterpriseData) => {
          console.log(enterpriseData)
          this.enterpriseData = enterpriseData
          return this.graduateWorkService.getGraduateWorkStudentData(this.inputdata.gw.graduateWorkId)
        }
      ),
      switchMap(
        (studentData) => {
          console.log(studentData)
          this.studentData = studentData
          if(this.graduateWorkData.graduateWorkType == "INSTRUMENTAL"){
            return this.userService.getUserData(this.graduateWorkData.graduateWorkInCompanyTutor)
          }
          return this.userService.getUserData(this.graduateWorkData.graduateWorkAcademicTutor)
        }
      ),
      switchMap(
        (tutorData) => {
          console.log(tutorData)
          this.tutorData = tutorData
          if(this.graduateWorkData.graduateWorkType == "INSTRUMENTAL"){
            return this.externalService.getExternalById(this.graduateWorkData.graduateWorkInCompanyTutor)
          }
          return this.professorService.getProfessorById(this.graduateWorkData.graduateWorkAcademicTutor)

          
        }
      ),
      switchMap(
        (tutorDataDescription) => {
          console.log(tutorDataDescription)
          this.tutorData.tutorDescription = tutorDataDescription
          const observables: Observable<any>[] = []
          this.listaRevisores.forEach( (revisor:any) => {
            observables.push(this.userService.getUserData(revisor))
          })
          return forkJoin(observables)

          
        }
      ),
      switchMap(
        (revisoresList: any) => {
          console.log(revisoresList)
          this.revisoresData = revisoresList

          const observables: Observable<any>[] = []

          let criteriaList: any[] = []
          console.log( this.criteria)
          console.log(this.userData)
          console.log(this.graduateWorkData)
          const criteriaFiltered =
            this.criteria.filter(
              (criteriaData:any) =>
              criteriaData.schoolName == this.userData.schoolName 
              && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
            )
          console.log(criteriaFiltered)
                this.criteria.filter(
                  (criteriaData:any) => criteriaData.schoolName == this.userData.schoolName && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
                ).forEach( (criteria: any) => {
  
                  const criterio = {
                    criteriaId: criteria.reviewerCriteriaId,
                    criteriaName: criteria.reviewerCriteriaDescription,
                    maxNote: 0,
                    model: "INFORMATICA",
                    seccionId: -1
                  }
                  criteriaList.push(criterio)
                    
  
                })
                console.log(criteriaList)
                const studentDataFormmatted: any = []
      
                this.studentData.forEach( (student: any) => {
                  studentDataFormmatted.push(
                    {
                      nombreAlumno: student.userLastName + ", " + student.userFirstName,
                      cedulaAlumno: student.userDNI, 
                      correo: student.userEmail, 
                      telefono: student.userPhone,
                      empresa: this.enterpriseData.enterpriseName
                    }
                  )
                })
      
                const tutorDataFormatted = {
                  nombreCompleto: this.tutorData.userLastName + this.tutorData.userFirstName, 
                  profesion: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? this.tutorData.tutorDescription.externalPersonnelProfession : this.tutorData.tutorDescription.professorProfession, 
                  experiencia: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? this.tutorData.tutorDescription.externalPersonnelWorkExperience : this.tutorData.tutorDescription.professorWorkExperience, 
                  cargo: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? "Falta el cargo en la tabla de Externo" : this.tutorData.tutorDescription.professorRole, 
                  correo: this.tutorData.userEmail, 
                  telefono: this.tutorData.userPhone
                }
      
                this.revisoresData.forEach( (revisor: any) => {

                  const formData = {
                    modalidad: this.graduateWorkData.graduateWorkType, 
                    titulo: this.graduateWorkData.graduateWorkTitle,
                    nombreEmpresa: this.enterpriseData.enterpriseName, 
                    studentData: studentDataFormmatted,
                    tutorData: tutorDataFormatted,
                    nombreRevisor: revisor.userLastName + ", " + revisor.userFirstName, 
                    fechaActual: new Date()
                  }

                  revisor.reviewerEvaluationFormFile = this.formService.generateGraduateWorkReviewerEvaluationForm(criteriaList.filter( (criterio: any ) => criterio.status ),formData)

                  const notificationData = {
                    fechaEnvio: new Date(),
                    nombreRevisor: revisor.userLastName + ", " + revisor.userFirstName,
                    modalidad: this.graduateWorkData.graduateWorkType,
                    tituloPropuesta: this.graduateWorkData.graduateWorkTitle,
                    nombreEstudiante: studentDataFormmatted[0].nombreAlumno,
                    nombreTutor: this.tutorData.userLastName + ", " +  this.tutorData.userFirstName,
                    correoCoordinador: this.administratorData.userEmail,
                    nombreCoordinador: `${this.administratorData.userFirstName.split(" ")[0]} ${this.administratorData.userLastName.split(" ")[0]}` ,
                  }
                
                  revisor.reviewerNotificationFile = this.formService.generateGraduateWorkReviewerNotification(notificationData)

                  
                  const reviewerEvaluation: CreateReviewerEvaluationRequest = {
                    "professorDNI": revisor.userDNI,
                    "graduateWorkId": this.inputdata.gw.graduateWorkId,
                    "committeeId": this.committeeSelected
                  }
                  
                  observables.push(this.graduateWorkService.createReviewerEvaluation(reviewerEvaluation) ) 
                })
                
          return forkJoin(observables)
        }
      ),
      switchMap(
        (result) => {
          console.log(result)
          console.log(this.criteria)
          console.log(this.criteria.filter(
            (criteriaData:any) => 
            criteriaData.schoolName == this.userData.schoolName 
            && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
            && criteriaData.status
          ))
          const observables: Observable<any>[] = [];
          this.revisoresData.forEach( (revisor: any) => {
            this.criteria.filter(
              (criteriaData:any) => 
              criteriaData.schoolName == this.userData.schoolName 
              && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
              && criteriaData.status
            ).forEach( (criterio: any) => {
              
              observables.push(this.graduateWorkService.createReviewerEvaluationCriteria({
                "professorDNI": revisor.userDNI,
                "graduateWorkId": this.inputdata.gw.graduateWorkId,
                "reviewerCriteriaId": criterio.reviewerCriteriaId
              }))
              
            })
          })
          

          return forkJoin(observables);
        }
      ),
      
    )
    .subscribe({
      next: (result: any) => {
        console.log(result)
        console.log(this.revisoresData)
        const observables: Observable<any>[] = [];
        this.revisoresData.forEach( (revisor: any) => {
          this.fileArray = []
          this.generarPlanillasDeRevisor(revisor) 
          .subscribe({
            next: (result) => {
              console.log(result)
            },
            error: (error) => {
              
              this._snackBar.open("Ocurrio un error con la carga del archivo, refresque la pagina e intente de nuevo","cerrar",{
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition
              })
              this.cargadoArchivos = false
              throw new Error(error.message)
            },
            complete: ()=> {
              console.log("%cCompletado", "color: green")
              window.location.href = window.location.href
            }
          })
        })

    
        
  
        console.log("Adios")
      }
    })
  }

  generarPlanillasDeRevisor(revisorData: any){
    console.log(this.fileArray)
    const fileArrayRevisor: File[] = []
    return this.formService.convertDocumentToBlob(revisorData.reviewerEvaluationFormFile).pipe(
      switchMap(
        (reviewerEvaluationFormFileBlob) => {
          const file: File = new File([reviewerEvaluationFormFileBlob], `${this.studentData[0].userLastName.split(" ")[0]}${this.studentData[0].userFirstName.split(" ")[0]} ${revisorData.userLastName.split(" ")[0]}${revisorData.userFirstName.split(" ")[0]} Evaluación Propuesta TG.docx`, { type: reviewerEvaluationFormFileBlob.type });
          console.log(file)
          fileArrayRevisor.push(file)
          return of("todo bien")
        }
      ),
      switchMap(
        (result) => {
          console.log(result)
          return this.formService.convertDocumentToBlob(revisorData.reviewerNotificationFile) 
        }
      ),
      switchMap(
        (reviewerNotificationFileBlob) => {
          const file: File = new File([reviewerNotificationFileBlob], `${this.studentData[0].userLastName.split(" ")[0]}${this.studentData[0].userFirstName.split(" ")[0]} ${revisorData.userLastName.split(" ")[0]}${revisorData.userFirstName.split(" ")[0]} Designación Revisor TG.docx`, { type: reviewerNotificationFileBlob.type });
          console.log(file)
          fileArrayRevisor.push(file)
          let fileName: string = ""
          if(this.inputdata.user.length > 1){
            fileName = `${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]} PTG.pdf`;
          }else{
            fileName = this.inputdata.user[0].userLastName.split(' ')[0]+this.inputdata.user[0].userFirstName.split(' ')[0]+' PTG.pdf';
          }
  
          console.log(fileName);
          this.fileName = fileName
          let escuela;
          if(this.userData.schoolName == "Ing. Informatica"){
            escuela = "Informática"
          }else{
            escuela = "Civil"
          }
  
          return downloadFile(fileName,this.inputdata.user[0].userDNI, this.inputdata.user[0].userFirstName.split(' ')[0],this.inputdata.user[0].userLastName.split(' ')[0],escuela)
  
        }
      ),
      switchMap(
        (propuestaBlob) => {
          const file: File = new File([propuestaBlob], this.fileName, { type: propuestaBlob.type });
          console.log(file)
          fileArrayRevisor.push(file)
  
          let studentNames: string = ""
          if(this.inputdata.user.length > 1){
            studentNames = `Alumnos ${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]}`
          }else{
            studentNames = ` Alumno ${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]}`
          }
  
          let emailData: SendEmailRequest = {
            emailTo: revisorData.userEmail,
            emailFrom: this.administratorData.userEmail,
            subject: `Designación Profesor Revisor ${revisorData.userLastName.split(" ")[0]} ${revisorData.userFirstName.split(" ")[0]} - Propuesta de TG ${studentNames}` ,
            htmlContent: 
            `
            Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
  
                      Buen día estimado(a) profesor(a): ${revisorData.userLastName}, ${revisorData.userFirstName}
  
                      Saludándole cordialmente
  
                      Adjunto: Carta de Designación como Profesor Revisor, Propuesta, Planilla de Evaluación de la misma editable, con los datos de la propuesta y estudiante.
  
                      Nota: Puede generar la planilla de evaluación de Propuesta en el siguiente enlace:
  
                      Enlace: ${environment.basicURL}/generar/planilla/${revisorData.userDNI}/${this.inputdata.gw.graduateWorkId}
  
                      Agradeciendo su amable y pronta atención a la presente.
  
                      Cualquier consulta o duda estoy a su disposición.
  
                      Atentamente
  
            ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}
            `
          }
          return this.emailService.sendMultipleEmail(fileArrayRevisor, emailData) 
        }
      )
    )

  
    

    
  

  }
  
  onCheckboxChange(option: Criteria) {
  
    const control = this.criteriaForm.get(option.reviewerCriteriaId.toString()) as FormControl

    if (control.value) {
      this.selectedValues.push(option.reviewerCriteriaId);
    } else {
      const index = this.selectedValues.indexOf(option.reviewerCriteriaId);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    }
    console.log(this.selectedValues)

  }

  veredictoPropuesta(decision: string){
    if(decision === 'aprobar'){
      if(this.committeeForm.valid && this.reviewerForm.valid){
        this.cargadoArchivos = true;
        if(this.listaRevisores.length == 0){
          this.graduateWorkService.getGraduateWorkById(this.inputdata.gw.graduateWorkId)
          .pipe(
            switchMap(
              (graduateWorkData) => {
                console.log(graduateWorkData)
                this.reviewerSelected = this.reviewerForm.value.reviewer
                this.committeeSelected = this.committeeForm.value.committeeId
                this.graduateWorkData = graduateWorkData
                return this.enterpriseService.getEnterpriseById(this.graduateWorkData.graduateWorkEnterprise)
              }
            ),
            switchMap(
              (enterpriseData) => {
                console.log(enterpriseData)
                this.enterpriseData = enterpriseData
                return this.graduateWorkService.getGraduateWorkStudentData(this.inputdata.gw.graduateWorkId)
              }
            ),
            switchMap(
              (studentData) => {
                console.log(studentData)
                this.studentData = studentData
                if(this.graduateWorkData.graduateWorkType == "INSTRUMENTAL"){
                  return this.userService.getUserData(this.graduateWorkData.graduateWorkInCompanyTutor)
                }
                return this.userService.getUserData(this.graduateWorkData.graduateWorkAcademicTutor)
              }
            ),
            switchMap(
              (tutorData) => {
                console.log(tutorData)
                this.tutorData = tutorData
                if(this.graduateWorkData.graduateWorkType == "INSTRUMENTAL"){
                  return this.externalService.getExternalById(this.graduateWorkData.graduateWorkInCompanyTutor)
                }
                return this.professorService.getProfessorById(this.graduateWorkData.graduateWorkAcademicTutor)
      
                
              }
            ),
            switchMap(
              (tutorDataDescription) => {
                console.log(tutorDataDescription)
                this.tutorData.tutorDescription = tutorDataDescription
                return this.userService.getUserData(this.reviewerSelected)
      
                
              }
            ),
            switchMap(
              (reviewerData) => {
                this.reviewerData = reviewerData
                let criteriaList: any[] = []
                console.log( this.criteria)
                console.log(this.userData)
                console.log(this.graduateWorkData)
                const criteriaFiltered =
                this.criteria.filter(
                  (criteriaData:any) => 
                  criteriaData.schoolName == this.userData.schoolName 
                  && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
                )
                console.log(criteriaFiltered)
                this.criteria.filter(
                  (criteriaData:any) => criteriaData.schoolName == this.userData.schoolName && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
                ).forEach( (criteria: any) => {
  
                  const criterio = {
                    criteriaId: criteria.reviewerCriteriaId,
                    criteriaName: criteria.reviewerCriteriaDescription,
                    maxNote: 0,
                    model: "INFORMATICA",
                    seccionId: -1
                  }
                  criteriaList.push(criterio)
                    
  
                })
                console.log(criteriaList)
                const studentDataFormmatted: any = []
      
                this.studentData.forEach( (student: any) => {
                  studentDataFormmatted.push(
                    {
                      nombreAlumno: student.userLastName + ", " + student.userFirstName,
                      cedulaAlumno: student.userDNI, 
                      correo: student.userEmail, 
                      telefono: student.userPhone,
                      empresa: this.enterpriseData.enterpriseName
                    }
                  )
                })
      
                const tutorDataFormatted = {
                  nombreCompleto: this.tutorData.userLastName + this.tutorData.userFirstName, 
                  profesion: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? this.tutorData.tutorDescription.externalPersonnelProfession : this.tutorData.tutorDescription.professorProfession, 
                  experiencia: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? this.tutorData.tutorDescription.externalPersonnelWorkExperience : this.tutorData.tutorDescription.professorWorkExperience, 
                  cargo: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? "Falta el cargo en la tabla de Externo" : this.tutorData.tutorDescription.professorRole, 
                  correo: this.tutorData.userEmail, 
                  telefono: this.tutorData.userPhone
                }
      
                const formData = {
                  modalidad: this.graduateWorkData.graduateWorkType, 
                  titulo: this.graduateWorkData.graduateWorkTitle,
                  nombreEmpresa: this.enterpriseData.enterpriseName, 
                  studentData: studentDataFormmatted,
                  tutorData: tutorDataFormatted,
                  nombreRevisor: this.reviewerData.userLastName + ", " + this.reviewerData.userFirstName, 
                  fechaActual: new Date()
                }
      
                this.reviewerEvaluationFormFile = this.formService.generateGraduateWorkReviewerEvaluationForm(criteriaList.filter( (criterio: any ) => criterio.status ),formData)
  
                console.log(this.administratorData)
                const notificationData = {
                  fechaEnvio: new Date(),
                  nombreRevisor:this.reviewerData.userLastName + ", " + this.reviewerData.userFirstName,
                  modalidad: this.graduateWorkData.graduateWorkType,
                  tituloPropuesta: this.graduateWorkData.graduateWorkTitle,
                  nombreEstudiante: studentDataFormmatted[0].nombreAlumno,
                  nombreTutor: this.tutorData.userLastName + ", " +  this.tutorData.userFirstName,
                  correoCoordinador: this.administratorData.userEmail,
                  nombreCoordinador: `${this.administratorData.userFirstName.split(" ")[0]} ${this.administratorData.userLastName.split(" ")[0]}` ,
                }
              
                this.reviewerNotificationFile = this.formService.generateGraduateWorkReviewerNotification(notificationData)
              
                const reviewerEvaluation: CreateReviewerEvaluationRequest = {
                  "professorDNI": this.reviewerSelected,
                  "graduateWorkId": this.inputdata.gw.graduateWorkId,
                  "committeeId": this.committeeSelected
                }
                console.log(reviewerEvaluation);
                return this.graduateWorkService.createReviewerEvaluation(reviewerEvaluation) 
              }
            ),
            switchMap(
              (result) => {
                console.log(result)
                const observables: Observable<any>[] = [];
                this.criteria.filter(
                  (criteriaData:any) => 
                  criteriaData.schoolName == this.userData.schoolName 
                  && criteriaData.criteriaModel == this.graduateWorkData.graduateWorkType
                  && criteriaData.status
                ).forEach( (criterio: any) => {
                  
                  observables.push(this.graduateWorkService.createReviewerEvaluationCriteria({
                    "professorDNI": this.reviewerSelected,
                    "graduateWorkId": this.inputdata.gw.graduateWorkId,
                    "reviewerCriteriaId": criterio.reviewerCriteriaId
                  }))
                  
                })
      
                return forkJoin(observables);
              }
            ),
            switchMap(
              (result) => {
                return this.formService.convertDocumentToBlob(this.reviewerEvaluationFormFile) 
              }
            ),
            switchMap(
              (reviewerEvaluationFormFileBlob) => {
                const file: File = new File([reviewerEvaluationFormFileBlob], `${this.studentData[0].userLastName.split(" ")[0]}${this.studentData[0].userFirstName.split(" ")[0]} ${this.tutorData.userLastName.split(" ")[0]}${this.tutorData.userFirstName.split(" ")[0]} Evaluación Propuesta TG.docx`, { type: reviewerEvaluationFormFileBlob.type });
                console.log(file)
                this.fileArray.push(file)
                return of("todo bien")
              }
            ),
            switchMap(
              (result) => {
                console.log(result)
                return this.formService.convertDocumentToBlob(this.reviewerNotificationFile) 
              }
            ),
            switchMap(
              (reviewerNotificationFileBlob) => {
                const file: File = new File([reviewerNotificationFileBlob], `${this.studentData[0].userLastName.split(" ")[0]}${this.studentData[0].userFirstName.split(" ")[0]} ${this.tutorData.userLastName.split(" ")[0]}${this.tutorData.userFirstName.split(" ")[0]} Designación Revisor TG.docx`, { type: reviewerNotificationFileBlob.type });
                console.log(file)
                this.fileArray.push(file)
                let fileName: string = ""
                if(this.inputdata.user.length > 1){
                  fileName = `${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]} PTG.pdf`;
                }else{
                  fileName = this.inputdata.user[0].userLastName.split(' ')[0]+this.inputdata.user[0].userFirstName.split(' ')[0]+' PTG.pdf';
                }
      
                console.log(fileName);
                this.fileName = fileName
                let escuela;
                if(this.userData.schoolName == "Ing. Informatica"){
                  escuela = "Informática"
                }else{
                  escuela = "Civil"
                }
  
                return downloadFile(fileName,this.inputdata.user[0].userDNI, this.inputdata.user[0].userFirstName.split(' ')[0],this.inputdata.user[0].userLastName.split(' ')[0],escuela)
  
              }
            ),
            switchMap(
              (propuestaBlob) => {
                const file: File = new File([propuestaBlob], this.fileName, { type: propuestaBlob.type });
                console.log(file)
                this.fileArray.push(file)
  
                let studentNames: string = ""
                if(this.inputdata.user.length > 1){
                  studentNames = `Alumnos ${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]}`
                }else{
                  studentNames = ` Alumno ${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]}`
                }
  
                let emailData: SendEmailRequest = {
                  emailTo: this.reviewerData.userEmail,
                  emailFrom: this.administratorData.userEmail,
                  subject: `Designación Profesor Revisor ${this.reviewerData.userLastName.split(" ")[0]} ${this.reviewerData.userFirstName.split(" ")[0]} - Propuesta de TG ${studentNames}` ,
                  htmlContent: 
                  `
                  Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
  
                            Buen día estimado(a) profesor(a): ${this.reviewerData.userLastName}, ${this.reviewerData.userFirstName}
  
                            Saludándole cordialmente
  
                            Adjunto: Carta de Designación como Profesor Revisor, Propuesta, Planilla de Evaluación de la misma editable, con los datos de la propuesta y estudiante.
  
                            Nota: Puede generar la planilla de evaluación de Propuesta en el siguiente enlace:
  
                            Enlace: ${environment.basicURL}/generar/planilla/${this.reviewerData.userDNI}/${this.inputdata.gw.graduateWorkId}
  
                            Agradeciendo su amable y pronta atención a la presente.
  
                            Cualquier consulta o duda estoy a su disposición.
  
                            Atentamente
  
                  ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}
                  `
                }
                return this.emailService.sendMultipleEmail(this.fileArray, emailData) 
              }
            )
          )
          .subscribe({
            next: (result) => {
              
              console.log(result)
            },
            complete: () => {
              console.log("%cCompletado", "color: green")
              window.location.href = window.location.href
            },
            error: (error) => {
              
              this._snackBar.open("Ocurrio un error con la carga del archivo, refresque la pagina e intente de nuevo","cerrar",{
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition
              })
              this.cargadoArchivos = false
              throw new Error(error.message)
            }
          })
        }else{
          console.log("Son varios revisores")
          this.generarPlanillaPorRevisor()
        }
        
        

      }else{
        this._snackBar.open("Debe llenar todos los campos" , "cerrar" , {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
      }
     
    
   
    }else{
      this.graduateWorkService.changeStatus(this.inputdata.gw.graduateWorkId,400)
      .subscribe({
        next: (result) => {
          window.location.href = window.location.href
        }
      })
    }

  }

  obtenerPlanillaEvaluacion(){
    console.log("ObtenerPlanillaDeEvaluacion")
  }

  createCommittee(){
    console.log("createCommittee()")
    this.isCreateNewCommittee = !this.isCreateNewCommittee
  }

  addCommittee(){
    console.log("addCommittee()")
    console.log(this.committeeForm.value.committeeId)
    const todayDate = new Date();
    this.committeeService.createCommittee({
      "committeeId": this.committeeForm.value.committeeId as string,
      "committeeDate": todayDate as Date,
      "schoolName": this.userData.schoolName
    }).subscribe({
      next: (data) => {
        console.log(data)
        this.isCreateNewCommittee = !this.isCreateNewCommittee
      },
      complete: () => {
        this.committeeService.getCommitteeBySchool(this.userData.schoolName).subscribe({
          next: ( data:any ) => {
            this.committeeList = [...data]
          }
        })
      }
    })
  }

  createReviewerCriteria(){
    console.log("createReviewerCriteria()")
    this.isCreateNewReviewerCriteria = !this.isCreateNewReviewerCriteria
  }

  addReviewerCriteria(){
    console.log("addReviewerCriteria()")
    console.log(this.reviewerCriteriaForm.value.reviewerCriteriaDescription)
    this.graduateWorkService.createReviewerCriteria({
      "reviewerCriteriaId": null,
      "reviewerCriteriaDescription": this.reviewerCriteriaForm.value.reviewerCriteriaDescription as string,
      schoolName: this.userData.schoolName,
      criteriaModel: this.graduateWorkData.graduateWorkType
    }).pipe(
      switchMap( (result) => {
        console.log(result)
        return of(result)
      })
    ).subscribe({
      complete: () => {
        this.graduateWorkService.getCriteria().subscribe({
          next: (data) => {
            this.criteria = [...data]
            console.log(this.criteria)
            this.criteria.forEach((item: Criteria) => {
              this.criteriaForm.addControl(item.reviewerCriteriaId.toString(), new FormControl(false)); // Assuming initial value is false
            });
          },
          complete: () => {
            this.isCreateNewReviewerCriteria = !this.isCreateNewReviewerCriteria
          }
        })
      }
    })
  }

  obtenerInformePropuesta(){
    let fileName: string = ""
    if(this.inputdata.user.length > 1){
      fileName = `${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]} PTG.pdf`;
    }else{
      fileName = this.inputdata.user[0].userLastName.split(' ')[0]+this.inputdata.user[0].userFirstName.split(' ')[0]+' PTG.pdf';
    }
    
    console.log(fileName);
    let escuela;
    if(this.userData.schoolName == "Ing. Informatica"){
      escuela = "Informática"
    }else{
      escuela = "Civil"
    }
    downloadFile(fileName,this.inputdata.user[0].userDNI, this.inputdata.user[0].userFirstName.split(' ')[0],this.inputdata.user[0].userLastName.split(' ')[0],escuela)
    .subscribe({
      next: (result) => {
        console.log(result)
      }
    });
 
  }

}
