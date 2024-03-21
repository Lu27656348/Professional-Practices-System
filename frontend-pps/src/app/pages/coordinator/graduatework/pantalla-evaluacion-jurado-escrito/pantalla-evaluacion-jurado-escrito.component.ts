import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, forkJoin, of } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { DocumentService } from 'src/app/services/document.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-pantalla-evaluacion-jurado-escrito',
  templateUrl: './pantalla-evaluacion-jurado-escrito.component.html',
  styleUrls: ['./pantalla-evaluacion-jurado-escrito.component.css']
})
export class PantallaEvaluacionJuradoEscritoComponent {

    generadorAbierto: boolean = false;
    
    formGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
  
    trabajoDeGrado: any = null;
    tutor: any = null;
    modo: any = null

    tutorAcademico: boolean = false
  
    displayedColumns: string[] = ['criterio'];
  
    seccionList: any[] = [
      {
        seccionId: 1,
        seccionName: "Nombre 1"
      },
      {
        seccionId: 2,
        seccionName: "Nombre 2"
      },
      {
        seccionId: 3,
        seccionName: "Nombre 3"
      }
    ]
    criteriaList: any = null
  
    dataSource: any = [
      {
        criteriaName: "Luis",
        maxNote: 3,
        seccionId: 1
      },
      {
        criteriaName: "Luis",
        maxNote: 1,
        seccionId: 1
      
      },
      {
        criteriaName: "Luis",
        maxNote: 1,
        seccionId: 2
      },
      {
        criteriaName: "Luis",
        maxNote: 2,
        seccionId: 4
      }
  
    ]
  
    dataSourceV2: any = null
  
    notaMaxima: number = 0;
  
    seccionExperiment: any[] = []
  
    totalSum: any = null
  
    allNotesAreSelected: boolean = false;
  
    graduateWorkData: any
    tutorData: any
    studentData: any
    enterpriseData: any
  
