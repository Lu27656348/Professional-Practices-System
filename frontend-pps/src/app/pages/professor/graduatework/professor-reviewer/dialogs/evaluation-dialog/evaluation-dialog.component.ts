import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GraduateworkService } from 'src/app/services/graduatework.service';
import {FormBuilder, FormsModule, ReactiveFormsModule,FormGroup,FormControl} from '@angular/forms';
import { switchMap,Observable, of,forkJoin} from 'rxjs';
interface Criteria {
  reviewerCriteriaId: number;
  reviewerCriteriaDescription: string
}

@Component({
  selector: 'app-evaluation-dialog',
  templateUrl: './evaluation-dialog.component.html',
  styleUrls: ['./evaluation-dialog.component.css']
})
export class EvaluationDialogComponent {
  inputdata: any;
  criteriaList: any = null;
  reviewerCriteriaIdList: any[] = [];
  selectedValues: any[] = [];
  reviewerDNI: string | null = null;
  criteriaForm = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService,private formGroup: FormBuilder ){
    this.inputdata = this.data
    console.log(this.inputdata)

    this.graduateWorkService.getGraduateWorkReviewer(this.inputdata.graduatework.graduateworkid)
    .pipe(
      switchMap(
        (reviewerDNI) => {
          this.reviewerDNI = reviewerDNI.professorDNI;
          return this.graduateWorkService.getReviewerEvaluationCriteria({
            graduateWorkId: this.inputdata.graduatework.graduateworkid,
            professorDNI: reviewerDNI.professorDNI as string
          })
        }
      )
    ) 
    .subscribe({
      next: (graduateWorkCriteriaList) => {
        this.criteriaList = graduateWorkCriteriaList;
        console.log(this.criteriaList);
        this.criteriaList.forEach((item: Criteria) => {
          this.reviewerCriteriaIdList.push(item.reviewerCriteriaId)
          this.criteriaForm.addControl(item.reviewerCriteriaId.toString(), new FormControl(false)); // Assuming initial value is false
        });
      }
    })
    
  }

arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  // Check for length equality
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Compare elements using a for loop and strict equality (===)
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // If all elements match, return true
  return true;
}
  
diferenciaArreglos<T>(arr1: T[], arr2: T[]): T[] {
  const diferencia: T[] = [];

  // Iterar sobre el primer arreglo
  for (const elemento1 of arr1) {
    // Buscar el elemento en el segundo arreglo
    const indiceEncontrado = arr2.indexOf(elemento1);

    // Si no se encuentra, agregarlo a la diferencia
    if (indiceEncontrado === -1) {
      diferencia.push(elemento1);
    }
  }

  // Iterar sobre el segundo arreglo
  for (const elemento2 of arr2) {
    // Buscar el elemento en el primer arreglo
    const indiceEncontrado = arr1.indexOf(elemento2);

    // Si no se encuentra, agregarlo a la diferencia
    if (indiceEncontrado === -1) {
      diferencia.push(elemento2);
    }
  }

  return diferencia;
}

  submitEvaluation(){
    console.log("submitEvaluation()")
    console.log(this.reviewerCriteriaIdList)
    console.log(this.selectedValues)
    if(this.arraysAreEqual(this.reviewerCriteriaIdList,this.selectedValues)){
      console.log("Selecciono todos los criterios")
      this.graduateWorkService.approveReviewerEvaluation({
        "graduateWorkId": this.inputdata.graduatework.graduateworkid as string,
        "professorDNI": this.reviewerDNI as string,
        "comments": null
      }).subscribe({
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href;
        }
      })

    }else{
      console.log("NO Selecciono todos los criterios")
      const diferencia = this.diferenciaArreglos(this.reviewerCriteriaIdList,this.selectedValues);
      console.log(diferencia);
      console.log(this.selectedValues)
      this.graduateWorkService.reproveReviewerEvaluation({
        "graduateWorkId": this.inputdata.graduatework.graduateworkid as string,
        "professorDNI": this.reviewerDNI as string,
        "comments": null
      }).pipe(
        switchMap(
          (result) => {
            console.log(result)
            console.log(this.inputdata)
            const observables: Observable<any>[] = [];
            
            diferencia.forEach( (criterio: number) => {
              observables.push(this.graduateWorkService.reproveReviewerEvaluationCriteria({
                "professorDNI": this.reviewerDNI as string,
                "graduateWorkId": this.inputdata.graduatework.graduateworkid,
                "reviewerCriteriaId": criterio
              }))
              
            })
            forkJoin([...observables]).subscribe({
              next: (results) => {
                console.log(results)
              }
            })
            return observables
          }
        ),
        switchMap(
          (result) => {
            console.log(result)
            const observables: Observable<any>[] = [];
            
            this.selectedValues.forEach( (criterio: number) => {
              console.log(criterio)
              observables.push(this.graduateWorkService.approveReviewerEvaluationCriteria({
                "professorDNI": this.reviewerDNI as string,
                "graduateWorkId": this.inputdata.graduatework.graduateworkid,
                "reviewerCriteriaId": criterio
              }))

            })
            forkJoin([...observables]).subscribe({
              next: (results) => {
                console.log(results)
              }
            })
            console.log(observables)
            return observables
          }
        )
      ).subscribe({
        complete: () => {
          console.log("Completado")
          window.location.href = window.location.href;
        }
      })

    }
  }

  printSelectedCriteria(event: any){
    console.log(event.source._value)
    this.selectedValues = event.source._value

  }
  onCheckboxChange(option: Criteria) {
  
    const control = this.criteriaForm.get(option.reviewerCriteriaId.toString()) as FormControl

    if (control.value) {
      this.selectedValues.push(option.reviewerCriteriaId);
    } else {
      const index = this.selectedValues.indexOf(option.reviewerCriteriaId);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    }
    console.log(this.selectedValues)

  }
}
