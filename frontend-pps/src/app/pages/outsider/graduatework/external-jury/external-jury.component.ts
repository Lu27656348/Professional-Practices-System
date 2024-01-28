import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { ProfessorJuryDialogComponent } from 'src/app/pages/professor/graduatework/professor-jury/professor-jury-dialog/professor-jury-dialog.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-external-jury',
  templateUrl: './external-jury.component.html',
  styleUrls: ['./external-jury.component.css']
})
export class ExternalJuryComponent {

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'Authors', 'Report',"Check"];
  juryDataList: any[] = []
  localUser: any = null;

  studentList: any[] = [];
  graduateWorkData: any = null;
  professorData: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UsersService,
    private graduateWorkService: GraduateworkService

  ){
    const userString = localStorage.getItem('user')

    if(userString){
      console.log("LOCAL STORAGE")

      this.localUser = JSON.parse(userString);
      console.log(this.localUser);

      this.graduateWorkService.getFinalDefensePending(this.localUser.userDNI).pipe(
        switchMap(
          (juryDataList) => {
            console.log(juryDataList)
            this.juryDataList = juryDataList;
            juryDataList.forEach((graduateWork: any,index: number) => {
              juryDataList[index].graduateWorkDefenseDate = new Date(graduateWork.graduateWorkDefenseDate).toUTCString();
            })
            console.log(juryDataList)
            this.juryDataList = juryDataList;
            const observables: Observable<any>[] = []
            this.juryDataList.forEach( (proposal:any) => {
              observables.push(this.graduateWorkService.getGraduateWorkStudentData(proposal.graduateWorkId))
            })
            return forkJoin(observables)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
          this.juryDataList.forEach( (proposal:any,indexP: number) => {
            let authors = ""; 
            result[indexP].forEach( (author: any, index: number) => {
             console.log(result[indexP])
             if(index == 0){
               authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0] + "/";
             }else{
               authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0];
             } 
             console.log(result[indexP][0])
             this.juryDataList[indexP].studentDNI = result[indexP][0].userDNI;
            })
            this.juryDataList[indexP].authors = authors;
           })

        }
      })
    }else{
      this.router.navigateByUrl("");
    }
    
  } 

  openDialog(element: any){
    console.log(element)
    this.graduateWorkService.getGraduateWorkById(element.graduateWorkId).pipe(
      switchMap(
        (graduateWorkData) => {
          this.graduateWorkData = graduateWorkData
          return this.graduateWorkService.getGraduateWorkStudentData(this.graduateWorkData.graduateworkid)
        }
      ),
      switchMap(
        (studentList) => {
          this.studentList = studentList
          return this.userService.getUserData(this.localUser.userDNI)
        }
      )
    ).subscribe({
      next: (result) => {
        console.log(result)
        const dialogRef = this.dialog.open(ProfessorJuryDialogComponent,{
          width: '80%',
          
          data: {
            graduateWorkData: this.graduateWorkData,
            studentData: this.studentList,
            professorData: result
          }
  
        })
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    })
    
  }

  obtenerInformeFinal(){
    console.log("obtenerInformeFinal()")
  }

}
