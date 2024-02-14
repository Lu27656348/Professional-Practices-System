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

interface ResponseBlob<T> extends Response {
  blob(): Promise<Blob>;
}

function downloadFile(fileName: string, studentDNI: string | null, userFirstName: string | null, userLastName: string | null) : Observable<Blob> {
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
        userLastName: userLastName
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
  selector: 'app-jury-dialog',
  templateUrl: './jury-dialog.component.html',
  styleUrls: ['./jury-dialog.component.css']
})
export class JuryDialogComponent implements OnInit {
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

  constructor(
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService, 
    private graduateworkService: GraduateworkService, 
    private studentService: StudentService, 
    private emailService: EmailService,
    private externalService: ExternalPersonnelService,
    private councilService: CouncilService,
    private enterpriseService: EnterpriseService,
    private formService: EvaluationFormGeneratorService
  
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

    this.graduateworkService.getJuryReportExperimentalCriteria().pipe(
      switchMap(
        (juryReportCriteriaList) => {
          this.experimentalReportJuryCriteriaList = juryReportCriteriaList
          return this.graduateworkService.getJuryReportExperimentalSeccion()
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
    

    this.graduateworkService.getJuryOralExperimentalCriteria().pipe(
      switchMap(
        (juryOralCriteriaList) => {
          this.experimentalOralJuryCriteriaList = juryOralCriteriaList
          return this.graduateworkService.getJuryOralExperimentalSeccion()
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

    this.studentService.getStudentCoordinator(this.inputdata.studentData[0].userDNI).subscribe({
      next: (coordinatorData) => {
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
      if(this.jurySelected !== null && this.jurySelected2 !== null && this.jurySelected3 !== null && this.jurySelected4 !== null){
        this.graduateworkService.getGraduateWorkStudentData(this.inputdata.graduateWorkData.graduateworkid).pipe(
          switchMap (
            (studentList) => {
              console.log(studentList)
              this.studentList = studentList
              const observables: Observable<any>[] = [];
              observables.push(this.graduateworkService.createJury(this.inputdata.graduateWorkData.graduateWorkAcademicTutor, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid,'TUTOR'));
              observables.push(this.graduateworkService.createJury(this.jurySelected, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid));
              observables.push(this.graduateworkService.createJury(this.jurySelected2, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid));
              /* Recordar agregar reemplazos de profesores en esta secccion */
              //return forkJoin(observables)
              return of("Jurado Creados")
            }
          ),
          switchMap(
            (result) =>{
              console.log(result)
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

              return this.formService.convertDocumentToBlob(
                this.formService.generateGraduateWorkJuryOralEvaluationForm(
                    this.experimentalOralJuryCriteriaList,
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
                  this.experimentalReportJuryCriteriaList,
                  this.experimentalReportJurySeccionList,
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
                if(jury.userDNI = this.inputdata.graduateWorkData.graduateWorkAcademicTutor){
                  this.tutorData = jury
                }
                if(jury.userDNI = this.jurySelected){
                  this.juryData = jury
                }
                if(jury.userDNI = this.jurySelected2){
                  this.jury2Data = jury
                }
              })
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
              const file: File = new File([juryNotificationBlob], `${this.juryDataList[0].userLastName.split(" ")[0]}${this.juryDataList[0].userFirstName.split(" ")[0]} Designacion Jurado TG.docx`, { type: juryNotificationBlob.type });
              console.log(file)
              this.fileArray.push(file)
              return this.emailService.sendMultipleEmail(this.fileArray,this.coordinatorData.userEmail,this.juryDataList[0].userEmail)
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
              return this.emailService.sendMultipleEmail(this.fileArray,this.coordinatorData.userEmail,this.juryDataList[1].userEmail)
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
              return this.emailService.sendMultipleEmail(this.fileArray,this.coordinatorData.userEmail,this.juryDataList[2].userEmail)
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
                observables.push(this.emailService.sendEmail(fileNotification,this.coordinatorData.userEmail,this.studentList[index].userEmail))
              })
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
          complete: () => {
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


    observables.push(this.graduateworkService.getJuryReportExperimentalCriteria())
    observables.push(this.graduateworkService.getJuryReportExperimentalSeccion())

    
    

    forkJoin(observables).subscribe({
      next: (result) => {
        console.log(result)

        //this.formService.printEvaluationForm())
      }
    })
  }
}
