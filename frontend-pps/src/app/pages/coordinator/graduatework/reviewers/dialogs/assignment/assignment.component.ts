import { Component, OnInit,Inject } from '@angular/core';

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup,FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/* Servicios */

import { GraduateworkService } from '../../../../../../services/graduatework.service';
import { ProfessorsService } from '../../../../../../services/professors.service';
import { CommitteeService } from '../../../../../../services/committee.service'

interface Criteria {
  criteriaid: number;
  criteriadescription: string
}

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit{

  professorsList: any[] = [];
  committeeList: any[] = [];

  reviewerSelected: any = {};
  committeeSelected: any = {};

  selectedValues: any[] = [];

  inputdata: any;

  reviewerForm = this.formGroup.group({
    reviewer: ['', Validators.required]
  });

  criteria: any = [];

  criteriaForm = new FormGroup({});
  constructor(private graduateWorkService: GraduateworkService, private professorService: ProfessorsService, private committeeService: CommitteeService,private formGroup: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.graduateWorkService.getCriteria().subscribe({
      next: (data) => {
        this.criteria = [...data]
        this.criteria.forEach((item: Criteria) => {
          this.criteriaForm.addControl(item.criteriaid.toString(), new FormControl(false)); // Assuming initial value is false
        });
      }
    })

  }
  ngOnInit(){
    this.professorService.getProfessors().subscribe({
      next: ( data:any ) => {
        this.professorsList = [...data]
        console.log( this.professorsList)
      }
    })

    this.committeeService.getCommittees().subscribe({
      next: ( data:any ) => {
        this.committeeList = [...data]
        console.log(this.committeeList)
      }
    })




  
  }

  onSelectionChange(){
    console.log(this.reviewerSelected)
    console.log(this.committeeSelected)
  }

  
  onCheckboxChange(option: Criteria) {
  
    const control = this.criteriaForm.get(option.criteriaid.toString()) as FormControl

    if (control.value) {
      this.selectedValues.push(option.criteriadescription);
    } else {
      const index = this.selectedValues.indexOf(option.criteriadescription);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    }

  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
  
      this.graduateWorkService.changeStatus(this.inputdata.gw.graduateWorkId,30).subscribe({
        next: (data) => {
          console.log(data)
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          console.log(this.reviewerSelected)
          console.log(this.committeeSelected)
          console.log(this.inputdata.gw.graduateWorkId)
          
          this.graduateWorkService.sendProposalToReviewer({
            "graduateWorkReviewer": this.reviewerSelected,
            "graduateWorkId": this.inputdata.gw.graduateWorkId,
            "graduateWorkCommittee": this.committeeSelected
          }).subscribe({
            next: (data) => {
              console.log(data)
            },
            complete: () => {
              window.location.href = window.location.href;
            }
          })
        }
      })
    }
  }

  obtenerPlanillaEvaluacion(){
    console.log("ObtenerPlanillaDeEvaluacion")
  }

}
