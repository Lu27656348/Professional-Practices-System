import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap, Observable, forkJoin } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { SchoolService } from 'src/app/services/school.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-generar-planilla-datos-tg',
  templateUrl: './generar-planilla-datos-tg.component.html',
  styleUrls: ['./generar-planilla-datos-tg.component.css']
})
export class GenerarPlanillaDatosTGComponent {

  empresaList: any = null;
  externalList: any = null;
  enterpriseSelected: boolean = false
  empresaSelected : any = null;
  userData: any = null;
  estudianteList: any = null
  professorList: any = null

  enterpriseData: any = null;
  externalPersonnelData: any = null;

  modalidadSelected: any = null
  caracterSelected: any = "INDIVIDUAL"
  studentList : any = null;

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  trabajoDeGradoForm = this.formBuilder.group({
    titulo: ['',Validators.required],
    modalidad: ['',Validators.required],
    alumno1: ['',Validators.required],
    alumno2: [''],
    tutorId: ['',Validators.required],
    empresaId: ['',Validators.required]
  });


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private professorService: ProfessorsService,
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private enterpriseService: EnterpriseService,
    private externalService: ExternalPersonnelService,
    private formService: EvaluationFormGeneratorService
  ){

    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      console.log(localUserData)
      this.userService.getUserData(localUserData.userDNI)
      .pipe(
        switchMap(
          (userData) => {
            this.userData = userData
            return this.studentService.getStudentBySchoolAndValidateGraduateWork(this.userData.schoolName)
          }
        ),
        switchMap(
          (studentList) => {
            console.log(studentList)
            this.studentList = studentList
            return this.studentService.getStudentsData()
          }
        )
      )
      .subscribe({
        next: (studentDataList) => {
          console.log(studentDataList)
          this.estudianteList = []
          studentDataList.forEach( (student:any) => {
            this.studentList.forEach( (estudiante:any) => {
              if (student.userDNI == estudiante.studentDNI){
                this.estudianteList.push(student)
              }
            })
          })
          console.log(this.estudianteList)
        }
      })
    }
    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseList) => {
        console.log(enterpriseList)
        this.empresaList = enterpriseList
      }
    })
    this.professorService.getProfessorsData()
    .pipe(
      switchMap(
        (professorList) => {
          console.log(professorList)
          this.professorList = professorList
          const observables: Observable<any>[] = []

          professorList.forEach( (profesor: any) => {
            observables.push(this.userService.getUserData(profesor.professorDNI))
          })

          return forkJoin(observables)
        }
      )
    )
    .subscribe({
      next: (professorDataList) => {
        console.log(professorDataList)
        this.professorList = professorDataList
      }
    })

  }

  onSelectionChange(){
    this.externalService.getExternalPersonnelByEnterpriseId(this.empresaSelected).pipe(
      switchMap(
        (externalList) => {
          console.log(externalList)
          const observables: Observable<any>[] = []
          externalList.forEach( (external: any) => {
            observables.push(this.userService.getUserData(external.externalPersonnelDNI))
          })
          return forkJoin(observables)
        }
      )
      
    ).subscribe({
      next: (externalList) => {
        console.log(externalList)
        this.externalList = externalList
      }
    })
  }

  generarPlanilla(){

  }
}
