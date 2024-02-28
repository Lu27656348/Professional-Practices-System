import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePasantiaDialogComponent } from './dialogs/create-pasantia-dialog/create-pasantia-dialog.component';
import { EvaluatePasantiaDialogComponent } from './dialogs/evaluate-pasantia-dialog/evaluate-pasantia-dialog.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-propuesta-pasantia',
  templateUrl: './propuesta-pasantia.component.html',
  styleUrls: ['./propuesta-pasantia.component.css']
})
export class PropuestaPasantiaComponent implements OnInit{

  intershipData: any[] = []

  displayedColumns: string[] = ['intershipId', 'intershipTitle', 'author', 'startDate','endDate','check']

  userData: any = null

  constructor(private pasantiaService: PasantiaService,private dialog: MatDialog, private userService: UsersService){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      console.log(localUserData.userDNI)
      this.userService.getUserData(localUserData.userDNI).pipe(
        switchMap(
          (userData) => {
            this.userData = userData
            console.log(userData)
            return this.pasantiaService.getPasantiasByStatusAndSchool(10,this.userData?.schoolName)
          }
        ),
        switchMap(
          (intershipList) => {
            console.log(intershipList)
            const observables: Observable<any>[] = []
  
            intershipList.forEach( (pasantia: any) => {
              observables.push(this.userService.getUserData(pasantia.studentDNI))
            })
            this.intershipData = intershipList
            return forkJoin(observables)
          }
        ),
        switchMap( (studentData) => {
          console.log(studentData)
          this.intershipData.forEach( (pasantia:any , index: number) => {
            this.intershipData[index].author = studentData[index].userLastName + ", " + studentData[index].userFirstName
            this.intershipData[index].intershipStartDate = new Date(this.intershipData[index].intershipStartDate).toLocaleDateString()
            this.intershipData[index].intershipCompletionDate = new Date(this.intershipData[index].intershipCompletionDate).toLocaleDateString()
          })
          return of("Completado")
        })
      ).subscribe({
        next: (result) => {
          console.log(result)
        }
      })
    }
  }
  ngOnInit(): void {

    
  }
  openDialog(data: any){
    console.log(data)
    const dialogRef = this.dialog.open(EvaluatePasantiaDialogComponent,{
      width: '60%',
      data: {
        pasantia: data,
        user: this.userData
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  


  openCreateDialog(){
    const dialogRef = this.dialog.open(CreatePasantiaDialogComponent,{
      width: '60%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
