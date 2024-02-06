import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
@Component({
  selector: 'app-edit-corporative-tutor-seccion',
  templateUrl: './edit-corporative-tutor-seccion.component.html',
  styleUrls: ['./edit-corporative-tutor-seccion.component.css']
})
export class EditCorporativeTutorSeccionComponent implements OnInit{

  seccionForm;

  maxNote: number = 0
  seccionName: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, formBuilder: FormBuilder, private corporativeTutorService: CriteriosTutorEmpresarialService){
    console.log(this.data)
    this.seccionForm = formBuilder.group({
      seccionId: new FormControl(this.data.seccionId),
      seccionName: new FormControl(this.data.seccionName),
      maxNote:new FormControl(this.data.maxNote)
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
    this.corporativeTutorService.changeEnterpriseTutorSeccion(this.seccionForm.value.seccionId, this.seccionForm.value as SeccionInterface).subscribe(
      {
        next: (result) => {
          console.log(result)
          window.location.href = window.location.href
        }
      }
    )

  }


}
