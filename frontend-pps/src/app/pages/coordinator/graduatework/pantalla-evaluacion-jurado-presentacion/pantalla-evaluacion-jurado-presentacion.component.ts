import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, forkJoin, of } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { DocumentService } from 'src/app/services/document.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { GraduateworkService } from 'src/app/services/graduatework.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-pantalla-evaluacion-jurado-presentacion',
  templateUrl: './pantalla-evaluacion-jurado-presentacion.component.html',
  styleUrls: ['./pantalla-evaluacion-jurado-presentacion.component.css']
})
export class PantallaEvaluacionJuradoPresentacionComponent {
    
  formGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  trabajoDeGrado: any = null;
  tutor: any = null;
  modo: any = null

  displayedColumns: string[] = ['criterio'];
  displayedColumnsV2: string[] = ['criterio'];

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
  dataSourceTutorAcademico: any = null

  notaMaxima: number = 0;
  notaMaximaV2: number = 0;

  seccionExperiment: any[] = []

  totalSum: any = null

  criteriosComunes: any = null

  allNotesAreSelected: boolean = false;

  graduateWorkData: any
  tutorData: any
  studentData: any
  enterpriseData: any

  esTutorAcademico: boolean = false;

  criteriosComunesSum: number = 0

  formularioAbierto: boolean = false;

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

        /* Primero obtenemos quien es el tutor del trabajo de grado */

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

                const fechaActual = new Date()
                const fechaDefensa = new Date(this.graduateWorkData.graduateWorkDefenseDate)

                console.log(fechaActual)
                console.log(fechaDefensa)

