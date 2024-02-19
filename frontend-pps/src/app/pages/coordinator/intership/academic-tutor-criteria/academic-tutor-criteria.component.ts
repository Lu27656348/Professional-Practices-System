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

@Component({
  selector: 'app-academic-tutor-criteria',
  templateUrl: './academic-tutor-criteria.component.html',
  styleUrls: ['./academic-tutor-criteria.component.css']
})
export class AcademicTutorCriteriaComponent {
  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria'];
  dataSource: any = null

  seccionList: SeccionInterface[] = []
  criteriaList: any[] = []

  constructor(private corporateCriteriaService: CriteriosTutorAcademicoService, private dialog: MatDialog,private formGenerator: EvaluationFormGeneratorService){

    this.corporateCriteriaService.getAllAcademicTutorSeccion()
    .pipe(
      switchMap(
        (seccionList) => {
          console.log(seccionList)
          this.seccionList = seccionList
          this.dataSource = new MatTableDataSource(seccionList)
          return this.corporateCriteriaService.getAllAcademicTutorCriteria()
        }
      )
    )
    .subscribe({
      next: (criteriaList) => {
        console.log(criteriaList)
        this.criteriaList = criteriaList
      }
    })
    
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
    const dialogRef = this.dialog.open(EditCorporativeTutorCriteriaComponent,{
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

  generarPlanilla(){
    this.corporateCriteriaService.getAllAcademicTutorSeccion().pipe(
      switchMap( 
        (seccionList) => {
          this.seccionList = seccionList
          return this.corporateCriteriaService.getAllAcademicTutorCriteria()
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
          this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipAcademicTutorEvaluationForm(criteriaArray,this.seccionList,data))
          return of("todo bien")
        }
      ),
    )
    .subscribe({
      next: (result) => {
          
      }
  })
    
  }
}
