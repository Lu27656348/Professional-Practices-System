import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { SeccionInterface } from 'src/app/interfaces/SeccionRequest';
import { CriteriosTutorOralService } from 'src/app/services/criterios-tg/criterios-tutor-oral.service';
import { UsersService } from 'src/app/services/users.service';
import { CrearSeccionTutorOralComponent } from './dialogs/crear-seccion-tutor-oral/crear-seccion-tutor-oral.component';
import { EditarCriterioTutorOralComponent } from './dialogs/editar-criterio-tutor-oral/editar-criterio-tutor-oral.component';
import { EditarSeccionTutorOralComponent } from './dialogs/editar-seccion-tutor-oral/editar-seccion-tutor-oral.component';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-criterios-tutor-oral',
  templateUrl: './criterios-tutor-oral.component.html',
  styleUrls: ['./criterios-tutor-oral.component.css']
})
export class CriteriosTutorOralComponent {
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
                this.seccionSource.forEach( ( seccion : any ) => {
                  this.seccionSumE = this.seccionSumE + seccion.maxNote
                });
              }
            }
          )
          this.criteriaService.getTutorOralSeccionByModelAndSchool(this.userData.schoolName,"INSTRUMENTAL").subscribe(
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
    this.criteriaService.getTutorOralCriteriaByModelAndSchool(this.userData.schoolName,modo)
      .pipe(
        switchMap(
          (criteriaList) => {
            this.criteriaList = criteriaList
            console.log(this.criteriaList)
            return this.criteriaService.getTutorOralSeccionByModelAndSchool(this.userData.schoolName,modo)
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
                this.criteriaList.filter( (criterio) => criterio.seccionId != objetoMenor.seccionId && criterio.status),
                this.criteriaList.filter( (criterio) => criterio.seccionId == objetoMenor.seccionId && criterio.status),
                this.seccionList,
                "",
                [{
                  nombre: "",
                  userDNI: ""
                }]
              ),
              `Planilla Evaluación - Presentación - Tutor`
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

    
    this.criteriaService.changeTutorOralSeccionStatus(element.seccionId)
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
