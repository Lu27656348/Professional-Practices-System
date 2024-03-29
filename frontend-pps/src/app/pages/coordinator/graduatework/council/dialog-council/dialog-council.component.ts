import { Component, OnInit,Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CouncilService } from '../../../../../services/council.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup,FormControl } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { Observable, catchError, forkJoin, from, mergeMap, of, switchMap, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { StudentService } from 'src/app/services/student.service';
import { EmailService } from 'src/app/services/email.service';
import { environment } from 'src/environments/environment';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';


function downloadFile(fileName: string, studentDNI: string | null, userFirstName: string | null, userLastName: string | null, escuela: string) : Observable<Blob> {
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
  selector: 'app-dialog-council',
  templateUrl: './dialog-council.component.html',
  styleUrls: ['./dialog-council.component.css']
})
export class DialogCouncilComponent implements OnInit{

  cargadoArchivos: boolean = false;

  inputdata: any = null;
  councilList: any = []

  councilSelected: any = null;

  isCreateNewSchoolCouncil: boolean = false;

  studentCount: number = 0;

  coordinatorData: any = null;
  enterpriseData: any = null;

  professorList: any = null

  fileArray: File[] = []

  schoolCouncilForm =  this.formGroup.group({
    schoolCouncil: ['']
  }) 

  councilForm = this.formGroup.group({
    schoolCouncilId: ['', Validators.required],
    academicTutorDNI: ['', Validators.required]
  }) 

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  academicTutorSelected: any = null

  professorData: any = null;

  academicTutorData: any = null;
  councilData: any = null;
  corporateTutorData: any = null;

  constructor(
    private councilService: CouncilService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private graduateWorkService: GraduateworkService,
    private formGroup: FormBuilder,
    private userService: UsersService,
    private enterpriseService: EnterpriseService,
    private professorService: ProfessorsService,
    private _snackBar: MatSnackBar,
    private studentService: StudentService,
    private formService: EvaluationFormGeneratorService,
    private emailService: EmailService
  ){

    this.inputdata = this.data
    console.log(this.inputdata)

    this.professorService.getProfessorsData()
    .pipe(
      switchMap(
        (professorData) => {
          console.log(professorData)
          this.professorData = professorData
          const observables: Observable<any>[] = []
          this.professorData.forEach( (professor: any) => {
            observables.push(this.userService.getUserData(professor.professorDNI))
          })
          return forkJoin(observables)
        }
      ),
      switchMap(
        (professorList) => {
          professorList.forEach ( (professor:any, index: number) => {
            this.professorData.forEach( (professorData: any) => {
              if(professorData.professorDNI == professor.userDNI){
                professorList[index].professorData = professorData
              }
            })
          })

          this.professorList = professorList
          console.log(this.professorList)
          return of("Completado")
        }
      )
    )
    .subscribe(
      {
        next: (result) => {
          console.log(result)
        }
      }
    )

  

  }

  ngOnInit(){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.councilService.getCouncils().subscribe({
      next: (data) => {
        this.councilList = data
      }
    })
    this.enterpriseService.getEnterpriseById(this.inputdata.graduateWorkData.graduateWorkEnterprise).subscribe({
      next: (enterpriseData) => {
        this.enterpriseData = enterpriseData
        console.log(this.enterpriseData)
      }
    });
    this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkCoordinator).subscribe({
      next: (coordinatorData) => {
        this.coordinatorData = coordinatorData
        console.log(coordinatorData)
      }
    })
    this.studentCount = this.inputdata.userData.length
    console.log(this.studentCount)

