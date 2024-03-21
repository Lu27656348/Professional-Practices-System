import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';
import { AssignmentComponent } from '../reviewers/dialogs/assignment/assignment.component';
import { ReviewerEvaluationDialogComponent } from './reviewer-evaluation-dialog/reviewer-evaluation-dialog.component';

import * as ExcelJS from 'exceljs'
import * as fs from 'file-saver'
import { Workbook } from 'exceljs';
import { EnterpriseService } from 'src/app/services/enterprise.service';

@Component({
  selector: 'app-reviewer-evaluation',
  templateUrl: './reviewer-evaluation.component.html',
  styleUrls: ['./reviewer-evaluation.component.css']
})
export class ReviewerEvaluationComponent {

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

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI', 'symbol',"check"];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UsersService,
    private graduateworkService: GraduateworkService,
    private dialog: MatDialog,
    private studentService: StudentService,
    private enterpriseService: EnterpriseService
  ){
    this.graduateworkService.getReviewersPending().pipe(
      switchMap(
        (data) => {
          this.reviewerData = [...data]
          console.log(this.reviewerData)
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
        console.log(data)
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
    this.graduateworkService.getGraduateWorkStudentData(data.graduateWorkId).subscribe({
      next: (studentData) => {
        const dialogRef = this.dialog.open(ReviewerEvaluationDialogComponent,{
          width: '60%',
          data: {
            gw: data,
            administrator: this.localUser,
            user: studentData
          }
        })
    
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

  generarReporteTrabajoGrado(){
    console.log("generarReporteTrabajoGrado()")
    console.log(this.reviewerData)

    const _workbook: Workbook = new ExcelJS.Workbook();

    _workbook.creator = 'Luis C. Somoza';
    _workbook.lastModifiedBy = 'Luis C. Somoza';
    _workbook.created = new Date();
    _workbook.modified = new Date();
    _workbook.lastPrinted = new Date();

    _workbook.calcProperties.fullCalcOnLoad = true;


    const sheet = _workbook.addWorksheet('Propuesta de TG');

    sheet.getColumn("A").width = 3

    sheet.getColumn("B").width = 20
    sheet.getColumn("C").width = 20
    sheet.getColumn("D").width = 20
    sheet.getColumn("E").width = 20
    sheet.getColumn("F").width = 45
    sheet.getColumn("G").width = 20

    sheet.getColumn("H").width = 15
    sheet.getColumn("I").width = 15

    sheet.getColumn("J").width = 20
    sheet.getColumn("K").width = 20
    sheet.getColumn("L").width = 20

    sheet.getColumn("M").width = 15
    sheet.getColumn("N").width = 15
    sheet.getColumn("O").width = 15

    sheet.getRow(1).height = 30
    sheet.getRow(2).height = 30

    sheet.mergeCells("A1:K1")
    sheet.mergeCells("A2:K2")

    const cabecera = sheet.getCell("A1")
    cabecera.value = "Control de Propuestas de Trabajos de Grado 202415 / octubre 2023"
    cabecera.font = {
      name: 'Trebuchet MS',
      size: 20,
      bold: true
    }
    cabecera.fill = {
      type: 'pattern',
      pattern: "solid",
      fgColor: {
        argb: 'B0E5F6'
      }
    }
    cabecera.alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getRow(3).height = 30
    /* Inyectamos la cabecera  */
    sheet.getCell("B3").value = "Cédula"
    sheet.getCell("B3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("C3").value = "Apellidos, Nombres"
    sheet.getCell("C3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("D3").value = "Correo"
    sheet.getCell("D3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("E3").value = "Teléfono"
    sheet.getCell("E3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("F3").value = "Título de la Propuesta"
    sheet.getCell("F3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("G3").value = "Tipo"
    sheet.getCell("G3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("H3").value = "Empresa"
    sheet.getCell("H3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("I3").value = "Tutor Académico / Empresarial"
    sheet.getCell("I3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("J3").value = "Fecha Presentación Comité TG"
    sheet.getCell("J3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("K3").value = "Decisión Comité"
    sheet.getCell("K3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("L3").value = "Profesor Revisor"
    sheet.getCell("L3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("M3").value = "Fecha Aprobación Profesor Revisor"
    sheet.getCell("M3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("N3").value = "Decisión Profesor Revisor"
    sheet.getCell("N3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("O3").value = "Consejo de Escuela Aprobación"
    sheet.getCell("O3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("P3").value = "Tutor Académico Asignado"
    sheet.getCell("P3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("Q3").value = "Consejo de Escuela Asignación Jurado"
    sheet.getCell("Q3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("R3").value = "Jurado"
    sheet.getCell("R3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("S3").value = "Fecha Presentación"
    sheet.getCell("S3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("B3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    
    sheet.getCell("C3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("D3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("E3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("F3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("G3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("H3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("I3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("J3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("K3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("L3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("M3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("N3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("O3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("P3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("Q3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("R3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("S3").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }

    this.reviewerData.forEach ( (tg:any, index: number) => {

      sheet.getRow(4 + index).height = 30

      sheet.getCell(`A${4+index}`).value = index + 1;
      sheet.getCell(`A${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`A${4+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      
      sheet.getCell(`B${4+index}`).value = tg.studentData.userDNI as string
      sheet.getCell(`B${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`B${4+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`C${4+index}`).value = `${tg.studentData.userLastName}, ${tg.studentData.userFirstName}`
      sheet.getCell(`C${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`C${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`D${4+index}`).value = tg.studentData.userEmail
      sheet.getCell(`D${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`D${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`E${4+index}`).value = tg.studentData.userPhone
      sheet.getCell(`E${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`F${4+index}`).value = tg.enterpriseData.enterpriseName
      sheet.getCell(`F${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`G${4+index}`).value = tg.graduateWorkTitle
      sheet.getCell(`G${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

    })

    _workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "Control de Propuestas de Trabajo de Grado.xlsx")
    })

  }
}
