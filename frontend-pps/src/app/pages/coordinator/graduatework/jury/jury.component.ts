import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'

import { JuryDialogComponent } from './jury-dialog/jury-dialog.component'

@Component({
  selector: 'app-jury',
  templateUrl: './jury.component.html',
  styleUrls: ['./jury.component.css']
})
export class JuryComponent {
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  reviewerData: any = [];

  proposal: any[] = [];

  studentData : any = null;
  graduateWorkData : any = null;

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getJuryPending().subscribe({
      next: (data: any) => {
        console.log(data)
        this.reviewerData = [...data]
        console.log(this.reviewerData)
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

    forkJoin([ this.userService.getUserData(data.studentDNI),this.studentService.getStudentGraduateWork(data.studentDNI), this.graduateworkService.getGraduateWorkById(data.graduateWorkId)])
    .subscribe(([result1,result2,result3]) => {
      console.log(result1)
      this.studentData = result1;
      this.graduateWorkData = result3;

      const dialogRef = this.dialog.open(JuryDialogComponent,{
        width: '60%',
        data: {
          graduateWorkData: this.graduateWorkData,
          studentData: this.studentData
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
      
      });

    
  }

  ngOnInit(){

  
  }

  goBack(){
    this.router.navigateByUrl("/dashboard");
  }


  }
  

