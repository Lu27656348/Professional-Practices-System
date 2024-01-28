import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { ProfessorJuryDialogComponent } from './professor-jury-dialog/professor-jury-dialog.component'
import { TegFinalFormService } from '../../../../form-generator/services/teg-final-form.service'
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
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

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI','defenseDate','symbol',"check"];


  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private graduateworkService: GraduateworkService, private dialog: MatDialog, private studentService: StudentService, private finalTEGService: TegFinalFormService,private formGeneratorService: EvaluationFormGeneratorService){
    console.log(this.currentDate)
    const localStorageUser = localStorage.getItem('user')
    if(localStorageUser){
      const localStorageUserData = JSON.parse(localStorageUser);
      console.log(localStorageUserData)
      this.graduateworkService.getFinalDefensePending(localStorageUserData.userDNI).pipe(
        switchMap(
          (defensePendingList) => {
            defensePendingList.forEach((graduateWork: any,index: number) => {
              defensePendingList[index].graduateWorkDefenseDate = new Date(graduateWork.graduateWorkDefenseDate).toUTCString();
            })
            console.log(defensePendingList)
            this.reviewerData = defensePendingList;
            const observables: Observable<any>[] = []
            this.reviewerData.forEach( (proposal:any) => {
              observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateWorkId))
            })
            return forkJoin(observables)
          }
        )
      ).subscribe({
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
        }
      })
      this.userService.getUserData(localStorageUserData.userDNI).subscribe({
        next: (data) => {
          console.log(data);
          this.professorData = data
        }
      });
    }
    
  }

  ngOnInit(){
  
  }

  openDialog(data: any) {
    console.log(data)
    this.graduateworkService.getGraduateWorkById(data.graduateWorkId).pipe(
      switchMap(
        (graduateWorkData) => {
          return of(graduateWorkData)
        }
      )
    ).subscribe(
      {
        next: (result) => {
          console.log(new Date())
          console.log(result.graduateWorkDefenseDate)
          console.log(new Date(result.graduateWorkDefenseDate))

          const dateTime = new Date(result.graduateWorkDefenseDate - 8 * 60 * 60 * 1000)

          const currentDate = new Date()
          console.log(currentDate)
          console.log(dateTime)
          if(currentDate >= dateTime ){
            forkJoin([this.userService.getUserData(data.studentDNI),this.graduateworkService.getGraduateWorkById(data.graduateWorkId)])
            .subscribe( ([userData, graduateWorkData]) => {
              const dialogRef = this.dialog.open(ProfessorJuryDialogComponent,{
                width: '80%',
                data: {
                  graduateWorkData: graduateWorkData,
                  studentData: userData,
                  professorData: this.professorData
                }
              })
          
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
              });
            })
            
          }else{
            console.log("No es el dia de la defensa")
            this.isDefenseDate = false
            alert("La defensa sera en: " + dateTime )
          }
        }
      }
    )
    
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
    /*
    this.finalTEGService.printFinalEvaluationTEGForm(
        this.finalTEGService.generateFinalEvaluationTEGForm({
          "tg": {
            "titulo": "Hola"
          },
          "alumnos": [
            {
              nombres: "Luis Carlos",
              apellidos: "Somoza Ledezma"
            }
          ]
        })
    )
    */
   console.log("hola")
   const body = {
    studentList: [
      {
        userDNI: "V-11515881",
        userEmail: "anyledezmad@est.ucab.edu.ve",
        userFirstName: "Joanny Josefina",
        userLastName: "Ledezma Diaz",
        userPhone: "+58-4122155879",
      }
    ],
    graduateWorkData: element,
    sectionList: [
      {
        formSectionName: "Presentacion"
      },
      {
        formSectionName: "Redaccion"
      },
      {
        formSectionName: "Justificacion del Problema"
      },
      {
        formSectionName: "Metodologia Aplicada"
      },
      {
        formSectionName: "Resultados"
      },
    ]
   }
   this.formGeneratorService.printEvaluationForm(this.formGeneratorService.generateEvaluationForm(body))
  }
}
