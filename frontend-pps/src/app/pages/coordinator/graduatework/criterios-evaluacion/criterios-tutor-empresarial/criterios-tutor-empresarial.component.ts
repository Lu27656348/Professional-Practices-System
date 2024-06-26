import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearCriterioProfesorRevisorComponent } from '../criterios-profesor-revisor/dialogs/crear-criterio-profesor-revisor/crear-criterio-profesor-revisor.component';
import { EditarCriterioProfesorRevisorComponent } from '../criterios-profesor-revisor/dialogs/editar-criterio-profesor-revisor/editar-criterio-profesor-revisor.component';
import { CriteriosTutorEmpresarialService } from 'src/app/services/criterios-tg/criterios-tutor-empresarial.service';
import { EditarCriterioTutorEmpresarialComponent } from './editar-criterio-tutor-empresarial/editar-criterio-tutor-empresarial.component';
import { CrearCriterioTutorEmpresarialComponent } from './crear-criterio-tutor-empresarial/crear-criterio-tutor-empresarial.component';

@Component({
  selector: 'app-criterios-tutor-empresarial',
  templateUrl: './criterios-tutor-empresarial.component.html',
  styleUrls: ['./criterios-tutor-empresarial.component.css']
})
export class CriteriosTutorEmpresarialComponent {
  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName','maxNote','actions','estado'];
  criteriaSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  constructor(
    private graduateWorkService: GraduateworkService,
    private criteriaService: CriteriosTutorEmpresarialService,
    private userService: UsersService,
    private dialog: MatDialog,
    private formGenerator: EvaluationFormGeneratorService,
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      this.userService.getUserData(localUserData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
          console.log(this.userData)
          this.criteriaService.obtenerCriteriosTutorEmpresarialPorEscuela(this.userData.schoolName)
          .subscribe({
            next: (criteriaList) => {
              console.log(criteriaList)
              this.criteriaSource = criteriaList
              this.criteriaSource.forEach( (criterio: any, index: number) => {
                this.criteriaSource[index].seccionId = 1
              })
            }
          })
        }
      })
    }
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.criteriaSource.filter = filterValue.trim().toLowerCase();
  }

  generarPlanilla(){
    this.formGenerator.printEvaluationForm(
      this.formGenerator.generateGraduateWorkCorporateTutorEvaluationForm(
        this.criteriaSource.filter( (criterio:any) => criterio.status),
        [
          {
            seccionId: 1,
            seccionName: "Desempeño dentro de la Empresa",
            maxNote: 20,
          }
        ],
        {
          nombreAlumno: "",
          cedulaAlumno: "",
          empresa: "",
          nombreTutor: ""
        }

      ),
      `Planilla Evaluación Individual Trabajo Instrumental de Grado (TIG) – Tutor Empresarial`
    )

  }

  crearSecionJurado(model: string){
    const dialogRef = this.dialog.open(CrearCriterioTutorEmpresarialComponent,{
      width: '60%', 
      data: {
        user: this.userData,
        model: model
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editarSeccionJurado(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(EditarCriterioTutorEmpresarialComponent,{
      width: '60%', 
      data: {
        user: this.userData,
        data: element
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deshabilitarCriterio(element: any){
    console.log(element)
    console.log("deshabilitarCriterio")
    
    this.criteriaService.cambiarEstadoCriterioTutorEmpresarial(element.criteriaId)
    .subscribe(
      {
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href 
        }
      }
    )
    
  }

}
