import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../../services/navbar.service';
import { Router } from '@angular/router';
import { Subscription,forkJoin,of  } from 'rxjs';

import { StudentService } from '../../../services/student.service';
import { UsersService } from '../../../services/users.service';
import { ProfessorsService } from '../../../services/professors.service';
import { EnterpriseService } from '../../../services/enterprise.service';
import { ExternalPersonnelService } from '../../../services/external-personnel.service'

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student-gw',
  templateUrl: './student-gw.component.html',
  styleUrls: ['./student-gw.component.css']
})
export class StudentGWComponent {

  selectedValue:string = '';
  selectedEnterpriseValue:string = '';
  academicTutor: any
  selectedInCompanyTutor: string = '';
  currentFile?: File;
  fileName = 'Select File';

  professorList: any[] = [];
  inTutorList: any[] = [];
  graduateWorkList: any[] = [];
  coordinatorData: any = {};

  dataBs: any;
  dataService$: Subscription = new Subscription();

  estatusCode: number = -1;

  hasGraduateWork: boolean = false;
  localUser: any;
  user: any = {};

  daysRemaining: number = 120

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    proposalTitle: ['', Validators.required],
  });
  isLinear = false;

  isProcessActive: boolean = false;

  form =  this.formBuilder.group({
    file: ['',[Validators.required]]
  }) 

  enterprisesData: any = [];

  constructor(private router: Router,private dataService: NavbarService, private studentService: StudentService,private userService: UsersService, private _formBuilder: FormBuilder, private professorService: ProfessorsService, private formBuilder: FormBuilder, private enterpriseService: EnterpriseService, private externalPersonnelService: ExternalPersonnelService){
    console.log("daacacasas")

    this.dataService.getData().subscribe({
      next: (data: any) => {
        console.log(data)
      },
      error: (error: any) => {
        console.log("error")
      }
    });

    this.enterpriseService.getEnterprises().subscribe({
      next: (data: any) => {
        console.log(data)
        this.enterprisesData = [...data]
      },
      error: (error: any) => {
        console.log(error);
      }
    })

    this.externalPersonnelService.getInTutors().subscribe({
      next: (data: any) => {
        console.log(data)
        this.inTutorList = [...data]
      },
      error: (error: any) => {
        console.log(error);
      }
    })

    const userString = localStorage.getItem('user');
    const rolesString = localStorage.getItem('roles');

    if(userString && rolesString){
      console.log("LOCAL STORAGE")
      this.localUser = JSON.parse(userString);
      this.userService.getUserData(this.localUser.userDNI).subscribe({
        next: (userData) => {
          console.log("userData")
          console.log(userData)
          this.user = {...userData}
          this.studentService.getStudentGraduateWork(this.user.userDNI).subscribe({
            next: (data: any) => {
              console.log(data)
              this.graduateWorkList = [...data]
              this.studentService.isProcessActive(this.user.userDNI).subscribe({
                next: (data) => {
                  this.hasGraduateWork = data;
                  console.log(data)
                  if(this.hasGraduateWork){
                    console.log("Se detecto un proceso activo")
    
                    
                  }else{
                    console.log("NO Se detecto un proceso activo")
                  }
                  
                },
                error: (error) => [
                  console.log(error)
                ]
              })
            },
            error: (error: any) => {
              console.log("error")
            }
          })

        },
        error: (errorData) => {
          console.log("errorData")
          console.log(errorData)
        },
        complete: () => {
          console.log("login completo")
  
        }
      })
      console.log(this.localUser.userDNI);
    }else{
      this.router.navigateByUrl("");
    }
  
  }

  register(){
    console.log("Register")
    this.isProcessActive = true
  }

  ngOnInit(){

    this.professorService.getProfessors().subscribe({
      next: (data) => {
        console.log(data)
        this.professorList = [...data]
      },
      error: (error) => {
        console.log(error)
      }
    })


    //this.studentService.isProcessActive()
  }

  onSelectionChange(){
    console.log(this.selectedValue);
    console.log("SELECT")
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    }

    // ...
  }

  upload(){
    this.studentService.upload(this.currentFile as File).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  
  createGraduteWorkProposal(){

  this.studentService.getStudentCoordinator(this.user.userDNI).subscribe({
    next: (data) => {
      console.log(data);
      this.coordinatorData = {...data}
    },
    complete: () => {
      forkJoin([this.studentService.createProposal({
        "studentDNI": this.user.userDNI,
        "graduateWorkType": this.selectedValue,
        "graduateWorkTitle": this.secondFormGroup.value.proposalTitle,
        "graduateWorkCoordinator": this.coordinatorData.professordni,
        "graduateWorkAcademicTutor": this.academicTutor,
        "graduateWorkEnterprise": this.selectedEnterpriseValue,
        "graduateWorkInCompanyTutor": (this.selectedValue === 'Experimental') ? null : this.selectedInCompanyTutor
      }),
      of(this.upload())
      ]).subscribe({
        next: ([proposalData, uploadData]) => {
          // Ambas funciones se han completado, accede a los resultados
          console.log('Propuesta creada:', proposalData);
          console.log('Subida realizada:', uploadData);
        },
        error: (error) => {
          // Maneja errores aquí
          console.error('Error:', error);
        },
        complete: () => {
          console.log("Termino")
          window.location.href = window.location.href;
        }
      })
    }
  })
    console.log({
      "studentDNI": this.user.userDNI,
      "graduateWorkType": this.selectedValue,
      "graduateWorkTitle": this.secondFormGroup.value.proposalTitle,
      "graduateWorkCoordinator": this.coordinatorData.professordni,
      "graduateWorkAcademicTutor": this.academicTutor,
      "graduateWorkEnterprise": this.selectedEnterpriseValue,
      "graduateWorkInCompanyTutor": (this.selectedValue === 'Experimental') ? null : this.selectedInCompanyTutor
    });

  

  }

}
