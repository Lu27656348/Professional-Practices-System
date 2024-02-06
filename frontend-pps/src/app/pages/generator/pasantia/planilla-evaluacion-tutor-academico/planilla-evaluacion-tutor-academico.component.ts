import { Component } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';

@Component({
  selector: 'app-planilla-evaluacion-tutor-academico',
  templateUrl: './planilla-evaluacion-tutor-academico.component.html',
  styleUrls: ['./planilla-evaluacion-tutor-academico.component.css']
})
export class PlanillaEvaluacionTutorAcademicoComponent {

  criteriaList: any = null;
  seccionList: any = null;

  constructor(private formGenerator: EvaluationFormGeneratorService, private criteriosTutorAcademicoService: CriteriosTutorAcademicoService){

  }
/*
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
  */
  generarEvaluacionTutorAcademico(){
    console.log("generarEvaluacionTutorAcademico()")
    this.criteriosTutorAcademicoService.getAllAcademicTutorCriteria().pipe(
      switchMap(
        (criteriaList) => {
          console.log(criteriaList)
          this.criteriaList = criteriaList
          return this.criteriosTutorAcademicoService.getAllAcademicTutorSeccion()
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
        this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipAcademicTutorEvaluationForm(this.criteriaList,this.seccionList,tableData));
      }
    })
   
    
  }
}
