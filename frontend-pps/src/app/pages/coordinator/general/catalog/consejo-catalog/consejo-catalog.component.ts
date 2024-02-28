import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CouncilService } from 'src/app/services/council.service';
import { ConsejoDialogComponent } from './dialogs/consejo-dialog/consejo-dialog.component'
import { UsersService } from 'src/app/services/users.service';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-consejo-catalog',
  templateUrl: './consejo-catalog.component.html',
  styleUrls: ['./consejo-catalog.component.css']
})
export class ConsejoCatalogComponent {

  councilList: any[] = []
  userData: any = null
  displayedColumns: string[] = ['schoolCouncilId', 'schoolSchoolType', 'schoolcouncildate', 'check']

  constructor(
    private councilService: CouncilService,
    private userService: UsersService,
    private dialog: MatDialog
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      this.userService.getUserData(localUserData.userDNI)
      .pipe(
        switchMap(
          (userData) => {
            this.userData = userData
            return this.councilService.getCouncilsBySchool(this.userData.schoolName)
          }
        )
      )
      .subscribe({
        next: (councilList) => {
          console.log(councilList)
          this.councilList = councilList
          this.councilList.forEach ( (consejo: any,index: number) => {
            this.councilList[index].schoolcouncildateformatted = this.formatDate(new Date(consejo.schoolcouncildate))
          })
        }
      })
    }
   
  }
  openCreateDialog(){
    
    const dialogRef = this.dialog.open(ConsejoDialogComponent,{
      width: '60%',
      data: {
        user: this.userData,
        mode: "CREAR"
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }

  editarRegistro(element: any){
    
    const dialogRef = this.dialog.open(ConsejoDialogComponent,{
      width: '60%',
      data: {
        data: element,
        user: this.userData,
        mode: "EDITAR"
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }

  eliminarRegistro(element: any){

    console.log(element)
    this.councilService.deleteCouncilById(element.schoolCouncilId).subscribe({
      next: (result) => {
        console.log(result)
        window.location.href = window.location.href
      }
    })
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  
    const locale = "es-ES"; // Cambiar según el idioma deseado
  
    return date.toLocaleDateString(locale, options);
  }

}
