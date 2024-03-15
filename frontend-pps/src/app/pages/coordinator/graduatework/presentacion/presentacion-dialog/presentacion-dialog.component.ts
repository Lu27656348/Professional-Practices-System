import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';
import { DocumentService } from 'src/app/services/document.service';
import { EmailService } from 'src/app/services/email.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-presentacion-dialog',
  templateUrl: './presentacion-dialog.component.html',
  styleUrls: ['./presentacion-dialog.component.css']
})
export class PresentacionDialogComponent {

  inputdata: any = null;
  cargadoArchivos: boolean = false
  administratorData: any = null
  constructor(
    private documentService: DocumentService,
    private formService: EvaluationFormGeneratorService,
    private userService: UsersService,
    private graduateWorkService: GraduateworkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private emailService: EmailService
  ){
    this.inputdata = this.data
    console.log(this.inputdata)
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      console.log(localUserData)
      this.userService.getUserData(localUserData.userDNI).subscribe
      (
        {
          next: (administratorData) => {
            this.administratorData = administratorData
            console.log(this.administratorData)
          }
        }
      )
    }
  }

  graduateWorkForm  = new FormGroup({
    file: new FormControl()
  });

  currentFile: any = null;
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
  }

  cargarActaEstudiante(){
    if(this.graduateWorkForm.valid){
      this.cargadoArchivos = true
      let formattedFileName = '';
      if(this.inputdata.studentData.length > 1){
        formattedFileName = `${this.inputdata.studentData[0].userLastName.split(" ")[0]}${this.inputdata.studentData[0].userFirstName.split(" ")[0]} ${this.inputdata.studentData[1].userLastName.split(" ")[0]}${this.inputdata.studentData[1].userFirstName.split(" ")[0]} Informe TG.pdf`
      }else{
        formattedFileName = `${this.inputdata.studentData[0].userLastName.split(" ")[0]}${this.inputdata.studentData[0].userFirstName.split(" ")[0]} Informe TG.pdf`
      }
      this.documentService.copyFileAndRename(this.currentFile as File,formattedFileName).pipe(
        switchMap(
          (newFile) => {
            let escuela
            if( this.inputdata.studentData[0].schoolName == "Ing. Informatica"){
              escuela = "Informática"
            }else{
              escuela = "Civil"
            }
            return this.graduateWorkService.uploadFinalSubmittion(newFile,this.inputdata.studentData,escuela)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            const observable: Observable<any>[] = []
            this.inputdata.studentData.forEach( (estudiante:any) => {
              let emailData: SendEmailRequest = {
                emailTo: estudiante.userEmail,
                emailFrom: this.administratorData.userEmail,
                subject: `Entrega de CD con acta de TG ` ,
                htmlContent: 
                `
                Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
                          Buen día estimad@ bachiller
                          Saludándole cordialmente
                          Le recuerdo que su Acta de TG está disponible para ser retirada en La Escuela de Ingeniería Informática, la copia legible (escaneada) de la misma debe estar anexa en el Informe de TG, según las especificaciones indicadas en la Guía del Informe de TG.
                          Instrucciones para la Entrega del Documento Final del Trabajo de Grado
                                    Una vez aprobado el Trabajo de Grado y realizadas las modificaciones que le haya instruido el jurado examinador, sobre el informe escrito final (si las hubiere), debidamente revisadas y avaladas por su Tutor Académico, debe entregar el informe final del Trabajo de Grado, de acuerdo a las siguientes pautas:
                                    	Incorpore al informe final, después de la portada, el Acta de Evaluación escaneada.
                                    	El informe final del trabajo de grado debe ser entregado en formato digital en dos (2) CD. 
                                    	Los CDs, deben contener dos (2) archivos en formato PDF; uno de los archivos debe contener solo el Resumen del trabajo y el otro archivo el Informe completo, incluyendo todas sus partes (desde la primera hasta la última página), en caso de tener apéndices y/o anexos estos deben ser incluidos en el mismo archivo. 
                                    	Cada CD debe estar identificado con una etiqueta (calcomanía) con los datos que se muestran en Anexo A3 de la Guía del Informe de TG
                                    	Uno de los CD debe ser entregado en una funda sintética para CD debidamente ponchada con huecos para su almacenamiento y el otro en cubierta dura, con una etiqueta que contenga la información que se muestra en el Anexo A4 de la Guía del Informe de TG
                                    	Antes de entregarlos, asegúrese de que cada uno de los archivos almacenados en el CD, se pueda leer correctamente
                Esta entrega de CD debe realizarse a más tardar un mes posterior a la presentación de su Trabajo de Grado, para dar continuidad al protocolo de grado, que le permitirá participar en el próximo acto de grado; de no entregar no podrá realizar el pago de derecho de grado y por ende graduarse en ese acto.
                Cualquier duda o consulta estoy a su disposición.
                Atentamente,

                ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}
                `
              }
              observable.push(this.emailService.sendEmailMessage(emailData))
            })
            return forkJoin(observable)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            return this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,90)
          }
        ),
      )
      .subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      })
    
    }else{
      
    }
    
  }
}
