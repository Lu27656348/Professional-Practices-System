import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { CreateAcademicTutorCriteriaComponent } from 'src/app/pages/coordinator/intership/academic-tutor-criteria/dialogs/create-academic-tutor-criteria/create-academic-tutor-criteria.component';
import { CriteriosJuradoOralService } from 'src/app/services/criterios-tg/criterios-jurado-oral.service';
import { CrearCriterioJuradoOralComponent } from '../crear-criterio-jurado-oral/crear-criterio-jurado-oral.component';

@Component({
  selector: 'app-editar-criterio-jurado-oral',
  templateUrl: './editar-criterio-jurado-oral.component.html',
  styleUrls: ['./editar-criterio-jurado-oral.component.css']
})
export class EditarCriterioJuradoOralComponent {
  criteriaForm;

  criteriaList: any = null
  isCriteriaSelected: boolean = false;
  displayedColumns: string[] = ['criteriaId','criteriaName', 'maxNote', 'check']

  constructor(
    private juryCriteria: CriteriosJuradoOralService, 
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

    this.juryCriteria.getJuradoOralCriteriaBySeccion(this.data.data.seccionId).subscribe({
      next: (result) => {
        console.log(result)
        this.criteriaList = result
      }
    })
  }
  ngOnInit(): void {
    this.juryCriteria.getJuradoOralCriteriaBySeccion(this.data.data.seccionId).subscribe({
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
    const dialogRef = this.dialog.open(CrearCriterioJuradoOralComponent,{
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
    
    this.juryCriteria.changeJuradoOralCriteria(this.criteriaForm.value as CriteriaRequest).subscribe({
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
