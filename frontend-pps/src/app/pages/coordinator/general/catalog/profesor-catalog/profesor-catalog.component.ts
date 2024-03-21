import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';
import { ProfesorDialogComponent } from './dialogs/profesor-dialog/profesor-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profesor-catalog',
  templateUrl: './profesor-catalog.component.html',
  styleUrls: ['./profesor-catalog.component.css']
})
export class ProfesorCatalogComponent {

  professorList: any[] = []
  professorDataList: any[] = []
  displayedColumns: string[] = ['professorDNI', 'userName', 'professorProfession', 'check']

  constructor(
    private userService: UsersService, 
    private professorService: ProfessorsService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ){
    this.professorService.getProfessorsData()
    .pipe(
      switchMap(
        (professorList) => {
          this.professorList = professorList
          const observables: Observable<any>[] = []
          this.professorList.forEach( (professor: any, index: number) => {
            observables.push(this.userService.getUserData(professor.professorDNI))
          })
          return forkJoin(observables)
        }
      ),
      switchMap( 
        (professorDataList) => {
          console.log(professorDataList)
          this.professorDataList = professorDataList;
          this.professorDataList.forEach( (professor: any, index: any) => {
            this.professorList.forEach( (professorData) => {
              if(professorData.professorDNI == professor.userDNI){
                this.professorDataList[index].professorData = professorData
              }
            })
          })
          return of(null)
        }
      )
    )
    .subscribe({
      next: (result) => {
        console.log(this.professorDataList)
        console.log(result)
      }
    })
  }

  

  openCreateDialog(){
    const dialogRef = this.dialog.open(ProfesorDialogComponent,{
      width: '60%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editarRegistro(element: any){
    const dialogRef = this.dialog.open(ProfesorDialogComponent,{
      width: '60%',
      data: {
        data: element,
        mode: "EDITAR"
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  eliminarRegistro(element: any){
    console.log(element)
    this.userService.deleteUserById(element.userDNI).subscribe({
      next: (result) => {
        console.log(result)
        window.location.href = window.location.href
      },
      error: (result) => {
        this._snackBar.open("No se puede eliminar al profesor", "cerrar", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "bottom"
        })
        throw new Error(result.message)
        
      }
    }) 
  }
}
