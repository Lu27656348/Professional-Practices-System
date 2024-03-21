import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap, of } from 'rxjs';
import { Criteria } from 'src/app/form-generator/interfaces/criteria';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { EditCorporativeTutorCriteriaComponent } from '../corporative-tutor-criteria/dialogs/edit-corporative-tutor-criteria/edit-corporative-tutor-criteria.component';
import { EditCorporativeTutorSeccionComponent } from '../corporative-tutor-criteria/dialogs/edit-corporative-tutor-seccion/edit-corporative-tutor-seccion.component';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { UsersService } from 'src/app/services/users.service';
import { CreateAcademicTutorCriteriaComponent } from './dialogs/create-academic-tutor-criteria/create-academic-tutor-criteria.component';
import { CreateAcademicTutorSeccionComponent } from './dialogs/create-academic-tutor-seccion/create-academic-tutor-seccion.component';
import { EditAcademicTutorCriteriaComponent } from './dialogs/edit-academic-tutor-criteria/edit-academic-tutor-criteria.component';

@Component({
  selector: 'app-academic-tutor-criteria',
  templateUrl: './academic-tutor-criteria.component.html',
  styleUrls: ['./academic-tutor-criteria.component.css']
})
export class AcademicTutorCriteriaComponent {
  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria','deshabilitar'];
  dataSource: any = null

  seccionList: SeccionInterface[] = []
  criteriaList: any[] = []

  userData: any = null

  seccionSum: number = 0

  constructor(
    private corporateCriteriaService: CriteriosTutorAcademicoService, 
    private dialog: MatDialog,
    private formGenerator: EvaluationFormGeneratorService,
    private userService: UsersService
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI)
      .pipe(
        switchMap(
          (userData) => {
            this.userData = userData;
            return this.corporateCriteriaService.getAllAcademicTutorSeccionBySchool(this.userData.schoolName)
          }
        ),
        switchMap(
          (seccionList) => {
            console.log(seccionList)
            this.seccionList = seccionList
            this.seccionList.filter( (seccion:any) => seccion.status == true).forEach( (seccion:any) => {
              this.seccionSum = this.seccionSum + seccion.maxNote
            })
            this.dataSource = new MatTableDataSource(seccionList)
            return this.corporateCriteriaService.getAllAcademicTutorCriteriaBySchool(this.userData.schoolName)
          }
        )
      )
      .subscribe({
        next: (result) => {
          console.log(result)
          this.criteriaList = result
        }
      })
    }  
  }
  ngOnInit(): void {
  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditCriteriaDialog(data: any) {
    console.log(data)
    const dialogRef = this.dialog.open(EditAcademicTutorCriteriaComponent,{
      width: '60%', 
      data: data
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
     
  }

  openEditSeccionDialog(data: any) {
    console.log(data)
    const dialogRef = this.dialog.open(EditCorporativeTutorSeccionComponent,{
      width: '60%',
      data: data
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
  
    });

  
     
  }

  openCreateSeccionDialog(){
    const dialogRef = this.dialog.open(CreateAcademicTutorSeccionComponent,{
      width: '60%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
  
    });
  }

  generarPlanilla(){
    this.corporateCriteriaService.getAllAcademicTutorSeccionBySchool(this.userData.schoolName).pipe(
      switchMap( 
        (seccionList) => {
          this.seccionList = seccionList
          return this.corporateCriteriaService.getAllAcademicTutorCriteriaBySchool(this.userData.schoolName)
        }
      ),
      switchMap( 
        (criteriaArray: Criteria[]) => {
          console.log(criteriaArray)
          const data = {
            nombreAlumno: "",
            cedulaAlumno: "",
            empresa: "",
            nombreTutor: ""
          }
          this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipAcademicTutorEvaluationForm(criteriaArray.filter( (seccion: any) => seccion.status == true),this.seccionList.filter( (seccion: any) => seccion.status == true),data),"Evaluación Pasantía Tutor Académico")
          return of("todo bien")
        }
      ),
    )
    .subscribe({
      next: (result) => {
          
      }
  })
    
  }

  deshabilitarSeccion(element: any){
    //this.corporateCriteriaService.changeEnterpriseTutorSeccionStatus()
    console.log("deshabilitarSeccion")
    console.log(element)
    this.corporateCriteriaService.changeAcademicTutorSeccionStatus(element.seccionId, !element.status)
    .subscribe({
      next: (result) => {
        console.log(result)
      },
      complete: () => {
        window.location.href = window.location.href
      }
    })

  }
}