                if(fechaActual >= fechaDefensa){
                  this.formularioAbierto = true
                }
                console.log( this.formularioAbierto)
                console.log( this.graduateWorkData)
                if(this.graduateWorkData.graduateWorkAcademicTutor == this.tutor){
                  this.esTutorAcademico = true
                }
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
                  console.log("%cTutor academico","color:red")
                  this.graduateWorkService.getTutorOraltExperimentalCriteria(this.studentData[0].schoolName)
                  .pipe(
                    switchMap(
                      (criteriaList: any) => {
                        console.log(criteriaList)
                        this.notaMaxima = this.obtenerNotaMaxima(criteriaList)
  
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
  
                        this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula && criteriaData.seccionId != 1)
                        console.log(this.criteriaList)
  
                        this.criteriosComunes = criteriaList.filter( (criteriaData: any) =>{ return criteriaData.seccionId == 1})
                        console.log(this.criteriosComunes)
                        
                        this.criteriosComunes.forEach((criteria: any, index: number) => {
                          this.criteriosComunes[index].selectedCheckBox = false;
                          this.criteriosComunes[index].selectedCheckBoxIndex = null;
                        })
  
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
  
  
                        this.seccionExperiment[0].userDNI = this.studentData[0].userDNI
                        this.seccionExperiment[0].userName = this.studentData[0].userLastName + ", " + this.studentData[0].userFirstName
                        this.seccionExperiment[0].sum = 0
  
  
                        this.seccionExperiment[0].criteriaList.forEach( (criterio:any, index: number) => {
                          this.seccionExperiment[0].criteriaList[index].userDNI = this.seccionExperiment[0].userDNI
                        })
    
  
                        console.log("%cAntes","color: green")
                        console.log(this.seccionExperiment)
  
                        console.log("SALIR")
                        this.notaMaximaV2 = this.obtenerNotaMaxima(this.criteriaList)
                        this.dataSourceV2 = this.seccionExperiment
                        return this.graduateWorkService.getJuryOralExperimentalSeccion(this.studentData[0].schoolName)
                      }
                    )
                  )
                  .subscribe({
                    next: (seccionList:any) =>{
  
                      console.log(seccionList)
                      this.seccionList = seccionList
                      const mayuscula: string  = this.modo.toUpperCase()
                      console.log(mayuscula)
  
  
                      if(this.studentData.length > 1){
                        
                        let nuevaSeccion: any = {
                          userDNI: this.studentData[1].userDNI,
                          userName: this.studentData[1].userLastName + ", " + this.studentData[1].userFirstName,
                          criteriaList: [],
                          sum: 0
                        }
                        console.log(nuevaSeccion)
  
                        console.log(this.dataSourceV2)
  
                        this.dataSourceV2[0].criteriaList.forEach(
                          (criteria:any) => 
                          {
                            let criteriaData = {...criteria}
                            criteriaData.userDNI = this.studentData[1].userDNI
                            nuevaSeccion.criteriaList.push(criteriaData)
                          }
                        )
                       
                        console.log(nuevaSeccion)
                        this.dataSourceV2.push(nuevaSeccion)
                      }
                        
  
                        /* A cada seccion le agregamos la firma del estudiante */
                        console.log("%cDespues","color: red")
                        console.log(this.dataSourceV2)
  
                      this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                      this.dataSourceV2.forEach(( seccion:any,index: number) => {
                        this.seccionList.forEach( (seccionData: any ) => {
                          if(seccionData.seccionId == seccion.seccionId){
                            this.dataSourceV2[index].seccionName = seccionData.seccionName
                          }
                        })
                      });
  
                     
                      for (let index = 0; index <= this.notaMaxima; index++) {
                        this.displayedColumns.push(index.toString())
                      }
                      for (let index = 0; index <= this.notaMaximaV2; index++) {
                        this.displayedColumnsV2.push(index.toString())
                      }
                      console.log(this.displayedColumns)
                      console.log("La Nota mas alta es: ", this.notaMaxima)
                    }
                  })
                }else{
                  console.log("%cJurado","color:red")
                  this.graduateWorkService.getJuryOralExperimentalCriteria(this.studentData[0].schoolName)
                  .pipe(
                    switchMap(
                      (criteriaList: any) => {
                        console.log(criteriaList)
                        this.notaMaxima = this.obtenerNotaMaxima(criteriaList)
  
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
  
                        this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula && criteriaData.seccionId != 1)
                        console.log(this.criteriaList)
  
                        this.criteriosComunes = criteriaList.filter( (criteriaData: any) =>{ return criteriaData.seccionId == 1})
                        console.log(this.criteriosComunes)
                        
                        this.criteriosComunes.forEach((criteria: any, index: number) => {
                          this.criteriosComunes[index].selectedCheckBox = false;
                          this.criteriosComunes[index].selectedCheckBoxIndex = null;
                        })
  
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
  
  
                        this.seccionExperiment[0].userDNI = this.studentData[0].userDNI
                        this.seccionExperiment[0].userName = this.studentData[0].userLastName + ", " + this.studentData[0].userFirstName
                        this.seccionExperiment[0].sum = 0
  
  
                        this.seccionExperiment[0].criteriaList.forEach( (criterio:any, index: number) => {
                          this.seccionExperiment[0].criteriaList[index].userDNI = this.seccionExperiment[0].userDNI
                        })
    
  
                        console.log("%cAntes","color: green")
                        console.log(this.seccionExperiment)
  
                        console.log("SALIR")
                        this.notaMaximaV2 = this.obtenerNotaMaxima(this.criteriaList)
                        this.dataSourceV2 = this.seccionExperiment
                        return this.graduateWorkService.getJuryOralExperimentalSeccion(this.studentData[0].schoolName)
                      }
                    )
                  )
                  .subscribe({
                    next: (seccionList:any) =>{
  
                      console.log(seccionList)
                      const mayuscula: string  = this.modo.toUpperCase()
                      console.log(mayuscula)
  
  
                      if(this.studentData.length > 1){
                        
                        let nuevaSeccion: any = {
                          userDNI: this.studentData[1].userDNI,
                          userName: this.studentData[1].userLastName + ", " + this.studentData[1].userFirstName,
                          criteriaList: [],
                          sum: 0
                        }
                        console.log(nuevaSeccion)
  
                        console.log(this.dataSourceV2)
  
                        this.dataSourceV2[0].criteriaList.forEach(
                          (criteria:any) => 
                          {
                            let criteriaData = {...criteria}
                            criteriaData.userDNI = this.studentData[1].userDNI
                            nuevaSeccion.criteriaList.push(criteriaData)
                          }
                        )
                       
                        console.log(nuevaSeccion)
                        this.dataSourceV2.push(nuevaSeccion)
                      }
                        
  
                        /* A cada seccion le agregamos la firma del estudiante */
                        console.log("%cDespues","color: red")
                        console.log(this.dataSourceV2)
  
                      this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                      this.dataSourceV2.forEach(( seccion:any,index: number) => {
                        this.seccionList.forEach( (seccionData: any ) => {
                          if(seccionData.seccionId == seccion.seccionId){
                            this.dataSourceV2[index].seccionName = seccionData.seccionName
                          }
                        })
                      });
  
                     
                      for (let index = 0; index <= this.notaMaxima; index++) {
                        this.displayedColumns.push(index.toString())
                      }
                      for (let index = 0; index <= this.notaMaximaV2; index++) {
                        this.displayedColumnsV2.push(index.toString())
                      }
                      console.log(this.displayedColumns)
                      console.log("La Nota mas alta es: ", this.notaMaxima)
                    }
                  })
                }
                
      
              }else{
                console.log("Extraemos todos los criterios y secciones del modo instrumental")
                if(this.graduateWorkData.graduateWorkAcademicTutor  == this.tutor){
                  console.log("%cTutor academico","color:red")
                  this.graduateWorkService.getTutorOralInstrumentalCriteria(this.studentData[0].schoolName)
                  .pipe(
                    switchMap(
                      (criteriaList: any) => {
                        console.log(criteriaList)
                        this.notaMaxima = this.obtenerNotaMaxima(criteriaList)
  
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
  
                        this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula && criteriaData.seccionId != criteriaList[0].seccionId)
                        console.log(this.criteriaList)
  
                        this.criteriosComunes = criteriaList.filter( (criteriaData: any) =>{ return criteriaData.seccionId == criteriaList[0].seccionId})
                        console.log(this.criteriosComunes)
                        
                        this.criteriosComunes.forEach((criteria: any, index: number) => {
                          this.criteriosComunes[index].selectedCheckBox = false;
                          this.criteriosComunes[index].selectedCheckBoxIndex = null;
                        })
  
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
  
  
                        this.seccionExperiment[0].userDNI = this.studentData[0].userDNI
                        this.seccionExperiment[0].userName = this.studentData[0].userLastName + ", " + this.studentData[0].userFirstName
                        this.seccionExperiment[0].sum = 0
  
  
                        this.seccionExperiment[0].criteriaList.forEach( (criterio:any, index: number) => {
                          this.seccionExperiment[0].criteriaList[index].userDNI = this.seccionExperiment[0].userDNI
                        })
    
  
                        console.log("%cAntes","color: green")
                        console.log(this.seccionExperiment)
  
                        console.log("SALIR")
                        this.notaMaximaV2 = this.obtenerNotaMaxima(this.criteriaList)
                        this.dataSourceV2 = this.seccionExperiment
                        return this.graduateWorkService.getTutorOralInstrumentalSeccion(this.studentData[0].schoolName)
                      }
                    )
                  )
                  .subscribe({
                    next: (seccionList:any) =>{
  
                      console.log(seccionList)
                      const mayuscula: string  = this.modo.toUpperCase()
                      console.log(mayuscula)
  
  
                      if(this.studentData.length > 1){
                        
                        let nuevaSeccion: any = {
                          userDNI: this.studentData[1].userDNI,
                          userName: this.studentData[1].userLastName + ", " + this.studentData[1].userFirstName,
                          criteriaList: [],
                          sum: 0
                        }
                        console.log(nuevaSeccion)
  
                        console.log(this.dataSourceV2)
  
                        this.dataSourceV2[0].criteriaList.forEach(
                          (criteria:any) => 
                          {
                            let criteriaData = {...criteria}
                            criteriaData.userDNI = this.studentData[1].userDNI
                            nuevaSeccion.criteriaList.push(criteriaData)
                          }
                        )
                       
                        console.log(nuevaSeccion)
                        this.dataSourceV2.push(nuevaSeccion)
                      }
                        
  
                        /* A cada seccion le agregamos la firma del estudiante */
                        console.log("%cDespues","color: red")
                        console.log(this.dataSourceV2)
  
                      this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                      this.dataSourceV2.forEach(( seccion:any,index: number) => {
                        this.seccionList.forEach( (seccionData: any ) => {
                          if(seccionData.seccionId == seccion.seccionId){
                            this.dataSourceV2[index].seccionName = seccionData.seccionName
                          }
                        })
                      });
  
                     
                      for (let index = 0; index <= this.notaMaxima; index++) {
                        this.displayedColumns.push(index.toString())
                      }
                      for (let index = 0; index <= this.notaMaximaV2; index++) {
                        this.displayedColumnsV2.push(index.toString())
                      }
                      console.log(this.displayedColumns)
                      console.log("La Nota mas alta es: ", this.notaMaxima)
                    }
                  })
                }else{
                  console.log("%cJurado","color:red")
                  this.graduateWorkService.getJuryOralInstrumentalCriteria(this.studentData[0].schoolName)
                  .pipe(
                    switchMap(
                      (criteriaList: any) => {
                        console.log(criteriaList)
                        this.notaMaxima = this.obtenerNotaMaxima(criteriaList)
  
                        const mayuscula: string  = this.modo.toUpperCase()
                        console.log(mayuscula)
  
                        this.criteriaList = criteriaList.filter( (criteriaData: any) => criteriaData.schoolName == this.studentData[0].schoolName && criteriaData.criteriaModel == mayuscula && criteriaData.seccionId != criteriaList[0].seccionId)
                        console.log(this.criteriaList)
  
                        this.criteriosComunes = criteriaList.filter( (criteriaData: any) =>{ return criteriaData.seccionId == criteriaList[0].seccionId})
                        console.log(this.criteriosComunes)
                        
                        this.criteriosComunes.forEach((criteria: any, index: number) => {
                          this.criteriosComunes[index].selectedCheckBox = false;
                          this.criteriosComunes[index].selectedCheckBoxIndex = null;
                        })
  
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
  
  
                        this.seccionExperiment[0].userDNI = this.studentData[0].userDNI
                        this.seccionExperiment[0].userName = this.studentData[0].userLastName + ", " + this.studentData[0].userFirstName
                        this.seccionExperiment[0].sum = 0
  
  
                        this.seccionExperiment[0].criteriaList.forEach( (criterio:any, index: number) => {
                          this.seccionExperiment[0].criteriaList[index].userDNI = this.seccionExperiment[0].userDNI
                        })
    
  
                        console.log("%cAntes","color: green")
                        console.log(this.seccionExperiment)
  
                        console.log("SALIR")
                        this.notaMaximaV2 = this.obtenerNotaMaxima(this.criteriaList)
                        this.dataSourceV2 = this.seccionExperiment
                        return this.graduateWorkService.getJuryOralInstrumentalSeccion(this.studentData[0].schoolName)
                      }
                    )
                  )
                  .subscribe({
                    next: (seccionList:any) =>{
  
                      console.log(seccionList)
                      const mayuscula: string  = this.modo.toUpperCase()
                      console.log(mayuscula)
  
  
                      if(this.studentData.length > 1){
                        
                        let nuevaSeccion: any = {
                          userDNI: this.studentData[1].userDNI,
                          userName: this.studentData[1].userLastName + ", " + this.studentData[1].userFirstName,
                          criteriaList: [],
                          sum: 0
                        }
                        console.log(nuevaSeccion)
  
                        console.log(this.dataSourceV2)
  
                        this.dataSourceV2[0].criteriaList.forEach(
                          (criteria:any) => 
                          {
                            let criteriaData = {...criteria}
                            criteriaData.userDNI = this.studentData[1].userDNI
                            nuevaSeccion.criteriaList.push(criteriaData)
                          }
                        )
                       
                        console.log(nuevaSeccion)
                        this.dataSourceV2.push(nuevaSeccion)
                      }
                        
  
                        /* A cada seccion le agregamos la firma del estudiante */
                        console.log("%cDespues","color: red")
                        console.log(this.dataSourceV2)
  
                      this.seccionList = seccionList.filter( (seccionData: any ) => seccionData.schoolName == this.studentData[0].schoolName && seccionData.criteriaModel == mayuscula) 
                      this.dataSourceV2.forEach(( seccion:any,index: number) => {
                        this.seccionList.forEach( (seccionData: any ) => {
                          if(seccionData.seccionId == seccion.seccionId){
                            this.dataSourceV2[index].seccionName = seccionData.seccionName
                          }
                        })
                      });
  
                     
                      for (let index = 0; index <= this.notaMaxima; index++) {
                        this.displayedColumns.push(index.toString())
                      }
                      for (let index = 0; index <= this.notaMaximaV2; index++) {
                        this.displayedColumnsV2.push(index.toString())
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
    this.dataSourceV2.forEach( (seccionEstudiante:any,index: number) => {
      if( row.userDNI == seccionEstudiante.userDNI){
        console.log("Estoy en la seccion del estudiante ",seccionEstudiante.userDNI )
        this.dataSourceV2[index].criteriaList.forEach( (criterioEstudiante:any) => {
          if(criterioEstudiante.criteriaId == row.criteriaId){
            if(criterioEstudiante.selectedCheckBox == false){
              this.totalSum = this.totalSum + checkboxIndex;
              criterioEstudiante.selectedCheckBoxIndex = checkboxIndex;
              criterioEstudiante.selectedCheckBox = true
            }else{
              if(criterioEstudiante.selectedCheckBoxIndex === checkboxIndex){

                console.log("estoy marcando la casilla anterior")
  
                this.totalSum = this.totalSum - checkboxIndex;
                criterioEstudiante.selectedCheckBox = false;
                criterioEstudiante.selectedCheckBoxIndex = null;
  
              }else{
  
                console.log("ya habia marcado la fila y ahora actualizo el valor")
  
                this.totalSum = this.totalSum - criterioEstudiante.selectedCheckBoxIndex
                this.totalSum = this.totalSum + checkboxIndex;
                criterioEstudiante.selectedCheckBoxIndex = checkboxIndex;
                
              }
            }
          }
        })
       this.calculateSeccionSum(seccionEstudiante)

      }
    })
    console.log(this.totalSum)
    this.allNotesAreSelected = this.validateAllNotesSelected()
  }

  onCheckboxChangeV2(row: any, checkboxIndex: number) {
    console.log(row)
    /* Lo primero que hacemos es ubicar elemento para saber en que fila estamos */

      this.criteriosComunes.forEach((elementRowRow: any, index: number) => {
        if(elementRowRow.criteriaId == row.criteriaId ){

          console.log("Estamos en el elemento " + index)

          if(elementRowRow.selectedCheckBox == false){

            console.log("No he marcado la fila todavia")

            this.totalSum = this.totalSum + checkboxIndex;
            this.criteriosComunesSum = this.criteriosComunesSum + checkboxIndex

            this.criteriosComunes[index].selectedCheckBoxIndex = checkboxIndex;
            this.criteriosComunes[index].selectedCheckBox = true

          }else{

            if(elementRowRow.selectedCheckBoxIndex === checkboxIndex){

              console.log("estoy marcando la casilla anterior")

              this.totalSum = this.totalSum - checkboxIndex;
              this.criteriosComunesSum = this.criteriosComunesSum - checkboxIndex
              elementRowRow.selectedCheckBox = false;
              elementRowRow.selectedCheckBoxIndex = null;

            }else{

              console.log("ya habia marcado la fila y ahora actualizo el valor")

              this.totalSum = this.totalSum - elementRowRow.selectedCheckBoxIndex
              this.totalSum = this.totalSum + checkboxIndex;

              this.criteriosComunesSum = this.criteriosComunesSum - elementRowRow.selectedCheckBoxIndex
              this.criteriosComunesSum = this.criteriosComunesSum + checkboxIndex

              elementRowRow.selectedCheckBoxIndex = checkboxIndex;
              
            }
            
          }
        }

      })

      console.log(this.totalSum)
      console.log(this.criteriosComunesSum)
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

        console.log("%cGenerar Planilla de Tutor academico","color:red")


        this.dataSourceV2.forEach( (elementRow: any, indexData: number) => {
          elementRow.criteriaList.forEach( ( elementRowRow: any, index: number ) => {
            console.log(elementRowRow)
            this.studentData.forEach((student: any) => {
              if(this.graduateWorkData.graduateWorkAcademicTutor  == this.tutor){
                observables.push(
                  this.graduateWorkService.addTutorOralEvaluationNote({
                    juryDNI: this.tutor,
                    studentDNI: student.userDNI,
                    graduateWorkId: this.graduateWorkData.graduateworkid,
                    criteriaId: elementRowRow.criteriaId,
                    evaluationNote: elementRowRow.selectedCheckBoxIndex
                  })
                )
              }else{
                observables.push(
                  this.graduateWorkService.addJuryOralEvaluationNote({
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

          console.log(this.dataSourceV2)

          this.seccionList.forEach( (seccion: any) => {
            this.dataSourceV2.forEach( (seccionData: any, index: number ) => {

              seccion.sum = seccionData.sum
              seccion.userDNI = seccionData.userDNI
              
            } )
          })

          console.log(this.seccionList)
          const data: any[] = []
          this.studentData.forEach( (student: any) => {
            
            data.push(
              {
                nombre: student.userLastName + ", " + student.userFirstName,
                userDNI: student.userDNI
              }
            )
          })
          
          console.log(this.studentData)


          console.log(this.criteriosComunes)

          this.criteriosComunes.forEach( ( elementRowRow: any, index: number ) => {


            elementRowRow.selectedValues = elementRowRow.selectedCheckBoxIndex         
      
          })

          const formData = {
            criteriaList: this.criteriaList,
            criteriosComunes: this.criteriosComunes,
            seccionList: this.seccionList,
            titulo: this.graduateWorkData.graduateWorkTitle,
            data: data,
            nombreTutor: this.tutorData.userLastName + ", " + this.tutorData.userFirstName
          }
          
          console.log(formData)

          this.formService.printEvaluationForm(this.formService.generateGraduateWorkJuryOralEvaluationForm(
            this.criteriaList,
            this.criteriosComunes,
            this.seccionList,
            this.graduateWorkData.graduateWorkTitle,
            data,
            this.tutorData.userLastName + ", " + this.tutorData.userFirstName
          ))
          
          
        }
      })
      
  }
}
