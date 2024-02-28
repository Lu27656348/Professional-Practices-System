import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosTutorEscritoService } from 'src/app/services/criterios-tg/criterios-tutor-escrito.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionJuradoOralComponent } from '../criterios-jurado-oral/dialogs/crear-seccion-jurado-oral/crear-seccion-jurado-oral.component';
import { EditarCriterioJuradoOralComponent } from '../criterios-jurado-oral/dialogs/editar-criterio-jurado-oral/editar-criterio-jurado-oral.component';
import { EditarSeccionJuradoOralComponent } from '../criterios-jurado-oral/dialogs/editar-seccion-jurado-oral/editar-seccion-jurado-oral.component';
import { CrearSeccionTutorEscritoComponent } from './dialogs/crear-seccion-tutor-escrito/crear-seccion-tutor-escrito.component';
import { EditarSeccionTutorEscritoComponent } from './dialogs/editar-seccion-tutor-escrito/editar-seccion-tutor-escrito.component';
import { EditarCriterioTutorEscritoComponent } from './dialogs/editar-criterio-tutor-escrito/editar-criterio-tutor-escrito.component';

@Component({
  selector: 'app-criterios-tutor-escrito',
  templateUrl: './criterios-tutor-escrito.component.html',
  styleUrls: ['./criterios-tutor-escrito.component.css']
})
export class CriteriosTutorEscritoComponent {
  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria'];
  seccionSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  constructor(
    private criteriaService: CriteriosTutorEscritoService,
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
          this.criteriaService.getTutorEscritoSeccionByModelAndSchool(this.userData.schoolName,"EXPERIMENTAL").subscribe(
            {
              next: (seccionList) => {
                console.log(seccionList)
                this.seccionSource = seccionList
              }
            }
          )
          this.criteriaService.getTutorEscritoSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
            {
              next: (seccionList) => {
                console.log(seccionList)
                this.seccionSourceInstrumental = seccionList
              }
            }
          )
        }
      })
    }
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.seccionSource.filter = filterValue.trim().toLowerCase();
  }

  generarPlanilla(){}

  crearSecionJurado(model: string){
    const dialogRef = this.dialog.open(CrearSeccionTutorEscritoComponent,{
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
    const dialogRef = this.dialog.open(EditarSeccionTutorEscritoComponent,{
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

  editarCriteriosDeSeccion(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(EditarCriterioTutorEscritoComponent,{
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
