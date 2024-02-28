import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosTutorOralService } from 'src/app/services/criterios-tg/criterios-tutor-oral.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionTutorOralComponent } from './dialogs/crear-seccion-tutor-oral/crear-seccion-tutor-oral.component';
import { EditarCriterioTutorOralComponent } from './dialogs/editar-criterio-tutor-oral/editar-criterio-tutor-oral.component';
import { EditarSeccionTutorOralComponent } from './dialogs/editar-seccion-tutor-oral/editar-seccion-tutor-oral.component';

@Component({
  selector: 'app-criterios-tutor-oral',
  templateUrl: './criterios-tutor-oral.component.html',
  styleUrls: ['./criterios-tutor-oral.component.css']
})
export class CriteriosTutorOralComponent {
  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria'];
  seccionSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  constructor(
    private criteriaService: CriteriosTutorOralService,
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
          this.criteriaService.getTutorOralSeccionByModelAndSchool(this.userData.schoolName,"EXPERIMENTAL").subscribe(
            {
              next: (seccionList) => {
                console.log(seccionList)
                this.seccionSource = seccionList
              }
            }
          )
          this.criteriaService.getTutorOralSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
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
    const dialogRef = this.dialog.open(CrearSeccionTutorOralComponent,{
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
    const dialogRef = this.dialog.open(EditarSeccionTutorOralComponent,{
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
    const dialogRef = this.dialog.open(EditarCriterioTutorOralComponent,{
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
