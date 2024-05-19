import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { CrearCriterioJuradoOralComponent } from '../../../criterios-jurado-oral/dialogs/crear-criterio-jurado-oral/crear-criterio-jurado-oral.component';
import { CrearCriterioJuradoEscritoComponent } from '../crear-criterio-jurado-escrito/crear-criterio-jurado-escrito.component';

@Component({
  selector: 'app-editar-criterio-jurado-escrito',
  templateUrl: './editar-criterio-jurado-escrito.component.html',
  styleUrls: ['./editar-criterio-jurado-escrito.component.css']
})
export class EditarCriterioJuradoEscritoComponent {
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check','estado']

  constructor(
    private juryCriteria: CriteriosJuradoEscritoService, 
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

    this.juryCriteria.getJuradoEscritoCriteriaBySeccion(this.data.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
      }
    })
  }
  ngOnInit(): void {
    this.juryCriteria.getJuradoEscritoCriteriaBySeccion(this.data.data.seccionId).subscribe({
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
    const dialogRef = this.dialog.open(CrearCriterioJuradoEscritoComponent,{
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
    
    this.juryCriteria.changeJuradoEscritoCriteria(this.criteriaForm.value as CriteriaRequest).subscribe({
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
    this.juryCriteria.changeJuradoEscritoCriteriaStatus(element.criteriaId)
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
