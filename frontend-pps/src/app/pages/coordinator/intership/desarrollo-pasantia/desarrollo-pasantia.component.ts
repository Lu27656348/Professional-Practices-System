import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';
import { EmailService } from 'src/app/services/email.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import * as ExcelJS from 'exceljs'
import * as fs from 'file-saver'
import { Workbook } from 'exceljs';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  cargadoArchivos: boolean = false

  constructor(
    
    private pasantiaService: PasantiaService,
    private dialog: MatDialog,
    private userService: UsersService, 
    private formGenerator: EvaluationFormGeneratorService,
    private enterpriseService: EnterpriseService,
    private academicTutorCriteriaService: CriteriosTutorAcademicoService,
    private emailService: EmailService,
    private corporateTutorCriteriaService: CriteriosTutorEmpresarialService,
    private _snackBar: MatSnackBar,
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI)
      .pipe(
        switchMap(
          (localUserData) => {
            this.localUserData = localUserData
            console.log(this.localUserData)
            return  this.pasantiaService.getPasantiasByStatusAndSchool(20,this.localUserData.schoolName)
          }
        ),
        switchMap(
          (intershipList) => {
            console.log(intershipList)
            const observables: Observable<any>[] = []
  
            intershipList.forEach( (pasantia: any,index: number) => {
  
              let fechaInicio = new Date(pasantia.intershipStartDate as number);
              let fechaFinal = new Date(pasantia.intershipCompletionDate as number);
              let fechaComienzo = new Date();
              if(fechaInicio > fechaComienzo){
                console.log("Comenzo despues")
                intershipList[index].diferencia = Math.floor((fechaFinal.getTime() - fechaComienzo.getTime()) / (1000 * 60 * 60 * 24));
              }else{
                console.log("Comenzo antes")
                intershipList[index].diferencia = Math.floor((fechaFinal.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
              }
              observables.push(this.userService.getUserData(pasantia.studentDNI))
            })
            this.intershipData = intershipList
            return forkJoin(observables)
          }
        ),
        switchMap( (studentData) => {
          console.log(studentData)
          this.intershipData.forEach( (pasantia:any , index: number) => {
            this.intershipData[index].studentData = studentData[index]
            this.intershipData[index].author = studentData[index].userLastName + ", " + studentData[index].userFirstName
            this.intershipData[index].intershipStartDate = new Date(this.intershipData[index].intershipStartDate).toLocaleDateString()
            this.intershipData[index].intershipCompletionDate = new Date(this.intershipData[index].intershipCompletionDate).toLocaleDateString()
          })
          
          const observables: Observable<any>[] = []

          this.intershipData.forEach( (pasantia: any) => {
            observables.push(this.userService.getUserData(pasantia.corporateTutorDNI))
          })

          return forkJoin(observables)
        }),
        switchMap(
          (corporateTutorList) => {

            const observables: Observable<any>[] = []

            this.intershipData.forEach( (pasantia: any, index: number) => {
              corporateTutorList.forEach( (tutorEmpresarial: any) => {
                if(pasantia.corporateTutorDNI == tutorEmpresarial.userDNI){
                  this.intershipData[index].corporateTutorData = tutorEmpresarial
                }
              })
            })

            this.intershipData.forEach( (pasantia: any) => {
              observables.push(this.enterpriseService.getEnterpriseById(pasantia.enterpriseId))
            })

            return forkJoin(observables)

          }
        ),
        switchMap(
          (enterpriseList) => {
            console.log(enterpriseList)

            this.intershipData.forEach( (pasantia: any, index: number) => {
              enterpriseList.forEach( (empresa: any) => {
                if(pasantia.enterpriseId == empresa.enterpriseid){
                  this.intershipData[index].enterpriseData = empresa
                }
              })
            })
            
            const observables: Observable<any>[] = []

            this.intershipData.forEach( (pasantia: any) => {
              observables.push(this.userService.getUserData(pasantia.academicTutorDNI))
            })

            return forkJoin(observables)
          }
        ),
        switchMap(
          (academicTutorList) => {

            const observables: Observable<any>[] = []

            this.intershipData.forEach( (pasantia: any, index: number) => {
              academicTutorList.forEach( (tutorAcademico: any) => {
                if(pasantia.academicTutorDNI == tutorAcademico.userDNI){
                  this.intershipData[index].academicTutorData = tutorAcademico
                }
              })
            })

            return of("Completado")
          }
        ),
      )
      .subscribe({
        next: (result) => {
          console.log(result)
        }
      })
      
    }
  }
  ngOnInit(): void {
    
  }

  enviarPlanillas(element: any){
    console.log(element)
    this.cargadoArchivos = true
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
          return this.corporateTutorCriteriaService.getAllEnterpriseTutorCriteriaBySchool(this.localUserData.schoolName)

        }
      ),
      switchMap(
        (corporateTutorCriteriaList) => {
          this.corporateCriteriaList = corporateTutorCriteriaList
          return this.academicTutorCriteriaService.getAllAcademicTutorCriteriaBySchool(this.localUserData.schoolName)
        }
      ),
      switchMap(
        (academicTutorCriteriaList) => {
          this.academicCriteriaList = academicTutorCriteriaList
          return this.academicTutorCriteriaService.getAllAcademicTutorSeccionBySchool(this.localUserData.schoolName)
        }
      ),
      switchMap(
        (academicTutorSeccionList) => {
          this.academicSeccionList = academicTutorSeccionList
          return this.corporateTutorCriteriaService.getAllEnterpriseTutorSeccionBySchool(this.localUserData.schoolName)
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
          let fileNotification: File = new File([this.academicTutorEvaluation], `${this.academicTutorData.userLastName.split(" ")[0]}${this.academicTutorData.userFirstName.split(" ")[0]} Evaluación Individual Pasantía – Tutor Académico.docx`, { type: this.academicTutorEvaluation.type });
          console.log(fileNotification)
          let fileNotification2: File = new File([this.corporateTutorEvaluation], `${this.corporateTutorData.userLastName.split(" ")[0]}${this.corporateTutorData.userFirstName.split(" ")[0]} Evaluación Individual Pasantía – Tutor Empresarial.docx`, { type: this.corporateTutorEvaluation.type });
          console.log(fileNotification2)

          let emailData: SendEmailRequest = {
            emailTo: this.corporateTutorData.userEmail,
            emailFrom: this.localUserData.userEmail,
            subject: `Evaluaciones y Cierre proceso de Pasantía Periodo 2023-30 - Tutor Empresarial: ${this.corporateTutorData.userLastName},  ${this.corporateTutorData.userFirstName} Alumno: ${this.studentData.userLastName}, ${this.studentData.userFirstName}` ,
            htmlContent: 
            `
            Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
            Buen día estimada Tutor Empresarial ${this.corporateTutorData.userLastName},  ${this.corporateTutorData.userFirstName}
            Saludándole cordialmente
            Agradeciendo por la experiencia de formación ofrecida a nuestro alumno, le indico el proceso de finalización de Pasantía:
           
            1)	Entrega de informe

            El alumno ${this.studentData.userLastName}, ${this.studentData.userFirstName}

            Debe enviarle el informe final de la Pasantía, el cual usted revisará, en caso de tener alguna observación, se la comunica al alumno. 

            2)	Evaluación de Pasantía

            Al estar conforme con el informe, completa la planilla de evaluación personalizada y editable que anexo al presente correo.
            Podrá calificarla de manera electrónica en el siguiente enlace: ${environment.basicURL}/generar/planilla/pasantia/empresarial/${this.corporateTutorData.userDNI}/${element.intershipId}

            3)	Envío de Evaluación de Pasantía
            Envíe la planilla de evaluación en formato PDF, desde su correo empresarial al correo institucional del Tutor Académico con copia al correo del alumno; a continuación, indico estos datos:
            Alumno	${this.studentData.userLastName}, ${this.studentData.userFirstName} Correo Alumno: ${this.studentData.userEmail}
            Tutor Académico	${this.academicTutorData.userLastName}, ${this.academicTutorData.userFirstName} Correo Tutor Académico: ${this.academicTutorData.userEmail}

            •	El envío al Tutor Académico es la señal de revisión y conformidad con el informe y el trabajo realizado por el alumno.
            •	El motivo de la copia al alumno es que él requiere anexar esta planilla de evaluación a su informe final
            •	Se recomienda imprimir firmar y sellar con sello de la empresa las planillas y luego de enviadas por correo, entregar al alumno para que las consigne en la coordinación de prácticas profesionales de la escuela de Ingeniería de Informática
            Reiterando mi agradecimiento y quedando a su disposición por cualquier consulta o duda 
            Atentamente,

            ${this.localUserData.userLastName},  ${this.localUserData.userFirstName}
            `
          }

          let emailDataV2: SendEmailRequest = {
            emailTo: this.academicTutorData.userEmail,
            emailFrom: this.localUserData.userEmail,
            subject: `Evaluaciones y Cierre proceso de Pasantía Periodo 2023-30 - Tutor Académico: ${this.academicTutorData.userLastName}, ${this.academicTutorData.userFirstName} Alumno: ${this.studentData.userLastName}, ${this.studentData.userFirstName}` ,
            htmlContent: 
            `
            Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
            Buen día estimado Tutor Académico  ${this.academicTutorData.userLastName}, ${this.academicTutorData.userFirstName}
            Saludándole cordialmente
            Para el Cierre de Pasantía Periodo 2023-30, el proceso es:

            1)	Entrega de informe, por parte del alumno

            ${this.studentData.userLastName}, ${this.studentData.userFirstName}

            Debe enviarle el informe final de la pasantía, previa revisión y evaluación del Tutor Empresarial, el cual usted revisará, en caso de tener alguna observación, se la comunica al alumno.

            El Tutor Empresarial debe haberle enviado copia de la planilla de evaluación de la Pasantía, en señal de conformidad con la realización de la Pasantía y de revisión del Informe, sino es así, por favor comuníquese con él.

            2)	Evaluación de Pasantía

            Al estar conforme con el informe, complete la planilla de evaluación personalizada y editable que se adjunta al presente correo.
            Podrá calificarla de manera electrónica en el siguiente enlace: ${environment.basicURL}/generar/planilla/pasantia/academico/${this.academicTutorData.userDNI}/${element.intershipId}}

            3)	Impresión Planilla de Evaluación de Pasantía

            Luego de completar cada uno de los criterios de evaluación de la planilla, fírmela, escanéela y entréguela en la Coordinación de Prácticas Profesionales de la Escuela de Ingeniería Informática.    

            4)	Envío de Evaluación de Pasantía

            Envíe la planilla de evaluación en formato PDF, desde su correo institucional al correo del alumno y al correo ${this.localUserData.userEmail}; a continuación, los datos del alumno:
            
            Alumno: ${this.studentData.userLastName}, ${this.studentData.userFirstName}	 Correo: ${this.studentData.userEmail}
             
            •	El motivo de la copia al alumno es que él requiere anexar esta planilla de evaluación a su informe final, antes de entregarlo.
            •	El motivo de la entrega y copia de la planilla de evaluación a la coordinación de Prácticas Profesionales es la garantía y respaldo de las evaluaciones, para luego colocar formalmente la nota al alumno.
             Cualquier consulta o duda estoy a su disposición
            Atentamente,
            ${this.localUserData.userLastName},  ${this.localUserData.userFirstName}
            `
          }
          observables.push(this.emailService.sendEmail(fileNotification2,emailData));
          observables.push(this.emailService.sendEmail(fileNotification,emailDataV2))
          return forkJoin(observables)
        }
      )

    ).subscribe(
      {
        next: (result) => {
          console.log(result)
          const observables: Observable<any>[] = []
          this.academicCriteriaList.forEach( (criteria: any) => {
            let data = {
              userDNI: this.academicTutorData.userDNI,
              intershipId: element.intershipId,
              criteriaId: criteria.criteriaId,
              maxNote: criteria.maxNote
            }
            console.log(data)
            
            observables.push(this.pasantiaService.asociarCriterioConEvaluacionDeTutorAcademico(
              data
            ))
            
          })

          this.corporateCriteriaList.forEach( (criteria: any) => {
            let data = {
              userDNI: this.corporateTutorData.userDNI,
              intershipId: element.intershipId,
              criteriaId: criteria.criteriaId,
              maxNote: criteria.maxNote
            }
            console.log(data)
            
            observables.push(this.pasantiaService.asociarCriterioConEvaluacionDeTutorEmpresarial(
              data
            ))
            
          })

          forkJoin(observables).pipe(
            switchMap(
              (result) => {
                console.log(result)
                return this.pasantiaService.cambiarEstadoPasantia(element.intershipId,30)
              }
            )
          )
          .subscribe({
            next: (result) => {
              console.log(result)
            },
            error: (error) => {
              this._snackBar.open("Error en el envio de planillas","cerrar",{
                horizontalPosition: "right",
                verticalPosition: "bottom",
                duration: 3000
              })
              this.cargadoArchivos = false
              throw new Error(error.message)
            },
            complete: () => {
              this.cargadoArchivos = false
              window.location.href = window.location.href   
            }
          })

          
        }
      }
    )
    //this.pasantiaService.cambiarEstadoPasantia()
  }

  generarReportePasantia(){
    console.log(this.intershipData)

    console.log("generarReportePasantia()")
    const _workbook: Workbook = new ExcelJS.Workbook();

    _workbook.creator = 'Luis C. Somoza';
    _workbook.lastModifiedBy = 'Luis C. Somoza';
    _workbook.created = new Date();
    _workbook.modified = new Date();
    _workbook.lastPrinted = new Date();

    _workbook.calcProperties.fullCalcOnLoad = true;


    const sheet = _workbook.addWorksheet('Propuesta de Pasantía');

    sheet.getColumn("A").width = 3

    sheet.getColumn("B").width = 20
    sheet.getColumn("C").width = 20
    sheet.getColumn("D").width = 20
    sheet.getColumn("E").width = 20
    sheet.getColumn("F").width = 20
    sheet.getColumn("G").width = 45

    sheet.getColumn("H").width = 15
    sheet.getColumn("I").width = 15

    sheet.getColumn("J").width = 20
    sheet.getColumn("K").width = 20
    sheet.getColumn("L").width = 20

    sheet.getColumn("M").width = 15
    sheet.getColumn("N").width = 15
    sheet.getColumn("O").width = 15

    sheet.getRow(1).height = 30
    sheet.getRow(2).height = 30

    sheet.mergeCells("A1:K1")
    sheet.mergeCells("A2:K2")

    const cabecera = sheet.getCell("A1")
    cabecera.value = "Propuestas de Pasantías"
    cabecera.font = {
      name: 'Trebuchet MS',
      size: 20,
      bold: true
    }
    cabecera.fill = {
      type: 'pattern',
      pattern: "solid",
      fgColor: {
        argb: 'B0E5F6'
      }
    }
    cabecera.alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    const cabeceraNRC = sheet.getCell("A2");
    cabeceraNRC.value = "NRC 20046"
    cabeceraNRC.font = {
      name: 'Trebuchet MS',
      size: 20,
      bold: true
    }
    cabeceraNRC.fill = {
      type: 'pattern',
      pattern: "solid",
      fgColor: {
        argb: 'B0E5F6'
      }
    }
    cabeceraNRC.alignment = {
      horizontal: "center"
    }

    sheet.getRow(3).height = 30
    /* Inyectamos la cabecera  */
    sheet.getCell("B3").value = "Cédula"
    sheet.getCell("B3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("C3").value = "Estudiante"
    sheet.getCell("C3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("D3").value = "Correo"
    sheet.getCell("D3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("E3").value = "Teléfono"
    sheet.getCell("E3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("F3").value = "Empresa"
    sheet.getCell("F3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("G3").value = "Título"
    sheet.getCell("G3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("H3").value = "Inicio"
    sheet.getCell("H3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("I3").value = "Fin"
    sheet.getCell("I3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("J3").value = "Tutor Empresarial"
    sheet.getCell("J3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("K3").value = "Tutor Académico"
    sheet.getCell("K3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("L3").value = "Correo Tutor Académico"
    sheet.getCell("L3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("M3").value = "ETE"
    sheet.getCell("M3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("N3").value = "ETA"
    sheet.getCell("N3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("O3").value = "EvDef"
    sheet.getCell("O3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("P3").value = "Observaciones"
    sheet.getCell("P3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("B3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    
    sheet.getCell("C3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("D3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("E3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("F3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("G3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("H3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("I3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("J3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("K3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("L3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("M3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("N3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("O3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("P3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }

    this.intershipData.forEach ( (pasantia:any, index: number) => {

      sheet.getRow(4 + index).height = 30

      sheet.getCell(`A${4+index}`).value = index + 1;
      sheet.getCell(`A${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`A${4+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      
      sheet.getCell(`B${4+index}`).value = pasantia.studentData.userDNI as string
      sheet.getCell(`B${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`B${4+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`C${4+index}`).value = `${pasantia.studentData.userLastName}, ${pasantia.studentData.userFirstName}`
      sheet.getCell(`C${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`C${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`D${4+index}`).value = pasantia.studentData.userEmail
      sheet.getCell(`D${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`D${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`E${4+index}`).value = pasantia.studentData.userPhone
      sheet.getCell(`E${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`F${4+index}`).value = pasantia.enterpriseData.enterpriseName
      sheet.getCell(`F${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`G${4+index}`).value = pasantia.intershipTitle
      sheet.getCell(`G${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`H${4+index}`).value = pasantia.intershipStartDate
      sheet.getCell(`H${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`I${4+index}`).value = pasantia.intershipCompletionDate
      sheet.getCell(`I${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`J${4+index}`).value = `${pasantia.corporateTutorData.userLastName}, ${pasantia.corporateTutorData.userFirstName}`
      sheet.getCell(`J${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`J${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`K${4+index}`).value = (pasantia.academicTutorData) ? `${pasantia.academicTutorData.userLastName}, ${pasantia.academicTutorData.userFirstName}` : ""
      sheet.getCell(`K${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`K${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }

      sheet.getCell(`L${4+index}`).value = (pasantia.academicTutorData) ? pasantia.academicTutorData.userEmail : ""
      sheet.getCell(`L${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`L${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }

      sheet.getCell(`M${4+index}`).value = (pasantia.ete) ? pasantia.ete : ""
      sheet.getCell(`M${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`N${4+index}`).value = (pasantia.eta) ? pasantia.eta : ""
      sheet.getCell(`N${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

      sheet.getCell(`O${4+index}`).value = (pasantia.eta && pasantia.ete) ? Math.round(( pasantia.ete + pasantia.eta ) / 2) : ""
      sheet.getCell(`O${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`P${4+index}`).value = ""
      sheet.getCell(`P${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

    })

    _workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "Control Propuestas Pasantías.xlsx")
    })
  }
}
