import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';

import { CargarEvaluacionesDialogComponent } from './dialogs/cargar-evaluaciones-dialog/cargar-evaluaciones-dialog.component';

@Component({
  selector: 'app-evaluacion-tutores',
  templateUrl: './evaluacion-tutores.component.html',
  styleUrls: ['./evaluacion-tutores.component.css']
})
export class EvaluacionTutoresComponent implements OnInit{

  tutorEvaluationList: any = null;
  displayedColumns: string[] = ['intershipId', 'intershipTitle', 'author', 'startDate','check'];

  constructor(
    private pasantiaService: PasantiaService, 
    private userService: UsersService,
    private dialog: MatDialog 
  ){
    this.pasantiaService.getPasantiasByStatus(30).pipe(
      switchMap(
        (tutorEvaluationList) => {
          console.log(tutorEvaluationList)
          const observables: Observable<any>[] = []

          tutorEvaluationList.forEach( (pasantia: any) => {
            observables.push(this.userService.getUserData(pasantia.studentDNI))
          })
          this.tutorEvaluationList = tutorEvaluationList
          return forkJoin(observables)
        }
      ),
      switchMap( (studentData) => {
        console.log(studentData)
        this.tutorEvaluationList.forEach( (pasantia:any , index: number) => {
          this.tutorEvaluationList[index].author = studentData[index].userLastName + ", " + studentData[index].userFirstName
          this.tutorEvaluationList[index].intershipStartDate = new Date(this.tutorEvaluationList[index].intershipStartDate).toLocaleDateString()
        })
        return of(null)
      })
    ).subscribe({
      complete: () => {
        console.log("completado")
      }
    })
  }

  ngOnInit(): void {
    
  }
  
  openDialog(data: any){
    console.log(data)
    const dialogRef = this.dialog.open(CargarEvaluacionesDialogComponent,{
      width: '60%',
      data: {
        pasantia: data
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

}
