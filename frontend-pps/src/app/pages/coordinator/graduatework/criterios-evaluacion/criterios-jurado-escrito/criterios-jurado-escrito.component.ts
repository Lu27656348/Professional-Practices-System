import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoEscritoService } from 'src/app/services/criterios-tg/criterios-jurado-escrito.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionJuradoEscritoComponent } from './dialogs/crear-seccion-jurado-escrito/crear-seccion-jurado-escrito.component';
import { EditarCriterioJuradoEscritoComponent } from './dialogs/editar-criterio-jurado-escrito/editar-criterio-jurado-escrito.component';
import { EditarSeccionJuradoEscritoComponent } from './dialogs/editar-seccion-jurado-escrito/editar-seccion-jurado-escrito.component';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-criterios-jurado-escrito',
  templateUrl: './criterios-jurado-escrito.component.html',
  styleUrls: ['./criterios-jurado-escrito.component.css']
})
export class CriteriosJuradoEscritoComponent {
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
                this.seccionSource.forEach( ( seccion : any ) => {
                  this.seccionSumE = this.seccionSumE + seccion.maxNote
                });
              }
            }
          )
          this.criteriaService.getJuradoEscritoSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
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

      this.criteriaService.getJuradoEscritoCriteriaByModelAndSchool(this.userData.schoolName,modo)
      .pipe(
        switchMap(
          (criteriaList) => {
            this.criteriaList = criteriaList
            console.log(this.criteriaList)
            return this.criteriaService.getJuradoEscritoSeccionByModelAndSchool(this.userData.schoolName,modo)
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
                [{nombre: ""}],
                ""
              ),
              `Planilla Evaluación - Informe - Jurado`
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
      /*
      this.formGenerator.printEvaluationForm(
        this.formGenerator.generateGraduateWorkJuryOralEvaluationForm(
          this.
        )
      )
      */
   


    
  }

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

    
    this.criteriaService.changeJuradoEscritoSeccionStatus(element.seccionId)
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
