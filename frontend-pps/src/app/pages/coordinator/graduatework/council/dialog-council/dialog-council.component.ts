import { Component, OnInit,Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CouncilService } from '../../../../../services/council.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'

@Component({
  selector: 'app-dialog-council',
  templateUrl: './dialog-council.component.html',
  styleUrls: ['./dialog-council.component.css']
})
export class DialogCouncilComponent implements OnInit{

  inputdata: any = null;
  councilList: any = []

  councilSelected: any = null;

  constructor(private councilService: CouncilService,@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService){}

  ngOnInit(){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.councilService.getCouncils().subscribe({
      next: (data) => {
        this.councilList = data
      }
    })
  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
      this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,50).subscribe({
        next: (data) => {
          console.log(data)
          this.graduateWorkService.setGraduateWorkCouncil({"graduateWorkId": this.inputdata.graduateWorkData.graduateworkid, "graduateWorkSchoolCouncil": this.councilSelected}).subscribe({
            next: (data) => {
              console.log(data)
              window.location.href = window.location.href;
            }
          })
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          
        }
      })
    }
  }

}
