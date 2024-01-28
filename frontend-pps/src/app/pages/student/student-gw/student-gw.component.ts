import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { NavbarService } from '../../../services/navbar.service';
import { Router } from '@angular/router';
import { Observable, Subscription,catchError,forkJoin,of,switchMap, throwError  } from 'rxjs';

import { StudentService } from '../../../services/student.service';
import { UsersService } from '../../../services/users.service';
import { ProfessorsService } from '../../../services/professors.service';
import { EnterpriseService } from '../../../services/enterprise.service';
import { ExternalPersonnelService } from '../../../services/external-personnel.service'
import { GraduateworkService } from '../../../services/graduatework.service'

import { environment } from 'src/environments/environment';

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup } from '@angular/forms';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


import { ResponseBlob } from '../../../interfaces/ResponseBlob'
import { GraduateWorkTable } from '../../../interfaces/GraduateWorkTable'
import { DocumentService } from 'src/app/services/document.service';

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

async function downloadProposalEvaluationFile(fileName: string, studentData: any) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/proposal/evaluation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName, studentDNI: studentData.studentDNI, userFirstName: studentData.userFirstName, userLastName: studentData.userLastName, revisionNumber: studentData.revisionNumber})
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

async function downloadLastAcademicTutorRevision(fileName: string, studentData: any) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/graduatework/revision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName, studentDNI: studentData.studentDNI, userFirstName: studentData.userFirstName, userLastName: studentData.userLastName, revisionNumber: studentData.revisionNumber})
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

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

  graduateWorkMode: string = 'Individual';
  partnerSelected: string = ''
  studentList: any = [];

  hasProposalRevisionPending: boolean = false;
  coordinatorEvaluationLastFile: File | null = null;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    proposalTitle: ['', Validators.required],
  });
  isLinear = false;

  isProcessActive: boolean = false;
  isCharging: boolean = false;

  form =  this.formBuilder.group({
    file: ['',[Validators.required]]
  }) 

  enterprisesData: any = [];
  isEnterpriseSelected : boolean = false;
  externalDataList: any;

  revisionCoordinatorCount: number = 0;
  revisionAcademicTutorCount: number = 0;
  isCulminated: boolean = false

  detectChanges() {
    this.cdRef.detectChanges();
  }

  defenseDate: Date = new Date();
  constructor(private router: Router,private dataService: NavbarService, private studentService: StudentService,private userService: UsersService, private _formBuilder: FormBuilder, private professorService: ProfessorsService, private formBuilder: FormBuilder, private enterpriseService: EnterpriseService, private externalPersonnelService: ExternalPersonnelService, private graduateworkService: GraduateworkService, private navbarService: NavbarService,private _snackBar: MatSnackBar,  private cdRef: ChangeDetectorRef, private documentService: DocumentService){

    /* Obtenemos los datos de todas empresas */
    this.enterpriseService.getEnterprises().subscribe({
      next: (data: any) => {
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
          return this.graduateworkService.isCulminated(this.user.userDNI)
        }),
        switchMap(
          (isCulminated) => {
            this.isCulminated = isCulminated
            console.log(this.isCulminated)
            return this.studentService.isProcessActive(this.user.userDNI)
          }
        ),
        switchMap( ( hasGraduateWork ) => {

          console.log(hasGraduateWork)
          /* Si tiene un trabajo de grado procedemos a buscar los datos de este trabajo de grado
             de lo contrario, si no tiene un trabajo de grado activo se finaliza la extraccion de datos */
      
          this.isProcessActive = hasGraduateWork

          if(this.isCulminated == false){
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
          this.hasGraduateWork = true

          if(this.currentGraduateWork.graduateWorkEstatusCode === 90){
            this.hasCulminated = true
            console.log("Trabajo de grado en defensa")
          }
          if(this.currentGraduateWork.graduateWorkEstatusCode === 100){
            this.termination = true
            console.log("Trabajo de grado culminado")
          }
          return this.graduateworkService.getCoordinatorEvaluationStatus(this.currentGraduateWork.graduateworkid)

        }),
        switchMap( ( coordinatorEvaluationStatus ) => {

          if(coordinatorEvaluationStatus === null ){
            return of(null)
          }

          console.log(`%c${coordinatorEvaluationStatus}`,'color: red')
          if(coordinatorEvaluationStatus === false){
            this.hasProposalRevisionPending = !coordinatorEvaluationStatus;
            console.log(`%c${this.hasProposalRevisionPending}`,'color: red')
            //const formattedName = "SomozaLuis PTG RevLS.pdf"
            //downloadProposalEvaluationFile(formattedName)
          }

          return this.graduateworkService.getGraduateWorkFileNames()

        }),
        /**********************************************/
        /* Validador Intermedio de Estado de Propuesta */
        /**********************************************/
     
        switchMap( ( propolsalFileNames) => {

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
          console.log(this.currentGraduateWork.graduateWorkAcademicTutor)
          console.log(this.currentGraduateWork.graduateworkid)
          return this.graduateworkService.verifyAcademicTutorRevisionPending(this.currentGraduateWork.graduateWorkAcademicTutor,this.currentGraduateWork.graduateworkid)
        }),

        switchMap( ( graduateWorkReviewsData ) => {

          if(graduateWorkReviewsData === null ){
            return of(null)
          }
          console.log(graduateWorkReviewsData)
          this.hasGraduateWorkReviewFile = graduateWorkReviewsData;
          /*
          this.graduateWorkReviewsFileList = graduateWorkReviewsData

          console.log(this.graduateWorkReviewsFileList);

          this.graduateWorkReviewsFileList.forEach( ( element: any ) => {
            if( element === `graduatework/reviews/${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} TG Rev.pdf` ){
              this.hasGraduateWorkReviewFile = true
              console.log(this.hasGraduateWorkReviewFile);
            }
          })
          */

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
          this.defenseDate = new Date(this.currentGraduateWork.graduateWorkDefenseDate)
          console.log(this.daysRemaining)
          console.log(this.daysRemaining <= 0)
          if(this.daysRemaining <= 0 && (this.currentGraduateWork.graduateWorkStatusCode == 50 || this.currentGraduateWork.graduateWorkStatusCode == 51)){
            console.log("Se acabo el tiempo")
            this.isFinalSubmittion = true
            this.graduateworkService.changeStatus(this.currentGraduateWork.graduateworkid,52).subscribe({
              next: (result) => {
                console.log(result)
              },
              complete: () =>{
                window.location.href =  window.location.href
              }
            })
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
    this.navbarService.changeIsDashBoard();

    this.studentService.getStudentsDataExceptOne(this.localUser.userDNI).subscribe({
      next: (studentList) => {
        console.log(studentList)
        this.studentList = studentList;
      }
    })

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

  onModeSelected(){
    console.log(this.graduateWorkMode)
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    }
  }

  createGraduteWorkProposal(){

    this.isCharging = true;
    this.studentService.getStudentCoordinator(this.user.userDNI).subscribe({
      next: (data) => {
        console.log(data);
        this.coordinatorData = {...data}
      },
      complete: () => {
        let isIndividual = true;
        if(this.partnerSelected !== '' ){
          isIndividual = false;
          console.log("Es tesis grupal")
          console.log("Tu companero es: " + this.partnerSelected)

          this.studentService.upload(this.currentFile as File, this.user.userDNI as string, this.partnerSelected)
          .pipe(
            switchMap(() => {
              console.log("SE CARGO EL ARCHIVO COMENZANDO CREACION DE PROPUESTA");
                return this.studentService.createProposal({
                  "studentDNI": this.user.userDNI,
                  "graduateWorkType": this.selectedValue.toUpperCase(),
                  "graduateWorkTitle": this.secondFormGroup.value.proposalTitle,
                  "graduateWorkCoordinator": this.coordinatorData.professordni,
                  "graduateWorkAcademicTutor": this.academicTutor,
                  "graduateWorkEnterprise": this.selectedEnterpriseValue,
                  "graduateWorkInCompanyTutor": (this.selectedValue === 'Experimental') ? null : this.selectedInCompanyTutor,
                  "studentDNI2": this.partnerSelected
                });
            }),
            catchError( (error) => {
              console.log("ERROR EN NOMBRE DE ARCHIVO");
              console.log(error);
              this._snackBar.open(error, 'Cerrar', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              return of(error);
            })
          )
          .subscribe({
            next: (data) => {
              console.log(data);
            },
            complete: () => {
              console.log("Actualizamos la vista")
              window.location.href = window.location.href;
            },
            error: (err) => {
              console.log(err)
            }
          });
        }else{
          console.log("Es tesis individual")
          this.studentService.upload(this.currentFile as File, this.user.userDNI as string, null)
          .pipe(
            catchError( (error) => {
              console.log("ERROR EN NOMBRE DE ARCHIVO");
              console.log(error);
              this._snackBar.open(error, 'Cerrar', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              return throwError( () => new Error())
            }),
            switchMap((uploadResult) => {
              console.log(uploadResult)
              this._snackBar.open(uploadResult.message, 'Cerrar', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              console.log("SE CARGO EL ARCHIVO COMENZANDO CREACION DE PROPUESTA");
                return this.studentService.createProposal({
                  "studentDNI": this.user.userDNI,
                  "graduateWorkType": this.selectedValue.toUpperCase(),
                  "graduateWorkTitle": this.secondFormGroup.value.proposalTitle,
                  "graduateWorkCoordinator": this.coordinatorData.professordni,
                  "graduateWorkAcademicTutor": this.academicTutor,
                  "graduateWorkEnterprise": this.selectedEnterpriseValue,
                  "graduateWorkInCompanyTutor": (this.selectedValue === 'Experimental') ? null : this.selectedInCompanyTutor
                });
            }),
          )
          .subscribe({
            next: (data) => {
              console.log(data);
            },
            complete: () => {
              console.log("complete")
              window.location.href = window.location.href;
            },
            error: (errorMessage) => {
              console.log("error en creacion de propuesta")
            }
          });
        }  
  
    
        }  })

        
        
  }

  uploadGraduateWorkFile(){
    console.log(this.currentGraduateWork)
    if(this.currentFile){
      this.graduateworkService.getAcademicTutorGraduateWorksCount(this.currentGraduateWork.graduateWorkAcademicTutor,this.currentGraduateWork.graduateworkid).pipe(
        switchMap(
          (revisionNumber) => {
            this.revisionAcademicTutorCount = revisionNumber;
            return this.graduateworkService.getGraduateWorkStudentData(this.currentGraduateWork.graduateworkid)
          }
        ),
        switchMap (
          (studentList) => {
            this.studentList = studentList
            console.log(this.studentList)
            let formattedFileName;
            if(this.studentList.length > 1){
              formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} ${this.studentList[1].userLastName.split(" ")[0]}${this.studentList[1].userFirstName.split(" ")[0]} TG.pdf`
            }else{
              formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} TG.pdf`;
            }
            return this.documentService.copyFileAndRename(this.currentFile as File,formattedFileName)
          }
        ),
        switchMap (
          (newFile) => {
            console.log(newFile)
            return  this.studentService.uploadGraduateWorkFile(newFile as File, this.studentList)
          }
        ),
        switchMap (
          (fileUploadResult) => {
            console.log(fileUploadResult)
            return this.graduateworkService.addAcademicTutorEvaluation(this.currentGraduateWork.graduateWorkAcademicTutor,this.currentGraduateWork.graduateworkid)
          }
        ),
      ).subscribe(
        {
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            console.log("%cCompletado", "color: green")
            window.location.href = window.location.href;
          }
        }
      )
    }else{
      this._snackBar.open("No ha seleccionado un archivo", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
    
  }

  uploadCulmination(){
    if(this.currentFile){
      this.graduateworkService.changeStatus(this.graduateWorkList.graduateworkid,100).subscribe({
        next: (data) => {
          console.log(data)
        }, 
        complete: () => {
          window.location.href = window.location.href;
        }
      })
    }else{
      this._snackBar.open("No ha seleccionado un archivo", 'cerrar',{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
    
  }

  downloadGraduateWorkFile(){
    if(this.hasGraduateWorkFile){
      const fileName: string = this.user.userLastName.split(' ')+this.user.userFirstName.split(' ')+' TG.pdf';
      console.log(fileName);
      downloadFile(fileName);
    }else{
      this._snackBar.open("No ha cargado ningun archivo", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
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
    console.log(this.currentGraduateWork);
    if(this.currentFile){
      this.graduateworkService.getGraduateWorkStudentData(this.currentGraduateWork.graduateworkid).pipe(
        switchMap(
          (studentList) => {
            this.studentList = studentList;
            let formattedFileName;
            if(this.studentList.length > 1){
              formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} ${this.studentList[1].userLastName.split(" ")[0]}${this.studentList[1].userFirstName.split(" ")[0]} TG.pdf`
            }else{
              formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} TG.pdf`
            }
            return this.documentService.copyFileAndRename(this.currentFile as File, formattedFileName)
          }
        ),
        switchMap(
          (newFile) => {
            return this.graduateworkService.uploadFinalSubmittion(newFile, this.studentList)
          }
        ),
        switchMap(
          (uploadFileResult) => {
            console.log(uploadFileResult)
            return this.graduateworkService.changeStatus(this.currentGraduateWork.graduateworkid,60)
          }
        ),
      ).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href;
        }
      })
    }else{
      this._snackBar.open("No ha seleccionado un archivo","Cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
    /*
    this.graduateworkService.uploadFinalSubmittion(this.currentFile as File).subscribe({
      next: (data: any) => {
        console.log(data)
      },
      complete: () => {
        window.location.href = window.location.href;
      }
    })
    */
  }

  downloadProposalEvaluationFile(){
    console.log("downloadProposalEvaluationFile()")
    this.graduateworkService.getGraduateWorkStudentData(this.graduateWorkList.graduateworkid).pipe(
      switchMap(
        (studentList) => {
          console.log(studentList)
          this.studentList = studentList;
          return this.graduateworkService.getCoordinatorEvaluationCount(this.graduateWorkList.graduateworkid)
        }
      ),
      switchMap(
        (result) => {
          let formattedName;
          let revisionFormat;
          console.log(result)
          result = result -1
          if(result == 1 || result == 0){
            revisionFormat = `Rev${this.coordinatorData.userFirstName.split(' ')[0].charAt(0)}${this.coordinatorData.userLastName.split(' ')[0].charAt(0)}`
          }else{
            revisionFormat = `Rev${result}${this.coordinatorData.userFirstName.split(' ')[0].charAt(0)}${this.coordinatorData.userLastName.split(' ')[0].charAt(0)}`
          }

          this.revisionCoordinatorCount = result;
          if(this.studentList.length > 1){
            formattedName = `${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]} PTG ${revisionFormat}.pdf`
          }else{
            formattedName =  `${this.user.userLastName.split(' ')[0]}${this.user.userFirstName.split(' ')[0]} PTG ${revisionFormat}.pdf`
          }
          console.log(this.user)
          downloadProposalEvaluationFile(formattedName,{
            studentDNI: this.user.userDNI, userFirstName: this.user.userFirstName, userLastName: this.user.userLastName, revisionNumber: result 
          })
          return of("Se ha descargado el archivo correctamente")
        }
      )
    ).subscribe(
      {
        next: (result) => {
          console.log(result)
        }
      }
    )
   
  }

  uploadProposalEvaluationFile(){
    console.log(this.currentGraduateWork);
    console.log(this.studentList)
    

    if(this.currentFile){
      this.graduateworkService.getGraduateWorkStudentData(this.currentGraduateWork.graduateworkid).pipe(
        switchMap(
          (studentList) => {
            this.studentList = studentList;
            return this.userService.getUserData(this.localUser.userDNI)

          }
        ),
        switchMap(
          (userData) =>{
            console.log(this.studentList)
            let formattedFileName;
            if(this.studentList.length > 1){
              formattedFileName =  `${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]} PTG.pdf`
              return this.studentService.upload(this.currentFile as File, userData.userDNI as string, this.studentList[1].userDNI)
            }else{
              formattedFileName = `${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} PTG.pdf`
            }
            return this.documentService.copyFileAndRename(this.currentFile as File,formattedFileName )
          }
        ),
        switchMap(
          (newFile) => {
            return this.studentService.upload(newFile, this.localUser.userDNI as string, null)
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            return this.graduateworkService.changeStatus(this.currentGraduateWork.graduateworkid,12)
          }
        ),
      ).subscribe({
        next: (result) => {
          console.log(result)
        }, 
        complete: () => {
          window.location.href = window.location.href;
        }
      })
    }else{
      this._snackBar.open("No ha seleccionado un archivo", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
  
    
  }

  enterpriseSelected(){
    this.isEnterpriseSelected = true;
    this.externalPersonnelService.getExternalPersonnelByEnterpriseId(parseInt(this.selectedEnterpriseValue)).pipe(
      switchMap(
        (externalList: any[]) => {
          console.log(externalList)
          const observables: Observable<any>[] = [];
          externalList.forEach( (external) => {
            observables.push(this.userService.getUserData(external.externalPersonnelDNI))
          })
          return forkJoin(observables)
        }
      )
    ).subscribe(
      {
        next: (externalDataList: any[]) => {
          console.log(externalDataList)
          this.externalDataList = externalDataList

        }
      }
    )
  }

  downloadLastRevision() {
    if(this.hasGraduateWorkReviewFile){
      console.log("downloadLastRevision()")
      console.log(this.currentGraduateWork)
      console.log(this.studentList)
      console.log(this.localUser)
      console.log(this.coordinatorData)
      this.graduateworkService.getAcademicTutorRevisionCount(this.currentGraduateWork.graduateWorkAcademicTutor,this.currentGraduateWork.graduateworkid).pipe(
        switchMap(
          (revisionNumber) => {
            this.revisionAcademicTutorCount = revisionNumber;
            return this.graduateworkService.getGraduateWorkStudentData(this.currentGraduateWork.graduateworkid)
          }
        ),
        switchMap(
          (studentList) => {
            console.log(studentList)
            this.studentList = studentList
            return this.userService.getUserData(this.currentGraduateWork.graduateWorkAcademicTutor)
            
          }
        ),
        switchMap(
          (academicTutorData) => {
            let formattedFileName;
            if(this.studentList.length > 1){
              if(this.revisionAcademicTutorCount == 1 || this.revisionAcademicTutorCount == 0){
                formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} ${this.studentList[1].userLastName.split(" ")[0]}${this.studentList[1].userFirstName.split(" ")[0]} TG Rev${academicTutorData.userFirstName.charAt(0)}${academicTutorData.userLastName.charAt(0)}.pdf`
              }else{
                formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} ${this.studentList[1].userLastName.split(" ")[0]}${this.studentList[1].userFirstName.split(" ")[0]} TG Rev${this.revisionAcademicTutorCount}${academicTutorData.userFirstName.charAt(0)}${academicTutorData.userLastName.charAt(0)}.pdf`
              }
            }else{
              if(this.revisionAcademicTutorCount == 1 || this.revisionAcademicTutorCount == 0){
                formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} TG Rev${academicTutorData.userFirstName.charAt(0)}${academicTutorData.userLastName.charAt(0)}.pdf`
              }else{
                formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} TG Rev${this.revisionAcademicTutorCount}${academicTutorData.userFirstName.charAt(0)}${academicTutorData.userLastName.charAt(0)}.pdf`
              }
            }
            return of(formattedFileName)
          }
        )
  
      ).subscribe({
        next: (result) => {
          console.log(result)
          downloadLastAcademicTutorRevision(result,{studentDNI: this.studentList[0].userDNI, userFirstName: this.studentList[0].userFirstName,userLastName: this.studentList[0].userLastName} )
        }
      })
    }else{
      this._snackBar.open("El tutor no ha cargado revisiones", "cerrar",{
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
    
  }
}/* FIN DE COMPONENTE */


