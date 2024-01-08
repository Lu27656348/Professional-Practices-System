import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GraduateworkService } from '../../../../../services/graduatework.service'

@Component({
  selector: 'app-professor-jury-dialog',
  templateUrl: './professor-jury-dialog.component.html',
  styleUrls: ['./professor-jury-dialog.component.css']
})
export class ProfessorJuryDialogComponent implements OnInit{
  mentionSelected: string = ""
  sliderValue: number = 0;
  inputdata: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService){
    this.inputdata = this.data
    console.log( this.inputdata)
  }

  ngOnInit(){

  }

  obtenerValorSlider(event: any){
    console.log(event)
    this.sliderValue = event
  }

  obtenerMencion(){
    console.log(this.mentionSelected)
  }

  cargarNotaJurado(){

    this.graduateWorkService.setDefenseNote(this.inputdata.graduateWorkData.graduateworkid, this.inputdata.professorData.userDNI, this.sliderValue).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
    
  }
}
