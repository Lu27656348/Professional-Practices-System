import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap, Observable, forkJoin } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';
import { DefenseDialogComponent } from '../defense/defense-dialog/defense-dialog.component';
import { PresentacionDialogComponent } from './presentacion-dialog/presentacion-dialog.component';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent {

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

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getGraduateWorkByStatus(80)
    .pipe(
      switchMap(
        (data: any) => {
          console.log(data)
          this.reviewerData = [...data]
          const observables: Observable<any>[] = []
          this.reviewerData.forEach( (proposal:any) => {
            observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateworkid))
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
    console.log(data);

    
    forkJoin([ this.graduateworkService.getGraduateWorkStudentData(data.graduateworkid),this.graduateworkService.getCurrentGraduateWork(data.studentDNI)])
    .subscribe(([result1,result2]) => {
      console.log(result1)
      console.log(result2)
      
      const dialogRef = this.dialog.open(PresentacionDialogComponent,{
        width: '60%',
        data: {
          studentData: result1,
          graduateWorkData: result2
        }
      })
      
      
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
