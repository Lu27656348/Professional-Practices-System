import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { ProfessorJuryDialogComponent } from './professor-jury-dialog/professor-jury-dialog.component'
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

  currentDate: Date = new Date();

  isDefenseDate: boolean = true;

  reviewerData: any = [];
  userData: any = null;

  professorData: any = null;
  proposal: any[] = [];

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService){
    console.log(this.currentDate)
    const localStorageUser = localStorage.getItem('user')
    if(localStorageUser){
      const localStorageUserData = JSON.parse(localStorageUser);
      console.log(localStorageUserData)
      this.graduateworkService.getFinalDefensePending(localStorageUserData.userDNI).subscribe({
        next: (defensePendingList) => {
          this.reviewerData = defensePendingList;
        }
      })
      this.userService.getUserData(localStorageUserData.userDNI).subscribe({
        next: (data) => {
          console.log(data);
          this.professorData = data
        }
      })
    }
    
  }

  ngOnInit(){
  
  }

  openDialog(data: any) {
    console.log(data)
    forkJoin([this.userService.getUserData(data.studentDNI),this.graduateworkService.getGraduateWorkById(data.graduateWorkId)])
    .subscribe( ([userData, graduateWorkData]) => {
      console.log(userData)
      console.log(graduateWorkData)
      const defenseDate = new Date(graduateWorkData.graduateWorkDefenseDate)
      console.log(defenseDate.toLocaleDateString())
      console.log(this.currentDate.toLocaleDateString())
      if(defenseDate.toLocaleDateString() == this.currentDate.toLocaleDateString()){
        this.isDefenseDate = true
        const dialogRef = this.dialog.open(ProfessorJuryDialogComponent,{
          width: '60%',
          data: {
            graduateWorkData: graduateWorkData,
            studentData: userData,
            professorData: this.professorData
          }
        })
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });

      }else{
        console.log("No es el dia de la defensa")
        this.isDefenseDate = false
        alert("La defensa sera en: " + defenseDate.toLocaleDateString() )
      }

    })

    
  }

  obtenerFechaTrabajoDeGrado( graduateWorkId: string ) : boolean {
    this.graduateworkService.getGraduateWorkById(graduateWorkId).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: () => {
      },
      complete: () => {
      }
    })
    return false;
  }

  obtenerInformeEstudiante(element: any){
    console.log(element)
  }
}
