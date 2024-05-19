import { Component } from '@angular/core';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosJuradoOralService } from 'src/app/services/criterios-tg/criterios-jurado-oral.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionJuradoOralComponent } from './dialogs/crear-seccion-jurado-oral/crear-seccion-jurado-oral.component';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { EditarSeccionJuradoOralComponent } from './dialogs/editar-seccion-jurado-oral/editar-seccion-jurado-oral.component';
import { EditarCriterioJuradoOralComponent } from './dialogs/editar-criterio-jurado-oral/editar-criterio-jurado-oral.component';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-criterios-jurado-oral',
  templateUrl: './criterios-jurado-oral.component.html',
  styleUrls: ['./criterios-jurado-oral.component.css']
})
export class CriteriosJuradoOralComponent {

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
                this.seccionSource.forEach( ( seccion : any ) => {
                  this.seccionSumE = this.seccionSumE + seccion.maxNote
                });
              }
            }
          )
          this.criteriaService.getJuradoOralSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
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

      this.criteriaService.getJuradoOralCriteriaByModelAndSchool(this.userData.schoolName,modo)
      .pipe(
        switchMap(
          (criteriaList) => {
            this.criteriaList = criteriaList
            console.log(this.criteriaList)
            return this.criteriaService.getJuradoOralSeccionByModelAndSchool(this.userData.schoolName,modo)
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
              this.formGenerator.generateGraduateWorkJuryOralEvaluationForm(
                this.criteriaList.filter( (criterio) => criterio.seccionId != objetoMenor.seccionId && criterio.status ),
                this.criteriaList.filter( (criterio) => criterio.seccionId == objetoMenor.seccionId && criterio.status ),
                this.seccionList,
                "",
                [{
                  nombre: "",
                  userDNI: ""
                }]
              ),
              `Planilla Evaluación - Presentación - Jurado`
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
        data: element,
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

    
    this.criteriaService.changeJuradoOralSeccionStatus(element.seccionId)
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
