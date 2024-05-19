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
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-criterios-tutor-escrito',
  templateUrl: './criterios-tutor-escrito.component.html',
  styleUrls: ['./criterios-tutor-escrito.component.css']
})
export class CriteriosTutorEscritoComponent {
  panelOpenState: boolean = false

  displayedColumns: string[] = ['seccionId', 'seccionName', 'maxNote','actions','criteria','deshabilitar'];
  seccionSource: any = null
  seccionSourceInstrumental: any = null

  seccionList: SeccionInterface[] = []
  
  criteriaList: any[] = []

  userData: any = null

  seccionSumE: number = 0;
  seccionSumI: number = 0;

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
                this.seccionSource.forEach( ( seccion : any ) => {
                  this.seccionSumE = this.seccionSumE + seccion.maxNote
                });
              }
            }
          )
          this.criteriaService.getTutorEscritoSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
            {
              next: (seccionList) => {
                console.log(seccionList)
                this.seccionSourceInstrumental = seccionList
                this.seccionSourceInstrumental.forEach( ( seccion : any ) => {
                  this.seccionSumI = this.seccionSumI + seccion.maxNote
                });
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

  generarPlanilla(modo: string){
    console.log(modo)
    this.criteriaService.getTutorEscritoCriteriaByModelAndSchool(this.userData.schoolName,modo)
      .pipe(
        switchMap(
          (criteriaList) => {
            this.criteriaList = criteriaList
            console.log(this.criteriaList)
            return this.criteriaService.getTutorEscritoSeccionByModelAndSchool(this.userData.schoolName,modo)
          }
        ),
        switchMap(
          (seccionList) => {
            this.seccionList = seccionList
            let objetoMenor: any = this.obtenerMenorId(this.criteriaList)
            console.log(objetoMenor)

            this.criteriaList.forEach ( (criterio:any,index:number) => {
              this.criteriaList[index].userDNI = ""
            })
            
            this.formGenerator.printEvaluationForm(
              this.formGenerator.generateGraduateWorkJuryReportEvaluationForm(
                this.criteriaList.filter( (criterio: any) => criterio.status),
                this.seccionList.filter( (criterio: any) => criterio.status),
                "",
                [{
                  nombre: ""
                }]
              ),
              `Planilla Evaluación - Informe - Tutor`
            )
            return of("Documento generado exitosamente")
          }
        ),
      )
      .subscribe({
        next: (result) => {
          console.log(result)
        }
      })
  }

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

  obtenerMenorId( arregloCriterios: any ){
    return arregloCriterios.reduce((menor:any, actual:any) => {
      if (actual.seccionId < menor.seccionId) {
        return actual;
      }
      return menor;
    });
  }

  deshabilitarSeccion(element: any){

    console.log("deshabilitarSeccion")
    console.log(element)

    
    this.criteriaService.changeTutorEscritoSeccionStatus(element.seccionId)
    .subscribe({
      next: (result) => {
        console.log(result)
      },
      complete: () => {
        window.location.href = window.location.href
      }
    })
    

  }
}
