import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';

@Component({
  selector: 'app-edit-corporative-tutor-criteria',
  templateUrl: './edit-corporative-tutor-criteria.component.html',
  styleUrls: ['./edit-corporative-tutor-criteria.component.css']
})
export class EditCorporativeTutorCriteriaComponent implements OnInit{
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check']

  constructor(private corporativeTutorCriteria: CriteriosTutorEmpresarialService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder){
    console.log(this.data)
    this.criteriaForm = formBuilder.group({
      criteriaId: new FormControl(),
      criteriaName: new FormControl(),
      maxNote:new FormControl()
    })
  }
  ngOnInit(): void {
    this.corporativeTutorCriteria.getEnterpriseTutorCriteriaBySeccion(this.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
      }
    })
  }


  editarCriterio(data: any){
    console.log(data)
    this.isCriteriaSelected = true
    this.criteriaForm = this.formBuilder.group({
      criteriaId: new FormControl(data.criteriaId),
      criteriaName: new FormControl(data.criteriaName),
      maxNote:new FormControl(data.maxNote)
    })

  }

  guardarCambios(){
    this.corporativeTutorCriteria.changeEnterpriseTutorCriteria(this.criteriaForm.value.criteriaId, this.criteriaForm.value as CriteriaRequest).subscribe({
      next: (result) => {
        console.log(result)
      },
      complete: () => {
        window.location.href = window.location.href
      }
    })
    console.log("guardarCambios")
  }
}
