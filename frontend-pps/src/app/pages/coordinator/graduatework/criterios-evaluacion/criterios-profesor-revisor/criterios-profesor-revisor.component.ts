import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionJuradoEscritoComponent } from '../criterios-jurado-escrito/dialogs/crear-seccion-jurado-escrito/crear-seccion-jurado-escrito.component';
import { EditarCriterioJuradoEscritoComponent } from '../criterios-jurado-escrito/dialogs/editar-criterio-jurado-escrito/editar-criterio-jurado-escrito.component';
import { EditarSeccionJuradoEscritoComponent } from '../criterios-jurado-escrito/dialogs/editar-seccion-jurado-escrito/editar-seccion-jurado-escrito.component';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { CrearCriterioProfesorRevisorComponent } from './dialogs/crear-criterio-profesor-revisor/crear-criterio-profesor-revisor.component';
import { EditarCriterioProfesorRevisorComponent } from './dialogs/editar-criterio-profesor-revisor/editar-criterio-profesor-revisor.component';

@Component({
  selector: 'app-criterios-profesor-revisor',
  templateUrl: './criterios-profesor-revisor.component.html',
  styleUrls: ['./criterios-profesor-revisor.component.css']
})
export class CriteriosProfesorRevisorComponent {
  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName','actions'];
  criteriaSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  constructor(
    private graduateWorkService: GraduateworkService,
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
          this.graduateWorkService.getRevierwerCriteriaByModelAndSchool(this.userData.schoolName, "EXPERIMENTAL").subscribe({
            next: (result) => {
              console.log(result)
              this.criteriaSource = result
            }
          })
          this.graduateWorkService.getRevierwerCriteriaByModelAndSchool(this.userData.schoolName, "INSTRUMENTAL").subscribe({
            next: (result) => {
              console.log(result)
              this.seccionSourceInstrumental = result
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

  generarPlanilla(){}

  crearSecionJurado(model: string){
    const dialogRef = this.dialog.open(CrearCriterioProfesorRevisorComponent,{
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
    const dialogRef = this.dialog.open(EditarCriterioProfesorRevisorComponent,{
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

}