    this.studentService.getStudentCoordinator(this.inputdata.userData[0].userDNI).subscribe({
      next: (professorData) => {
        this.userService.getUserData(professorData.professordni).subscribe({
          next: (coordinatorData) => {
            this.coordinatorData = coordinatorData
            console.log(coordinatorData)
          }
        })
        
      }
    })
    
  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
      this.cargadoArchivos = true
      if(this.councilForm.valid){
        console.log(this.councilForm.value)

        this.userService.getUserData(this.councilForm.value.academicTutorDNI as string).pipe(
          switchMap(
            (academicTutorData) => {
              this.academicTutorData = academicTutorData
              return this.councilService.getCouncilById(this.councilForm.value.schoolCouncilId as string)
            } 
          ),
          switchMap(
            (councilData) => {
              this.councilData = councilData
              console.log(this.councilData )
              return this.enterpriseService.getEnterpriseById(this.inputdata.graduateWorkData.graduateWorkEnterprise)
            } 
          ),
          switchMap(
            (enterpriseData) => {
              this.enterpriseData = enterpriseData
              return this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkInCompanyTutor)
            }
          ),
          switchMap(
            (corporateTutorData) => {
              this.corporateTutorData = corporateTutorData

              const studentDataFormatted: any = []

              this.inputdata.userData.forEach( (student:any) => {
                studentDataFormatted.push({
                    nombre: student.userLastName + ', ' + student.userFirstName,
                    cedula: student.userDNI,
                    titulo: this.inputdata.graduateWorkData.graduateWorkTitle,
                    empresa: this.enterpriseData.enterpriseName,
                })
              })

              const notificationData = {
                fechaActual: new Date(),
                modalidad: this.inputdata.graduateWorkData.graduateWorkType,
                nombreTutor: this.academicTutorData.userLastName + ", " + this.academicTutorData.userFirstName,
                consejoDeEscuela: this.councilData.schoolCouncilId,
                fechaConsejo: new Date(this.councilData.schoolcouncildate),
                studentData: studentDataFormatted,
                tutorEmpresarial: (this.corporateTutorData) ? this.corporateTutorData.userLastName + ", " + this.corporateTutorData.userFirstName : "",
                nombreCoordinador: `${this.coordinatorData.userFirstName.split(" ")[0]} ${this.coordinatorData.userLastName.split(" ")[0]}`,
                fechaTope: new Date()
              }
              return this.formService.convertDocumentToBlob(this.formService.generateGraduateWorkTutorNotification(notificationData))
            }
          ),
          switchMap(
            (tutorNotificationBlob) => {
              const file: File = new File([tutorNotificationBlob], `${this.academicTutorData.userLastName.split(" ")[0]}${this.academicTutorData.userFirstName.split(" ")[0]} Designación Tutor Académico.docx`, { type: tutorNotificationBlob.type });
              console.log(file)
              let fileName: string = ""
              if(this.inputdata.userData.length > 1){
                fileName = `${this.inputdata.userData[0].userLastName.split(' ')[0]}${this.inputdata.userData[0].userFirstName.split(' ')[0]} ${this.inputdata.userData[1].userLastName.split(' ')[0]}${this.inputdata.userData[1].userFirstName.split(' ')[0]} PTG.pdf`;
              }else{
                fileName = this.inputdata.userData[0].userLastName.split(' ')[0]+this.inputdata.userData[0].userFirstName.split(' ')[0]+' PTG.pdf';
              }
              this.fileArray.push(file)
              let escuela
              if( this.inputdata.userData[0].schoolName == "Ing. Informatica"){
                escuela = "Informática"
              }else{
                escuela = "Civil"
              }
              return downloadFile(fileName,this.inputdata.userData[0].userDNI, this.inputdata.userData[0].userFirstName.split(' ')[0],this.inputdata.userData[0].userLastName.split(' ')[0],escuela)
            }
          ),
          switchMap(
            (proposalBlob) => {
              let fileName: string = ""
              let studentNames: string = ""
              if(this.inputdata.userData.length > 1){
                fileName = `${this.inputdata.userData[0].userLastName.split(' ')[0]}${this.inputdata.userData[0].userFirstName.split(' ')[0]} ${this.inputdata.userData[1].userLastName.split(' ')[0]}${this.inputdata.userData[1].userFirstName.split(' ')[0]} PTG.pdf`;
                studentNames = `Alumnos ${this.inputdata.userData[0].userLastName.split(' ')[0]}${this.inputdata.userData[0].userFirstName.split(' ')[0]} ${this.inputdata.userData[1].userLastName.split(' ')[0]}${this.inputdata.userData[1].userFirstName.split(' ')[0]}`
              }else{
                fileName = this.inputdata.userData[0].userLastName.split(' ')[0]+this.inputdata.userData[0].userFirstName.split(' ')[0]+' PTG.pdf';
                studentNames = ` Alumno ${this.inputdata.userData[0].userLastName.split(' ')[0]}${this.inputdata.userData[0].userFirstName.split(' ')[0]}`
              }
              const file: File = new File([proposalBlob], fileName, { type: proposalBlob.type });
              console.log(file)
              this.fileArray.push(file)

              const emailData: SendEmailRequest = {
                emailTo: this.academicTutorData.userEmail,
                emailFrom: this.coordinatorData.userEmail,
                subject: `Designación Tutor Académico ${this.academicTutorData.userLastName.split(" ")[0]} ${this.academicTutorData.userFirstName.split(" ")[0]} ${studentNames}` ,
                htmlContent:
                `
                Puerto Ordaz,  ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
                Buen día estimado Tutor Académico ${this.academicTutorData.userLastName} ${this.academicTutorData.userFirstName}
                Saludándole cordialmente
                Adjunto:
                          	Carta de Designación como Tutor Académico
                          	Propuesta de Trabajo de Grado aprobada
                En el enlace:
                https://drive.google.com/drive/folders/1hlsABemJ6s9rM8ewyw9VnT7TF_-5Oy6o?usp=sharing
                Encontrará 
                          	Guía Informe Trabajo Grado IINF Gy, donde se detalla el contenido que debe tener el Informe de Trabajo Grado, el cual usted debe garantizar al emitir la Carta Culminación TG.
                          	Guía Normas APA Formato - IINF, donde se detalla el formato que debe tener el Informe de Trabajo Grado, el cual usted debe garantizar al emitir la Carta Culminación TG.
                          	Reglamento Trabajo de Grado de la Facultad de Ingeniería, vigente y que rige lo relativo a la elaboración y presentación del Trabajo de Grado en la Facultad.
                Documentos que requiere para la realización de la tutoría.
                Deseándole el mayor de los éxitos en su tutoría
                Se le convoca a una reunión para tratar puntos relevantes sobre la entrega del informe de Trabajo de Grado, entre Tutores y Alumnos, el día jueves 15 de junio, a las 4 pm, en el laboratorio de Base de Datos.
                Cualquier consulta o duda estoy a su disposición.
                Atentamente
                ${this.coordinatorData.userLastName}, ${this.coordinatorData.userFirstName}
                `
              }
              return this.emailService.sendMultipleEmail(this.fileArray,emailData)

            }
          ),
          switchMap(
            (result) => {
              console.log(result)
              const notificationDataArray: any = []
            
              this.inputdata.userData.forEach( (student:any) => {
                notificationDataArray.push({
                  fechaActual: new Date(),
                  nombreTutor: this.academicTutorData.userLastName + ", " + this.academicTutorData.userFirstName,
                  cedulaTutor: this.academicTutorData.userDNI,
                  consejoDeEscuela: this.councilData.schoolCouncilId,
                  fechaConsejo: new Date(this.councilData.schoolcouncildate),
                  nombreAlumno: student.userLastName + ', ' + student.userFirstName,
                  nombreCoordinador: this.coordinatorData.userFirstName + ", " + this.coordinatorData.userLastName,
                  fechaTope: new Date()
                })
              })

              const observables: Observable<any>[] = []
              this.inputdata.userData.forEach( (student: any, index: number) => {
                observables.push(this.formService.convertDocumentToBlob(this.formService.generateGraduateWorkTutorStudentNotification(notificationDataArray[index])))
              })
              
              return forkJoin(observables)
              
            }
          ),
          switchMap(
            (fileBlobArray) => {
              console.log(fileBlobArray)
              const observables: Observable<any>[] = []

              let studentNames: string = ""
              if(this.inputdata.userData.length > 1){
                studentNames = `Alumnos ${this.inputdata.userData[0].userLastName.split(' ')[0]}${this.inputdata.userData[0].userFirstName.split(' ')[0]} ${this.inputdata.userData[1].userLastName.split(' ')[0]}${this.inputdata.userData[1].userFirstName.split(' ')[0]}`
              }else{
                studentNames = ` Alumno ${this.inputdata.userData[0].userLastName.split(' ')[0]}${this.inputdata.userData[0].userFirstName.split(' ')[0]}`
              }


              this.inputdata.userData.forEach( (student: any, index: number) => {
                let file: File = new File([fileBlobArray[index]], `${student.userLastName.split(" ")[0]}${student.userFirstName.split(" ")[0]} Designación Tutor Académico.docx`, { type: fileBlobArray[index].type });
                console.log(file)
                let emailData: SendEmailRequest = {
                  emailTo: student.userEmail,
                  emailFrom: this.coordinatorData.userEmail,
                  subject: `Notificación Aprobación Propuesta de TG ${studentNames}` ,
                  htmlContent: 
                  `
                  Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
                  Buen día estimado(a) ${student.userLastName}, ${student.userFirstName}
                  Le informo que su Propuesta de Trabajo de Grado, ha sido aprobada en Consejo de Escuela; adjunto Carta de Aprobación de la misma.
                  En el enlace:
                            https://drive.google.com/drive/folders/1AvM-Bshb2HZePPBxszrg81Xtdwn-kuOr?usp=sharing
                            Encontrará la Guía Informe Trabajo Grado IINF Gy, donde se detalla el contenido que debe tener el Informe de Trabajo Grado.
                  Y en el enlace 
                            https://drive.google.com/drive/folders/1aa0u-J8Dm6ZdDBKQg4joRbOPEvqb7XVO?usp=sharing
                            Encontrará la Guía Normas APA Formato - IINF, donde se detalla el formato que debe tener el Informe de Trabajo Grado
                  También se le envía copia de la designación a su Tutor Académico
                  Deseándole el mayor de los éxitos
                  Cualquier consulta o duda estoy a su disposición.
                  Saludos cordiales
                  ${this.coordinatorData.userLastName}, ${this.coordinatorData.userFirstName}
                  `
                }
                observables.push(this.emailService.sendEmail(file,emailData))
              })
              return forkJoin(observables)
            }
          ),
          switchMap(
            (result) => {
              console.log(result)
              return  this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,50)
            }
          ),
          switchMap(
            (result) => {
              console.log(result)
              return  this.graduateWorkService.setGraduateWorkCouncil({"graduateWorkId": this.inputdata.graduateWorkData.graduateworkid, "graduateWorkSchoolCouncil": this.councilForm.value.schoolCouncilId, "graduateWorkAcademicTutor": this.councilForm.value.academicTutorDNI})
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
        this._snackBar.open("Debe seleccionar todos los datos", "cerrar",{
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        })
      }
      
  
    }
    
  }

  createSchoolCouncil(){
    console.log("createReviewerCriteria()")
    this.isCreateNewSchoolCouncil = !this.isCreateNewSchoolCouncil
  }

  addSchoolCouncil(){
    console.log("addSchoolCouncil()")
  }

  generarPlanillas(){
    /*
    this.formService.printEvaluationForm(this.formService.generateGraduateWorkTutorNotification(
      {
        fechaActual: new Date(),
        modalidad: "INSTRUMENTAL",
        nombreTutor: "Medina, Luz Esperanza",
        consejoDeEscuela: "001-2023-2024",
        fechaConsejo: new Date(),
        studentData: 
        [
          {
            nombre: "Somoza Ledezma, Luis Carlos",
            cedula: "V-27656348",
            titulo: "Sistema de Practicas Profesionales",
            empresa: "OpenTech C.A",
          }
        ],
        tutorEmpresarial: "Bello, Jannelly",
        nombreCoordinador: "Nombre de Coordinador",
        fechaTope: new Date()
      }
    ))
    */
   this.formService.printEvaluationForm(this.formService.generateGraduateWorkTutorStudentNotification(
    {
      fechaActual: new Date(),
      nombreTutor: "Medina, Luz Esperanza",
      cedulaTutor: "V-11515881",
      consejoDeEscuela: "001-2023-2024",
      fechaConsejo: new Date(),
      nombreAlumno: "Somoza Ledezma, Luis Carlos",
      nombreCoordinador: "Nombre de Coordinador",
      fechaTope: new Date()
    }
   ))
  }
}
