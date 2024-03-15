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
import * as ExcelJS from 'exceljs'
import * as fs from 'file-saver'

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

  generarReportePresentaciones(){

    console.log(this.reviewerData)

    console.log("generarReportePasantia()")
    const _workbook: ExcelJS.Workbook = new ExcelJS.Workbook();

    _workbook.creator = 'Luis C. Somoza';
    _workbook.lastModifiedBy = 'Luis C. Somoza';
    _workbook.created = new Date();
    _workbook.modified = new Date();
    _workbook.lastPrinted = new Date();

    _workbook.calcProperties.fullCalcOnLoad = true;

    const sheet = _workbook.addWorksheet('Presentaciones');

    sheet.getColumn("A").width = 3

    sheet.getColumn("B").width = 20
    sheet.getColumn("C").width = 20
    sheet.getColumn("D").width = 20
    sheet.getColumn("E").width = 20
    sheet.getColumn("F").width = 20
    sheet.getColumn("G").width = 45

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
    cabecera.value = "Presentación de Trabajos de Grado"
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

    const cabeceraNRC = sheet.getCell("A2");
    cabeceraNRC.value = "NRC - 17464"
    cabeceraNRC.font = {
      name: 'Trebuchet MS',
      size: 20,
      bold: true
    }
    cabeceraNRC.fill = {
      type: 'pattern',
      pattern: "solid",
      fgColor: {
        argb: 'B0E5F6'
      }
    }
    cabeceraNRC.alignment = {
      horizontal: "center"
    }

    sheet.getRow(3).height = 30
    /* Inyectamos la cabecera  */
    sheet.getCell("B4").value = "Nro. Expediente"
    sheet.getCell("B4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("C4").value = "Cédula"
    sheet.getCell("C4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("D4").value = "Estudiante"
    sheet.getCell("D4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("E4").value = "Título"
    sheet.getCell("E4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("F4").value = "Tipo"
    sheet.getCell("F4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("G4").value = "Tutor Empresarial"
    sheet.getCell("G4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    /* Datos de Tutor Académico */
    sheet.getCell("H4").value = "Cédula"
    sheet.getCell("H4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("I4").value = "Tutor"
    sheet.getCell("I4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    /* Datos de Jurado 1 */
    sheet.getCell("J4").value = "Cédula"
    sheet.getCell("J4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("K4").value = "Jurado1"
    sheet.getCell("K4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    /* Datos de Jurado 2 */
    sheet.getCell("L4").value = "Cédula"
    sheet.getCell("L4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("M4").value = "Jurado2"
    sheet.getCell("M4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }


    /* Datos de Suplente 1 */
    sheet.getCell("N4").value = "Cédula"
    sheet.getCell("N4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("O4").value = "Jurado2"
    sheet.getCell("O4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    /* Datos de Suplente 2 */
    sheet.getCell("P4").value = "Cédula"
    sheet.getCell("P4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }

    sheet.getCell("Q4").value = "Jurado2"
    sheet.getCell("Q4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }


    /* Datos de la Presentación */
    sheet.getCell("R4").value = "Fecha"
    sheet.getCell("R4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("S4").value = "Día"
    sheet.getCell("S4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("T4").value = "Hora"
    sheet.getCell("T4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("U4").value = "Lugar"
    sheet.getCell("U4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("V4").value = "Calificación"
    sheet.getCell("V4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("V4").value = "Observaciones"
    sheet.getCell("V4").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    /* Tipografía */

    sheet.getCell("B4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    
    sheet.getCell("C4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("D4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("E4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("F4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("G4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("H4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("I4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("J4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("K4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("L4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("M4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("N4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("O4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("P4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }

    sheet.getCell("Q4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("R4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("S4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("T4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("U4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("V4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }
    sheet.getCell("W4").font = {
      name: 'Trebuchet MS',
      size: 10,
      bold: true
    }

    this.reviewerData.forEach ( (tg:any, index: number) => {

      sheet.getRow(5+ index).height = 30

      sheet.getCell(`A${5+index}`).value = index + 1;
      sheet.getCell(`A${5+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`A${5+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      
      sheet.getCell(`B${5+index}`).value = tg.studentData.userDNI as string
      sheet.getCell(`B${5+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`B${5+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }

      sheet.getCell(`C${5+index}`).value = `${tg.studentData.userLastName}, ${tg.studentData.userFirstName}`
      sheet.getCell(`C${5+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`C${5+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }

      sheet.getCell(`D${5+index}`).value = tg.graduateWorkTitle
      sheet.getCell(`D${5+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

      sheet.getCell(`F${5+index}`).value = (tg.graduateWorkType == "EXPERIMENTAL") ? "TEG" : "TIG"
      sheet.getCell(`F${5+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

      sheet.getCell(`G${5+index}`).value = ""
      sheet.getCell(`G${5+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

    })

    _workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "Presentaciones - TG.xlsx")
    })

  }
}
