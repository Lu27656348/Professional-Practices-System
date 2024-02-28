import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosTutorOralService } from 'src/app/services/criterios-tg/criterios-tutor-oral.service';

@Component({
  selector: 'app-editar-seccion-tutor-oral',
  templateUrl: './editar-seccion-tutor-oral.component.html',
  styleUrls: ['./editar-seccion-tutor-oral.component.css']
})
export class EditarSeccionTutorOralComponent {
  seccionForm;

  maxNote: number = 0
  seccionName: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, formBuilder: FormBuilder, private criteriaService: CriteriosTutorOralService){
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
    this.criteriaService.changeTutorOralSeccion(this.seccionForm.value as SeccionInterface).subscribe(
      {
        next: (result) => {
          console.log(result)
          window.location.href = window.location.href
        }
      }
    )

  }
}
