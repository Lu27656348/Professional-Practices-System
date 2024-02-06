import { Component } from '@angular/core';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';

@Component({
  selector: 'app-notificacion-tutor-academico',
  templateUrl: './notificacion-tutor-academico.component.html',
  styleUrls: ['./notificacion-tutor-academico.component.css']
})
export class NotificacionTutorAcademicoComponent {

  constructor(private formGenerator: EvaluationFormGeneratorService){

  }

  generarNotificacionTutorAcademico(){
    this.formGenerator.printEvaluationForm(this.formGenerator.generateIntershipAcademicTutorNotification(
    {
        fechaEnvio: new Date(),
        academicTutor: "Bello, Franklin",
        consejoDeEscuela: "CE O 001-2023-2024",
        fechaConsejo: new Date(),
        datosEstudiante: {
            nombre: "Somoza Ledezma, Luis Carlos",
            cedula: "V-27656348"
        },
        empresa: "Sidor",
        titulo: "Sistema de Practicas Profesionales",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        tutorEmpresarial: "SanVicente Wladimir",
        administrador: "Luz E. Medina"
    }

      
    ))
  }
}
