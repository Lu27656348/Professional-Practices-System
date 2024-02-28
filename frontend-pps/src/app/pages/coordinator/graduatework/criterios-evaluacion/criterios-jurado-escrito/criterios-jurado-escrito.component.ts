import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionJuradoEscritoComponent } from './dialogs/crear-seccion-jurado-escrito/crear-seccion-jurado-escrito.component';
import { EditarCriterioJuradoEscritoComponent } from './dialogs/editar-criterio-jurado-escrito/editar-criterio-jurado-escrito.component';
import { EditarSeccionJuradoEscritoComponent } from './dialogs/editar-seccion-jurado-escrito/editar-seccion-jurado-escrito.component';

@Component({
  selector: 'app-criterios-jurado-escrito',
  templateUrl: './criterios-jurado-escrito.component.html',
  styleUrls: ['./criterios-jurado-escrito.component.css']
})
export class CriteriosJuradoEscritoComponent {
  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria'];
  seccionSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  constructor(
    private criteriaService: CriteriosJuradoEscritoService,
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
          this.criteriaService.getJuradoEscritoSeccionByModelAndSchool(this.userData.schoolName,"EXPERIMENTAL").subscribe(
            {
              next: (seccionList) => {
                console.log(seccionList)
                this.seccionSource = seccionList
              }
            }
          )
          this.criteriaService.getJuradoEscritoSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
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
    const dialogRef = this.dialog.open(CrearSeccionJuradoEscritoComponent,{
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
    const dialogRef = this.dialog.open(EditarSeccionJuradoEscritoComponent,{
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
    const dialogRef = this.dialog.open(EditarCriterioJuradoEscritoComponent,{
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
