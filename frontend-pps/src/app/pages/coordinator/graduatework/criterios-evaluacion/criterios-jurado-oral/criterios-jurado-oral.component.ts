import { Component } from '@angular/core';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoOralService } from 'src/app/services/criterios-tg/criterios-jurado-oral.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionJuradoOralComponent } from './dialogs/crear-seccion-jurado-oral/crear-seccion-jurado-oral.component';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { EditarSeccionJuradoOralComponent } from './dialogs/editar-seccion-jurado-oral/editar-seccion-jurado-oral.component';
import { EditarCriterioJuradoOralComponent } from './dialogs/editar-criterio-jurado-oral/editar-criterio-jurado-oral.component';

@Component({
  selector: 'app-criterios-jurado-oral',
  templateUrl: './criterios-jurado-oral.component.html',
  styleUrls: ['./criterios-jurado-oral.component.css']
})
export class CriteriosJuradoOralComponent {

  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria'];
  seccionSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  constructor(
    private criteriaService: CriteriosJuradoOralService,
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
          this.criteriaService.getJuradoOralSeccionByModelAndSchool(this.userData.schoolName,"EXPERIMENTAL").subscribe(
            {
              next: (seccionList) => {
                console.log(seccionList)
                this.seccionSource = seccionList
              }
            }
          )
          this.criteriaService.getJuradoOralSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
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
    const dialogRef = this.dialog.open(CrearSeccionJuradoOralComponent,{
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
    const dialogRef = this.dialog.open(EditarSeccionJuradoOralComponent,{
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
    const dialogRef = this.dialog.open(EditarCriterioJuradoOralComponent,{
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
