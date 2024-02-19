import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';

@Component({
  selector: 'app-edit-academic-tutor-criteria',
  templateUrl: './edit-academic-tutor-criteria.component.html',
  styleUrls: ['./edit-academic-tutor-criteria.component.css']
})
export class EditAcademicTutorCriteriaComponent {
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check']

  constructor(private academicTutorCriteria: CriteriosTutorAcademicoService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder){
    console.log(this.data)
    this.criteriaForm = formBuilder.group({
      criteriaId: new FormControl(),
      criteriaName: new FormControl(),
      maxNote:new FormControl()
    })
  }
  ngOnInit(): void {
    this.academicTutorCriteria.getAcademicTutorCriteriaBySeccion(this.data.seccionId).subscribe({
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
    this.academicTutorCriteria.changeAcademicTutorCriteria(this.criteriaForm.value.criteriaId, this.criteriaForm.value as CriteriaRequest).subscribe({
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
