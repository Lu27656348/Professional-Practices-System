import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'

import { JuryDialogComponent } from './jury-dialog/jury-dialog.component'

@Component({
  selector: 'app-jury',
  templateUrl: './jury.component.html',
  styleUrls: ['./jury.component.css']
})
export class JuryComponent {

  panelOpenState = false;
  
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
  studentList: any = null;

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getJuryPending().pipe(
      switchMap(
        (data: any) => {
          console.log(data)
          this.reviewerData = [...data]
          const observables: Observable<any>[] = []
          this.reviewerData.forEach( (proposal:any) => {
            observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateWorkId))
          })
          return forkJoin(observables)
        }
      )
    )
    .subscribe({
      next: (data: any) => {
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
    this.graduateworkService.getGraduateWorkById(data.graduateWorkId).pipe(
      switchMap(
        (graduateWorkData) => {
          console.log(graduateWorkData)
          this.graduateWorkData = graduateWorkData
          return this.graduateworkService.getGraduateWorkStudentData(graduateWorkData.graduateworkid)
        }
      )
    ).subscribe({
      next: (result) => {
        console.log(result)
        this.studentList = result
        const dialogRef = this.dialog.open(JuryDialogComponent,{
          width: '60%',
          data: {
            graduateWorkData: this.graduateWorkData,
            studentData: this.studentList
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });

      }
    })
  }

  ngOnInit(){

  
  }

  goBack(){
    this.router.navigateByUrl("/dashboard");
  }


  }
  

