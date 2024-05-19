import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap, Observable, forkJoin, of } from 'rxjs';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';
import { DialogCouncilComponent } from '../council/dialog-council/dialog-council.component';
import { DesarrolloTgDialogComponent } from './desarrollo-tg-dialog/desarrollo-tg-dialog.component';
import * as ExcelJS from 'exceljs'
import * as fs from 'file-saver'
import { Workbook } from 'exceljs';
import { EnterpriseService } from 'src/app/services/enterprise.service';
@Component({
  selector: 'app-desarrollo-tg',
  templateUrl: './desarrollo-tg.component.html',
  styleUrls: ['./desarrollo-tg.component.css']
})
export class DesarrolloTGComponent {

  panelOpenState = false;
  
  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  coordinatorData: any = {}

  councilData: any = [];

  proposal: any[] = [];

  displayedColumns: string[] = ['graduateWorkId', 'graduateWorkTitle', 'studentDNI',"check"];

  reviewerList: any = null

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UsersService,
    private graduateworkService: GraduateworkService,
    private dialog: MatDialog,
    private studentService: StudentService,
    private enterpriseService: EnterpriseService
  ){
    

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
      this.userService.getUserData(this.localUser.userDNI).subscribe({
        next: (coordinatorData) => {
          this.coordinatorData = coordinatorData
        }
      })


    }else{
      this.router.navigateByUrl("");
    }

    this.graduateworkService.getGraduateWorkByStatus(50).pipe(
      switchMap(
        (data) => {
          this.councilData = data
          const observables: Observable<any>[] = []
          this.councilData.forEach( (proposal:any) => {
            observables.push(this.graduateworkService.getGraduateWorkStudentData(proposal.graduateworkid))
          })
          return forkJoin(observables)
        }
      ),
      switchMap(
        (data) => {
          console.log(this.councilData)
          this.councilData.forEach( (proposal:any,indexP: number) => {
            let authors = ""; 
            data[indexP].forEach( (author: any, index: number) => {
             console.log(data[indexP])
             if(index == 0){
               authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0] + "/";
             }else{
               authors = authors + author.userLastName.split(" ")[0]+ author.userFirstName.split(" ")[0];
             } 
             console.log(data[indexP][0])
             this.councilData[indexP].studentDNI = data[indexP][0].userDNI;
             console.log(author)
             console.log(proposal)
             if(author.graduateWorkId == proposal.graduateworkid){
              this.councilData[indexP].studentData = data[indexP]
             }
            })
            let fechaFinal = new Date(proposal.schoolCouncilApprovalDate as number);
            fechaFinal.setDate(fechaFinal.getDate() + 150);
            let fechaComienzo = new Date();
            this.councilData[indexP].diferencia = Math.floor((fechaFinal.getTime() - fechaComienzo.getTime()) / (1000 * 60 * 60 * 24));
            this.councilData[indexP].authors = authors;
           })
           return of(this.councilData)
        }
      ),
      switchMap(
        (result) => {
          return this.graduateworkService.generarReportePropuestas(this.coordinatorData.schoolName)
        }
      ),
      switchMap(
        (reporteData:any) => {
          console.log(reporteData)
          console.log(this.councilData)
          const observables: Observable<any>[] = []

          this.councilData.forEach( (trabajoGrado:any,index: number) => {
            reporteData.forEach( (filaReporte: any) => {
              if( filaReporte.graduateWorkId == trabajoGrado.graduateworkid){
                if( "studentData" in trabajoGrado){
                  let existe: boolean = false;
                  trabajoGrado.studentData.forEach( (estudiante: any) => {
                    if(estudiante.userDNI == filaReporte.userDNI){
                      existe = true
                    }
                  });
                  if(!existe){
                    this.councilData[index].studentData.push(
                      {
                        userDNI: filaReporte.userDNI,
                        userLastName: filaReporte.userLastName,
                        userFirstName: filaReporte.userFirstName,
                        userEmail: filaReporte.userEmail,
                        userPhone: filaReporte.userPhone
                      }
                    )
                  }
                }else{
                  this.councilData[index].studentData = []
                  this.councilData[index].studentData.push(
                    {
                      userDNI: filaReporte.userDNI,
                      userLastName: filaReporte.userLastName,
                      userFirstName: filaReporte.userFirstName,
                      userEmail: filaReporte.userEmail,
                      userPhone: filaReporte.userPhone
                    }
                  )
                }
              }
            })
          })

          this.councilData.forEach( ( trabajoGrado: any ) => {
            observables.push(this.enterpriseService.getEnterpriseById(trabajoGrado.graduateWorkEnterprise))
          });
          return forkJoin(observables)
        }
      ),
      switchMap(
        (result: any) => {
          console.log(result)
          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            result.forEach( (empresa: any) => {
              if(trabajoGrado.graduateWorkEnterprise == empresa.enterpriseid){
                this.councilData[index].enterpriseData = empresa
              }
            });
            
          });

          const observables: Observable<any>[] = []
          console.log(this.councilData)
          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            console.log(trabajoGrado)
            if( trabajoGrado.graduateWorkType === 'INSTRUMENTAL' ){
              console.log(trabajoGrado.graduateWorkInCompanyTutor)
              observables.push(this.userService.getUserData(trabajoGrado.graduateWorkInCompanyTutor))
            }else{
              observables.push(this.userService.getUserData(trabajoGrado.graduateWorkAcademicTutor))
            }
          })  

          return forkJoin(observables)
        }
      ),
      switchMap(
        (result: any) => {
          console.log(result)
          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            result.forEach( (tutor: any) => {
              if( tutor.userDNI == trabajoGrado.graduateWorkInCompanyTutor && trabajoGrado.graduateWorkType === 'INSTRUMENTAL' ){
                this.councilData[index].tutorData = tutor
              }
              if( tutor.userDNI == trabajoGrado.graduateWorkAcademicTutor && trabajoGrado.graduateWorkType === 'EXPERIMENTAL' ){
                this.councilData[index].tutorData = tutor
              }
            });
            
          });
          console.log(this.councilData)

          const observables: Observable<any>[] = []

          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            observables.push(this.graduateworkService.getGraduateWorkReviewer(trabajoGrado.graduateworkid))
          });
          return forkJoin(observables)
          

        }
      ),
      switchMap(
        (reviewerList) => {
          console.log(reviewerList)
          const observables: Observable<any>[] = []
          reviewerList.forEach( (revisorList) => {
            revisorList.forEach( (revisor:any) => {
              observables.push(this.userService.getUserData(revisor.professorDNI))
            })
            
          })
          this.reviewerList = reviewerList
          return forkJoin(observables)
        }
      ),
      switchMap(
        (reviewerDataList) => {
          console.log(this.reviewerList)
          console.log(reviewerDataList)
          this.reviewerList.forEach( ( revisor: any, index: number ) => {
            reviewerDataList.forEach( (revisorDataFromList: any) => {
              revisor.forEach( (revisorData:any,indexP: number) => {
                if(revisorData.professorDNI == revisorDataFromList.userDNI){
                  console.log("ENCONTRADO")
                  this.reviewerList[indexP][index].revisorData = revisorDataFromList
                  this.reviewerList[indexP][index].revisorData.revisionDate = new Date(revisorData.revisionDate)
                }
              })
              
            })
            
          });
          console.log(this.reviewerList)
          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            this.reviewerList.forEach( ( revisor:any ) => {
              revisor.forEach( (revisorData: any, indexP: number) => {
                if( trabajoGrado.graduateWorkId == revisorData.graduateWorkId ){
                  this.councilData[index].revisorData = revisorData.revisorData
                }
              })
              
            })
          });
          return of(this.councilData)
        }
      ),
      switchMap(
        (reviewerDataList) => {

          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            this.reviewerList.forEach( ( revisor:any ) => {
              revisor.forEach( (elementoRevisor:any) => {
                if( trabajoGrado.graduateworkid == elementoRevisor.graduateWorkId ){
                  this.councilData[index].revisorData = elementoRevisor.revisorData
                }
              });
            
            })
          });

          const observables: Observable<any>[] = []

          this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
            observables.push(this.userService.getUserData(trabajoGrado.graduateWorkAcademicTutor))
          });
          return forkJoin(observables)
        }
      )
    ).subscribe({
      next: (academicTutorDataList: any) => {
        console.log(academicTutorDataList)
        this.councilData.forEach( ( trabajoGrado: any, index: number ) => {
          academicTutorDataList.forEach( ( academic: any, index: number ) => {
            if( trabajoGrado.graduateWorkAcademicTutor ==  academic.userDNI){
              this.councilData[index].academicTutorData = academic
            }
          })
        });
        console.log(this.councilData)
        console.log(this.coordinatorData)
        this.councilData = this.councilData.filter( (trabajoDeGrado:any) => trabajoDeGrado.studentData[0].schoolName == this.coordinatorData.schoolName)
      },
      error: (error: any) => {
        console.log(error)
      }
    })

  }

  openDialog(data: any) {

    console.log(data)

    forkJoin([this.graduateworkService.getGraduateWorkStudentData(data.graduateworkid),this.graduateworkService.getGraduateWorkById(data.graduateworkid)]).subscribe({
      next: ([userData,graduateWorkData]) => {

        const dialogRef = this.dialog.open(DesarrolloTgDialogComponent,{
          width: '60%',
          data: {
            userData: userData,
            graduateWorkData: graduateWorkData
          }
        })
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    })

  }
  ngOnInit(){

    this.userService.getUserData(this.data.userDNI).subscribe({
      next: (data) => {
        console.log(data)
      }
    })

  }

  generarReporteTrabajoGrado(){
    console.log("generarReporteTrabajoGrado")
    console.log(this.coordinatorData)
    console.log(this.councilData)
    this.graduateworkService.generarReportePropuestas(this.coordinatorData.schoolName)
    .pipe(
      switchMap(
        (reporteData: any) => {
          console.log(reporteData)

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
          let indiceActual: number = 4;
          this.councilData.forEach ( (tg:any, index: number) => {
            
            tg.studentData.forEach( (estudiante: any, indiceEstudiante: number) => {

              console.log(indiceActual)

              /* Si solo hay un estudiante entonces inserto normal */
              if( indiceEstudiante == 0 ){
                sheet.getRow(indiceActual).height = 30

                sheet.getCell(`A${indiceActual}`).value = indiceActual;
                sheet.getCell(`A${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`A${indiceActual}`).alignment = {
                  horizontal: "center",
                  vertical: "middle",
                  wrapText: true
                }
        
                sheet.getCell(`B${indiceActual}`).value = estudiante.userDNI
                sheet.getCell(`B${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`B${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`C${indiceActual}`).value = estudiante.userLastName + ", " + estudiante.userFirstName
                sheet.getCell(`C${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`C${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`D${indiceActual}`).value = estudiante.userEmail
                sheet.getCell(`D${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`D${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`E${indiceActual}`).value = estudiante.userPhone
                sheet.getCell(`E${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`E${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`F${indiceActual}`).value = tg.graduateWorkTitle
                sheet.getCell(`F${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`F${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`G${indiceActual}`).value = (tg.graduateWorkType == 'INSTRUMENTAL') ? 'TIG' : 'TEG'
                sheet.getCell(`G${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`G${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`H${indiceActual}`).value = tg.enterpriseData.enterpriseName
                sheet.getCell(`H${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`H${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }  

                
                sheet.getCell(`I${indiceActual}`).value = tg.tutorData.userLastName + ", " + tg.tutorData.userFirstName
                sheet.getCell(`I${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`I${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }  
                
                
                sheet.getCell(`J${indiceActual}`).value = tg.graduateWorkCommittee + " / " + new Date(tg.committeeApprovalDate).toLocaleDateString()
                sheet.getCell(`J${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`J${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }        
                
                sheet.getCell(`K${indiceActual}`).value = "Aprobado Tema"
                sheet.getCell(`K${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`K${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.getCell(`L${indiceActual}`).value = tg.revisorData.userLastName + ", " +  tg.revisorData.userFirstName
                sheet.getCell(`L${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`L${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.getCell(`M${indiceActual}`).value = tg.revisorData.revisionDate.toLocaleDateString()
                sheet.getCell(`M${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`M${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.getCell(`N${indiceActual}`).value = "Aprobado Tema"
                sheet.getCell(`N${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`N${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`O${indiceActual}`).value = tg.graduateWorkSchoolCouncil + " / " + new Date(tg.schoolCouncilApprovalDate).toLocaleDateString()
                sheet.getCell(`O${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`O${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.getCell(`P${indiceActual}`).value = tg.academicTutorData.userLastName + ", " + tg.academicTutorData.userFirstName
                sheet.getCell(`P${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`P${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                indiceActual = indiceActual + 1;
              }else{
                /* Si hay dos necesito moverme un espacio hacia adelante */
                //indiceActual = indiceActual + 1;
                /* Y luego inserto */
                sheet.getRow(indiceActual).height = 30

                sheet.getCell(`A${indiceActual}`).value = indiceActual;
                sheet.getCell(`A${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`A${indiceActual}`).alignment = {
                  horizontal: "center",
                  vertical: "middle",
                  wrapText: true
                }
        
                sheet.getCell(`B${indiceActual}`).value = estudiante.userDNI
                sheet.getCell(`B${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`B${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`C${indiceActual}`).value = estudiante.userLastName + ", " + estudiante.userFirstName
                sheet.getCell(`C${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`C${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`D${indiceActual}`).value = estudiante.userEmail
                sheet.getCell(`D${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`D${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`E${indiceActual}`).value = estudiante.userPhone
                sheet.getCell(`E${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`E${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.getCell(`F${indiceActual}`).value = tg.graduateWorkTitle
                sheet.getCell(`F${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`F${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.mergeCells(`F${indiceActual}`,`F${indiceActual-1}`)

                sheet.getCell(`G${indiceActual}`).value = (tg.graduateWorkType == 'INSTRUMENTAL') ? 'TIG' : 'TEG'
                sheet.getCell(`G${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`G${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.mergeCells(`G${indiceActual}`,`G${indiceActual-1}`)

                sheet.getCell(`H${indiceActual}`).value = tg.enterpriseData.enterpriseName
                sheet.getCell(`H${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`H${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }  

                sheet.mergeCells(`H${indiceActual}`,`H${indiceActual-1}`)
                
                sheet.getCell(`I${indiceActual}`).value = tg.tutorData.userLastName + ", " + tg.tutorData.userFirstName
                sheet.getCell(`I${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`I${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }  

                sheet.mergeCells(`I${indiceActual}`,`I${indiceActual-1}`)
                
                sheet.getCell(`J${indiceActual}`).value = tg.graduateWorkCommittee + " / " + new Date(tg.committeeApprovalDate).toLocaleDateString()
                sheet.getCell(`J${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`J${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }        

                sheet.mergeCells(`J${indiceActual}`,`J${indiceActual-1}`)
                
                sheet.getCell(`K${indiceActual}`).value = "Aprobado Tema"
                sheet.getCell(`K${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`K${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.mergeCells(`K${indiceActual}`,`K${indiceActual-1}`)

                sheet.getCell(`L${indiceActual}`).value = tg.revisorData.userLastName + ", " +  tg.revisorData.userFirstName
                sheet.getCell(`L${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`L${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.mergeCells(`L${indiceActual}`,`L${indiceActual-1}`)

                sheet.getCell(`M${indiceActual}`).value = tg.revisorData.revisionDate.toLocaleDateString()
                sheet.getCell(`M${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`M${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.mergeCells(`M${indiceActual}`,`M${indiceActual-1}`)

                sheet.getCell(`N${indiceActual}`).value = "Aprobado Tema"
                sheet.getCell(`N${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`N${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                }

                sheet.mergeCells(`N${indiceActual}`,`N${indiceActual-1}`)

                sheet.getCell(`O${indiceActual}`).value = tg.graduateWorkSchoolCouncil + " / " + new Date(tg.schoolCouncilApprovalDate).toLocaleDateString()
                sheet.getCell(`O${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`O${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.mergeCells(`O${indiceActual}`,`O${indiceActual-1}`)

                sheet.getCell(`P${indiceActual}`).value = tg.academicTutorData.userLastName + ", " + tg.academicTutorData.userFirstName
                sheet.getCell(`P${indiceActual}`).font = {
                  name: 'Trebuchet MS',
                  size: 10
                }
                sheet.getCell(`P${indiceActual}`).alignment = {
                  horizontal: "left",
                  vertical: "middle",
                  wrapText: true
                } 

                sheet.mergeCells(`P${indiceActual}`,`P${indiceActual-1}`)
                /* Incremento nuevamente para empezar en la siguiente fila */
                indiceActual = indiceActual + 1;
              }
              

      

            });
          })


          _workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data]);
            fs.saveAs(blob, "Control de Propuestas de Trabajo de Grado.xlsx")
          })
          return of(reporteData)
        }
      ),

    )
    .subscribe({
      next: (result) => {
        console.log(result)
      }
    })
  }
}
