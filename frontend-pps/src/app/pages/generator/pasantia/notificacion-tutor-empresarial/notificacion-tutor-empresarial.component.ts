import { Component } from '@angular/core';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-notificacion-tutor-empresarial',
  templateUrl: './notificacion-tutor-empresarial.component.html',
  styleUrls: ['./notificacion-tutor-empresarial.component.css']
})
export class NotificacionTutorEmpresarialComponent {

  constructor(private documentService: DocumentService, private formGenerator: EvaluationFormGeneratorService){

  }
  generarNotificacionTutorEmpresarial(){
    const body = {

    }
    const date = new Date()
    console.log("generarNotificacionTutorEmpresarial()")
    this.formGenerator.printEvaluationForm(
      this.formGenerator.generateIntershipCorporateTutorNotification(
        {
        consejo: "CE O 001-2023-2024",
        fechaConsejo: date,
        propuesta: {
          tutor_academico: {
            apellidos: "Bello",
            nombres: "Frankin"
          },
          titulo: "Sistema de Practicas Profesionales",
          alumno: {apellidos: "Somoza Ledezma", nombres: "Luis Carlos"}
        },
        fecha_designacion: date,
        revisor: "Wladimir SanVicente",
        correo_administrador: "luiscarlossomoza@gmail.com",
        administrador: "Luz E. Medina"
        }
      )
    );
  }
}
