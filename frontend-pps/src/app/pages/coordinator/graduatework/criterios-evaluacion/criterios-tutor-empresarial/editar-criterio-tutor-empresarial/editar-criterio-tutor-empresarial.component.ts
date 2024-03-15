import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriteriaRequest } from 'src/app/interfaces/CriteriaRequest';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/criterios-tg/criterios-tutor-empresarial.service';

@Component({
  selector: 'app-editar-criterio-tutor-empresarial',
  templateUrl: './editar-criterio-tutor-empresarial.component.html',
  styleUrls: ['./editar-criterio-tutor-empresarial.component.css']
})
export class EditarCriterioTutorEmpresarialComponent {
  seccionForm;

  maxNote: number = 0
  seccionName: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, formBuilder: FormBuilder, private criteriaService: CriteriosTutorEmpresarialService){
    console.log(this.data)
    this.seccionForm = formBuilder.group({
      criteriaId: new FormControl(this.data.data.criteriaId),
      criteriaName: new FormControl(this.data.data.criteriaName),
      maxNote:new FormControl(this.data.data.maxNote)
    })

    this.maxNote = data.maxNote
    this.seccionName = data.seccionName

    console.log(this.seccionForm.value)

  }
  ngOnInit(): void {
    this.maxNote = this.seccionForm.value.maxNote as number;
    this.seccionName = this.seccionForm.value.criteriaName as string;
  }

  guardarCambiosSeccion(){
    console.log("guardarCambiosSeccion()")
    console.log(this.seccionForm.value)
    this.criteriaService.cambiarCriterioTutorEmpresarial(this.seccionForm.value as CriteriaRequest).subscribe(
      {
        next: (result) => {
          console.log(result)
          window.location.href = window.location.href
        }
      }
    )

  }
}
