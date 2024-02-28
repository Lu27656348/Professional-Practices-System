import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CriteriosTutorOralService } from 'src/app/services/criterios-tg/criterios-tutor-oral.service';
import { CrearCriterioTutorEscritoComponent } from '../../../criterios-tutor-escrito/dialogs/crear-criterio-tutor-escrito/crear-criterio-tutor-escrito.component';
import { CrearCriterioTutorOralComponent } from '../crear-criterio-tutor-oral/crear-criterio-tutor-oral.component';

@Component({
  selector: 'app-editar-criterio-tutor-oral',
  templateUrl: './editar-criterio-tutor-oral.component.html',
  styleUrls: ['./editar-criterio-tutor-oral.component.css']
})
export class EditarCriterioTutorOralComponent {
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check']

  constructor(
    private juryCriteria: CriteriosTutorOralService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ){
    console.log(this.data)
    this.criteriaForm = formBuilder.group({
      criteriaId: new FormControl(),
      criteriaName: new FormControl(),
      maxNote:new FormControl()
    })

    this.juryCriteria.getTutorOralCriteriaBySeccion(this.data.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
      }
    })
  }
  ngOnInit(): void {
    this.juryCriteria.getTutorOralCriteriaBySeccion(this.data.data.seccionId).subscribe({
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

  agregarCriterioASeccion(){
    const dialogRef = this.dialog.open(CrearCriterioTutorOralComponent,{
      width: '60%', 
      data: this.data
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit()
    });

    this.ngOnInit()
  }

  guardarCambios(){
    
    this.juryCriteria.changeTutorOralCriteria(this.criteriaForm.value as CriteriaRequest).subscribe({
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
