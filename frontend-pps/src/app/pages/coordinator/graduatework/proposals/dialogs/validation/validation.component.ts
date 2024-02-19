import { Component, OnInit,Inject } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog'

import { GraduateworkService } from '../../../../../../services/graduatework.service';
import { StudentService } from '../../../../../../services/student.service';
import { UsersService } from '../../../../../../services//users.service';
import { EnterpriseService } from '../../../../../../services/enterprise.service'
import { environment  } from 'src/environments/environment';
import { ResubmittionComponent } from '../resubmittion/resubmittion.component';

//import { PlanillaPropuestaTEG } from '../../../../../../form-generator/classes/planillaPropuestaTEG'
import { TegFormService } from 'src/app/form-generator/services/teg-form.service';

// Interface for the request body
interface ValidateFileNameRequest {
  fileName: string;
}

// Generic type for the response with a blob body
interface ResponseBlob<T> extends Response {
  blob(): Promise<Blob>;
}

async function downloadFile(fileName: string, studentDNI: string | null, userFirstName: string | null, userLastName: string | null) {
  try {
    const response = await fetch(`${environment.amazonS3}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        fileName: fileName,
        studentDNI: studentDNI,
        userFirstName: userFirstName,
        userLastName: userLastName
      })
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
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit{

  inputdata: any;
  proposalFileList: any = [];
  coordinatorData: any = {};
  enterpriseData: any = {};
  isGrupal: boolean = false;
  cargadoArchivos: boolean = false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService, private studentService: StudentService,private userService: UsersService, private enterpriseService: EnterpriseService, private dialog: MatDialog, private tegFormService: TegFormService){

  }
  ngOnInit(){
    this.inputdata = this.data
    console.log(this.inputdata)
    console.log(this.inputdata.user.length)
    if(this.inputdata.user.length > 1){
      this.isGrupal = true;
    }

    this.studentService.getStudentCoordinator(this.inputdata.user[0].userDNI).subscribe({
      next: (data) => {
        console.log(data);
        this.userService.getUserData(data.professordni).subscribe({
          next: (data) => {
            console.log(data);
            this.coordinatorData = data;
          }
        })
      }
    })

    this.enterpriseService.getEnterpriseById(this.inputdata.graduatework.graduateWorkEnterprise).subscribe({
      next: (data) => {
        console.log(data);
        this.enterpriseData = data;
      }
    })
    
  }

  obtenerPlanillaSolicitud(){
    console.log("obtenerPlanillaSolicitud()")
    this.tegFormService.generateDocx({
      fecha_envio: new Date() as Date,
      titulo: "Sistema de Practicas Profesionales",
      
    });
  }

  obtenerInformePropuesta(){
    let fileName: string = ""
    if(this.inputdata.user.length > 1){
      fileName = `${this.inputdata.user[0].userLastName.split(' ')[0]}${this.inputdata.user[0].userFirstName.split(' ')[0]} ${this.inputdata.user[1].userLastName.split(' ')[0]}${this.inputdata.user[1].userFirstName.split(' ')[0]} PTG.pdf`;
    }else{
      fileName = this.inputdata.user[0].userLastName.split(' ')[0]+this.inputdata.user[0].userFirstName.split(' ')[0]+' PTG.pdf';
    }
    
    console.log(fileName);
    downloadFile(fileName,this.inputdata.user[0].userDNI, this.inputdata.user[0].userFirstName.split(' ')[0],this.inputdata.user[0].userLastName.split(' ')[0]);
  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
      this.cargadoArchivos = true;
      this.graduateWorkService.changeStatus(this.inputdata.proposal.graduateworkid,20)
      .pipe(
        switchMap(
          (result) => {

            return this.graduateWorkService.approveCoordinatorEvaluation(this.coordinatorData.userDNI,this.inputdata.proposal.graduateworkid)
    
          }
        )
      )
      .subscribe({
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
    }else if (decision === 'rechazar'){
      this.graduateWorkService.changeStatus(this.inputdata.proposal.graduateworkid,400).subscribe({
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
    }else{
      console.log("Iniciar Funcion de Reenvio de Trabajo de Grado ()")
      console.log(this.inputdata)
      const dialogRef = this.dialog.open(ResubmittionComponent,{
        width: '60%',
        data: this.inputdata
      })

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

    }
  }
} 
