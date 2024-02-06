import { Component } from '@angular/core';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';

@Component({
  selector: 'app-student-pasantia',
  templateUrl: './student-pasantia.component.html',
  styleUrls: ['./student-pasantia.component.css']
})
export class StudentPasantiaComponent {

  currentPasantia: any = null
  daysRemaining: number = -1;
  totalDays: number = -1;

  constructor(private pasantiaService: PasantiaService){
    const localUser = localStorage.getItem('user')
    console.log(localUser != null )
    if(localUser != null){
      const localUserData = JSON.parse(localUser)
      console.log(localUserData)
      this.pasantiaService.getStudentCurrentPasantia(localUserData.userDNI).subscribe({
        next: (pasantiaData) => {
          console.log(pasantiaData)
          this.currentPasantia = pasantiaData
          if(this.currentPasantia != null ){
            let fechaInicio = new Date();
            let fechaComienzo = new Date(this.currentPasantia.intershipStartDate as number);
            let fechaFinal = new Date(this.currentPasantia.intershipCompletionDate as number);
            this.daysRemaining = Math.floor((fechaFinal.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
            this.totalDays = Math.floor((fechaFinal.getTime() - fechaComienzo.getTime()) / (1000 * 60 * 60 * 24));
            console.log(this.daysRemaining)
            console.log(this.totalDays)
          }
        }
      })
    }else{

    }
    
  }
}
