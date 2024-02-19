import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { of, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { EditCorporativeTutorCriteriaComponent } from './dialogs/edit-corporative-tutor-criteria/edit-corporative-tutor-criteria.component';
import { EditCorporativeTutorSeccionComponent } from './dialogs/edit-corporative-tutor-seccion/edit-corporative-tutor-seccion.component';
import { Criteria } from 'src/app/form-generator/interfaces/criteria';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { Seccion } from 'src/app/form-generator/interfaces/seccion';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';

interface SeccionInterface {
  maxNote: number,
  seccionId: number,
  seccionName: string
}

@Component({
  selector: 'app-corporative-tutor-criteria',
  templateUrl: './corporative-tutor-criteria.component.html',
  styleUrls: ['./corporative-tutor-criteria.component.css']
})
export class CorporativeTutorCriteriaComponent implements OnInit{
  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria'];
  dataSource: any = null

  seccionList: SeccionInterface[] = []
  criteriaList: any[] = []

  constructor(private corporateCriteriaService: CriteriosTutorEmpresarialService, private dialog: MatDialog,private formGenerator: EvaluationFormGeneratorService){

    this.corporateCriteriaService.getAllEnterpriseTutorSeccion()
    .pipe(
      switchMap(
        (seccionList) => {
          console.log(seccionList)
          this.seccionList = seccionList
          this.dataSource = new MatTableDataSource(seccionList)
          return this.corporateCriteriaService.getAllEnterpriseTutorCriteria()
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
    this.corporateCriteriaService.getAllEnterpriseTutorSeccion().pipe(
      switchMap( 
        (seccionList) => {
          this.seccionList = seccionList
          return this.corporateCriteriaService.getAllEnterpriseTutorCriteria()
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
          this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipCorporateTutorEvaluationForm(criteriaArray,this.seccionList,data))
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
