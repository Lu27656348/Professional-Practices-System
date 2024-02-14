import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommitteeService } from 'src/app/services/committee.service';
import { ComiteDialogComponent } from './dialogs/comite-dialog/comite-dialog.component'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comite-catalog',
  templateUrl: './comite-catalog.component.html',
  styleUrls: ['./comite-catalog.component.css']
})
export class ComiteCatalogComponent {
  comiteList: any[] = []
  displayedColumns: string[] = ['comiteId','fechaComite','check']

  constructor(
    private comiteService: CommitteeService,
    private dialog: MatDialog,
  ){
    this.comiteService.getCommittees().subscribe({
      next: (comiteList) => {
        console.log(comiteList)
        this.comiteList = comiteList
        this.comiteList.forEach( (comite: any, index: number) => {
          this.comiteList[index].committeeDateFormatted = this.formatDate(new Date(comite.committeeDate))
        })
      }
    })
  }
  openCreateDialog(){
    
    const dialogRef = this.dialog.open(ComiteDialogComponent,{
      width: '60%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }

  editarRegistro(element: any){
    
    const dialogRef = this.dialog.open(ComiteDialogComponent,{
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
    this.comiteService.deleteCommittee(element.committeeId).subscribe({
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
