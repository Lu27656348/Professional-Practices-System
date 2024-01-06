import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { DialogsComponent } from './dialogs/dialogs.component'


@Component({
  selector: 'app-professor-reviewer',
  templateUrl: './professor-reviewer.component.html',
  styleUrls: ['./professor-reviewer.component.css']
})
export class ProfessorReviewerComponent implements OnInit{
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

  graduateWorkData: any = null;
  userData: any = null;

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){}

  ngOnInit(){
    this.graduateworkService.getReviewersPending().subscribe({
      next: (data) => {
        this.reviewerData = data;
      }
    })
  
  }

  openDialog(data: any) {
    console.log(data)

    forkJoin([this.userService.getUserData(data.studentDNI),this.graduateworkService.getGraduateWorkById(data.graduateWorkId)])
    .subscribe( ([userData,graduateWorkData]) => {
      this.userData = userData;
      this.graduateWorkData = graduateWorkData

      const dialogRef = this.dialog.open(DialogsComponent,{
        width: '60%',
        data: {
          user: this.userData,
          graduatework: this.graduateWorkData
        }
      })
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

    })
    
  }
}
