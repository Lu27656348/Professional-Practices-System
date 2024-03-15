import { Component,OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CouncilService } from '../../../../../services/council.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'
import { FormGroup, FormControl,FormBuilder,Validators } from '@angular/forms';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { EmailService } from 'src/app/services/email.service';
import { forEach } from 'lodash';
import { SendEmailRequest } from 'src/app/interfaces/requests/SendEmailRequest';

@Component({
  selector: 'app-defense-dialog',
  templateUrl: './defense-dialog.component.html',
  styleUrls: ['./defense-dialog.component.css']
})
export class DefenseDialogComponent {
  inputdata: any = null;
  councilList: any = []
  selectedDateVar: any = null
  selectedDateValue: any = null;

  councilSelected: any = null;

  studentList: any = null
  juryDataList: any = null

  localUserData: any = null

  administratorData: any = null

  cargadoArchivos: boolean = false;

  myForm = new FormGroup({
    date: new FormControl(),
    location: new FormControl(),
    time: new FormControl()
  });

  constructor(
    private councilService: CouncilService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private graduateWorkService: GraduateworkService,
    private userService: UsersService,
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
    this.graduateWorkService.getGraduateWorkStudentData(this.inputdata.graduateWorkData.graduateworkid)
    .subscribe({
      next: (studentList) => {
        console.log(studentList)
        this.studentList = studentList
      }
    })

    this.graduateWorkService.getGraduateWorkJuries(this.inputdata.graduateWorkData.graduateworkid)
    .subscribe({
      next: (juryList:any) => {
        console.log(juryList)
        const observable: Observable<any>[] = []
        juryList.forEach ((jurado:any) => {
          observable.push(this.userService.getUserData(jurado.juryDNI))
        })
        forkJoin(observable).subscribe({
          next: (juryDataList) => {
            console.log(juryDataList)
            this.juryDataList = juryDataList
          }
        })
      }
    })
  }

  ngOnInit(){

  }
  
  selectedDate(date: any) {
    console.log("Selected date:", date.target);
    console.log("Selected date:", this.selectedDateValue);
    console.log(this.myForm.value.date)
    // Store the date for later use
    this.selectedDateValue = this.myForm.value.date;
  }

  setDefenseDate(){
    this.cargadoArchivos = true
    console.log(this.myForm.value)
    const time = (this.myForm.value.time)
    console.log(time)
    // Split the string by 'T'
    const [dateString, timeString] = time.split("T");

    // Split date by '-'
    const [year, month, day] = dateString.split("-");

    // Split time by ':'
    const [hour, minute] = timeString.split(":");

    console.log(dateString)
    console.log(timeString)

    const fecha = new Date(dateString);

    // Obtiene el número del día de la semana (0-6, donde 0 es domingo)
    const numeroDia = fecha.getDay();

    // Array para los nombres de los días de la semana
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
    forkJoin([this.graduateWorkService.setDefenseDate(this.myForm.value.time, this.myForm.value.location,this.inputdata.graduateWorkData.graduateworkid),this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,80)])
    .pipe(
      switchMap(
        (result) => {
          console.log(result)
          const observable: Observable<any>[] = []
          let studentNames: string = ""
              if(this.studentList.length > 1){
                studentNames = `Alumnos ${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]}`
              }else{
                studentNames = ` Alumno ${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]}`
              }
          this.juryDataList.forEach( (jurado: any) => {
            
            let emailData: SendEmailRequest = {
              emailTo: jurado.userEmail,
              emailFrom: this.administratorData.userEmail,
              subject: `Datos Presentación TG - ${studentNames}` ,
              htmlContent: 
              `
              Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
              Buen día
              Saludándole cordialmente
              Me es grato dirigirme a Usted en la oportunidad de informarle los datos de la presentación y defensa del Trabajo de Grado:
              
                ${studentNames}
                Título Proyecto: ${this.inputdata.graduateWorkData.graduateWorkTitle}
                Día: ${diasSemana[numeroDia]}
                Fecha: ${dateString}
                Hora: ${timeString}
                Lugar: ${this.myForm.value.location}
              Cualquier consulta o duda estoy a su disposición
              Atentamente,

              ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}
              `
            }
            observable.push(this.emailService.sendEmailMessage(emailData))
            
          })
          this.studentList.forEach( (estudiante: any) => {
            
            let emailData: SendEmailRequest = {
              emailTo: estudiante.userEmail,
              emailFrom: this.administratorData.userEmail,
              subject: `Datos Presentación TG - ${studentNames}` ,
              htmlContent: 
              `
              Puerto Ordaz, ${new Date().toLocaleDateString("es-ES", {day: "numeric",month: "long", year: "numeric",})}
              Buen día
              Saludándole cordialmente
              Me es grato dirigirme a Usted en la oportunidad de informarle los datos de la presentación y defensa del Trabajo de Grado:
              
                ${studentNames}
                Título Proyecto: ${this.inputdata.graduateWorkData.graduateWorkTitle}
                Día: ${diasSemana[numeroDia]}
                Fecha: ${dateString}
                Hora: ${timeString}
                Lugar: ${this.myForm.value.location}
              Cualquier consulta o duda estoy a su disposición
              Atentamente,

              ${this.administratorData.userLastName}, ${this.administratorData.userFirstName}
              `
            }
            observable.push(this.emailService.sendEmailMessage(emailData))
            
          })

          return forkJoin(observable)
        }
      )
    )
    .subscribe({
      next: (result) => {
        console.log(result)
      },
      complete: () => {
        this.cargadoArchivos = false
        window.location.href = window.location.href
      },
      error: (error) => {
        this.cargadoArchivos = false
      }
    })
    
    
  }
}
