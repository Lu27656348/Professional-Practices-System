import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { forkJoin, of } from 'rxjs';
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


    }else{
      this.router.navigateByUrl("");
    }
  }

  ngOnInit(){

    this.graduateworkService.getAcademicTutorGraduateWork(this.localUser.userDNI).subscribe({
      next: (data) => {
        console.log(data)
        this.reviewerData = data

      }
    })

  }
  openDialog(data: any) {
    console.log(data)
    const dialogRef = this.dialog.open(DialogTutorComponent,{
      width: '60%',
      data: {
        revisionData: data
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
