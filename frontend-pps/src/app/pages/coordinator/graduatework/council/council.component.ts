import { Component,OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { StudentService} from '../../../../services/student.service'
import { forkJoin, of } from 'rxjs';

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

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getCouncilPending().subscribe({
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

    forkJoin([this.userService.getUserData(data.studentDNI),this.graduateworkService.getGraduateWorkById(data.graduateWorkId)]).subscribe({
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
