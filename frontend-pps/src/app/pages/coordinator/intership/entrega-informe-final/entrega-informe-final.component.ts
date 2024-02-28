import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';
import { EntregaInformeDialogComponent } from './dialogs/entrega-informe-dialog/entrega-informe-dialog.component';
@Component({
  selector: 'app-entrega-informe-final',
  templateUrl: './entrega-informe-final.component.html',
  styleUrls: ['./entrega-informe-final.component.css']
})
export class EntregaInformeFinalComponent {

  pasantiaList: any = null;
  displayedColumns: string[] = ['intershipId', 'intershipTitle', 'author', 'startDate','check'];

  localUserData: any = null

  constructor(
    private pasantiaService: PasantiaService,
    private userService: UsersService,
    private dialog: MatDialog
  ){
    
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI)
      .pipe(
        switchMap(
          (userData) => {
            this.localUserData = userData
            return this.pasantiaService.getPasantiasByStatusAndSchool(40, this.localUserData.schoolName)
          }
        ),
        switchMap(
          (pasantiaList) => {
            console.log(pasantiaList)
            const observables: Observable<any>[] = []
  
            pasantiaList.forEach( (pasantia: any) => {
              observables.push(this.userService.getUserData(pasantia.studentDNI))
            })
            this.pasantiaList = pasantiaList
            return forkJoin(observables)
          }
        ),
        switchMap( (studentData) => {
          console.log(studentData)
          this.pasantiaList.forEach( (pasantia:any , index: number) => {
            this.pasantiaList[index].author = studentData[index].userLastName + ", " + studentData[index].userFirstName
            this.pasantiaList[index].intershipStartDate = new Date(this.pasantiaList[index].intershipStartDate).toLocaleDateString()
          })
          return of(null)
        })
      )
      .subscribe(
        {
          complete: () => {
            console.log("completado")
          }
        }
      )
    }

  }

  openDialog(data: any){
    console.log(data)
    const dialogRef = this.dialog.open(EntregaInformeDialogComponent,{
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
