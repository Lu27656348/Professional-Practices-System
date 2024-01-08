import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../../services/navbar.service';
import { Router } from '@angular/router';
import { Subscription,forkJoin,of,switchMap  } from 'rxjs';

import { StudentService } from '../../../services/student.service';
import { UsersService } from '../../../services/users.service';
import { ProfessorsService } from '../../../services/professors.service';
import { EnterpriseService } from '../../../services/enterprise.service';
import { ExternalPersonnelService } from '../../../services/external-personnel.service'
import { GraduateworkService } from '../../../services/graduatework.service'

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup } from '@angular/forms';

import { ResponseBlob } from '../../../interfaces/ResponseBlob'
import { GraduateWorkTable } from '../../../interfaces/GraduateWorkTable'

async function downloadFile(fileName: string) {
  try {
    const response = await fetch('http://localhost:8082/download/graduatework', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName })
    } as RequestInit);

    const blob = await (response as ResponseBlob<Blob>).blob(); // Type assertion for blobBody
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Set desired filename
    link.click();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

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
  graduateWorkList: any = {};
  coordinatorData: any = {};
  tableData: GraduateWorkTable[] = []

  graduateWorkFileList: any = [];
  graduateWorkReviewsFileList: any = [];
  graduateWorkFinalFileList: any = [];

  hasGraduateWorkFile: boolean = false;
  hasGraduateWorkReviewFile: boolean = false;
  hasCulminated : boolean = false;
  termination : boolean = false;

  dataBs: any;
  dataService$: Subscription = new Subscription();

  estatusCode: number = -1;

  hasGraduateWork: boolean = false;
  localUser: any;
  user: any = {};

  daysRemaining: number = 150
  currentGraduateWork: any = {};
  isFinalSubmittion: boolean = false;
  hasFinalSubmitted: boolean = false;
  

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

  constructor(private router: Router,private dataService: NavbarService, private studentService: StudentService,private userService: UsersService, private _formBuilder: FormBuilder, private professorService: ProfessorsService, private formBuilder: FormBuilder, private enterpriseService: EnterpriseService, private externalPersonnelService: ExternalPersonnelService, private graduateworkService: GraduateworkService){

    /* Obtenemos los datos de todas empresas */
    this.enterpriseService.getEnterprises().subscribe({
      next: (data: any) => {
        console.log(data)
        this.enterprisesData = [...data]
      },
      error: (error: any) => {
        console.log(error);
      }
    })

    /* Obtenemos los datos de todos los foraneos */
    this.externalPersonnelService.getInTutors().subscribe({
      next: (data: any) => {
        console.log(data)
        this.inTutorList = [...data]
      },
      error: (error: any) => {
        console.log(error);
      }
    })

    /* Extraemos del LocalStorage el usuario y los roles de usuario */
    const userString = localStorage.getItem('user');
    const rolesString = localStorage.getItem('roles');

    if(userString && rolesString){

      /* En el caso de que tengamos una cuenta iniciada, primero extraemos los datos del
         usuario para poder realizar las operaciones */

      console.log("LOCAL STORAGE")
      this.localUser = JSON.parse(userString);

      this.userService.getUserData(this.localUser.userDNI).pipe(

        /* Una vez que obtenemos el usuario debemos validar, si este tiene alguna tesis activa */
        switchMap( ( userData ) => {
          console.log(userData);
          this.user = userData
          return this.studentService.isProcessActive(this.user.userDNI)
        }),
        switchMap( ( hasGraduateWork ) => {

          /* Si tiene un trabajo de grado procedemos a buscar los datos de este trabajo de grado
             de lo contrario, si no tiene un trabajo de grado activo se finaliza la extraccion de datos */
          this.hasGraduateWork = hasGraduateWork
          if(this.hasGraduateWork){
            return this.graduateworkService.getCurrentGraduateWork(this.user.userDNI)
          }else{
            return of(null)
          }

        }),
      
        switchMap( ( graduateWorkData ) => {

          if(graduateWorkData === null ){
            return of(null)
          }

          console.log(graduateWorkData)
          this.currentGraduateWork = graduateWorkData;
          if(this.currentGraduateWork.graduateWorkEstatusCode === 90){
            this.hasCulminated = true
            console.log("Trabajo de grado en defensa")
          }
          if(this.currentGraduateWork.graduateWorkEstatusCode === 100){
            this.termination = true
            console.log("Trabajo de grado culminado")
          }
          return this.graduateworkService.getGraduateWorkFileNames()

        }),
        switchMap( ( propolsalFileNames ) => {
          if(propolsalFileNames === null ){
            return of(null)
          }
          console.log( propolsalFileNames )
          this.graduateWorkFileList = propolsalFileNames;
          console.log(`graduatework/${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} TG.pdf`)
          this.graduateWorkFileList.forEach( (element: any)=> {
            console.log(element)
            if( element === `graduatework/${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} TG.pdf` ){
              this.hasGraduateWorkFile = true
              console.log(this.hasGraduateWorkFile);
            }
          });
          return this.graduateworkService.getGraduateWorReviewsFileNames()
        }),

        switchMap( ( graduateWorkReviewsData ) => {
          if(graduateWorkReviewsData === null ){
            return of(null)
          }
          this.graduateWorkReviewsFileList = graduateWorkReviewsData
          console.log(this.graduateWorkReviewsFileList);
          this.graduateWorkReviewsFileList.forEach( ( element: any ) => {
            if( element === `graduatework/reviews/${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} TG Rev.pdf` ){
              this.hasGraduateWorkReviewFile = true
              console.log(this.hasGraduateWorkReviewFile);
            }
          })
          return this.graduateworkService.getCurrentGraduateWork(this.user.userDNI)
        }),
        switchMap( ( graduateWorkListData ) => {
          if(graduateWorkListData === null ){
            return of(null)
          }
          console.log(graduateWorkListData)
          if(graduateWorkListData.graduateWorkEstatusCode === 90){
            this.hasCulminated = true
          }
          if(graduateWorkListData.graduateWorkEstatusCode === 100){
            this.termination = true
          }
          this.graduateWorkList = graduateWorkListData
          console.log(this.graduateWorkList)
          return of(this.hasGraduateWorkReviewFile)
        }),
        switchMap( ( hasGraduateWorkReviewFile ) => {
          if(hasGraduateWorkReviewFile === null ){
            return of(null)
          }
          return this.studentService.getStudentCoordinator(this.user.userDNI)
          
        }),
        switchMap( ( coordinatorData ) => {
          if(coordinatorData === null ){
            return of(null)
          }
          return this.userService.getUserData(coordinatorData.professordni)
          
          
          
        }),
        switchMap( ( coordinatorData ) => {
          if(coordinatorData === null ){
            return of(null)
          }
          this.coordinatorData = coordinatorData;
          return this.graduateworkService.getGraduateWorReviewsFileNames()
          
        }),
        switchMap( ( graduateWorkReviewsData ) => {
          if(graduateWorkReviewsData === null ){
            return of(null)
          }
          this.graduateWorkReviewsFileList = graduateWorkReviewsData
          console.log(this.graduateWorkReviewsFileList);
          this.graduateWorkReviewsFileList.forEach( ( element: any ) => {
            if( element === `graduatework/reviews/${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} TG Rev${this.coordinatorData.userFirstName.charAt(0)}${this.coordinatorData.userLastName.charAt(0)}.pdf` ){
              this.hasGraduateWorkReviewFile = true
              console.log(this.hasGraduateWorkReviewFile);
            }
          })
          return this.graduateworkService.getCurrentGraduateWork(this.user.userDNI)
        }),
        switchMap( ( graduateWorkData ) => {

          if( graduateWorkData === null ){
            return of(null)
          }

          return this.graduateworkService.listFinalFiles() 

        }),
        switchMap( ( finalFiles ) => {

          if( finalFiles === null ){
            return of(null)
          }
          this.graduateWorkFinalFileList = finalFiles;
          console.log( this.graduateWorkFinalFileList );

          this.graduateWorkFinalFileList.forEach( ( element: any ) => {
            if( element === `graduatework/final/${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} TG.pdf` ){
              this.hasFinalSubmitted = true
              console.log(this.hasFinalSubmitted);
            }
          })


          return of(finalFiles)

        }),
        switchMap( ( graduateWorkData ) => {

          if( graduateWorkData === null ){
            return of(null)
          }

          console.log( graduateWorkData )
          return this.graduateworkService.getRemainingDays(this.currentGraduateWork.graduateworkid) 

        }),


        
      ).subscribe({
        next: (data: any) => {
          console.log(data)
          this.daysRemaining = data;
          if(this.daysRemaining <= 0){
            this.isFinalSubmittion = true
          }
        },
        complete: () => {
          console.log("El constructor ha finalizado")
        }
      })

      /****************************************************************************************************/ 
      
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
  }

  createGraduteWorkProposal(){

    this.studentService.getStudentCoordinator(this.user.userDNI).subscribe({
      next: (data) => {
        console.log(data);
        this.coordinatorData = {...data}
      },
      complete: () => {
        
  
      this.studentService.upload(this.currentFile as File, this.user.userDNI as string)
      .pipe(
      switchMap(() => {
        console.log("SE CARGO EL ARCHIVO COMENZANDO CREACION DE PROPUESTA");
        return this.studentService.createProposal({
          "studentDNI": this.user.userDNI,
          "graduateWorkType": this.selectedValue,
          "graduateWorkTitle": this.secondFormGroup.value.proposalTitle,
          "graduateWorkCoordinator": this.coordinatorData.professordni,
          "graduateWorkAcademicTutor": this.academicTutor,
          "graduateWorkEnterprise": this.selectedEnterpriseValue,
          "graduateWorkInCompanyTutor": (this.selectedValue === 'Experimental') ? null : this.selectedInCompanyTutor
        });
      })
    )
    .subscribe({
      next: (data) => {
        console.log(data);
      },
      complete: () => {
        window.location.href = window.location.href;
      },
      error: (errorMessage) => {
        console.log("ERROR EN NOMBRE DE ARCHIVO");
        console.log(errorMessage);
      }
    });
  
    
        this.studentService.upload(this.currentFile as File,this.user.userDNI as string).subscribe({
          next: (data) => {
            console.log("SE CARGO EL ARCHIVO COMENZANDO CREACION DE PROPUESTA")
            this.studentService.createProposal({
              "studentDNI": this.user.userDNI,
              "graduateWorkType": this.selectedValue,
              "graduateWorkTitle": this.secondFormGroup.value.proposalTitle,
              "graduateWorkCoordinator": this.coordinatorData.professordni,
              "graduateWorkAcademicTutor": this.academicTutor,
              "graduateWorkEnterprise": this.selectedEnterpriseValue,
              "graduateWorkInCompanyTutor": (this.selectedValue === 'Experimental') ? null : this.selectedInCompanyTutor
            }).subscribe({
              next: (data) => {
                console.log(data)
              },
              complete: () => {
                window.location.href = window.location.href;
              }
            })
          },
          error: (errorMessage) => {
            console.log("ERROR EN NOMBRE DE ARCHIVO")
            console.log(errorMessage)
          }
        })
  
    
        }  })
  }

  uploadGraduateWorkFile(){
    this.studentService.uploadGraduateWorkFile(this.currentFile as File,this.user.userDNI as string).subscribe({
      next: (data: any) => {
        console.log(data)
      },
      complete: () => {
        window.location.href = window.location.href;
      }
    })
  }

  uploadCulmination(){
    this.graduateworkService.changeStatus(this.graduateWorkList.graduateworkid,100).subscribe({
      next: (data) => {
        console.log(data)
      }, 
      complete: () => {
        window.location.href = window.location.href;
      }
    })
  }

  downloadGraduateWorkFile(){
    if(this.hasGraduateWorkFile){
      const fileName: string = this.user.userLastName.split(' ')+this.user.userFirstName.split(' ')+' TG.pdf';
      console.log(fileName);
      downloadFile(fileName);
    }
  }

  fileHandler(event : any){
    console.log("fileHandler()")
    console.log(event.target.files)
    console.log(event.target.files[0])
    this.currentFile = event.target.files[0]
  }

  uploadFinalDocument(){
    console.log("Entrega final")
    this.graduateworkService.uploadFinalSubmittion(this.currentFile as File).subscribe({
      next: (data: any) => {
        console.log(data)
      },
      complete: () => {
        window.location.href = window.location.href;
      }
    })
  }

}/* FIN DE COMPONENTE */


