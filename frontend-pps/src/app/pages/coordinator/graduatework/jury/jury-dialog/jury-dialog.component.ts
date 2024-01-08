import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UsersService } from '../../../../../services/users.service';
import { StudentService} from '../../../../../services/student.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'
import  {ExternalPersonnelService } from '../../../../../services/external-personnel.service'
import { Subscription,forkJoin,of,switchMap  } from 'rxjs';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-jury-dialog',
  templateUrl: './jury-dialog.component.html',
  styleUrls: ['./jury-dialog.component.css']
})
export class JuryDialogComponent implements OnInit {
  inputdata: any = null

  jurySelected: any = null;
  jurySelected2: any = null;
  jurySelected3: any = null;
  jurySelected4: any = null;

  juryList: any = null

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private userService: UsersService, private graduateworkService: GraduateworkService, private studentService: StudentService, private externalService: ExternalPersonnelService){
    this.inputdata = this.data
    console.log(this.inputdata)
  }

  ngOnInit(){

    this.externalService.getInTutors().pipe(
      switchMap( ( juryList ) => {
        console.log(juryList)
        this.juryList = juryList;
        return this.studentService.getStudentCoordinator(this.inputdata.studentData.userDNI);
      }),
      switchMap( ( coordinatorData ) => {
        console.log(coordinatorData)
        const coordinatorId = coordinatorData.professordni;
        const objetosFiltrados = this.juryList.filter((objeto : any) => objeto.userDNI !== coordinatorId);
        return of(objetosFiltrados);
      }),
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.juryList = data;
      }
    })
    


  }

  juryListHandler (element : any){
    console.log(element)
    
  }

 
  

  createJury(){
    console.log(this.inputdata.graduateWorkData.graduateWorkCoordinator)
    let areDifferent = [this.jurySelected, this.jurySelected2, this.jurySelected3, this.jurySelected4].every(
      (valor, indice, array) => {
        return array.indexOf(valor) === indice;
      }
    );
    if(areDifferent){
      if(this.jurySelected !== null && this.jurySelected2 !== null && this.jurySelected3 !== null && this.jurySelected4 !== null){
        
        this.graduateworkService.createJury(this.jurySelected, this.inputdata.graduateWorkData.graduateworkid,1).subscribe({
          next: (data) => {
            console.log(data);
          }
        })
        this.graduateworkService.createJury(this.inputdata.graduateWorkData.graduateWorkCoordinator, this.inputdata.graduateWorkData.graduateworkid,1).subscribe({
          next: (data) => {
            console.log(data);
          }
        })
        this.graduateworkService.createJury(this.jurySelected2,this.inputdata.graduateWorkData.graduateworkid,1).subscribe({
          next: (data) => {
            console.log(data);
          }
        })
        this.graduateworkService.createJury(this.jurySelected3,this.inputdata.graduateWorkData.graduateworkid,2).subscribe({
          next: (data) => {
            console.log(data);
          }
        })
        
        this.graduateworkService.createJury(this.jurySelected4,this.inputdata.graduateWorkData.graduateworkid,2).subscribe({
          next: (data) => {
            console.log(data);
          }
        })

        this.graduateworkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,70).subscribe({
          next: (data) => {
            console.log(data)
          },
          complete: () => {
            window.location.href = window.location.href;
          }
        })
        console.log("Creando jurados")
      }else{
        alert("NO HA SELECCIONADO A TODOS LOS JURADOS")
      }
    }else{
      alert("NO PUEDE HABER DOS JURADOS IGUALES")
    }

    
  }
}
