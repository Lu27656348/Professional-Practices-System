import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { UsersService } from 'src/app/services/users.service';

import { ProfesionalDialogComponent } from './dialogs/profesional-dialog/profesional-dialog.component'

@Component({
  selector: 'app-profesional-catalog',
  templateUrl: './profesional-catalog.component.html',
  styleUrls: ['./profesional-catalog.component.css']
})
export class ProfesionalCatalogComponent {

  externalList: any[] = []
  externalDataList: any[] = []
  displayedColumns: string[] = ['externalPersonnelDNI', 'userName', 'schoolName', 'professorProfession', 'check']

  constructor(
    private userService: UsersService, 
    private externalPersonnelService: ExternalPersonnelService,
    private enterpriseService: EnterpriseService,
    private dialog: MatDialog
  ){
    this.externalPersonnelService.getAllExternal()
    .pipe(
      switchMap(
        (externalList) => {
          this.externalList = externalList
          const observables: Observable<any>[] = []
          console.log(this.externalList)
          this.externalList.forEach( (external: any, index: number) => {
            observables.push(this.userService.getUserData(external.externalPersonnelDNI))
          })
          return forkJoin(observables)
        }
      ),
      switchMap( 
        (externalDataList) => {
          console.log(externalDataList)
          this.externalDataList = externalDataList;
          this.externalDataList.forEach( (external: any, index: any) => {
            this.externalList.forEach( (externalData) => {
              if(externalData.externalPersonnelDNI == external.userDNI){
                this.externalDataList[index].externalData = externalData
              }
            })
          })

          return this.enterpriseService.getEnterprises()
        }
      ),
      switchMap( 
        (enterpriseList) => {
          console.log(enterpriseList)
          console.log(this.externalDataList)
          this.externalDataList.forEach( (external: any, index: any) => {
            enterpriseList.forEach( (enterprise: any) => {
              if(external.externalData.externalPersonnelEnterpriseId == enterprise.enterpriseid){
                this.externalDataList[index].enterpriseData = enterprise
              }
            })
          })

          return of(null)
        }
      )
    )
    .subscribe({
      next: (result) => {
        console.log(this.externalDataList)
        console.log(result)
      }
    })
  }

  openCreateDialog(){
    
    const dialogRef = this.dialog.open(ProfesionalDialogComponent,{
      width: '60%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }

  editarRegistro(element: any){
    
    const dialogRef = this.dialog.open(ProfesionalDialogComponent,{
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
      }
    }) 
  }

}
