import { Component, OnInit,Inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GraduateworkService } from '../../../../../services/graduatework.service'
import { StudentService } from '../../../../../services/student.service'

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent {
  inputdata: any;
  coordinatorData: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService, private studentService: StudentService){
    
    

  }
  ngOnInit(){
    this.inputdata = this.data
    console.log(this.inputdata)
  }

  obtenerPlanillaEvaluacion(){
    console.log("obtenerPlanillaEvaluacion()")
  }

  obtenerInformePropuesta(){
    console.log("obtenerInformePropuesta()")
  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
      console.log("Aprobar")
      this.graduateWorkService.changeStatus(this.inputdata.graduatework.graduateworkid,40).subscribe({
        next: (data) => {
          console.log(data)
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          window.location.href = window.location.href;
        }
      })
    }
  }
}
