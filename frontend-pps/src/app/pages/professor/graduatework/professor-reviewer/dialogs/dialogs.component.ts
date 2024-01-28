import { Component, OnInit,Inject } from '@angular/core';

import { forkJoin, of, switchMap } from 'rxjs';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog'

import { GraduateworkService } from '../../../../../services/graduatework.service'
import { StudentService } from '../../../../../services/student.service'

import { ResponseBlob } from '../../../../../interfaces/ResponseBlob'
import { environment } from 'src/environments/environment';

import { EvaluationDialogComponent } from './evaluation-dialog/evaluation-dialog.component';
import { UsersService } from 'src/app/services/users.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';

async function downloadFile(fileName: string,studentDNI: string, userFirstName: string, userLastName: string) {
  try {
    const response = await fetch(`${environment.amazonS3}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName,studentDNI: studentDNI, userFirstName: userFirstName, userLastName: userLastName})
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
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent {
  inputdata: any;
  coordinatorData: any = {};
  studentCount: number = 0;
  academicTutorData: any = null;
  enterpriseData: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService, private studentService: StudentService,private dialog: MatDialog, private userService: UsersService, private enterpriseService: EnterpriseService){
    this.inputdata = this.data
    this.studentCount = this.inputdata.user.length
    console.log(this.inputdata)
    console.log(this.studentCount)
    this.studentService.getStudentCoordinator(this.inputdata.user[0].userDNI).pipe(
      switchMap(
        (result) => {
          console.log(result)
          return this.userService.getUserData(result.professordni)
        }
      ),
      switchMap(
        (result) => {
          console.log(result)
          this.coordinatorData = result;
          return this.userService.getUserData(this.inputdata.graduatework.graduateWorkAcademicTutor)
        }
      ),
      switchMap(
        (result) => {

          this.academicTutorData = result;
          console.log(this.academicTutorData)
          return of("hola")
        }
      ),
    ).subscribe({
      next: (result) => {
        console.log(result)
      }
    });

  }
  ngOnInit(){

    this.enterpriseService.getEnterpriseById(this.inputdata.graduatework.graduateWorkEnterprise).subscribe({
      next: (result) => {
        this.enterpriseData = result
        console.log(this.enterpriseData)
      }
    })
  
  }

  obtenerPlanillaEvaluacion(){
    console.log("obtenerPlanillaEvaluacion()")
  }

  obtenerInformePropuesta(){
    let fileName;
    if(this.studentCount > 1){
      fileName = `${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]} PTG.pdf`;
    }else{
      fileName = `${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} PTG.pdf`
    }
    console.log(fileName);
    downloadFile(fileName,this.inputdata.user[0].userDNI,this.inputdata.user[0].userFirstName.split(" ")[0],this.inputdata.user[0].userLastName.split(" ")[0]);
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
  openReviewerEvaluationDialog(){
    const dialogRef = this.dialog.open(EvaluationDialogComponent,{
      width: '60%',
      data: this.inputdata
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
