import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { UsersService } from 'src/app/services/users.service';
import { EmpresaDialogComponent } from './dialogs/empresa-dialog/empresa-dialog.component';

@Component({
  selector: 'app-empresa-catalog',
  templateUrl: './empresa-catalog.component.html',
  styleUrls: ['./empresa-catalog.component.css']
})
export class EmpresaCatalogComponent {

  enterpriseList: any[] = []
  displayedColumns: string[] = ['enterpriseName', 'enterpriseDescription', 'enterpriseAddress', 'check']

  constructor(
    private userService: UsersService, 
    private enterpriseService: EnterpriseService,
    private dialog: MatDialog
  ){
    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseList) => {
        console.log(enterpriseList)
        this.enterpriseList = enterpriseList
      }
    })
  }
  openCreateDialog(){
    
    const dialogRef = this.dialog.open(EmpresaDialogComponent,{
      width: '60%'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }

  editarRegistro(element: any){
    
    const dialogRef = this.dialog.open(EmpresaDialogComponent,{
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
    this.enterpriseService.deleteEnterpriseById(element.enterpriseid).subscribe({
      next: (result) => {
        console.log
        (result)
        window.location.href = window.location.href
      }
    })
  }
}
