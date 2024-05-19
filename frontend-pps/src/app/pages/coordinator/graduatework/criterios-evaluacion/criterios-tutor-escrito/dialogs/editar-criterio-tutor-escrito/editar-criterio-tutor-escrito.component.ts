import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CriteriosTutorEscritoService } from 'src/app/services/criterios-tg/criterios-tutor-escrito.service';
import { CrearCriterioJuradoOralComponent } from '../../../criterios-jurado-oral/dialogs/crear-criterio-jurado-oral/crear-criterio-jurado-oral.component';
import { CrearCriterioTutorEscritoComponent } from '../crear-criterio-tutor-escrito/crear-criterio-tutor-escrito.component';

@Component({
  selector: 'app-editar-criterio-tutor-escrito',
  templateUrl: './editar-criterio-tutor-escrito.component.html',
  styleUrls: ['./editar-criterio-tutor-escrito.component.css']
})
export class EditarCriterioTutorEscritoComponent {
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check','estado']

  constructor(
    private juryCriteria: CriteriosTutorEscritoService, 
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

    this.juryCriteria.getTutorEscritoCriteriaBySeccion(this.data.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
      }
    })
  }
  ngOnInit(): void {
    this.juryCriteria.getTutorEscritoCriteriaBySeccion(this.data.data.seccionId).subscribe({
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
    const dialogRef = this.dialog.open(CrearCriterioTutorEscritoComponent,{
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
    
    this.juryCriteria.changeTutorEscritoCriteria(this.criteriaForm.value as CriteriaRequest).subscribe({
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
    this.juryCriteria.changeTutorEscritoCriteriaStatus(element.criteriaId)
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
