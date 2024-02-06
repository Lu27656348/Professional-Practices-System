import { formatDate } from '@angular/common';
import { Component,OnInit,Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { ResponseBlob } from 'src/app/interfaces/ResponseBlob';
import { EvaluateIntershipProposalRequest } from 'src/app/interfaces/requests/EvaluateIntershipProposalRequest';
import { CouncilService } from 'src/app/services/council.service';
import { EmailService } from 'src/app/services/email.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

async function descargarPropuestaPasantia(fileName: string,studentDNI: string, userFirstName: string, userLastName: string) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/pasantia/propuesta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName,studentDNI: studentDNI, userFirstName: userFirstName, userLastName: userLastName})
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
    
    this.councilService.getCouncils().subscribe({
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

      
      this.councilService.getCouncilById(this.pasantiaForm.value.consejoEscuela as string).pipe(
        switchMap(
          (schoolData) => {
            console.log(schoolData)
            this.schoolCouncilData = schoolData;
            console.log(this.inputdata.pasantia)
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
              fechaFin: new Date(this.intershipData.intershipStartDate),
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
            observables.push(this.emailService.sendEmail(this.studentNotification,this.administratorData.userEmail,this.studentData.userEmail))
            observables.push(this.emailService.sendEmail(this.tutorNotification,this.administratorData.userEmail,this.academicTutorData.userEmail))
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
                window.location.href = window.location.href
              }
            }
          )
          
        }
      })
      /*
      const notificationData = {
        consejo: this.pasantiaForm.value.consejoEscuela,
        fechaConsejo: date,
        propuesta: {
          tutor_academico: {
            apellidos: "Bello",
            nombres: "Frankin"
          },
          titulo: "Sistema de Practicas Profesionales",
          alumno: {apellidos: "Somoza Ledezma", nombres: "Luis Carlos"}
        },
        fecha_designacion: date,
        revisor: "Wladimir SanVicente",
        correo_administrador: "luiscarlossomoza@gmail.com",
        administrador: "Luz E. Medina"
      }
      this.formGenerator.convertDocumentToBlob(this.formGenerator.generateIntershipCorporateTutorNotification(
        
      ))
      */
      /*
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
            window.location.href = window.location.href
          }
        }
      )
      */
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
    descargarPropuestaPasantia(fileName,this.studentData.userDNI, this.studentData.userFirstName,this.studentData.userLastName)
  }
}
