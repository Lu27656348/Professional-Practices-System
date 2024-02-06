import { Component, OnInit } from '@angular/core';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { PlanillaEvaluacionTutorAcademicoComponent } from '../planilla-evaluacion-tutor-academico/planilla-evaluacion-tutor-academico.component';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { Criteria } from 'src/app/form-generator/interfaces/criteria';
import { of, switchMap } from 'rxjs';
import { Seccion } from 'src/app/form-generator/interfaces/seccion';
import { MatTableDataSource, MatTable } from '@angular/material/table';

export class Group {
  level: number = 0;
  parent: Group | null = null;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}


@Component({
  selector: 'app-planilla-evaluacion-tutor-empresarial',
  templateUrl: './planilla-evaluacion-tutor-empresarial.component.html',
  styleUrls: ['./planilla-evaluacion-tutor-empresarial.component.css']
})
export class PlanillaEvaluacionTutorEmpresarialComponent implements OnInit{

  
  data: Data[] = [
    {
      name: 'Nivel 1',
      children: [
        {
          name: 'Nivel 2-1',
          children: [
            {
              name: 'Nivel 3-1'
            },
            {
              name: 'Nivel 3-2'
            }
          ]
        },
        {
          name: 'Nivel 2-2'
        }
      ]
    }
  ]

  generarCriterios: boolean = false;
  graduateWorkSource: any[] = [ ]
  seccionMaxNotes: any[] = []
  totalSum: number = 0;
  areAllNotesSelected : boolean =  false;
  displayedColumns: string[] = ['criteria','0','1','2'];
  seccionList: any = null
  criteriaList: any = null

  constructor(private criteriosTutorEmpresarialService: CriteriosTutorEmpresarialService, private formGenerator: EvaluationFormGeneratorService){
    this.criteriosTutorEmpresarialService.getAllEnterpriseTutorSeccion().pipe(
      switchMap(
        (seccionList: any) => {
          console.log(seccionList);
          this.seccionList = seccionList
          return this.criteriosTutorEmpresarialService.getAllEnterpriseTutorCriteria()
        }

      )
    ).subscribe({
      next: (criteriaList: any) => {
        console.log(criteriaList);
        /* Agregamos los selectores */
  
        criteriaList.forEach( (element: any,index: number) => {
          criteriaList[index].selectedCheckBox = false;
          criteriaList[index].selectedCheckBoxIndex = null;
        });
      
        this.criteriaList = criteriaList;
        this.seccionList.forEach( (seccion: any, index: number) => {
          const array: any[] = []
          this.seccionMaxNotes.push(seccion.maxNote)
          this.criteriaList.forEach( (criteria: any) => {
            if(seccion.seccionId == criteria.seccionId){
              criteria.seccionName = seccion.seccionName
              array.push(criteria)
            }
          })
          this.graduateWorkSource.push(array)
        })
        console.log(this.graduateWorkSource)
        return this.criteriosTutorEmpresarialService.getAllEnterpriseTutorSeccion()
      }
    })

  }

  sumarNumeros(acumulador: number, elemento: any) {
    return acumulador + elemento.numero;
  }

  generarEvaluacionTutorEmpresarial(){
      console.log("generarEvaluacionTutorEmpresarial()")
      this.criteriosTutorEmpresarialService.getAllEnterpriseTutorCriteria().pipe(
        switchMap(
          (criteriaList) => {
            console.log(criteriaList)
            this.criteriaList = criteriaList
            return this.criteriosTutorEmpresarialService.getAllEnterpriseTutorSeccion()
          }
        )
      ).subscribe({
        next: (seccionList) => {
          console.log(seccionList)
          this.seccionList = seccionList
          const tableData = {
            nombreAlumno: "Somoza Ledezma, Luis Carlos",
            cedulaAlumno: "V-27656348",
            empresa: "Sidor",
            nombreTutor: "Medina, Luz Esperanza"
          }

          this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipCorporateTutorEvaluationForm(this.criteriaList,this.seccionList,tableData))
          
        }
      })
     
   
  }

  ngOnInit() {
  
  }

  ponderarCriterios(){
    this.generarCriterios = true
  }

  validateAllNotesSelected() : boolean{
    const  areAllSelected = this.graduateWorkSource.every((row:any)=> row.selectedCheckBox)
    return areAllSelected
  }

  onCheckboxChange(row: any, checkboxIndex: number) {
    console.log(row)
    console.log(this.graduateWorkSource)
    /* Lo primero que hacemos es ubicar elemento para saber en que fila estamos */
    this.graduateWorkSource.forEach ((elementRow: any, index: number) => {
      if(elementRow.criteriaId == row.criteriaId ){
        console.log("Estamos en el elemento " + index)
        if(this.graduateWorkSource[index].selectedCheckBox == false){
          console.log("No he marcado la fila todavia")
          this.totalSum = this.totalSum + checkboxIndex;
          this.graduateWorkSource[index].selectedCheckBoxIndex = checkboxIndex;
          this.graduateWorkSource[index].selectedCheckBox = true
        }else{
          if(this.graduateWorkSource[index].selectedCheckBoxIndex === checkboxIndex){
            console.log("estoy marcando la casilla anterior")
            this.totalSum = this.totalSum - checkboxIndex;
            this.graduateWorkSource[index].selectedCheckBox = false;
            this.graduateWorkSource[index].selectedCheckBoxIndex = null;
          }else{
            console.log("ya habia marcado la fila y ahora actualizo el valor")
            this.totalSum = this.totalSum - this.graduateWorkSource[index].selectedCheckBoxIndex
            this.totalSum = this.totalSum + checkboxIndex;
            this.graduateWorkSource[index].selectedCheckBoxIndex = checkboxIndex;

          }
          
        }
      }
    })
    this.areAllNotesSelected = this.validateAllNotesSelected()
}

generarPlanilla(){
  console.log("generarPlanilla")
  console.log(this.totalSum)
  this.criteriosTutorEmpresarialService.getAllEnterpriseTutorSeccion().pipe(
    switchMap( 
      (seccionList) => {
        this.seccionList = seccionList
        return this.criteriosTutorEmpresarialService.getAllEnterpriseTutorCriteria()
      }
    ),
    switchMap( 
      (criteriaArray: Criteria[]) => {
        console.log(criteriaArray)
        //this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipCorporateTutorEvaluationForm(criteriaArray,this.seccionList as Seccion[]))
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

class Data {
  name: string = '';
  children?: Data[] = [];
}
