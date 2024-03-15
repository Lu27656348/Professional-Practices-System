import { formatDate } from '@angular/common';
import { Component,OnInit,Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { ResponseBlob } from 'src/app/interfaces/ResponseBlob';
import { EvaluateIntershipProposalRequest } from 'src/app/interfaces/requests/EvaluateIntershipProposalRequest';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';
import { CouncilService } from 'src/app/services/council.service';
import { EmailService } from 'src/app/services/email.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

async function descargarPropuestaPasantia(fileName: string,studentDNI: string, userFirstName: string, userLastName: string,schoolName: string) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/pasantia/propuesta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName,studentDNI: studentDNI, userFirstName: userFirstName, userLastName: userLastName,escuela:schoolName})
    } as RequestInit);

    const blob = await (response as ResponseBlob<Blob>).blob(); // Type assertion for blobBody
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Set desired filename
    link.click();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}


@Component({
  selector: 'app-evaluate-pasantia-dialog',
  templateUrl: './evaluate-pasantia-dialog.component.html',
  styleUrls: ['./evaluate-pasantia-dialog.component.css']
})
export class EvaluatePasantiaDialogComponent implements OnInit{

  professorList: any = null;
  councilList: any = null;

  pasantiaForm;

  inputdata: any = null;

  studentData: any = null;
  corporateTutorData: any = null;
  academicTutorData: any = null;
  enterpriseData: any = null;
  schoolCouncilData: any = null;
  administratorData: any = null;
  intershipData: any = null;

  studentNotification: any = null;
  tutorNotification: any = null;

  fechaCulminacion: any = null
  fechaIniciacion: any = null

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  cargadoArchivos: boolean = false

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  
    const locale = "es-ES"; // Cambiar según el idioma deseado
  
