import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule,FormGroup } from '@angular/forms';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { switchMap,of} from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';
import { DocumentService } from 'src/app/services/document.service';
@Component({
  selector: 'app-resubmittion',
  templateUrl: './resubmittion.component.html',
  styleUrls: ['./resubmittion.component.css']
})
export class ResubmittionComponent {

  form =  this.formBuilder.group({
    file: ['',[Validators.required]],
    comments: ['']
  }) 

  currentFile?: File;
  fileName = 'Select File';
  comments: string = '';
  inputdata: any = null;
  localUser: any = null;
  coordinatorData: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder, private graduateWorkService: GraduateworkService, private studentService: StudentService, private userService: UsersService, private documentService: DocumentService){
    this.inputdata = this.data
    console.log(this.inputdata)
    const userString = localStorage.getItem('user');
    const rolesString = localStorage.getItem('roles');

    if(userString && rolesString){

      /* En el caso de que tengamos una cuenta iniciada, primero extraemos los datos del
         usuario para poder realizar las operaciones */

      console.log("LOCAL STORAGE")
      this.localUser = JSON.parse(userString);
    }
  }

  reenviarPropuesta(){
    console.log("reenviarPropuesta()")
    if(this.currentFile){
      if(this.currentFile.type === "application/pdf"){
        this.graduateWorkService.changeStatus(this.inputdata.graduatework.graduateworkid,11).pipe(
          switchMap ( () => {
            return this.studentService.getStudentCoordinator(this.inputdata.user[0].userDNI)
   
          }),
          switchMap ( (coordinatorBasicData) => {
            return this.userService.getUserData(coordinatorBasicData.professordni)
          }),
          switchMap ( (coordinatorData) => {
            this.coordinatorData = coordinatorData;
        
            return this.graduateWorkService.getCoordinatorEvaluationCount(this.inputdata.graduatework.graduateworkid)
            //return this.documentService.copyFileAndRename(this.currentFile as File,)
            //return this.graduateWorkService.uploadProposalCoordinatorEvaluationFile(this.currentFile as File,this.inputdata.user,coordinatorData)
          }),
          switchMap ( (result) => {
            let formattedFileName;
            let revisionFormat;
            if(result === 1){
              revisionFormat = `Rev${this.coordinatorData.userFirstName.charAt(0)}${this.coordinatorData.userLastName.charAt(0)}`
            }else{
              revisionFormat = `Rev${result}${this.coordinatorData.userFirstName.charAt(0)}${this.coordinatorData.userLastName.charAt(0)}`
            }
            if(this.inputdata.user.length > 1){
              formattedFileName = `${this.inputdata.user[0].userLastName.split(" ")[0]}${this.inputdata.user[0].userFirstName.split(" ")[0]} ${this.inputdata.user[1].userLastName.split(" ")[0]}${this.inputdata.user[1].userFirstName.split(" ")[0]} PTG ${revisionFormat}.pdf`
            }else{
              formattedFileName =  `${this.inputdata.user[0].userLastName.split(" ")[0]}${this.inputdata.user[0].userFirstName.split(" ")[0]} PTG ${revisionFormat}.pdf`
            }
            console.log(formattedFileName)
            return this.documentService.copyFileAndRename(this.currentFile as File, formattedFileName)

            return of("todo bien");
            return this.graduateWorkService.generateCoordinatorEvaluation({
              professorDNI : this.localUser.userDNI,
              graduateWorkId : this.inputdata.graduatework.graduateworkid,
              revisionResult : 'PENDIENTE',
              coordinatorComments : (this.form.valid) ? this.form.value.comments as string : 'Sin comentarios'
            })
   
          }),
          switchMap ( (newFile) => {
            return this.graduateWorkService.uploadProposalCoordinatorEvaluationFile(newFile as File,this.inputdata.user,this.coordinatorData)
          }),
          switchMap ( (result) => {
            console.log(result)
            return this.graduateWorkService.generateCoordinatorEvaluation({
              professorDNI : this.localUser.userDNI,
              graduateWorkId : this.inputdata.graduatework.graduateworkid,
              revisionResult : 'PENDIENTE',
              coordinatorComments : (this.form.valid) ? this.form.value.comments as string : 'Sin comentarios'
            })
          }),
          
        ).subscribe({
          next: (result) => {
            console.log(result)
            //window.location.href = window.location.href 
          },
          complete: () => {
            window.location.href = window.location.href 
          }
        })
      }else{
        console.log("Error en seleccion de archivo")
      }
    }else{
      console.log("No ha seleccionado archivo")
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    }
  }


}