    constructor(
      private _formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private documentService: DocumentService,
      private formService: EvaluationFormGeneratorService,
      private userService: UsersService,
      private externalPersonnelService: ExternalPersonnelService,
      private professorService: ProfessorsService,
      private enterpriseService: EnterpriseService,
      private graduateWorkService: GraduateworkService
    ){
      this.route.params.subscribe(
        params => {
          console.log(params)
          this.modo = params['modo']
          this.trabajoDeGrado = params['graduateWorkId']
          this.tutor = params['tutor']
          console.log(this.tutor)
          console.log(this.trabajoDeGrado)
          this.userService.getUserData(this.tutor)
            .pipe(
              switchMap(
                (userData) => {
                  this.tutorData = userData
                  return this.graduateWorkService.getGraduateWorkById(this.trabajoDeGrado)
                }
              ),
              switchMap(
                (graduateWorkData) => {
                  this.graduateWorkData = graduateWorkData
                  if( graduateWorkData.graduateWorkStatusCode == 70 || graduateWorkData.graduateWorkStatusCode == 80 ){
                    this.generadorAbierto = true
                  }

                  if(this.graduateWorkData.graduateWorkAcademicTutor == this.tutor){
                    console.log("Es el tutor academico")
                    this.tutorAcademico = true
                  }
                  console.log( this.graduateWorkData)
                  return this.graduateWorkService.getGraduateWorkStudentData(this.graduateWorkData.graduateworkid)
                }
              ),
              switchMap(
                (studentData) => {
                  this.studentData = studentData
                  console.log(this.studentData)
                  return this.enterpriseService.getEnterpriseById(this.graduateWorkData.graduateWorkEnterprise)
                }
              )
            )
            .subscribe({
              next: (result) => {
                console.log(result)
                this.enterpriseData = result

                if(this.modo == "experimental"){
                  console.log("Extraemos todos los criterios y secciones del modo experimental")


                  if(this.graduateWorkData.graduateWorkAcademicTutor  == this.tutor){
                    
                    this.graduateWorkService.getTutorReportExperimentalCriteria(this.studentData[0].schoolName)
                    .pipe(
                      switchMap(
                        (criteriaList: any) => {
                          console.log(criteriaList)
                          const mayuscula: string  = this.modo.toUpperCase()
                          console.log(mayuscula)
                          this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula)
                          console.log(this.criteriaList)
                          this.criteriaList.forEach((criteria: any, index: number) => {
                            this.criteriaList[index].selectedCheckBox = false;
                            this.criteriaList[index].selectedCheckBoxIndex = null;
                          })

                          this.criteriaList.forEach((criteria: any, index: number) => {
                            /* Si no tengo elementos en mi arreglo inserto la primera seccion */
                            if(this.seccionExperiment.length == 0){
                              this.seccionExperiment.push(
                                {
                                  seccionId: criteria.seccionId,
                                  criteriaList: [criteria]
                                }
                              )
                            }else{
                              /* Si ya tengo elemento tengo que validar que la seccion entrante ya existe */
                              let existeSeccion = false
                              this.seccionExperiment.forEach((seccionData: any, index: number) =>{
                                if(seccionData.seccionId == criteria.seccionId){
                                  existeSeccion = true;
                                  this.seccionExperiment[index].criteriaList.push(criteria)
                                }
                              })
          
                              if(existeSeccion == false){
                                this.seccionExperiment.push(
                                  {
                                    seccionId: criteria.seccionId,
                                    criteriaList: [criteria]
                                  }
                                )
                              }
                            }
                          });
          
                          console.log(this.seccionExperiment)
                          this.dataSourceV2 = this.seccionExperiment
                          return this.graduateWorkService.getTutorReportExperimentalSeccion(this.studentData[0].schoolName)
                        }
                      )
                    )
                    .subscribe({
                      next: (seccionList:any) =>{
                        console.log(seccionList)
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
                        console.log(this.dataSourceV2)
                        this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                        this.dataSourceV2.forEach(( seccion:any,index: number) => {
                          this.seccionList.forEach( (seccionData: any ) => {
                            if(seccionData.seccionId == seccion.seccionId){
                              this.dataSourceV2[index].seccionName = seccionData.seccionName
                            }
                          })
                        });
                        console.log(this.dataSourceV2)
                        this.notaMaxima = this.obtenerNotaMaxima(this.criteriaList)
                        for (let index = 0; index <= this.notaMaxima; index++) {
                          this.displayedColumns.push(index.toString())
                        }
                        console.log(this.displayedColumns)
                        console.log("La Nota mas alta es: ", this.notaMaxima)
                      }
                    })

                  }else{

                    this.graduateWorkService.getJuryReportExperimentalCriteria(this.studentData[0].schoolName)
                    .pipe(
                      switchMap(
                        (criteriaList: any) => {
                          console.log(criteriaList)
                          const mayuscula: string  = this.modo.toUpperCase()
                          console.log(mayuscula)
                          this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula)
                          console.log(this.criteriaList)
                          this.criteriaList.forEach((criteria: any, index: number) => {
                            this.criteriaList[index].selectedCheckBox = false;
                            this.criteriaList[index].selectedCheckBoxIndex = null;
                          })

                          this.criteriaList.forEach((criteria: any, index: number) => {
                            /* Si no tengo elementos en mi arreglo inserto la primera seccion */
                            if(this.seccionExperiment.length == 0){
                              this.seccionExperiment.push(
                                {
                                  seccionId: criteria.seccionId,
                                  criteriaList: [criteria]
                                }
                              )
                            }else{
                              /* Si ya tengo elemento tengo que validar que la seccion entrante ya existe */
                              let existeSeccion = false
                              this.seccionExperiment.forEach((seccionData: any, index: number) =>{
                                if(seccionData.seccionId == criteria.seccionId){
                                  existeSeccion = true;
                                  this.seccionExperiment[index].criteriaList.push(criteria)
                                }
                              })
          
                              if(existeSeccion == false){
                                this.seccionExperiment.push(
                                  {
                                    seccionId: criteria.seccionId,
                                    criteriaList: [criteria]
                                  }
                                )
                              }
                            }
                          });
          
                          console.log(this.seccionExperiment)
                          this.dataSourceV2 = this.seccionExperiment
                          return this.graduateWorkService.getJuryReportExperimentalSeccion(this.studentData[0].schoolName)
                        }
                      )
                    )
                    .subscribe({
                      next: (seccionList:any) =>{
                        console.log(seccionList)
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
                        console.log(this.dataSourceV2)
                        this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                        this.dataSourceV2.forEach(( seccion:any,index: number) => {
                          this.seccionList.forEach( (seccionData: any ) => {
                            if(seccionData.seccionId == seccion.seccionId){
                              this.dataSourceV2[index].seccionName = seccionData.seccionName
                            }
                          })
                        });
                        console.log(this.dataSourceV2)
                        this.notaMaxima = this.obtenerNotaMaxima(this.criteriaList)
                        for (let index = 0; index <= this.notaMaxima; index++) {
                          this.displayedColumns.push(index.toString())
                        }
                        console.log(this.displayedColumns)
                        console.log("La Nota mas alta es: ", this.notaMaxima)
                      }
                    })

                  }
                  
                  
                }else{
                  console.log("Extraemos todos los criterios y secciones del modo instrumental")
                  if(this.graduateWorkData.graduateWorkAcademicTutor == this.tutor){
                    this.graduateWorkService.getTutorReportInstrumentalCriteria(this.studentData[0].schoolName)
                    .pipe(
                      switchMap(
                        (criteriaList: any) => {
                          console.log(criteriaList)
                          const mayuscula: string  = this.modo.toUpperCase()
                          console.log(mayuscula)
                          this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula)
                          console.log(this.criteriaList)
  
                          this.criteriaList.forEach((criteria: any, index: number) => {
                            this.criteriaList[index].selectedCheckBox = false;
                            this.criteriaList[index].selectedCheckBoxIndex = null;
                          })
  
                          this.criteriaList.forEach((criteria: any, index: number) => {
                            /* Si no tengo elementos en mi arreglo inserto la primera seccion */
                            if(this.seccionExperiment.length == 0){
                              this.seccionExperiment.push(
                                {
                                  seccionId: criteria.seccionId,
                                  criteriaList: [criteria]
                                }
                              )
                            }else{
                              /* Si ya tengo elemento tengo que validar que la seccion entrante ya existe */
                              let existeSeccion = false
                              this.seccionExperiment.forEach((seccionData: any, index: number) =>{
                                if(seccionData.seccionId == criteria.seccionId){
                                  existeSeccion = true;
                                  this.seccionExperiment[index].criteriaList.push(criteria)
                                }
                              })
          
                              if(existeSeccion == false){
                                this.seccionExperiment.push(
                                  {
                                    seccionId: criteria.seccionId,
                                    criteriaList: [criteria]
                                  }
                                )
                              }
                            }
                          });
          
                          console.log(this.seccionExperiment)
                          this.dataSourceV2 = this.seccionExperiment
                          return this.graduateWorkService.getTutorReportInstrumentalSeccion(this.studentData[0].schoolName)
                        }
                      )
                    )
                    .subscribe({
                      next: (seccionList:any) =>{
                        console.log(seccionList)
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
                        console.log(this.dataSourceV2)
                        this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                        this.dataSourceV2.forEach(( seccion:any,index: number) => {
                          this.seccionList.forEach( (seccionData: any ) => {
                            if(seccionData.seccionId == seccion.seccionId){
                              this.dataSourceV2[index].seccionName = seccionData.seccionName
                            }
                          })
                        });
                        console.log(this.dataSourceV2)
                        this.notaMaxima = this.obtenerNotaMaxima(this.criteriaList)
                        for (let index = 0; index <= this.notaMaxima; index++) {
                          this.displayedColumns.push(index.toString())
                        }
                        console.log(this.displayedColumns)
                        console.log("La Nota mas alta es: ", this.notaMaxima)
                      }
                    })
                  }else{
                    this.graduateWorkService.getJuryReportInstrumentalCriteria(this.studentData[0].schoolName)
                    .pipe(
                      switchMap(
                        (criteriaList: any) => {
                          console.log(criteriaList)
                          const mayuscula: string  = this.modo.toUpperCase()
                          console.log(mayuscula)
                          this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula)
                          console.log(this.criteriaList)
  
                          this.criteriaList.forEach((criteria: any, index: number) => {
                            this.criteriaList[index].selectedCheckBox = false;
                            this.criteriaList[index].selectedCheckBoxIndex = null;
                          })
  
                          this.criteriaList.forEach((criteria: any, index: number) => {
                            /* Si no tengo elementos en mi arreglo inserto la primera seccion */
                            if(this.seccionExperiment.length == 0){
                              this.seccionExperiment.push(
                                {
                                  seccionId: criteria.seccionId,
                                  criteriaList: [criteria]
                                }
                              )
                            }else{
                              /* Si ya tengo elemento tengo que validar que la seccion entrante ya existe */
                              let existeSeccion = false
                              this.seccionExperiment.forEach((seccionData: any, index: number) =>{
                                if(seccionData.seccionId == criteria.seccionId){
                                  existeSeccion = true;
                                  this.seccionExperiment[index].criteriaList.push(criteria)
                                }
                              })
          
                              if(existeSeccion == false){
                                this.seccionExperiment.push(
                                  {
                                    seccionId: criteria.seccionId,
                                    criteriaList: [criteria]
                                  }
                                )
                              }
                            }
                          });
          
                          console.log(this.seccionExperiment)
                          this.dataSourceV2 = this.seccionExperiment
                          return this.graduateWorkService.getJuryReportInstrumentalSeccion(this.studentData[0].schoolName)
                        }
                      )
                    )
                    .subscribe({
                      next: (seccionList:any) =>{
                        console.log(seccionList)
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
                        console.log(this.dataSourceV2)
                        this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                        this.dataSourceV2.forEach(( seccion:any,index: number) => {
                          this.seccionList.forEach( (seccionData: any ) => {
                            if(seccionData.seccionId == seccion.seccionId){
                              this.dataSourceV2[index].seccionName = seccionData.seccionName
                            }
                          })
                        });
                        console.log(this.dataSourceV2)
                        this.notaMaxima = this.obtenerNotaMaxima(this.criteriaList)
                        for (let index = 0; index <= this.notaMaxima; index++) {
                          this.displayedColumns.push(index.toString())
                        }
                        console.log(this.displayedColumns)
                        console.log("La Nota mas alta es: ", this.notaMaxima)
                      }
                    })
                  }
                  
                }
              }
            })
          
        }
      )
      
      
    }
  
    ngOnInit() {
      // Fetch data or set an initial value here
  
    }
  
    obtenerNotaMaxima(listaCriterios: any[]) : number{
      let numeroMaximo = listaCriterios[0].maxNote
      listaCriterios.forEach( (criterio) => {
        if (criterio.maxNote > numeroMaximo) {
          numeroMaximo = criterio.maxNote;
        }
      })
      return numeroMaximo;
    }
  
  
  
    onCheckboxChange(row: any, checkboxIndex: number) {
      console.log(row)
      console.log(this.dataSourceV2)
      /* Lo primero que hacemos es ubicar elemento para saber en que fila estamos */
      this.dataSourceV2.forEach ((elementRow: any, indexData: number) => {
  
        elementRow.criteriaList.forEach((elementRowRow: any, index: number) => {
          if(elementRowRow.criteriaId == row.criteriaId ){
  
            console.log("Estamos en el elemento " + index)
  
            if(elementRowRow.selectedCheckBox == false){
  
              console.log("No he marcado la fila todavia")
  
              this.totalSum = this.totalSum + checkboxIndex;
              this.dataSourceV2[indexData].criteriaList[index].selectedCheckBoxIndex = checkboxIndex;
              this.dataSourceV2[indexData].criteriaList[index].selectedCheckBox = true
  
            }else{
  
              if(elementRowRow.selectedCheckBoxIndex === checkboxIndex){
  
                console.log("estoy marcando la casilla anterior")
  
                this.totalSum = this.totalSum - checkboxIndex;
                elementRowRow.selectedCheckBox = false;
                elementRowRow.selectedCheckBoxIndex = null;
  
              }else{
  
                console.log("ya habia marcado la fila y ahora actualizo el valor")
  
                this.totalSum = this.totalSum - elementRowRow.selectedCheckBoxIndex
                this.totalSum = this.totalSum + checkboxIndex;
                elementRowRow.selectedCheckBoxIndex = checkboxIndex;
                
              }
              
            }
          }
  
        })
          
        this.calculateSeccionSum(elementRow)
        
      })
      console.log(this.totalSum)
      this.allNotesAreSelected = this.validateAllNotesSelected()
    }
  
    calculateSeccionSum(seccion: any){
      seccion.sum = 0;
      seccion.criteriaList.forEach( (criteria:any) => {
        if(criteria.selectedCheckBoxIndex != null){
          seccion.sum = seccion.sum + criteria.selectedCheckBoxIndex
        }
      })
      console.log(seccion.sum)
    }
  
    
    validateAllNotesSelected() : boolean{
      const  areAllSelected = this.dataSourceV2.every(
                                                      (row:any) => {
                                                        return row.criteriaList.every( (row:any) => row.selectedCheckBox)
                                                      }
                                                    )
      return areAllSelected
    }
  
    generarPlanilla(){
      console.log("generarPlanilla")
      console.log(this.modo)
      console.log(this.dataSourceV2)
      const observables: Observable<any>[] = []

        this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
          elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {
            console.log(elementRowRow)
            this.studentData.forEach((student: any) => {
              if(this.graduateWorkData.graduateWorkAcademicTutor  == this.tutor){
                observables.push(
                  this.graduateWorkService.addTutorReportEvaluationNote({
                    juryDNI: this.tutor,
                    studentDNI: student.userDNI,
                    graduateWorkId: this.graduateWorkData.graduateworkid,
                    criteriaId: elementRowRow.criteriaId,
                    evaluationNote: elementRowRow.selectedCheckBoxIndex
                  })
                )
              }else{
                observables.push(
                  this.graduateWorkService.addTutorReportEvaluationNote({
                    juryDNI: this.tutor,
                    studentDNI: student.userDNI,
                    graduateWorkId: this.graduateWorkData.graduateworkid,
                    criteriaId: elementRowRow.criteriaId,
                    evaluationNote: elementRowRow.selectedCheckBoxIndex
                  })
                )
              }
              
              
            })
            
          })
        })
  
        forkJoin(observables)
        .pipe(
          switchMap(
            (result: any) => {
              console.log(result)
              const seccionObservables: Observable<any>[] = []
              let criteriaFormArray: any[] = []

              console.log(this.seccionList)
  
              this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
                elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {


                        elementRowRow.selectedValues = elementRowRow.selectedCheckBoxIndex
                        criteriaFormArray.push(elementRowRow)              
                  
                })
              })
  
              console.log(criteriaFormArray)
  
              this.criteriaList = criteriaFormArray    
  
              return of(this.criteriaList)
            }
          )
        )
        .subscribe({
          next: (seccionList: any) => {
  
            this.seccionList.forEach( (seccion: any) => [
              this.dataSourceV2.forEach( (seccionData: any ) => {
                if(seccion.seccionId == seccionData.seccionId){
                  seccion.sum = seccionData.sum
                }
              } )
            ])
  
            console.log(this.seccionList)
            const data: any[] = []
            this.studentData.forEach( (student: any) => {
              
              data.push(
                {
                  nombre: student.userLastName + ", " + student.userFirstName
                }
              )
            })
            
            console.log(this.studentData)
            
            this.formService.printEvaluationForm(this.formService.generateGraduateWorkJuryReportEvaluationForm(
              this.criteriaList,
              this.seccionList,
              this.graduateWorkData.graduateWorkTitle,
              data,
              this.tutorData.userLastName + ", " + this.tutorData.userFirstName
            ))
            
            
          }
        })

      
    }
}
  

