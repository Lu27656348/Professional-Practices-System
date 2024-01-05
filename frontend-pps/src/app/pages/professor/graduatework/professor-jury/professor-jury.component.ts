import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
@Component({
  selector: 'app-professor-jury',
  templateUrl: './professor-jury.component.html',
  styleUrls: ['./professor-jury.component.css']
})
export class ProfessorJuryComponent {
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  reviewerData: any = [];

  proposal: any[] = [];

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){}

  ngOnInit(){

  
  }

  openDialog(data: any) {
    console.log(data)
    /*
    const dialogRef = this.dialog.open(AssignmentComponent,{
      width: '60%',
      data: {
        gw: data
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    */
  }
}
