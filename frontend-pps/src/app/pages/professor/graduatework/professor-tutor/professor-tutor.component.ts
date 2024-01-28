import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'

import { GraduateWorkTable } from '../../../../interfaces/GraduateWorkTable'

import { DialogTutorComponent } from './dialog-tutor/dialog-tutor.component'

@Component({
  selector: 'app-professor-tutor',
  templateUrl: './professor-tutor.component.html',
  styleUrls: ['./professor-tutor.component.css']
})
export class ProfessorTutorComponent implements OnInit{
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  reviewerData: any = [];
  graduateWorkData: any = []
  tableData: GraduateWorkTable[] = []

  proposal: any[] = [];

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){

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

      this.graduateworkService.getAcademicTutorGraduateWork(this.localUser.userDNI).pipe(
        switchMap(
          (data) => {
            console.log(data)
            this.reviewerData = data
            const observables: Observable<any>[] = []
            this.reviewerData.forEach( (proposal:any) => {
              observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateWorkId))
            })
            return forkJoin(observables)
          }
        ),
        switchMap(
          (data) => {
            console.log(data)
            this.reviewerData.forEach( (proposal:any,indexP: number) => {
              let authors = ""; 
              data[indexP].forEach( (author: any, index: number) => {
               console.log(data[indexP])
               if(index == 0){
                 authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0] + "/";
               }else{
                 authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0];
               } 
               console.log(data[indexP][0])
               this.reviewerData[indexP].studentDNI = data[indexP][0].userDNI;
              })
              this.reviewerData[indexP].authors = authors;
             })
             return of(this.reviewerData)
          }
        ),
      ).subscribe({
        next: (data) => {
          console.log(data)
          this.reviewerData = data
        }
      })

    }else{
      this.router.navigateByUrl("");
    }
  }

  ngOnInit(){

  

  }
  openDialog(data: any) {
    console.log(data)
    const dialogRef = this.dialog.open(DialogTutorComponent,{
      width: '60%',
      data: {
        revisionData: data,
        tutorData: this.localUser
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
