import { Component, OnInit,Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CouncilService } from '../../../../../services/council.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup,FormControl } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';

@Component({
  selector: 'app-dialog-council',
  templateUrl: './dialog-council.component.html',
  styleUrls: ['./dialog-council.component.css']
})
export class DialogCouncilComponent implements OnInit{

  inputdata: any = null;
  councilList: any = []

  councilSelected: any = null;

  isCreateNewSchoolCouncil: boolean = false;

  studentCount: number = 0;

  coordinatorData: any = null;
  enterpriseData: any = null;

  schoolCouncilForm =  this.formGroup.group({
    schoolCouncil: ['']
  }) 

  constructor(private councilService: CouncilService,@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService,private formGroup: FormBuilder,private userService: UsersService, private enterpriseService: EnterpriseService){}

  ngOnInit(){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.councilService.getCouncils().subscribe({
      next: (data) => {
        this.councilList = data
      }
    })
    this.enterpriseService.getEnterpriseById(this.inputdata.graduateWorkData.graduateWorkEnterprise).subscribe({
      next: (enterpriseData) => {
        this.enterpriseData = enterpriseData
        console.log(this.enterpriseData)
      }
    });
    this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkCoordinator).subscribe({
      next: (coordinatorData) => {
        this.coordinatorData = coordinatorData
        console.log(coordinatorData)
      }
    })
    this.studentCount = this.inputdata.userData.length
    console.log(this.studentCount)
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

  createSchoolCouncil(){
    console.log("createReviewerCriteria()")
    this.isCreateNewSchoolCouncil = !this.isCreateNewSchoolCouncil
  }

  addSchoolCouncil(){
    console.log("addSchoolCouncil()")
  }

}
