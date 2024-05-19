import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UsersService } from '../../../../../services/users.service';
import { StudentService} from '../../../../../services/student.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'
import  {ExternalPersonnelService } from '../../../../../services/external-personnel.service'
import { Observable, Subscription,catchError,forkJoin,from,mergeMap,of,switchMap, throwError  } from 'rxjs';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CouncilService } from 'src/app/services/council.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { EmailService } from 'src/app/services/email.service';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { environment } from 'src/environments/environment';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

interface ResponseBlob<T> extends Response {
  blob(): Promise<Blob>;
}

function downloadFile(fileName: string, studentDNI: string | null, userFirstName: string | null, userLastName: string | null,schoolName: string) : Observable<Blob> {
  return from(
    fetch(`${environment.amazonS3}/download/graduatework/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ 
        fileName: fileName,
        studentDNI: studentDNI,
        userFirstName: userFirstName,
        userLastName: userLastName,
        escuela: schoolName
      }]),
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
  selector: 'app-jury-dialog',
  templateUrl: './jury-dialog.component.html',
  styleUrls: ['./jury-dialog.component.css']
})
export class JuryDialogComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  inputdata: any = null

  jurySelected: any = null;
  jurySelected2: any = null;
  jurySelected3: any = null;
  jurySelected4: any = null;

  juryList: any = null
  councilList: any = null;

  councilSelected: any = null;

  coordinatorData: any = null;
  enterpriseData: any = null;

  selectedValues: any[] = [];

  criteriaList: any = null;
  seccionList: any = null;

  experimentalReportTutorCriteriaList: any = null

  experimentalReportJuryCriteriaList: any = null
  experimentalReportJurySeccionList: any = null

  experimentalOralJuryCriteriaList: any = null
  experimentalOralJurySeccionList: any = null

  criteriosTutorAcademicoPresentacion: any = null
  criteriosTutorAcademicoinforme: any = null

  instrumentalReportTutorCriteriaList: any = null
  instrumentalReportJuryCriteriaList: any = null


  studentList: any = null;

  fileArray: File[] = []

  juryDataList: any = null;

  tutorData: any = null;
  juryData: any = null;
  jury2Data: any = null;
  councilData: any = null
  studentData: any = null;

  notificacionTutor: any = null;
  notificacionJurado: any = null;
  notificacionJurado2: any = null;

  cargadoArchivos: boolean = false;

  fileName: any = null

  constructor(
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService, 
    private graduateworkService: GraduateworkService, 
    private studentService: StudentService, 
    private emailService: EmailService,
    private externalService: ExternalPersonnelService,
    private councilService: CouncilService,
    private enterpriseService: EnterpriseService,
    private formService: EvaluationFormGeneratorService,
    private _snackBar: MatSnackBar,
  ){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.enterpriseService.getEnterpriseById(this.inputdata.graduateWorkData.graduateWorkEnterprise).subscribe(
      {
        next: (enterpriseData) => {
          this.enterpriseData = enterpriseData
          console.log(this.enterpriseData)
        }
      }
    )

    if(this.inputdata.graduateWorkData.graduateWorkType == "EXPERIMENTAL"){
      this.graduateworkService.getJuryReportExperimentalCriteria(this.inputdata.studentData[0].schoolName).pipe(
        switchMap(
          (juryReportCriteriaList) => {
            this.experimentalReportJuryCriteriaList = juryReportCriteriaList
            return this.graduateworkService.getJuryReportExperimentalSeccion(this.inputdata.studentData[0].schoolName)
          }
        ),
        switchMap(
          (juryReportSeccionList) => {
            this.experimentalReportJurySeccionList = juryReportSeccionList
            /*
            this.formService.printEvaluationForm(this.formService.generateGraduateWorkJuryReportEvaluationForm(
              this.experimentalReportJuryCriteriaList,
              this.experimentalReportJurySeccionList,
              "Sistema de Practicas Profesionales",
              [
                {
                  nombre: "Somoza Ledezma, Luis Carlos"
                }
              ]
            ))
            */
            return of("Criterios de Jurado / INFORME / EXPERIMENTAL -> Completados")
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        }
      })
      this.graduateworkService.getJuryOralExperimentalCriteria(this.inputdata.studentData[0].schoolName).pipe(
        switchMap(
          (juryOralCriteriaList) => {
            this.experimentalOralJuryCriteriaList = juryOralCriteriaList
            return this.graduateworkService.getJuryOralExperimentalSeccion(this.inputdata.studentData[0].schoolName)
          }
        ),
        switchMap(
          (juryOralSeccionList) => {
            this.experimentalOralJurySeccionList = juryOralSeccionList
            /*
            this.formService.printEvaluationForm(this.formService.generateGraduateWorkJuryOralEvaluationForm(
              this.experimentalOralJuryCriteriaList,
              this.experimentalOralJurySeccionList,
              "Sistema de Practicas Profesionales",
              [
                {
                  nombre: "Somoza Ledezma, Luis Carlos"
                }
              ]
            ))
            */
            return of("Criterios de Jurado / ORAL / EXPERIMENTAL -> Completados")
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        }
      })
      this.graduateworkService.getTutorOraltExperimentalCriteria(this.inputdata.studentData[0].schoolName).subscribe({
        next: (criteriaList) => {
          console.log(criteriaList)
          this.criteriosTutorAcademicoPresentacion = criteriaList
        }
      })
      this.graduateworkService.getTutorReportExperimentalCriteria(this.inputdata.studentData[0].schoolName).subscribe({
        next: (criteriaList) => {
          console.log(criteriaList)
          this.criteriosTutorAcademicoinforme = criteriaList
        }
      })
    }else{
      console.log("%c", "CRITERIOS DE TIPO INSTRUMENTAL", "color: red");

      this.graduateworkService.getJuryReportInstrumentalCriteria(this.inputdata.studentData[0].schoolName).pipe(
        switchMap(
          (juryOralCriteriaList) => {
            this.experimentalReportJuryCriteriaList = juryOralCriteriaList
            return this.graduateworkService.getJuryReportInstrumentalSeccion(this.inputdata.studentData[0].schoolName)
          }
        ),
        switchMap(
          (juryOralSeccionList) => {
            this.experimentalReportJurySeccionList = juryOralSeccionList
            return of("Criterios de Jurado / ORAL / EXPERIMENTAL -> Completados")
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        }
      })

      this.graduateworkService.getJuryOralInstrumentalCriteria(this.inputdata.studentData[0].schoolName).pipe(
        switchMap(
          (juryOralCriteriaList) => {
            this.experimentalOralJuryCriteriaList = juryOralCriteriaList
            return this.graduateworkService.getJuryOralInstrumentalSeccion(this.inputdata.studentData[0].schoolName)
          }
        ),
        switchMap(
          (juryOralSeccionList) => {
            this.experimentalOralJurySeccionList = juryOralSeccionList
            return of("Criterios de Jurado / ORAL / EXPERIMENTAL -> Completados")
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        }
      })

      this.graduateworkService.getTutorOralInstrumentalCriteria(this.inputdata.studentData[0].schoolName).subscribe({
        next: (criteriaList) => {
          console.log(criteriaList)
          this.criteriosTutorAcademicoPresentacion = criteriaList
        }
      })
      this.graduateworkService.getTutorReportInstrumentalCriteria(this.inputdata.studentData[0].schoolName).subscribe({
        next: (criteriaList) => {
          console.log(criteriaList)
          this.criteriosTutorAcademicoinforme = criteriaList
        }
      })
    }
    

    this.studentService.getStudentCoordinator(this.inputdata.studentData[0].userDNI).subscribe({
      next: (coordinatorData) => {
        console.log(coordinatorData)
        this.coordinatorData = coordinatorData
      }
    })
  }

  ngOnInit(){

    this.externalService.getInTutors().pipe(
      switchMap( ( juryList ) => {
        console.log(juryList)
        this.juryList = juryList;
        return this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkAcademicTutor)
      }),
      switchMap( ( coordinatorData ) => {
        console.log(coordinatorData)
        const coordinatorId = coordinatorData?.userDNI;
        this.coordinatorData = coordinatorData;
        const objetosFiltrados = this.juryList.filter((objeto : any) => objeto.userDNI !== coordinatorId);
        return of(objetosFiltrados);
      }),
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.juryList = data;
      },
      complete: () => {
        this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkAcademicTutor).subscribe({
          next: (academicTutorData) => {
            this.coordinatorData = academicTutorData
          }
        });
        this.councilService.getCouncils().subscribe({
          next: (councilList) => {
            this.councilList = councilList
          }
        })

      }
    })
    


  }

  juryListHandler (element : any){
    console.log(element)
    console.log(this.juryList)
    
  }

 
  

  createJury(){
    console.log(this.inputdata.graduateWorkData)

    let areDifferent = [this.jurySelected, this.jurySelected2, this.jurySelected3, this.jurySelected4].every(
      (valor, indice, array) => {
        return array.indexOf(valor) === indice;
      }
    );
    
    if(areDifferent){
      this.cargadoArchivos = true
      if(this.jurySelected !== null && this.jurySelected2 !== null && this.jurySelected3 !== null && this.jurySelected4 !== null){
        this.graduateworkService.getGraduateWorkStudentData(this.inputdata.graduateWorkData.graduateworkid).pipe(
          switchMap (
            (studentList) => {
              console.log(studentList)
              this.studentList = studentList
              const observables: Observable<any>[] = [];

              console.log(this.councilSelected)
              observables.push(this.graduateworkService.createJury(this.inputdata.graduateWorkData.graduateWorkAcademicTutor, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid,'TUTOR'));
              observables.push(this.graduateworkService.createJury(this.jurySelected, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid,'PRINCIPAL',this.jurySelected3));
              observables.push(this.graduateworkService.createJury(this.jurySelected2, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid,'PRINCIPAL',this.jurySelected4));
              /* Recordar agregar reemplazos de profesores en esta secccion */
              return forkJoin(observables)
              
            }
          ),
          switchMap(
            (result) => {
              let fileName: string = ""
              if(this.studentList.length > 1){
                fileName = `${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]} TG.pdf`;
              }else{
                fileName = this.studentList[0].userLastName.split(' ')[0]+this.studentList[0].userFirstName.split(' ')[0]+' TG.pdf';
              }
              this.fileName = fileName
              let escuela
              if( this.studentList[0].schoolName == "Ing. Informatica"){
                escuela = "Informática"
              }else{
                escuela = "Civil"
              }
              return downloadFile(fileName,this.studentList[0].userDNI,this.studentList[0].userFirstName, this.studentList[0].userLastName,escuela)
            }
          ),
          switchMap(
            (result) =>{
              console.log(result)
              const file: File = new File([result], this.fileName, { type: result.type });
              console.log(file)
              this.fileArray.push(file)
              return this.councilService.getCouncilById(this.councilSelected)
            }
          ),
          switchMap(
            (councilData) =>{
              console.log(councilData)
              this.councilData = councilData
              return of("Consejo extraido")
            }
          ),
          switchMap(
            (result) => {
              console.log(result)
              /* Generamos el Blob de la Planilla de Evaluacion Oral */

              const studentName: any = []
              this.studentList.forEach( (student:any) => {
                studentName.push( 
                  {
                    nombre: student.userLastName + ", " + student.userFirstName
                  }
                )
              } )
              console.log(this.experimentalOralJuryCriteriaList)
              console.log(this.obtenerMenorId(this.experimentalOralJuryCriteriaList))
              console.log(this.experimentalOralJuryCriteriaList.filter( (criteria:any) => criteria.seccionId == this.obtenerMenorId(this.experimentalOralJuryCriteriaList).seccionId),
              )
              return this.formService.convertDocumentToBlob(
                this.formService.generateGraduateWorkJuryOralEvaluationForm(
                    this.experimentalOralJuryCriteriaList.filter( (contenido: any ) => contenido.status ),
                    this.experimentalOralJuryCriteriaList.filter( (criteria:any) => criteria.seccionId == this.obtenerMenorId(this.experimentalOralJuryCriteriaList).seccionId),
                    this.experimentalOralJurySeccionList,
                    this.inputdata.graduateWorkData.graduateWorkTitle,
                    studentName
                )
              )
            },
          ),
          switchMap(
            (fileBlob) => {
              const file: File = new File([fileBlob], `Evaluacion Oral Trabajo de Grado - Jurado.docx`, { type: fileBlob.type });
              console.log(file)
              this.fileArray.push(file)
              const studentName: any = []
              this.studentList.forEach( (student:any) => {
                studentName.push( 
                  {
                    nombre: student.userLastName + ", " + student.userFirstName
                  }
                )
              })

              return this.formService.convertDocumentToBlob(
                this.formService.generateGraduateWorkJuryReportEvaluationForm(
                  this.experimentalReportJuryCriteriaList.filter( (contenido: any ) => contenido.status ),
                  this.experimentalReportJurySeccionList.filter( (contenido: any ) => contenido.status ),
                  this.inputdata.graduateWorkData.graduateWorkTitle,
                  studentName
                )
              )
            }  
          ),
          switchMap(
            (fileBlob) => {
              const file: File = new File([fileBlob], `Evaluacion Escrita Trabajo de Grado - Jurado.docx`, { type: fileBlob.type });
              console.log(file)
              this.fileArray.push(file)
              const observables: Observable<any>[] = [];
              observables.push(this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkAcademicTutor))
              observables.push(this.userService.getUserData(this.jurySelected))
              observables.push(this.userService.getUserData(this.jurySelected2))
              return forkJoin(observables)
            }  
          ),
          switchMap(
            (juryDataList) => {
              console.log(juryDataList)


              this.juryDataList = juryDataList

              this.juryDataList.forEach( (jury:any) => {
                if(jury.userDNI == this.inputdata.graduateWorkData.graduateWorkAcademicTutor){
                  this.tutorData = jury
                }
                if(jury.userDNI == this.jurySelected){
                  this.juryData = jury
                }
                if(jury.userDNI == this.jurySelected2){
                  this.jury2Data = jury
                }
              })

              console.log(this.tutorData)
              console.log(this.juryData)
              console.log(this.jury2Data)
              const observables: Observable<any>[] = [];

              const studentData: any = [];

              this.studentList.forEach (  (student: any) => {
                studentData.push(
                  {
                    nombre: student.userLastName + ", " + student.userFirstName,
                    cedula: student.userDNI
                  }
                )
              })

              this.studentData = studentData

              let notificationData = {
                fechaActual: new Date(),
                nombreJurado:  this.juryDataList[0].userLastName + ", " + this.juryDataList[0].userFirstName,
                consejoDeEscuela: this.councilSelected,
                fechaConsejo: new Date(),
                studentData: this.studentData,
                titulo: this.inputdata.graduateWorkData.graduateWorkTitle,
                tutorAcademico: this.tutorData.userLastName + ", " + this.tutorData.userFirstName,
                jurado1: this.juryData.userLastName + ", " + this.juryData.userFirstName,
                jurado2: this.jury2Data.userLastName + ", " + this.jury2Data.userFirstName,
                nombreCoordinador: this.coordinatorData.userLastName + ", " + this.coordinatorData.userFirstName,
                correoCoordinador: this.coordinatorData.userEmail
              }
              return this.formService.convertDocumentToBlob(this.formService.generateGraduateWorkJuryNotification(notificationData))
            }
          ),
          
          switchMap(
            (juryNotificationBlob) => {
              console.log(juryNotificationBlob)
              let alumnos;
              if(this.studentList.length > 1){
                alumnos = `Alumnos ${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} ${this.studentList[1].userLastName.split(" ")[0]}${this.studentList[1].userFirstName.split(" ")[0]} `
              }else{
                alumnos = `Alumno ${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} `
              }
              const file: File = new File([juryNotificationBlob], `${this.juryDataList[0].userLastName.split(" ")[0]}${this.juryDataList[0].userFirstName.split(" ")[0]} Designacion Jurado TG.docx`, { type: juryNotificationBlob.type });
              console.log(file)
              this.fileArray.push(file)
              let emailData: SendEmailRequest = {
                emailTo: this.juryDataList[0].userEmail,
                emailFrom: this.coordinatorData.userEmail,
                subject: `Notificación Designación Jurado ${this.juryDataList[0].userLastName.split(" ")[0]} ${this.juryDataList[0].userFirstName.split(" ")[0]} - documentos para evaluación de TG - ${alumnos}` ,
                htmlContent: 
                `
                Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}                                                         
                Buen día estimada profeso(a)r: ${this.juryDataList[0].userLastName} ${this.juryDataList[0].userFirstName}
                Usted ha sido designado jurado de Trabajo de Grado. Adjunto su Designación de Jurado
                Para la revisión y evaluación del mismo dispone de los siguientes documentos:
                          	Informe del Trabajo de Grado
                          El cual encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/17e0j8uznhK1YkUlT1-Z2JwUHJYYrY-vI?usp=sharing
                          	Guía para el Jurador Examinador, el cual contiene un extracto del Reglamento de Trabajos de Grado de la Facultad de Ingeniería relativo a evaluación y criterios a ser evaluados.
                          	Guía Informe Trabajo Grado IINF Gy; en la cual se encuentran los Formatos de Planillas de evaluación del trabajo (Como referencia de los ítems a ser evaluados)
                          Las cuales encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/1AvM-Bshb2HZePPBxszrg81Xtdwn-kuOr?usp=sharing
                          	Guía Normas APA Formato - IINF Gy; la cual contiene un resumen del formato que deben seguir los alumnos en la elaboración del Informe de Trabajo de Grado. 
                          La cual encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/1aa0u-J8Dm6ZdDBKQg4joRbOPEvqb7XVO?usp=sharing

                Las  Planillas de evaluación con los datos del TG y del (los) estudiante(s) estarán impresas y disponibles para ser retiradas en La Escuela de Ingeniería Informática, cuando usted guste. 
                Nota: Adicionalmente, las Planillas de evaluación están disponibles en el siguientes enlaces; puede iniciar la evaluación del documento esrito (informe) del TG y el día de la defensa puede continuar la evaluación de la presentación del TG 

                Enlace para la evaluación del Trabajo Escrito: ${environment.basicURL}/generar/planilla/trabajodegrado/informe/${this.inputdata.graduateWorkData.graduateWorkType.toLowerCase()}/${this.juryDataList[0].userDNI}/${this.inputdata.graduateWorkData.graduateworkid}

                Enlace para la evaluación de la Defensa Oral: ${environment.basicURL}/generar/planilla/trabajodegrado/presentacion/${this.inputdata.graduateWorkData.graduateWorkType.toLowerCase()}/${this.juryDataList[0].userDNI}/${this.inputdata.graduateWorkData.graduateworkid}

                El jurado dispone de 5 y máximo 10 días para la lectura y evaluación del Informe del Trabajo de Grado, según artículo 11 del Reglamento de Trabajo de Grado de la Facultad de Ingeniería.
                La presentación oral será fijada, de acuerdo a la disponibilidad de los participantes; posterior a este acuerdo se le informará el lugar, fecha y hora de la misma.
                De antemano la Escuela de Ingeniería Informática desea expresarle un especial agradecimiento por su colaboración en la evaluación de este Trabajo de Grado.
                Saludándole cordialmente
                Atentamente,
                ${this.coordinatorData.userLastName}, ${this.coordinatorData.userFirstName}
                
                `              }
              return this.emailService.sendMultipleEmail(this.fileArray,emailData)
            },
          ),
          switchMap(
            (emailResult) => {
              console.log(emailResult)
              let notificationData = {
                fechaActual: new Date(),
                nombreJurado:  this.juryDataList[1].userLastName + ", " + this.juryDataList[1].userFirstName,
                consejoDeEscuela: this.councilSelected,
                fechaConsejo: new Date(),
                studentData: this.studentData,
                titulo: this.inputdata.graduateWorkData.graduateWorkTitle,
                tutorAcademico: this.tutorData.userLastName + ", " + this.tutorData.userFirstName,
                jurado1: this.juryData.userLastName + ", " + this.juryData.userFirstName,
                jurado2: this.jury2Data.userLastName + ", " + this.jury2Data.userFirstName,
                nombreCoordinador: this.coordinatorData.userLastName + ", " + this.coordinatorData.userFirstName,
                correoCoordinador: this.coordinatorData.userEmail
              }
              this.fileArray.pop()
              return this.formService.convertDocumentToBlob(this.formService.generateGraduateWorkJuryNotification(notificationData))
            },
          ),
          switchMap(
            (juryNotificationBlob) => {
              console.log(juryNotificationBlob)
              const file: File = new File([juryNotificationBlob], `${this.juryDataList[1].userLastName.split(" ")[0]}${this.juryDataList[1].userFirstName.split(" ")[0]} Designacion Jurado TG.docx`, { type: juryNotificationBlob.type });
              console.log(file)
              this.fileArray.push(file)
              let studentNames: string = ""
              if(this.studentList.length > 1){
                studentNames = `Alumnos ${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]}`
              }else{
                studentNames = ` Alumno ${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]}`
              }
              let emailData: SendEmailRequest = {
                emailTo: this.juryDataList[1].userEmail,
                emailFrom: this.coordinatorData.userEmail,
                subject: `Notificación Designación Jurado ${this.juryDataList[1].userLastName.split(" ")[0]} ${this.juryDataList[1].userFirstName.split(" ")[0]} – documentos para evaluación de TG - ${studentNames}` ,
                htmlContent: ` 
                Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}                                                         
                Buen día estimada profeso(a)r: ${this.juryDataList[1].userLastName} ${this.juryDataList[1].userFirstName}
                Usted ha sido designado jurado de Trabajo de Grado. Adjunto su Designación de Jurado
                Para la revisión y evaluación del mismo dispone de los siguientes documentos:
                          	Informe del Trabajo de Grado
                          El cual encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/17e0j8uznhK1YkUlT1-Z2JwUHJYYrY-vI?usp=sharing
                          	Guía para el Jurador Examinador, el cual contiene un extracto del Reglamento de Trabajos de Grado de la Facultad de Ingeniería relativo a evaluación y criterios a ser evaluados.
                          	Guía Informe Trabajo Grado IINF Gy; en la cual se encuentran los Formatos de Planillas de evaluación del trabajo (Como referencia de los ítems a ser evaluados)
                          Las cuales encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/1AvM-Bshb2HZePPBxszrg81Xtdwn-kuOr?usp=sharing
                          	Guía Normas APA Formato - IINF Gy; la cual contiene un resumen del formato que deben seguir los alumnos en la elaboración del Informe de Trabajo de Grado. 
                          La cual encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/1aa0u-J8Dm6ZdDBKQg4joRbOPEvqb7XVO?usp=sharing

                Las  Planillas de evaluación con los datos del TG y del (los) estudiante(s) estarán impresas y disponibles para ser retiradas en La Escuela de Ingeniería Informática, cuando usted guste. 
                Nota: Adicionalmente, las Planillas de evaluación están disponibles en el siguientes enlaces; puede iniciar la evaluación del documento esrito (informe) del TG y el día de la defensa puede continuar la evaluación de la presentación del TG 

                Enlace para la evaluación del Trabajo Escrito: ${environment.basicURL}/generar/planilla/trabajodegrado/informe/${this.inputdata.graduateWorkData.graduateWorkType.toLowerCase()}/${this.juryDataList[1].userDNI}/${this.inputdata.graduateWorkData.graduateworkid}


                Enlace para la evaluación de la Defensa Oral: ${environment.basicURL}/generar/planilla/trabajodegrado/presentacion/${this.inputdata.graduateWorkData.graduateWorkType.toLowerCase()}/${this.juryDataList[1].userDNI}/${this.inputdata.graduateWorkData.graduateworkid}

                El jurado dispone de 5 y máximo 10 días para la lectura y evaluación del Informe del Trabajo de Grado, según artículo 11 del Reglamento de Trabajo de Grado de la Facultad de Ingeniería.
                La presentación oral será fijada, de acuerdo a la disponibilidad de los participantes; posterior a este acuerdo se le informará el lugar, fecha y hora de la misma.
                De antemano la Escuela de Ingeniería Informática desea expresarle un especial agradecimiento por su colaboración en la evaluación de este Trabajo de Grado.
                Saludándole cordialmente
                Atentamente,
                ${this.coordinatorData.userLastName}, ${this.coordinatorData.userFirstName}
                `
              }
              return this.emailService.sendMultipleEmail(this.fileArray,emailData)
            },
          ),
          switchMap(
            (emailResult) => {
              console.log(emailResult)
              let notificationData = {
                fechaActual: new Date(),
                nombreJurado:  this.juryDataList[2].userLastName + ", " + this.juryDataList[2].userFirstName,
                consejoDeEscuela: this.councilSelected,
                fechaConsejo: new Date(),
                studentData: this.studentData,
                titulo: this.inputdata.graduateWorkData.graduateWorkTitle,
                tutorAcademico: this.tutorData.userLastName + ", " + this.tutorData.userFirstName,
                jurado1: this.juryData.userLastName + ", " + this.juryData.userFirstName,
                jurado2: this.jury2Data.userLastName + ", " + this.jury2Data.userFirstName,
                nombreCoordinador: this.coordinatorData.userLastName + ", " + this.coordinatorData.userFirstName,
                correoCoordinador: this.coordinatorData.userEmail
              }
              this.fileArray.pop()
              return this.formService.convertDocumentToBlob(this.formService.generateGraduateWorkJuryNotification(notificationData))

              
            },
          ),
          switchMap(
            (juryNotificationBlob) => {
              console.log(juryNotificationBlob)
              const file: File = new File([juryNotificationBlob], `${this.juryDataList[2].userLastName.split(" ")[0]}${this.juryDataList[2].userFirstName.split(" ")[0]} Designacion Jurado TG.docx`, { type: juryNotificationBlob.type });
              console.log(file)
              this.fileArray.push(file)
              let studentNames: string = ""
              if(this.studentList.length > 1){
                studentNames = `Alumnos ${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]}`
              }else{
                studentNames = ` Alumno ${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]}`
              }
              
              let emailData: SendEmailRequest = {
                emailTo: this.juryDataList[2].userEmail,
                emailFrom: this.coordinatorData.userEmail,
                subject: ` Notificación Designación Jurado ${this.juryDataList[2].userLastName.split(" ")[0]} ${this.juryDataList[2].userFirstName.split(" ")[0]} – documentos para evaluación de TG - ${studentNames}` ,
                htmlContent:
                ` 
                Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}                                                         
                Buen día estimada profesora: ${this.juryDataList[2].userLastName} ${this.juryDataList[2].userFirstName}
                Usted ha sido designado jurado de Trabajo de Grado. Adjunto su Designación de Jurado
                Para la revisión y evaluación del mismo dispone de los siguientes documentos:
                          	Informe del Trabajo de Grado
                          El cual encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/17e0j8uznhK1YkUlT1-Z2JwUHJYYrY-vI?usp=sharing
                          	Guía para el Jurador Examinador, el cual contiene un extracto del Reglamento de Trabajos de Grado de la Facultad de Ingeniería relativo a evaluación y criterios a ser evaluados.
                          	Guía Informe Trabajo Grado IINF Gy; en la cual se encuentran los Formatos de Planillas de evaluación del trabajo (Como referencia de los ítems a ser evaluados)
                          Las cuales encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/1AvM-Bshb2HZePPBxszrg81Xtdwn-kuOr?usp=sharing
                          	Guía Normas APA Formato - IINF Gy; la cual contiene un resumen del formato que deben seguir los alumnos en la elaboración del Informe de Trabajo de Grado. 
                          La cual encontrará en el siguiente enlace
                          https://drive.google.com/drive/folders/1aa0u-J8Dm6ZdDBKQg4joRbOPEvqb7XVO?usp=sharing

                Las  Planillas de evaluación con los datos del TG y del (los) estudiante(s) estarán impresas y disponibles para ser retiradas en La Escuela de Ingeniería Informática, cuando usted guste. 
                Nota: Adicionalmente, las Planillas de evaluación están disponibles en el siguientes enlaces; puede iniciar la evaluación del documento esrito (informe) del TG y el día de la defensa puede continuar la evaluación de la presentación del TG 

                Enlace para la evaluación del Trabajo Escrito: ${environment.basicURL}/generar/planilla/trabajodegrado/informe/${this.inputdata.graduateWorkData.graduateWorkType.toLowerCase()}/${this.juryDataList[2].userDNI}/${this.inputdata.graduateWorkData.graduateworkid}

                Enlace para la evaluación de la Defensa Oral: ${environment.basicURL}/generar/planilla/trabajodegrado/presentacion/${this.inputdata.graduateWorkData.graduateWorkType.toLowerCase()}/${this.juryDataList[2].userDNI}/${this.inputdata.graduateWorkData.graduateworkid}


                El jurado dispone de 5 y máximo 10 días para la lectura y evaluación del Informe del Trabajo de Grado, según artículo 11 del Reglamento de Trabajo de Grado de la Facultad de Ingeniería.
                La presentación oral será fijada, de acuerdo a la disponibilidad de los participantes; posterior a este acuerdo se le informará el lugar, fecha y hora de la misma.
                De antemano la Escuela de Ingeniería Informática desea expresarle un especial agradecimiento por su colaboración en la evaluación de este Trabajo de Grado.
                Saludándole cordialmente
                Atentamente,
                ${this.coordinatorData.userLastName}, ${this.coordinatorData.userFirstName}
                `
              }

              return this.emailService.sendMultipleEmail(this.fileArray,emailData)
            },
          ),
          switchMap(
            (result) => {
              console.log(result)
              const observables: Observable<any>[] = [];
              let notificationData = {
                fechaActual: new Date(),
                nombreJurado:  this.juryDataList[2].userLastName + ", " + this.juryDataList[2].userFirstName,
                consejoDeEscuela: this.councilSelected,
                fechaConsejo: new Date(),
                studentData: this.studentData,
                titulo: this.inputdata.graduateWorkData.graduateWorkTitle,
                tutorAcademico: this.tutorData.userLastName + ", " + this.tutorData.userFirstName,
                jurado1: this.juryData.userLastName + ", " + this.juryData.userFirstName,
                jurado2: this.jury2Data.userLastName + ", " + this.jury2Data.userFirstName,
                nombreCoordinador: this.coordinatorData.userLastName + ", " + this.coordinatorData.userFirstName,
                correoCoordinador: this.coordinatorData.userEmail
              }
              this.studentData.forEach( (student: any) => {
                observables.push(this.formService.convertDocumentToBlob(this.formService.generateGraduateWorkJuryStudentNotification(notificationData)))
              })
              return forkJoin(observables)
            },
          ),
          switchMap(
            (notificationBlobArray) => {
              const observables: Observable<any>[] = [];
              notificationBlobArray.forEach( (file: any,index: number) => {
                let fileNotification: File = new File([notificationBlobArray[index]], `${this.studentList[index].userLastName.split(" ")[0]}${this.studentList[index].userFirstName.split(" ")[0]} Designacion Jurado TG.docx`, { type: notificationBlobArray[index].type });
                console.log(fileNotification)

                let emailData: SendEmailRequest = {
                  emailTo: this.studentList[index].userEmail,
                  emailFrom: this.coordinatorData.userEmail,
                  subject: `Notificación Designación Jurado y sugerencias para la presentación de TG - Alumno: ${this.studentList[index].userLastName.split(" ")[0]} ${this.studentList[index].userFirstName.split(" ")[0]}` ,
                  htmlContent: 
                  `
                  Puerto Ordaz,  ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})} 
                  Buen día estimado Alumno ${this.studentList[index].userLastName}, ${this.studentList[index].userFirstName}
                  Saludándole cordialmente
                  Adjunto Notificación de designación de Jurado de su Trabajo de Grado y por favor lea el resumen de la dinámica de actividades y responsabilidades para la presentación oral del mismo, que se encuentra en la documentación del TG.
                  Cualquier duda o consulta estoy a su disposición.
                  Atentamente
                  ${this.coordinatorData.userLastName}, ${this.coordinatorData.userFirstName}
                  `
                }


                observables.push(this.emailService.sendEmail(fileNotification,emailData))
              })
              return forkJoin(observables)
            }
          ),
          
          switchMap(
            (result) => {
              const observables: Observable<any>[] = []
              console.log(result)
              console.log(this.juryDataList)
              console.log(this.experimentalOralJuryCriteriaList)
              console.log(this.inputdata.studentData)
              console.log(this.inputdata.graduateWorkData)
              this.juryDataList.forEach( (jury:any) => {
                this.inputdata.studentData.forEach( (student:any) => {
                  this.experimentalOralJuryCriteriaList.forEach( (criteria:any) => {
                             /* Tutor */
                             if(jury.userDNI == this.inputdata.graduateWorkData.graduateWorkAcademicTutor){

  
                             }else{

                               observables.push(
                                 this.graduateworkService.addJuryOralEvaluationNote(
                                   {
                                     juryDNI: jury.userDNI,
                                     studentDNI: student.userDNI,
                                     graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
                                     criteriaId: criteria.criteriaId,
                                     evaluationNote: null
                                   }
                                 )
                               )
                             }
                    
                  })
                })
              })
              
              this.juryDataList.forEach( (jury:any) => {
                this.inputdata.studentData.forEach( (student:any) => {
                  this.experimentalReportJuryCriteriaList.forEach( (criteria:any) => {
                             /* Tutor */
                             if(jury.userDNI == this.inputdata.graduateWorkData.graduateWorkAcademicTutor){

  
                             }else{

                               observables.push(
                                 this.graduateworkService.addJuryReportEvaluationNote(
                                   {
                                     juryDNI: jury.userDNI,
                                     studentDNI: student.userDNI,
                                     graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
                                     criteriaId: criteria.criteriaId,
                                     evaluationNote: null
                                   }
                                 )
                               )
                             }
                    
                  })
                })
              })

              this.criteriosTutorAcademicoPresentacion.forEach ( (criterio:any) => {
                this.inputdata.studentData.forEach( (estudiante: any) => {
                  observables.push(
                    this.graduateworkService.addTutorOralEvaluationNote(
                      {
                        juryDNI: this.tutorData.userDNI,
                        studentDNI: estudiante.userDNI,
                        graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
                        criteriaId: criterio.criteriaId,
                        evaluationNote: null
                      }
                    )
                  )
                })
              })

              this.criteriosTutorAcademicoinforme.forEach ( (criterio:any) => {
                this.inputdata.studentData.forEach( (estudiante: any) => {
                  observables.push(
                    this.graduateworkService.addTutorReportEvaluationNote(
                      {
                        juryDNI: this.tutorData.userDNI,
                        studentDNI: estudiante.userDNI,
                        graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
                        criteriaId: criterio.criteriaId,
                        evaluationNote: null
                      }
                    )
                  )
                })
              })


              this.inputdata.graduateWorkData.graduateWorkAcademicTutor
              return forkJoin(observables)
            }
          ),

          switchMap(
            (result) => {
              console.log(result)
              return this.graduateworkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,70)
            }
          )
        ).subscribe({
          next: (result) => {
            console.log(result)
          },
          error: (error) => {
            console.log(error)
            this.cargadoArchivos = false
            this._snackBar.open("Error durante el envio de documentos", "cerrar",{
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition
            })
            throw new Error("Error durante el envio de documentos")
          },
          complete: () => {
            console.log("COMPLETADO")
            window.location.href = window.location.href
          }
        })
      }else{
        alert("NO HA SELECCIONADO A TODOS LOS JURADOS")
      }
    }else{
      alert("NO PUEDE HABER DOS JURADOS IGUALES")
    }

    
  }

  generarNotificaciones(){
    console.log(this.jurySelected)
    console.log(this.jurySelected2)
    console.log(this.councilSelected)
    const studentData = [
      {
        nombre: "Somoza Ledezma, Luis Carlos",
        cedula: "V-27656348"
      },
      {
        nombre: "Somoza Ledezma, Luis Carlos",
        cedula: "V-27656348"
      }
    ]
    const notificationData = {
        fechaActual: new Date(),
        nombreJurado: "Nombre De Jurado",
        consejoDeEscuela: "CodigoConsejoDeEscuela",
        fechaConsejo: new Date(),
        studentData,
        titulo: "Sistema de Practicas Profesionales",
        tutorAcademico: "Luz E. Medina",
        jurado1: "Jannelly Bello",
        jurado2: "Oriana Renaud",
        nombreCoordinador: "NombreCoordinador",
        correoCoordinador: "coordinador@gmail.com"
    }
    //this.formService.printEvaluationForm(this.formService.generateGraduateWorkJuryNotification(notificationData))
    //this.formService.printEvaluationForm(this.formService.generateGraduateWorkJuryStudentNotification(notificationData))

    const observables: Observable<any>[] = []


    observables.push(this.graduateworkService.getJuryReportExperimentalCriteria("Ing. Informatica"))
    observables.push(this.graduateworkService.getJuryReportExperimentalSeccion("Ing. Informatica"))

    
    

    forkJoin(observables).subscribe({
      next: (result) => {
        console.log(result)

        //this.formService.printEvaluationForm())
      }
    })
  }

  obtenerMenorId( arregloCriterios: any ){
    return arregloCriterios.reduce((menor:any, actual:any) => {
      if (actual.seccionId < menor.seccionId) {
        return actual;
      }
      return menor;
    });
  }
}
