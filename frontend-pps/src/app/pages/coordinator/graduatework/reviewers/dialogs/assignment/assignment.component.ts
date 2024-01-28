import { Component, OnInit,Inject } from '@angular/core';

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup,FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';

/* Servicios */

import { GraduateworkService } from '../../../../../../services/graduatework.service';
import { ProfessorsService } from '../../../../../../services/professors.service';
import { CommitteeService } from '../../../../../../services/committee.service'
import { CreateReviewerEvaluationRequest } from 'src/app/interfaces/requests/CreateReviewerEvaluationRequest';

interface Criteria {
  reviewerCriteriaId: number;
  reviewerCriteriaDescription: string
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

  isCreateNewCommittee: boolean = false;
  newCommittee: string = '';

  isCreateNewReviewerCriteria : boolean = false;
  newReviewerCriteria: string = '';

  reviewerForm = this.formGroup.group({
    reviewer: ['', Validators.required]
  });

  committeeForm =  this.formGroup.group({
    committeeId: ['']
  }) 

  reviewerCriteriaForm =  this.formGroup.group({
    reviewerCriteriaDescription: ['']
  }) 

  criteria: any = [];

  criteriaForm = new FormGroup({});
  constructor(private graduateWorkService: GraduateworkService, private professorService: ProfessorsService, private committeeService: CommitteeService,private formGroup: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.graduateWorkService.getCriteria().subscribe({
      next: (data) => {
        this.criteria = [...data]
        console.log(this.criteria)
        this.criteria.forEach((item: Criteria) => {
          this.criteriaForm.addControl(item.reviewerCriteriaId.toString(), new FormControl(false)); // Assuming initial value is false
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
  
    const control = this.criteriaForm.get(option.reviewerCriteriaId.toString()) as FormControl

    if (control.value) {
      this.selectedValues.push(option.reviewerCriteriaId);
    } else {
      const index = this.selectedValues.indexOf(option.reviewerCriteriaId);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    }
    console.log(this.selectedValues)

  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
      const reviewerEvaluation: CreateReviewerEvaluationRequest = {
        "professorDNI": this.reviewerSelected,
        "graduateWorkId": this.inputdata.gw.graduateWorkId
      }
      console.log(reviewerEvaluation);
      this.graduateWorkService.createReviewerEvaluation(reviewerEvaluation).pipe(
        switchMap(
          (result) => {
            console.log(result)
            const observables: Observable<any>[] = [];
            console.log(this.selectedValues)
            this.selectedValues.forEach( (criterio: number) => {
              
              observables.push(this.graduateWorkService.createReviewerEvaluationCriteria({
                "professorDNI": this.reviewerSelected,
                "graduateWorkId": this.inputdata.gw.graduateWorkId,
                "reviewerCriteriaId": criterio
              }))
              
            })
            return forkJoin(observables);
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          console.log("Completado")
          window.location.href = window.location.href;
        }
      })

    }else{

    }

  }

  obtenerPlanillaEvaluacion(){
    console.log("ObtenerPlanillaDeEvaluacion")
  }

  createCommittee(){
    console.log("createCommittee()")
    this.isCreateNewCommittee = !this.isCreateNewCommittee
  }

  addCommittee(){
    console.log("addCommittee()")
    console.log(this.committeeForm.value.committeeId)
    const todayDate = new Date();
    this.committeeService.createCommittee({
      "committeeId": this.committeeForm.value.committeeId as string,
      "committeeDate": todayDate as Date
    }).subscribe({
      next: (data) => {
        console.log(data)
        this.isCreateNewCommittee = !this.isCreateNewCommittee
      },
      complete: () => {
        this.committeeService.getCommittees().subscribe({
          next: ( data:any ) => {
            this.committeeList = [...data]
          }
        })
      }
    })
  }

  createReviewerCriteria(){
    console.log("createReviewerCriteria()")
    this.isCreateNewReviewerCriteria = !this.isCreateNewReviewerCriteria
  }

  addReviewerCriteria(){
    console.log("addReviewerCriteria()")
    console.log(this.reviewerCriteriaForm.value.reviewerCriteriaDescription)
    this.graduateWorkService.createReviewerCriteria({
      "reviewerCriteriaId": null,
      "reviewerCriteriaDescription": this.reviewerCriteriaForm.value.reviewerCriteriaDescription as string
    }).pipe(
      switchMap( (result) => {
        console.log(result)
        return of(result)
      })
    ).subscribe({
      complete: () => {
        this.graduateWorkService.getCriteria().subscribe({
          next: (data) => {
            this.criteria = [...data]
            console.log(this.criteria)
            this.criteria.forEach((item: Criteria) => {
              this.criteriaForm.addControl(item.reviewerCriteriaId.toString(), new FormControl(false)); // Assuming initial value is false
            });
          },
          complete: () => {
            this.isCreateNewReviewerCriteria = !this.isCreateNewReviewerCriteria
          }
        })
      }
    })
  }

}