    return date.toLocaleDateString(locale, options);
  }

  constructor(
    private professorService: ProfessorsService, 
    private userService: UsersService, 
    private formBuilder: FormBuilder, 
    private councilService: CouncilService,
    private enterpriseService: EnterpriseService,
    private pasantiaService: PasantiaService,
    private _snackBar: MatSnackBar,
    private emailService: EmailService,
    private formGenerator: EvaluationFormGeneratorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.pasantiaForm = this.formBuilder.group({
      tutorAcademico: ['', Validators.required],
      consejoEscuela: ['', Validators.required]
    })

    this.inputdata = data;
    console.log(this.inputdata)

    this.fechaCulminacion = this.formatDate(new Date(this.inputdata.pasantia.intershipCompletionDate))
    this.fechaIniciacion = this.formatDate(new Date(this.inputdata.pasantia.intershipStartDate))
    console.log(this.inputdata.pasantia.intershipCompletionDate)
    console.log(this.inputdata.pasantia.intershipStartDate)
    console.log(this.fechaCulminacion)
    console.log(this.fechaIniciacion)
    this.userService.getUserData(this.inputdata.pasantia.studentDNI).pipe(
      switchMap(
        (studentData) => {
          this.studentData = studentData
          return this.pasantiaService.getPasantiaById(this.inputdata.pasantia.intershipId)
        }
      ),
      switchMap( 
        (intershipData) => {
          console.log(intershipData)
          this.intershipData = intershipData
          return this.userService.getUserData(this.inputdata.pasantia.corporateTutorDNI)
        }
      ),
      switchMap(
        (corporateTutorData) => {
          this.corporateTutorData = corporateTutorData
          return this.enterpriseService.getEnterpriseById(this.inputdata.pasantia.enterpriseId)
        }
      ),
    ).subscribe(
      {
        next: (enterpriseData) => {
          this.enterpriseData = enterpriseData
        }
      }
    )
    
    this.councilService.getCouncilsBySchool(this.inputdata.user.schoolName).subscribe({
      next: (councilList) => {
        this.councilList = councilList
      }
    })
  } 

  ngOnInit(): void {
    this.professorService.getProfessors().pipe(
      switchMap(
        (professorDNIList: any) => {
          console.log(professorDNIList)
          const observables: Observable<any>[] = []
          professorDNIList.forEach( (professor: any) => {
            observables.push(this.userService.getUserData(professor.userDNI))
          })
          return forkJoin(observables)
        }
      )
    ).subscribe({
      next: (professorList) => {
        console.log(professorList)
        this.professorList = professorList
      }
    })
  }

  rechazarPropuestaPasantia(){
    if(this.pasantiaForm.value.consejoEscuela){
      this.cargadoArchivos = true
      const evaluationData: EvaluateIntershipProposalRequest = {
        intershipId: this.inputdata.pasantia.intershipId,
        intershipStatusCode: 400,
        schoolCouncilId: this.pasantiaForm.value.consejoEscuela as string,
        schoolCouncilDecision: 'RECHAZADA',
	      corporateTutorDNI: null
      }
      console.log(evaluationData)
      this.pasantiaService.evaluarPropuestaPasantia(evaluationData).subscribe(
        {
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            window.location.href = window.location.href
          }
        }
      )
    }else{
      this._snackBar.open("Debe cargar un consejo de escuela", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
    
  }

  aprobarPropuestaPasantia(){
    if(this.pasantiaForm.valid){

      this.cargadoArchivos = true
      this.councilService.getCouncilById(this.pasantiaForm.value.consejoEscuela as string).pipe(
        switchMap(
          (schoolData) => {
            console.log(schoolData)
            this.schoolCouncilData = schoolData;
            console.log(this.inputdata.pasantia)
            console.log(this.pasantiaForm.value)
            return this.userService.getUserData(this.pasantiaForm.value.tutorAcademico as string)
          }
        ),
        switchMap(
          (academicTutorData) => {
            console.log(academicTutorData)
            this.academicTutorData = academicTutorData;
            return this.userService.getUserData(this.inputdata.pasantia.corporateTutorDNI)
          }
        ),
        switchMap(
          (corporateTutorData) => {
            console.log(corporateTutorData)
            this.corporateTutorData = corporateTutorData;
            return this.userService.getUserData(this.inputdata.pasantia.studentDNI)
          }
        ),
        switchMap(
          (studentData) => {
            console.log(studentData)
            this.studentData = studentData;
            const localUser = localStorage.getItem('user');
            if(localUser){
              const localUserData = JSON.parse(localUser)
              console.log(localUserData.userDNI)
              return this.userService.getUserData(localUserData.userDNI)
            }
            return of(
              null
            )
          }
        ),
        switchMap(
          (administratorData) => {
            if(administratorData == null){
              return of(null)
            }
            console.log(administratorData)
            this.administratorData = administratorData;
            /* Armamos la carta de Notificacion para el estudiante */
            const notificationData = {
              consejo: this.pasantiaForm.value.consejoEscuela as string,
              fechaConsejo: new Date(this.schoolCouncilData.schoolcouncildate) as Date,
              propuesta: {
                tutor_academico: {
                  apellidos: this.academicTutorData.userLastName as string,
                  nombres: this.academicTutorData.userFirstName as string
                },
                titulo: this.inputdata.pasantia.intershipTitle as string,
                alumno: {apellidos: this.studentData.userLastName as string, nombres: this.studentData.userFirstName as string}
              },
              fecha_designacion: new Date() as Date,
              revisor: (this.academicTutorData.userLastName + ", " + this.academicTutorData.userFirstName) as string,
              correo_administrador: administratorData.userEmail as string,
              administrador: `${administratorData.userFirstName.split(" ")[0]} ${administratorData.userFirstName.split(" ")[1].charAt(0)}. ${administratorData.userLastName.split(" ")[0]} `
            }
            console.log(notificationData)
            return this.formGenerator.convertDocumentToBlob(this.formGenerator.generateIntershipCorporateTutorNotification(notificationData));
            
          }
        ),
        switchMap(
          (studentNotificationBlob: any) => {
            /* Enviamos la carta por correo electronico  */
            const file: File = new File([studentNotificationBlob], `${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} Notificación Aprobación de Pasantía y Tutor Académico.docx`, { type: studentNotificationBlob.type });
            console.log(file)

            this.studentNotification = file;

            /* Armamos la carta de notificacion para el tutor */

            const academicTutorNotificationData = {
              fechaEnvio: new Date(),
              academicTutor: this.academicTutorData.userLastName + ", " + this.academicTutorData.userFirstName,
              consejoDeEscuela: this.schoolCouncilData.schoolCouncilId,
              fechaConsejo: new Date(this.schoolCouncilData.schoolcouncildate),
              datosEstudiante: {
                  nombre: this.studentData.userLastName + "," + this.studentData.userFirstName,
                  cedula: this.studentData.userDNI
              },
              empresa: this.enterpriseData.enterpriseName as string,
              titulo: this.inputdata.pasantia.intershipTitle,
              fechaInicio: new Date(this.intershipData.intershipStartDate),
              fechaFin: new Date(this.fechaCulminacion),
              tutorEmpresarial: this.corporateTutorData.userLastName + ", " + this.corporateTutorData.userFirstName ,
              administrador: `${this.administratorData.userFirstName.split(" ")[0]} ${this.administratorData.userFirstName.split(" ")[1].charAt(0)}. ${this.administratorData.userLastName.split(" ")[0]} `
            }
            console.log(academicTutorNotificationData)
            return this.formGenerator.convertDocumentToBlob(this.formGenerator.generateIntershipAcademicTutorNotification(academicTutorNotificationData))
          }
        ),
        switchMap(
          (tutorNotification) => {
            const file: File = new File([tutorNotification], `${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} ${this.academicTutorData.userLastName.split(" ")[0]}${this.academicTutorData.userFirstName.split(" ")[0]} Designación Tutor Académico Pasantía.docx`, { type: tutorNotification.type });
            console.log(file)
            this.tutorNotification = file
            const observables: Observable<any>[] = []

            let emailData: SendEmailRequest = {
              emailTo: this.studentData.userEmail,
              emailFrom: this.administratorData.userEmail,
              subject: `Notificación Aprobación Pasantía y Tutor Académico - Procedimiento - Guías ${this.studentData.userLastName.split(" ")[0]}, ${this.studentData.userFirstName.split(" ")[0]}` ,
              htmlContent: 
              `
              Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}

                        Buen día alumno	
                        Adjunto: Notificación Aprobación de Pasantía y Tutor Académico, Procedimiento y Guías para el desarrollo de su Pasantía

              En los siguientes enlaces
              Enlace Documentación Pasantía IINF-Gy

                        https://drive.google.com/drive/folders/1-yydB_0zywTpJgJ3ZS6XybuTvfAKKucM?usp=sharing

              Guía Normas APA Formato - IINF Gy

                        https://drive.google.com/drive/folders/1aa0u-J8Dm6ZdDBKQg4joRbOPEvqb7XVO?usp=sharing

              Encontrará Las guías para el desarrollo de la documentación de Pasantía.
              También se le envía copia de la designación a su Tutor Académico
              Deseándole el mayor de los éxitos
              Cualquier consulta o duda estoy a su disposición.
              Atentamente, 
              ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}

              ` 
            }

            let emailDataV2: SendEmailRequest = {
              emailTo: this.academicTutorData.userEmail,
              emailFrom: this.administratorData.userEmail,
              subject: `Notificación Designación Tutor Académico Pasantía y Documentos Pasantía - Alumno ${this.studentData.userLastName.split(" ")[0]}, ${this.studentData.userFirstName.split(" ")[0]}` ,
              htmlContent:
               `
              Puerto Ordaz,  ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
              Buen día Tutor Académico ${this.academicTutorData.userLastName}, ${this.academicTutorData.userFirstName}
              Saludándole cordialmente
              Adjunto 

                        	Notificación Designación Tutor Académico Pasantía 
                        	Propuesta de Pasantía aprobado por el Consejo de Escuela
                        	Planilla de Evaluación Pasantía Tutor Académico

              Documentos pertinentes para el seguimiento y evaluación de la misma 

                        	Guía Elaboración Informe de Pasantía
                        	Guía Normas APA Formato - IINF Gy

              La Notificación de Designación, propuesta y Planilla de Evaluación personalizada, de cada alumno, se adjuntan con este documento.

              Las guías están disponibles en el siguiente enlace:

                        Enlace Documentación Pasantía IINF-Gy
                        https://drive.google.com/drive/folders/1-yydB_0zywTpJgJ3ZS6XybuTvfAKKucM?usp=sharing

                        Guía Normas APA Formato - IINF Gy
                        https://drive.google.com/drive/folders/1aa0u-J8Dm6ZdDBKQg4joRbOPEvqb7XVO?usp=sharing

              Recordándole que el proceso de Pasantía es:

                        	Seguimiento, cada semana el estudiante debe reportar las actividades y productos obtenidos durante esa semana, utilizando el formato de Informe Actividades Pasantía y usted debe verificarlo. 
                        	Evaluación, al finalizar la Pasantía, el estudiante le entregará un informe sobre el trabajo realizado, previa evaluación y aprobación del mismo por el Tutor Empresarial. Este informe debe cumplir con lo estipulado en la Guía Elaboración Informe de Pasantía y usted debe verificarlo.
                        1. Entrega de informe, por parte de los alumnos
                        los alumnos deben enviarle el informe final de la pasantía, previa evaluación del Tutor Empresarial, el cual usted revisará, en caso de tener alguna observación, se la comunica al alumno.
                        El Tutor Empresarial debe haberle enviado copia de la planilla de evaluación de la Pasantía, en señal de conformidad con la realización de la Pasantía y de revisión del Informe, sino es así, por favor comuníquese con él.
                        2. Evaluación de Pasantía
                        Al estar conforme con el informe, completa la planilla de evaluación personalizada y editable que anexo al presente correo.
                        3. Envío de Evaluación de Pasantía
                        Envíe la planilla de evaluación desde su correo institucional al correo ${this.administratorData.userEmail}, con copia al correo del alumno, para que él la adjunte en su informe. Cualquier consulta o duda estoy a su disposición
                        Atentamente,
              ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}
              ` 
            }

            console.log(emailData)
            console.log(emailDataV2)
            observables.push(this.emailService.sendEmail(this.studentNotification,emailData))
            observables.push(this.emailService.sendEmail(this.tutorNotification,emailDataV2))
            return forkJoin(observables)
          }
        )
      ).subscribe({
        next: (result: any) => {
          console.log(result)
          const evaluationData: EvaluateIntershipProposalRequest = {
            intershipId: this.inputdata.pasantia.intershipId,
            intershipStatusCode: 20,
            schoolCouncilId: this.pasantiaForm.value.consejoEscuela as string,
            schoolCouncilDecision: 'APROBADA',
            corporateTutorDNI: this.pasantiaForm.value.tutorAcademico as string,
          }

          console.log(evaluationData)
          this.pasantiaService.evaluarPropuestaPasantia(evaluationData).subscribe(
            {
              next: (result) => {
                console.log(result)
              },
              complete: () => {
                this.cargadoArchivos = false
                window.location.href = window.location.href
              }
            }
          )
          
        }
      })

    }else{
      this._snackBar.open("Debe cargar todos los datos", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  }

  descargarPropuestaPasantiaAlumno(){
    console.log(this.studentData)
    const fileName = `${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} Propuesta Pasantía.pdf`
    let escuela;
    if(this.inputdata.user.schoolName == "Ing. Informatica"){
      escuela = "Informática"
    }else{
      escuela = "Civil"
    }
    descargarPropuestaPasantia(fileName,this.studentData.userDNI, this.studentData.userFirstName,this.studentData.userLastName,escuela)
  }
}
