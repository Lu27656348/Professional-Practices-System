import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UsersService } from '../../../../../services/users.service';
import { StudentService} from '../../../../../services/student.service'
import { GraduateworkService } from '../../../../../services/graduatework.service'
import  {ExternalPersonnelService } from '../../../../../services/external-personnel.service'
import { Observable, Subscription,forkJoin,of,switchMap  } from 'rxjs';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CouncilService } from 'src/app/services/council.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';

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
  councilList: any = null;

  councilSelected: any = null;

  coordinatorData: any = null;
  enterpriseData: any = null;

  selectedValues: any[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private userService: UsersService, private graduateworkService: GraduateworkService, private studentService: StudentService, private externalService: ExternalPersonnelService,private councilService: CouncilService,private enterpriseService: EnterpriseService){
    this.inputdata = this.data
    console.log(this.inputdata)
    this.enterpriseService.getEnterpriseById(this.inputdata.graduateWorkData.graduateWorkEnterprise).subscribe(
      {
        next: (enterpriseData) => {
          this.enterpriseData = enterpriseData
          console.log(this.enterpriseData)
        }
      }
    )

  }

  ngOnInit(){

    this.externalService.getInTutors().pipe(
      switchMap( ( juryList ) => {
        console.log(juryList)
        this.juryList = juryList;
        return this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkAcademicTutor)
      }),
      switchMap( ( coordinatorData ) => {
        console.log(coordinatorData)
        const coordinatorId = coordinatorData?.userDNI;
        this.coordinatorData = coordinatorData;
        const objetosFiltrados = this.juryList.filter((objeto : any) => objeto.userDNI !== coordinatorId);
        return of(objetosFiltrados);
      }),
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.juryList = data;
      },
      complete: () => {
        this.userService.getUserData(this.inputdata.graduateWorkData.graduateWorkAcademicTutor).subscribe({
          next: (academicTutorData) => {
            this.coordinatorData = academicTutorData
          }
        });
        this.councilService.getCouncils().subscribe({
          next: (councilList) => {
            this.councilList = councilList
          }
        })

      }
    })
    


  }

  juryListHandler (element : any){
    console.log(element)
    console.log(this.juryList)
    
  }

 
  

  createJury(){
    console.log(this.inputdata.graduateWorkData)

    let areDifferent = [this.jurySelected, this.jurySelected2, this.jurySelected3, this.jurySelected4].every(
      (valor, indice, array) => {
        return array.indexOf(valor) === indice;
      }
    );
    
    if(areDifferent){
      if(this.jurySelected !== null && this.jurySelected2 !== null && this.jurySelected3 !== null && this.jurySelected4 !== null){
        this.graduateworkService.getGraduateWorkStudentData(this.inputdata.graduateWorkData.graduateworkid).pipe(
          switchMap (
            (studentList) => {
              console.log(studentList)
              const observables: Observable<any>[] = [];
              observables.push(this.graduateworkService.createJury(this.inputdata.graduateWorkData.graduateWorkAcademicTutor, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid,'TUTOR'));
              observables.push(this.graduateworkService.createJury(this.jurySelected, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid));
              observables.push(this.graduateworkService.createJury(this.jurySelected2, this.councilSelected, this.inputdata.graduateWorkData.graduateworkid));
              /* Recordar agregar reemplazos de profesores en esta secccion */
              return forkJoin(observables)
            }
          ),
          switchMap(
            (result) => {
              console.log(result)
              return this.graduateworkService.changeStatus(this.inputdata.graduateWorkData.graduateworkid,70)
            },
          )
        ).subscribe({
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            window.location.href = window.location.href
          }
        })
      }else{
        alert("NO HA SELECCIONADO A TODOS LOS JURADOS")
      }
    }else{
      alert("NO PUEDE HABER DOS JURADOS IGUALES")
    }

    
  }
}
