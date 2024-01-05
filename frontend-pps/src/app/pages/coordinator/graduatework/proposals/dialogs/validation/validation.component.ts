import { Component, OnInit,Inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GraduateworkService } from '../../../../../../services/graduatework.service'
import { StudentService } from '../../../../../../services/student.service'
// Interface for the request body
interface ValidateFileNameRequest {
  fileName: string;
}

// Generic type for the response with a blob body
interface ResponseBlob<T> extends Response {
  blob(): Promise<Blob>;
}

async function downloadFile(fileName: string) {
  try {
    const response = await fetch('http://localhost:8082/download', {
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
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit{
  inputdata: any;
  proposalFileList: any = [];
  coordinatorData: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService, private studentService: StudentService){
    
  }
  ngOnInit(){
    this.inputdata = this.data
    console.log( this.inputdata)
    this.studentService.getStudentCoordinator(this.inputdata.user.userDNI).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
    this.graduateWorkService.listProposalFiles().subscribe({
      next: (data) => {
        console.log(data);

      }
    })
  }

  obtenerPlanillaSolicitud(){
    console.log("obtenerPlanillaSolicitud()")
  }

  obtenerInformePropuesta(){
    const fileName: string = this.inputdata.user.userLastName.split(' ')+this.inputdata.user.userFirstName.split(' ')+' PTG.pdf';
    console.log(fileName);
    downloadFile(fileName);
  }

  veredictoPropuesta(decision: string){
    console.log("veredictoPropuesta() -> " + decision)
    if(decision === 'aprobar'){
      this.graduateWorkService.changeStatus(this.inputdata.proposal[0].graduateworkid,20).subscribe({
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
} 
