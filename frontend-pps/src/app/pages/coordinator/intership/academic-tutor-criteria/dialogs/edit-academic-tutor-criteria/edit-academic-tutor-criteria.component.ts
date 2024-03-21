import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { CreateAcademicTutorCriteriaComponent } from '../create-academic-tutor-criteria/create-academic-tutor-criteria.component';

@Component({
  selector: 'app-edit-academic-tutor-criteria',
  templateUrl: './edit-academic-tutor-criteria.component.html',
  styleUrls: ['./edit-academic-tutor-criteria.component.css']
})
export class EditAcademicTutorCriteriaComponent {
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check','estado']

  criteriaSum: number = 0
  seccionSum: number = 0

  constructor(
    private academicTutorCriteria: CriteriosTutorAcademicoService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ){
    console.log(this.data)
    this.seccionSum = this.data.maxNote
    this.criteriaForm = formBuilder.group({
      criteriaId: new FormControl(),
      criteriaName: new FormControl(),
      maxNote:new FormControl()
    })
    this.academicTutorCriteria.getAcademicTutorCriteriaBySeccion(this.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
        this.criteriaList.filter( (criterio: any) => criterio.status == true ).forEach ( (criterio: any) => {
          this.criteriaSum = this.criteriaSum + criterio.maxNote
        })
      }
    })
  }
  ngOnInit(): void {
    
    this.academicTutorCriteria.getAcademicTutorCriteriaBySeccion(this.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
        this.criteriaList.filter( (criterio: any) => criterio.status == true ).forEach ( (criterio: any) => {
          this.criteriaSum = this.criteriaSum + criterio.maxNote
        })
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

  agregarCriterioASeccion(){
    const dialogRef = this.dialog.open(CreateAcademicTutorCriteriaComponent,{
      width: '60%', 
      data: this.data
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit()
    });
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

  deshabilitarCriterio(element: any){
    console.log(element)
    console.log("deshabilitarCriterio")
    this.academicTutorCriteria.changeAcademicTutorCriteriaStatus(element.criteriaId,!element.status)
    .subscribe(
      {
        next: (result) => {
          console.log(result)
          this.ngOnInit()
        },
        complete: () => {
          window.location.href = window.location.href 
        }
      }
    )
  }
}
