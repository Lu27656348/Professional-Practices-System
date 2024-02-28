import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoOralService } from 'src/app/services/criterios-tg/criterios-jurado-oral.service';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';

@Component({
  selector: 'app-editar-seccion-jurado-oral',
  templateUrl: './editar-seccion-jurado-oral.component.html',
  styleUrls: ['./editar-seccion-jurado-oral.component.css']
})
export class EditarSeccionJuradoOralComponent {
  seccionForm;

  maxNote: number = 0
  seccionName: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, formBuilder: FormBuilder, private criteriaService: CriteriosJuradoOralService){
    console.log(this.data)
    this.seccionForm = formBuilder.group({
      seccionId: new FormControl(this.data.data.seccionId),
      seccionName: new FormControl(this.data.data.seccionName),
      maxNote:new FormControl(this.data.data.maxNote)
    })

    this.maxNote = data.maxNote
    this.seccionName = data.seccionName

    console.log(this.seccionForm.value)

  }
  ngOnInit(): void {
    this.maxNote = this.seccionForm.value.maxNote as number;
    this.seccionName = this.seccionForm.value.seccionName as string;
  }

  guardarCambiosSeccion(){
    console.log("guardarCambiosSeccion()")
    console.log(this.seccionForm.value)
    this.criteriaService.changeJuradoOralSeccion(this.seccionForm.value as SeccionInterface).subscribe(
      {
        next: (result) => {
          console.log(result)
          window.location.href = window.location.href
        }
      }
    )

  }
}
