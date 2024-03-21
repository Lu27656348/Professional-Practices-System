import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from 'lodash';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { DocumentService } from 'src/app/services/document.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { CriteriosTutorAcademicoService } from 'src/app/services/pasantia/criterios-tutor-academico.service';
import { CriteriosTutorEmpresarialService } from 'src/app/services/pasantia/criterios-tutor-empresarial.service';
import { PasantiaService } from 'src/app/services/pasantia/pasantia.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-pantalla-evaluacion',
  templateUrl: './pantalla-evaluacion.component.html',
  styleUrls: ['./pantalla-evaluacion.component.css']
})
export class PantallaEvaluacionComponent implements OnInit{
  
  formGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  pasantia: any = null;
  tutor: any = null;
  modo: any = null

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

  intershipData: any
  tutorData: any
  studentData: any
  enterpriseData: any

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private academicCriteriaService: CriteriosTutorAcademicoService,
    private corporateCriteriaService: CriteriosTutorEmpresarialService,
    private documentService: DocumentService,
    private formService: EvaluationFormGeneratorService,
    private userService: UsersService,
    private externalPersonnelService: ExternalPersonnelService,
    private professorService: ProfessorsService,
    private pasantiaService: PasantiaService,
    private enterpriseService: EnterpriseService
  ){
    this.route.params.subscribe(
      params => {
        console.log(params)
        this.modo = params['modo']
        this.pasantia = parseInt(params['pasantiaId'])
        this.tutor = params['tutor']
        console.log(this.tutor)
        console.log(this.pasantia)
        this.userService.getUserData(this.tutor)
          .pipe(
            switchMap(
              (userData) => {
                this.tutorData = userData
                return this.pasantiaService.getPasantiaById(this.pasantia)
              }
            ),
            switchMap(
              (intershipData) => {
                this.intershipData = intershipData
                console.log( this.intershipData)
                return this.userService.getUserData(this.intershipData.studentDNI)
              }
            ),
            switchMap(
              (studentData) => {
                this.studentData = studentData
                return this.enterpriseService.getEnterpriseById(this.intershipData.enterpriseId)
              }
            )
          )
          .subscribe({
            next: (result) => {
              console.log(result)
              this.enterpriseData = result
            }
          })
        if(this.modo == "academico"){
          console.log("Extraemos todos los criterios y secciones del tutor academico")
  
          this.academicCriteriaService.obtenerCriteriosEvaluacionTutorAcademico(this.pasantia as number, this.tutor).subscribe(
            {
              next: (criteriaList: any) => {
                console.log(criteriaList)
                criteriaList.forEach((criteria: any, index: number) => {
                  criteriaList[index].selectedCheckBox = false;
                  criteriaList[index].selectedCheckBoxIndex = null;
                })
                criteriaList.forEach((criteria: any, index: number) => {
                  /* Si no tengo elementos en mi arreglo inserto la primera seccion */
                  if(this.seccionExperiment.length == 0){
                    this.seccionExperiment.push(
                      {
                        seccionId: criteria.seccionId,
                        seccionName: criteria.seccionName,
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
                          seccionName: criteria.seccionName,
                          criteriaList: [criteria]
                        }
                      )
                    }
                  }
                });

                console.log(this.seccionExperiment)
                this.dataSourceV2 = this.seccionExperiment
              }
            }
          )

          
          
        }else{
          console.log("Extraemos todos los criterios del tutor empresarial")
          this.corporateCriteriaService.obtenerCriteriosEvaluacionTutorEmpresarial(this.pasantia as number, this.tutor).subscribe(
            {
              next: (criteriaList: any) => {
                console.log(criteriaList)
                criteriaList.forEach((criteria: any, index: number) => {
                  criteriaList[index].selectedCheckBox = false;
                  criteriaList[index].selectedCheckBoxIndex = null;
                })
                criteriaList.forEach((criteria: any, index: number) => {
                  /* Si no tengo elementos en mi arreglo inserto la primera seccion */
                  if(this.seccionExperiment.length == 0){
                    this.seccionExperiment.push(
                      {
                        seccionId: criteria.seccionId,
                        seccionName: criteria.seccionName,
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
                          seccionName: criteria.seccionName,
                          criteriaList: [criteria]
                        }
                      )
                    }
                  }
                });

                console.log(this.seccionExperiment)
                this.dataSourceV2 = this.seccionExperiment
              }
            }
          )
        }
      }
    )
    this.notaMaxima = this.obtenerNotaMaxima(this.dataSource)
    for (let index = 0; index <= this.notaMaxima; index++) {
      this.displayedColumns.push(index.toString())
    }
    console.log(this.displayedColumns)
    console.log("La Nota mas alta es: ", this.notaMaxima)
    
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
    if(this.modo == "academico"){
      this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
        elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {
          console.log(elementRowRow)
          observables.push(
            this.academicCriteriaService.calificarCriterioEvaluacionTutorAcademico(
              {
                userDNI: this.tutor,
                intershipId: this.pasantia,
                criteriaId: elementRowRow.criteriaId,
                criteriaNote: elementRowRow.selectedCheckBoxIndex
              }
            )
          )
        })
        console.log()
      })

      forkJoin(observables)
      .pipe(
        switchMap(
          (result) => {
            console.log(result)
            const criteriaObservables: Observable<any>[] = []

            this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
              criteriaObservables.push(this.academicCriteriaService.getAcademicTutorCriteriaBySeccion(elementRow.seccionId)) 
            })

            return forkJoin(criteriaObservables)
          }
        ),
        switchMap(
          (result: any) => {
            console.log(result)
            const seccionObservables: Observable<any>[] = []
            let criteriaFormArray: any = []

            this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
              elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {

                result.forEach( (criteriaArray: any) => {
                  criteriaArray.forEach( (criteriaData: any, index: number) => {
                    if(elementRowRow.criteriaId == criteriaArray[index].criteriaId){
                      criteriaArray[index].selectedValues = elementRowRow.selectedCheckBoxIndex
                      criteriaFormArray.push(criteriaData)
                    }

                    
                  })
                  
                })
                
              })
            })

            console.log(criteriaFormArray)

            this.criteriaList = criteriaFormArray
            
            this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
              seccionObservables.push(this.academicCriteriaService.getAcademicTutorSeccionById(elementRow.seccionId)) 
            })

            return forkJoin(seccionObservables)
          }
        )
      )
      .subscribe({
        next: (seccionList: any) => {
          console.log(seccionList)
          this.seccionList = seccionList

          this.seccionList.forEach( (seccion: any) => [
            this.dataSourceV2.forEach( (seccionData: any ) => {
              if(seccion.seccionId == seccionData.seccionId){
                seccion.sum = seccionData.sum
              }
            } )
          ])

          console.log(this.seccionList)
          const data = {
            nombreAlumno: this.studentData.userLastName + ", " + this.studentData.userFirstName,
            cedulaAlumno: this.studentData.userDNI, 
            empresa: this.enterpriseData.enterpriseName, 
            nombreTutor: this.tutorData.userLastName + ", " + this.tutorData.userFirstName,
          }
          this.formService.printEvaluationForm(this.formService.generateIntershipAcademicTutorEvaluationForm(
            this.criteriaList,
            this.seccionList,
            data
          ),
          `${this.studentData.userLastName.split(" ")[0] + this.studentData.userFirstName.split(" ")[0]} Evaluación Pasantía Tutor ${this.modo.charAt(0).toUpperCase() + this.modo.slice(1)} ${this.tutorData.userLastName.split(" ")[0] + this.tutorData.userFirstName.split(" ")[0]}`
          )
          
        }
      })
    }else{
      this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
        elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {
          observables.push(
            this.corporateCriteriaService.calificarCriterioEvaluacionTutorEmpresarial(
              {
                userDNI: this.tutor,
                intershipId: this.pasantia,
                criteriaId: elementRowRow.criteriaId,
                criteriaNote: elementRowRow.selectedCheckBoxIndex
              }
            )
          )
        })
        console.log()
      })
      forkJoin(observables)
      .pipe(
        switchMap(
          (result) => {
            console.log(result)
            const criteriaObservables: Observable<any>[] = []

            this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
              criteriaObservables.push(this.corporateCriteriaService.getEnterpriseTutorCriteriaBySeccion(elementRow.seccionId)) 
            })

            return forkJoin(criteriaObservables)
          }
        ),
        switchMap(
          (result: any) => {
            console.log(result)
            const seccionObservables: Observable<any>[] = []
            let criteriaFormArray: any = []

            this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
              elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {

                result.forEach( (criteriaArray: any) => {
                  criteriaArray.forEach( (criteriaData: any, index: number) => {
                    if(elementRowRow.criteriaId == criteriaArray[index].criteriaId){
                      criteriaArray[index].selectedValues = elementRowRow.selectedCheckBoxIndex
                      criteriaFormArray.push(criteriaData)
                    }

                    
                  })
                  
                })
                
              })
            })

            console.log(criteriaFormArray)

            this.criteriaList = criteriaFormArray
            
            this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
              seccionObservables.push(this.corporateCriteriaService.getEnterpriseTutorSeccionById(elementRow.seccionId)) 
            })

            return forkJoin(seccionObservables)
          }
        )
      )
      .subscribe({
        next: (seccionList: any) => {
          console.log(seccionList)
          this.seccionList = seccionList
          this.seccionList.forEach( (seccion: any) => [
            this.dataSourceV2.forEach( (seccionData: any ) => {
              if(seccion.seccionId == seccionData.seccionId){
                seccion.sum = seccionData.sum
              }
            } )
          ])

          console.log(this.seccionList)
          const data = {
            nombreAlumno: this.studentData.userLastName + ", " + this.studentData.userFirstName,
            cedulaAlumno: this.studentData.userDNI, 
            empresa: this.enterpriseData.enterpriseName, 
            nombreTutor: this.tutorData.userLastName + ", " + this.tutorData.userFirstName,
          }
          this.formService.printEvaluationForm(this.formService.generateIntershipCorporateTutorEvaluationForm(
            this.criteriaList,
            this.seccionList,
            data
          ),
          `${this.studentData.userLastName.split(" ")[0] + this.studentData.userFirstName.split(" ")[0]} Evaluación Pasantía Tutor ${this.modo.charAt(0).toUpperCase() + this.modo.slice(1)} ${this.tutorData.userLastName.split(" ")[0] + this.tutorData.userFirstName.split(" ")[0]}`
          )
          
        }
      })
    }
  }
}
