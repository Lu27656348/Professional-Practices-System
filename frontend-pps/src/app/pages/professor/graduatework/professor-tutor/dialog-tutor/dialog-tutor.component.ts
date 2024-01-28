import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GraduateworkService } from '../../../../../services/graduatework.service';
import { UsersService } from '../../../../../services/users.service';
import { StudentService  } from '../../../../../services/student.service'
import { ResponseBlob } from 'src/app/interfaces/ResponseBlob';
import { environment } from 'src/environments/environment';
import { of, switchMap } from 'rxjs';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { DocumentService } from 'src/app/services/document.service';

async function downloadFile(fileName: string, studentDNI: string, userFirstName: string, userLastName: string) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/graduatework`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName,studentDNI: studentDNI, userFirstName: userFirstName, userLastName: userLastName })
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
  selector: 'app-dialog-tutor',
  templateUrl: './dialog-tutor.component.html',
  styleUrls: ['./dialog-tutor.component.css']
})
export class DialogTutorComponent implements OnInit{

  currentFile: any = null
  fileName: string = "";

  inputdata: any = null;
  coordinatorData: any = null;
  studentData: any = null;
  graduateWorkData: any = null;
  studentCount: number = 0;
  studentList: any = null;
  enterpriseData: any = null;
  academicTutorData: any = null;

  constructor(private graduateWorkService: GraduateworkService, private userService: UsersService,@Inject(MAT_DIALOG_DATA) public data: any, private studentService: StudentService, private enterpriseService: EnterpriseService, private documentService: DocumentService){
    
    this.inputdata = this.data
    console.log(this.inputdata.revisionData)

    this.studentService.getStudentCoordinator(this.inputdata.revisionData.studentDNI).subscribe({
      next: (coordinatorData) => {
        console.log(coordinatorData)
        this.userService.getUserData(coordinatorData.professordni).subscribe({
          next: (coordinatorData) => {
            console.log(coordinatorData)
            this.coordinatorData = coordinatorData
          }
        })
      }
    });

    

    this.userService.getUserData(this.inputdata.revisionData.studentDNI).subscribe({
      next: (studentData) => {
        console.log(studentData);
        this.studentData = studentData;
      }
    })

    this.graduateWorkService.getGraduateWorkById(this.inputdata.revisionData.graduateWorkId).pipe(
      switchMap(
        (graduateWorkData) => {
          this.graduateWorkData = graduateWorkData;
          console.log(this.graduateWorkData )
          return this.enterpriseService.getEnterpriseById(this.graduateWorkData.graduateWorkEnterprise)
        }
      ),
      switchMap(
        (enterpriseData) => {
          this.enterpriseData = enterpriseData
          console.log(this.enterpriseData)
          return this.graduateWorkService.getGraduateWorkStudentData(this.graduateWorkData.graduateworkid)
        }
      ),
    ).subscribe({
      next: (studentList) => {
        this.studentCount = studentList.length
        console.log(this.studentCount)
        this.studentList = studentList
        console.log(this.studentList)
      }
    })
  }

  ngOnInit(){

  }
  obtenerInformeTrabajoDeGrado(){
    console.log("obtenerInformeTrabajoDeGrado()")
    console.log(this.studentList)
    let fileName;
    if(this.studentCount > 1){
      fileName = `${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} ${this.studentList[1].userLastName.split(' ')[0]}${this.studentList[1].userFirstName.split(' ')[0]} TG.pdf`
    }else{
      fileName = `${this.studentList[0].userLastName.split(' ')[0]}${this.studentList[0].userFirstName.split(' ')[0]} TG.pdf`
    }
    downloadFile(fileName,this.studentList[0].userDNI, this.studentList[0].userFirstName, this.studentList[0].userLastName);

  }

  validateRevisionFileName(fileName: string) : boolean {
    const fileNameWithOutExtension = fileName.slice(0, fileName.lastIndexOf('.pdf'));
    const regexValidator = /^[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+(\s?[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+)?\s(PTG|TG|Pasantía|SC|Propuesta\sPasantía|Propuesta\sSC)\sRev[A-Z]{2}$/;
    return regexValidator.test(fileNameWithOutExtension);
  }

  validateFileNameFormat(fileName: string) : boolean {
    const fileNameWithOutExtension = fileName.slice(0, fileName.lastIndexOf('.pdf'));
    if(fileNameWithOutExtension === `${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} TG Rev${this.coordinatorData.userFirstName}${this.coordinatorData.userLastName}`){
      return true
    }
    return false
  }

  fileHandler(event: any){
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    }

  }

  uploadRevision(){

    if(this.currentFile){
      console.log(this.studentList)
      console.log(this.inputdata.tutorData.userDNI);
      this.userService.getUserData(this.inputdata.tutorData.userDNI).pipe(
        switchMap(
          (academicTutorData) => {
            console.log(academicTutorData)
            this.academicTutorData = academicTutorData;
            return this.graduateWorkService.getAcademicTutorGraduateWorksCount(this.inputdata.tutorData.userDNI,this.graduateWorkData.graduateworkid)
          }
        ),
        switchMap(
          (revisionNumber) =>{
            let formattedFileName;
            let formattedRevision;
            if(revisionNumber == 0 || revisionNumber == 1){
              formattedRevision = `Rev${this.academicTutorData.userFirstName.charAt(0)}${this.academicTutorData.userLastName.charAt(0)}`;
            }else{
              formattedRevision = `Rev${revisionNumber}${this.academicTutorData.userFirstName.charAt(0)}${this.academicTutorData.userLastName.charAt(0)}`;
            }
            if(this.studentList.length > 1) {
              formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} ${this.studentList[1].userLastName.split(" ")[0]}${this.studentList[1].userFirstName.split(" ")[0]} TG ${formattedRevision}.pdf`
            }else{
              formattedFileName = `${this.studentList[0].userLastName.split(" ")[0]}${this.studentList[0].userFirstName.split(" ")[0]} TG ${formattedRevision}.pdf`
            }
            console.log(revisionNumber)
            console.log(formattedFileName)
            return this.documentService.copyFileAndRename(this.currentFile,formattedFileName)
          }
        ),
        switchMap(
          (newFile) => {
            console.log(newFile);
            return this.graduateWorkService.uploadRevision(newFile as File, this.studentList)
          }
        ),
        switchMap(
          (uploadRevisionResult) => {
            console.log(uploadRevisionResult);
            console.log(this.academicTutorData)
            console.log(this.graduateWorkData)
            return this.graduateWorkService.approveAcademicTutorRevision(this.academicTutorData.userDNI,this.graduateWorkData.graduateworkid)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
          
        },
        complete: ()=>{
          window.location.href = window.location.href
        }
      })
      /*
      this.documentService.copyFileAndRename(this.currentFile,"Hola.pdf").pipe(
        switchMap(
          (data) => {
            return of(data)
          }
        )
      )
      */
      /*
      this.graduateWorkService.uploadRevision(this.currentFile as File).subscribe({
        next: (data) => {
          console.log(data)
        },
        error: (error) => {
          console.log(error)
        }
      })
      */
    }else{
      alert("No ha cargado un archivo")
    }

    /*
    const fileNameWithOutExtension = this.fileName.slice(0, this.fileName.lastIndexOf('.pdf'));
    console.log(`${this.studentData.userLastName.split(" ")[0]}${this.studentData.userFirstName.split(" ")[0]} TG Rev${this.coordinatorData.userFirstName.charAt(0)}${this.coordinatorData.userLastName.charAt(0)}`)
    if(this.validateRevisionFileName(this.fileName) && this.validateRevisionFileName(this.fileName)){
      console.log(this.currentFile)
      this.graduateWorkService.uploadRevision(this.currentFile as File).subscribe({
        next: (data) => {
          console.log(data)
        },
        error: (error) => {
          console.log(error)
        }
      })
    }else{
      alert("El archivo no tiene el formato correcto [ApellidoEstudiante][NombreEstudiante] TG Rev[PrimeraLetraDePrimerNombre][rimeraLetraDePrimerApellido], ejemplo: SomozaLuis TG RevLM")
    }
    */
    
  }

}
