import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap, Observable, forkJoin, of } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';
import { DialogCouncilComponent } from '../council/dialog-council/dialog-council.component';
import { DesarrolloTgDialogComponent } from './desarrollo-tg-dialog/desarrollo-tg-dialog.component';

@Component({
  selector: 'app-desarrollo-tg',
  templateUrl: './desarrollo-tg.component.html',
  styleUrls: ['./desarrollo-tg.component.css']
})
export class DesarrolloTGComponent {
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  coordinatorData: any = {}

  councilData: any = [];

  proposal: any[] = [];

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getGraduateWorkByStatus(50).pipe(
      switchMap(
        (data) => {
          this.councilData = data
          const observables: Observable<any>[] = []
          this.councilData.forEach( (proposal:any) => {
            observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateworkid))
          })
          return forkJoin(observables)
        }
      ),
      switchMap(
        (data) => {
          console.log(this.councilData)
          this.councilData.forEach( (proposal:any,indexP: number) => {
            let authors = ""; 
            data[indexP].forEach( (author: any, index: number) => {
             console.log(data[indexP])
             if(index == 0){
               authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0] + "/";
             }else{
               authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0];
             } 
             console.log(data[indexP][0])
             this.councilData[indexP].studentDNI = data[indexP][0].userDNI;
             
            })
            let fechaFinal = new Date(proposal.schoolCouncilApprovalDate as number);
            fechaFinal.setDate(fechaFinal.getDate() + 150);
            let fechaComienzo = new Date();
            this.councilData[indexP].diferencia = Math.floor((fechaFinal.getTime() - fechaComienzo.getTime()) / (1000 * 60 * 60 * 24));
            this.councilData[indexP].authors = authors;
           })
           return of(this.councilData)
        }
      ),
    ).subscribe({
      next: (data: any) => {
        console.log(data)
        this.councilData = [...data]
        console.log(this.councilData)
      },
      error: (error: any) => {
        console.log(error)
      }
    })

    const userString = localStorage.getItem('user')
    const rolesString = localStorage.getItem('roles')

    if(userString && rolesString){
      console.log("LOCAL STORAGE")

      this.localUser = JSON.parse(userString);
      
      this.data = {...this.localUser.user}

      const rolesRequest = JSON.parse(rolesString);
      console.log(rolesRequest)

      for (let i = 0; i < rolesRequest.length; i++) {
        this.roles.push(rolesRequest[i]);
      }
      console.log(this.roles)

      this.roleSelected = this.userService.getMode();
      this.isRoleSelected = true;


      console.log(this.localUser);


    }else{
      this.router.navigateByUrl("");
    }

  }

  openDialog(data: any) {

    console.log(data)

    forkJoin([this.graduateworkService.getGraduateWorkStudentData(data.graduateworkid),this.graduateworkService.getGraduateWorkById(data.graduateworkid)]).subscribe({
      next: ([userData,graduateWorkData]) => {

        const dialogRef = this.dialog.open(DesarrolloTgDialogComponent,{
          width: '60%',
          data: {
            userData: userData,
            graduateWorkData: graduateWorkData
          }
        })
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    })

  }
  ngOnInit(){

    this.userService.getUserData(this.data.userDNI).subscribe({
      next: (data) => {
        console.log(data)
      }
    })

  }
}
