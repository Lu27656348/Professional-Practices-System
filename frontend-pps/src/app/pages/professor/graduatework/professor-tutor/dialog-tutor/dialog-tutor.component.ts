import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GraduateworkService } from '../../../../../services/graduatework.service';
import { UsersService } from '../../../../../services/users.service';
import { StudentService  } from '../../../../../services/student.service'

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

  constructor(private graduateWorkService: GraduateworkService, private userService: UsersService,@Inject(MAT_DIALOG_DATA) public data: any, private studentService: StudentService){
    
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
  }

  ngOnInit(){

  }
  obtenerInformeTrabajoDeGrado(){
    console.log("obtenerInformeTrabajoDeGrado()")
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
    
  }

}
