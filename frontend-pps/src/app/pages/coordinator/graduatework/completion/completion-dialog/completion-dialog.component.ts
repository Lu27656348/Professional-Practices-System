import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, Observable, forkJoin } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-completion-dialog',
  templateUrl: './completion-dialog.component.html',
  styleUrls: ['./completion-dialog.component.css']
})
export class CompletionDialogComponent {

  graduateWorkForm: any = null;
  currentFile: any = null
  inputdata: any = null;
  councilList: any = []
  selectedDateVar: any = null
  selectedDateValue: any = null;

  councilSelected: any = null;
  studentList: any;
  enterpriseList: any;
  professorData: any;
  professorList: any;

  constructor(
    private formBuilder: FormBuilder,
    private externalService: ExternalPersonnelService,
    private studentService: StudentService,
    private professorService: ProfessorsService, 
    private enterpriseService: EnterpriseService, 
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private graduateWorkService: GraduateworkService,
    private documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.graduateWorkForm = this.formBuilder.group({
      file: ['',Validators.required]
    })

    this.inputdata = this.data
    console.log(this.inputdata)

    
  }

  culminarTrabajoDeGrado(){
    this.graduateWorkService.changeStatus(this.inputdata.proposal[0].graduateworkid,100).subscribe({
      next: (result) => {
        console.log(result)
      },
      complete: () => {
        window.location.href = window.location.href
      }
    })
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
    }
  }
}
