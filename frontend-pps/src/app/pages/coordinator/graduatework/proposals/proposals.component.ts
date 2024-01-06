import { Component,OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { ValidationComponent } from './dialogs/validation/validation.component'
import { StudentService} from '../../../../services/student.service'
import { forkJoin, of } from 'rxjs';
interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit{
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  coordinatorData: any = {}

  proposalData: any = [];

  proposal: any[] = [];

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];
  dataSource = ELEMENT_DATA;

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    this.graduateworkService.getProposals().subscribe({
      next: (data: any) => {
        console.log(data)
        this.proposalData = [...data]
        console.log(this.proposalData)
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

    forkJoin([ this.userService.getUserData(data.studentDNI),this.graduateworkService.getCurrentGraduateWork(data.studentDNI), this.graduateworkService.getGraduateWorkById(data.graduateWorkId)])
    .subscribe(([result1,result2,result3]) => {
      console.log(result1)
      console.log(result2)
      console.log(result3)
      const dialogRef = this.dialog.open(ValidationComponent,{
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
  
    this.userService.getUserData(data.studentDNI).subscribe({
      next: (data) => {
        studentData = {...data}
        console.log(studentData)
      }
    })

  this.studentService.getStudentGraduateWork(data.studentDNI).subscribe({
    next: (data: any) => {
      graduateWorkData = [...data]
      this.proposal = graduateWorkData
      console.log(graduateWorkData)
      this.graduateworkService.getGraduateWorkById(graduateWorkData[0].graduateworkid).subscribe({
        next: (data) => {
          console.log(data)
        }
      })
    }
  })
/*
    const dialogRef = this.dialog.open(ValidationComponent,{
      data: {
        user: this.user,
        proposal: this.proposal
      }
    });
*/
/*
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
*/
  }
  ngOnInit(){
    /*
    this.studentService.getStudentCoordinator().subscribe({
      next: (data) => {
        console.log(data);
        this.coordinatorData = {...data}
      }
    })
    */
  }

  goBack(){
    this.router.navigateByUrl("/dashboard");
  }

  editProposal(data: any){
    console.log(data);
  }

  deleteProposal(data: any){
    console.log(data);
  }
}
