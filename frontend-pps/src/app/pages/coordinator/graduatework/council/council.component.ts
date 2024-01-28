import { Component,OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { StudentService} from '../../../../services/student.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';

import { DialogCouncilComponent } from './dialog-council/dialog-council.component'

@Component({
  selector: 'app-council',
  templateUrl: './council.component.html',
  styleUrls: ['./council.component.css']
})
export class CouncilComponent implements OnInit{
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
    this.graduateworkService.getCouncilPending().pipe(
      switchMap(
        (data) => {
          this.councilData = [...data]
          const observables: Observable<any>[] = []
          this.councilData.forEach( (proposal:any) => {
            observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateWorkId))
          })
          return forkJoin(observables)
        }
      ),
      switchMap(
        (data) => {
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

    forkJoin([this.graduateworkService.getGraduateWorkStudentData(data.graduateWorkId),this.graduateworkService.getGraduateWorkById(data.graduateWorkId)]).subscribe({
      next: ([userData,graduateWorkData]) => {

        const dialogRef = this.dialog.open(DialogCouncilComponent,{
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
    /*
    this.studentService.getStudentCoordinator().subscribe({
      next: (data) => {
        console.log(data);
        this.coordinatorData = {...data}
      }
    })
    */
  }

}
