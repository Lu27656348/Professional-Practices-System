import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { CompletionDialogComponent } from './completion-dialog/completion-dialog.component';

@Component({
  selector: 'app-completion',
  templateUrl: './completion.component.html',
  styleUrls: ['./completion.component.css']
})
export class CompletionComponent {
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

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getGraduateWorkByStatus(90)
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
    console.log(this.user)
    console.log(data);

    let studentData;
    let graduateWorkData;

    forkJoin([ this.userService.getUserData(data.studentDNI),this.studentService.getStudentGraduateWork(data.studentDNI), this.graduateworkService.getGraduateWorkById(data.graduateWorkId)])
    .subscribe(([result1,result2,result3]) => {
      console.log(result1)
      console.log(result2)
      console.log(result3)
      
      const dialogRef = this.dialog.open(CompletionDialogComponent,{
        width: '60%',
        data: {
          user: result1,
          proposal: result2,
          graduatework: result3
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
