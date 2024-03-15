import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Workbook } from 'exceljs';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { UsersService } from 'src/app/services/users.service';
import * as ExcelJS from 'exceljs'
import * as fs from 'file-saver'
import { EnterpriseService } from 'src/app/services/enterprise.service';

@Component({
  selector: 'app-pasantia-completada',
  templateUrl: './pasantia-completada.component.html',
  styleUrls: ['./pasantia-completada.component.css']
})
export class PasantiaCompletadaComponent {

  displayedColumns: string[] = ['intershipId', 'intershipTitle', 'author', 'startDate','check'];
  pasantiaList: any = []

  localUserData: any = null
  constructor(
    private pasantiaService: PasantiaService, 
    private userService: UsersService,
    private dialog: MatDialog,
    private enterpriseService: EnterpriseService
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localStorageData = JSON.parse(localUser)
      this.userService.getUserData(localStorageData.userDNI)
      .pipe(
        switchMap(
          (userData) => {
            this.localUserData = userData
            console.log(this.localUserData)
            return this.pasantiaService.getPasantiasByStatusAndSchool(100,this.localUserData.schoolName)
          }
        ),
        switchMap(
          (pasantiaList) => {
            console.log(pasantiaList)
            const observables: Observable<any>[] = []
  
            pasantiaList.forEach( (pasantia: any) => {
              observables.push(this.userService.getUserData(pasantia.studentDNI))
            })
            this.pasantiaList = pasantiaList
            return forkJoin(observables)
          }
        ),
        switchMap( (studentData) => {
          console.log(studentData)
          this.pasantiaList.forEach( (pasantia:any , index: number) => {
            this.pasantiaList[index].author = studentData[index].userLastName + ", " + studentData[index].userFirstName
            this.pasantiaList[index].studentData = studentData[index]
            this.pasantiaList[index].intershipStartDate = new Date(this.pasantiaList[index].intershipStartDate).toLocaleDateString()
          })

          const observables: Observable<any>[] = []

          this.pasantiaList.forEach( (pasantia: any) => {
            observables.push(this.userService.getUserData(pasantia.academicTutorDNI))
          })

          return forkJoin(observables)
        }),
        switchMap(
          (academicTutorList) => {

            const observables: Observable<any>[] = []

            this.pasantiaList.forEach( (pasantia: any, index: number) => {
              academicTutorList.forEach( (tutorAcademico: any) => {
                if(pasantia.academicTutorDNI == tutorAcademico.userDNI){
                  this.pasantiaList[index].academicTutorData = tutorAcademico
                }
              })
            })

            this.pasantiaList.forEach( (pasantia: any) => {
              observables.push(this.userService.getUserData(pasantia.corporateTutorDNI))
            })

            return forkJoin(observables)
          }
        ),
        switchMap(
          (corporateTutorList) => {

            const observables: Observable<any>[] = []

            this.pasantiaList.forEach( (pasantia: any, index: number) => {
              corporateTutorList.forEach( (tutorEmpresarial: any) => {
                if(pasantia.corporateTutorDNI == tutorEmpresarial.userDNI){
                  this.pasantiaList[index].corporateTutorData = tutorEmpresarial
                }
              })
            })

            this.pasantiaList.forEach( (pasantia: any) => {
              observables.push(this.enterpriseService.getEnterpriseById(pasantia.enterpriseId))
            })

            return forkJoin(observables)

          }
        ),
        switchMap(
          (enterpriseList) => {
            console.log(enterpriseList)

            const observables: Observable<any>[] = []

            this.pasantiaList.forEach( (pasantia: any, index: number) => {
              enterpriseList.forEach( (empresa: any) => {
                if(pasantia.enterpriseId == empresa.enterpriseid){
                  this.pasantiaList[index].enterpriseData = empresa
                }
              })
            })
            
            this.pasantiaList.forEach( (pasantia: any) => {
              observables.push(this.pasantiaService.obtenerCalificacionEvaluacionTutorAcademico(pasantia.intershipId,pasantia.academicTutorDNI))
            })
            return forkJoin(observables)
          }
        ),
        switchMap(
          (academicTutorCalificacionList) => {
            console.log(academicTutorCalificacionList)

            const observables: Observable<any>[] = []

            this.pasantiaList.forEach( (pasantia: any, index: number) => {
              academicTutorCalificacionList.forEach( (calificacion: any) => {
                if(pasantia.intershipId == calificacion.intershipId && pasantia.academicTutorDNI == calificacion.professorDNI){
                  this.pasantiaList[index].eta = calificacion.finalNote
                }
              })
            })

            this.pasantiaList.forEach( (pasantia: any) => {
              observables.push(this.pasantiaService.obtenerCalificacionEvaluacionTutorEmpresarial(pasantia.intershipId,pasantia.corporateTutorDNI))
            })

            return forkJoin(observables)
          }
        ),
        switchMap(
          (corporateTutorCalificacionList) => {

            this.pasantiaList.forEach( (pasantia: any, index: number) => {
              corporateTutorCalificacionList.forEach( (calificacion: any) => {
                if(pasantia.intershipId == calificacion.intershipId && pasantia.corporateTutorDNI == calificacion.externalPersonnelDNI){
                  this.pasantiaList[index].ete = calificacion.finalNote
                }
              })
            })

            return of(null)
          }
        )


      )
      .subscribe({
        complete: () => {
          console.log("completado")
        }
      })
    }
  }

  openDialog(data: any){
    console.log(data)
  }

  generarReportePasantia(){

    console.log(this.pasantiaList)

    console.log("generarReportePasantia()")
    const _workbook: Workbook = new ExcelJS.Workbook();

    _workbook.creator = 'Luis C. Somoza';
    _workbook.lastModifiedBy = 'Luis C. Somoza';
    _workbook.created = new Date();
    _workbook.modified = new Date();
    _workbook.lastPrinted = new Date();

    _workbook.calcProperties.fullCalcOnLoad = true;


    const sheet = _workbook.addWorksheet('Propuesta de Pasantía');

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
    cabecera.value = "Propuestas de Pasantías"
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
    cabeceraNRC.value = "NRC 20046"
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
    sheet.getCell("B3").value = "Cédula"
    sheet.getCell("B3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("C3").value = "Estudiante"
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
    sheet.getCell("F3").value = "Empresa"
    sheet.getCell("F3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("G3").value = "Título"
    sheet.getCell("G3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("H3").value = "Inicio"
    sheet.getCell("H3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("I3").value = "Fin"
    sheet.getCell("I3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("J3").value = "Tutor Empresarial"
    sheet.getCell("J3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("K3").value = "Tutor Académico"
    sheet.getCell("K3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("L3").value = "Correo Tutor Académico"
    sheet.getCell("L3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("M3").value = "ETE"
    sheet.getCell("M3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("N3").value = "ETA"
    sheet.getCell("N3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("O3").value = "EvDef"
    sheet.getCell("O3").alignment = {
      horizontal: "center",
      vertical: "middle"
    }
    sheet.getCell("P3").value = "Observaciones"
    sheet.getCell("P3").alignment = {
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

    this.pasantiaList.forEach ( (pasantia:any, index: number) => {

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
      
      sheet.getCell(`B${4+index}`).value = pasantia.studentData.userDNI as string
      sheet.getCell(`B${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`B${4+index}`).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`C${4+index}`).value = `${pasantia.studentData.userLastName}, ${pasantia.studentData.userFirstName}`
      sheet.getCell(`C${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`C${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`D${4+index}`).value = pasantia.studentData.userEmail
      sheet.getCell(`D${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`D${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`E${4+index}`).value = pasantia.studentData.userPhone
      sheet.getCell(`E${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`F${4+index}`).value = pasantia.enterpriseData.enterpriseName
      sheet.getCell(`F${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`G${4+index}`).value = pasantia.intershipTitle
      sheet.getCell(`G${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`H${4+index}`).value = pasantia.intershipStartDate
      sheet.getCell(`H${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`I${4+index}`).value = new Date(pasantia.intershipCompletionDate).toLocaleDateString()
      sheet.getCell(`I${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`J${4+index}`).value = `${pasantia.corporateTutorData.userLastName}, ${pasantia.corporateTutorData.userFirstName}`
      sheet.getCell(`J${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`J${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`K${4+index}`).value = `${pasantia.academicTutorData.userLastName}, ${pasantia.academicTutorData.userFirstName}`
      sheet.getCell(`K${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`K${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`L${4+index}`).value = pasantia.academicTutorData.userEmail
      sheet.getCell(`L${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`L${4+index}`).alignment = {
        vertical: "middle",
        wrapText: true
      }
      sheet.getCell(`M${4+index}`).value = pasantia.ete
      sheet.getCell(`M${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`N${4+index}`).value = pasantia.eta
      sheet.getCell(`N${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`O${4+index}`).value = Math.round(( pasantia.ete + pasantia.eta ) / 2)
      sheet.getCell(`O${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }
      sheet.getCell(`P${4+index}`).value = ""
      sheet.getCell(`P${4+index}`).font = {
        name: 'Trebuchet MS',
        size: 10
      }

    })

    _workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "Control Propuestas Pasantías.xlsx")
    })

  }
  
}
