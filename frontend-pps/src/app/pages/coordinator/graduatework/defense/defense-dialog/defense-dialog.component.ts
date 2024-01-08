import { Component,OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CouncilService } from '../../../../../services/council.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'
import { FormGroup, FormControl,FormBuilder,Validators } from '@angular/forms';

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

  myForm = new FormGroup({
    date: new FormControl()
  });

  constructor(private councilService: CouncilService,@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService){}

  ngOnInit(){
    this.inputdata = this.data
    console.log(this.inputdata)
  }
  selectedDate(date: any) {
    console.log("Selected date:", date.target);
    console.log("Selected date:", this.selectedDateValue);
    console.log(this.myForm.value.date)
    // Store the date for later use
    this.selectedDateValue = this.myForm.value.date;
  }

  setDefenseDate(){
    this.graduateWorkService.setDefenseDate(this.selectedDateValue, this.inputdata.graduateWorkData.graduateworkid).subscribe({
      next: (data) => {
        console.log(data)
      }
    })
    this.graduateWorkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,80).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      complete: () => {
        window.location.href = window.location.href;
      }
    })
  }
}
