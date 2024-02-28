import { Component, Inject, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { UsersService } from '../../../../services/users.service';
import { StudentService} from '../../../../services/student.service'
import { GraduateworkService } from '../../../../services/graduatework.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { DialogsComponent } from './dialogs/dialogs.component'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { DocumentService } from 'src/app/services/document.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';


interface Criteria {
  reviewerCriteriaId: number;
  reviewerCriteriaDescription: string
}

@Component({
  selector: 'app-professor-reviewer',
  templateUrl: './professor-reviewer.component.html',
  styleUrls: ['./professor-reviewer.component.css']
})
export class ProfessorReviewerComponent implements OnInit{
  

  displayedColumns: string[] = ['criterio', 'aprobado', 'reprobado'];
  dataSource: Criteria[] = [];
  criteriaList: any = null;

  selectedValues: any = [];

  criteriaForm = new FormGroup({});

  revisorName: string = ''

  allSelected: boolean = false;

  professorData: any = null;

  trabajoDeGrado: any = null;
  revisor: any = null

  graduateWorkData: any = null;
  enterpriseData: any = null;
  studentData: any = null;
  tutorData: any = null;
  reviewerData: any = null
  
  constructor(
    private graduateWorkService: GraduateworkService,
    private formService: EvaluationFormGeneratorService,
    private documentService: DocumentService,
    private userService: UsersService,
    private professorService: ProfessorsService,
    private enterpriseService: EnterpriseService,
    private externalService: ExternalPersonnelService,
    private route: ActivatedRoute,
    private router: Router
  ){

    this.route.params.subscribe(
      params => {
        console.log(params)
        this.trabajoDeGrado = params['trabajoDeGrado']
        this.graduateWorkService.getGraduateWorkById(this.trabajoDeGrado).subscribe({
          next: (graduateWorkData) => {
            console.log(graduateWorkData)
            if(graduateWorkData.graduateWorkStatusCode !== 30){
              this.router.navigateByUrl(`dashboard`);
            }

          }
        })
        this.revisor = params['profesorRevisor']
        this.graduateWorkService.getGraduateWorkReviewer(params['trabajoDeGrado']).pipe(
          switchMap(
            (professorData) => {
              return this.userService.getUserData(professorData.professorDNI)
            }
          ),
          switchMap(
            (userData) => {
              this.professorData = userData
              return this.professorService.getProfessorById(this.professorData.userDNI)
            }
          )
        ).subscribe({
          next: (professorData) => {
            this.professorData.professorData = professorData
            console.log(professorData)
          }
        })
        this.graduateWorkService.getReviewerEvaluationCriteria({
          graduateWorkId: params['trabajoDeGrado'], 
          professorDNI: params['profesorRevisor']
        }).subscribe({
          next: (result) =>{
            console.log(result)
            this.criteriaList = result;
            this.criteriaList.forEach((item: Criteria, index: number) => {
              this.criteriaList[index].selectedValue = null
            });
            this.dataSource = this.criteriaList
            console.log(this.dataSource)
          }
        })
      }
    )

    

  }
  ngOnInit(): void {
    
  }

  arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
    // Check for length equality
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Compare elements using a for loop and strict equality (===)
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    // If all elements match, return true
    return true;
  }
  
  diferenciaArreglos<T>(arr1: T[], arr2: T[]): T[] {
    const diferencia: T[] = [];

    // Iterar sobre el primer arreglo
    for (const elemento1 of arr1) {
      // Buscar el elemento en el segundo arreglo
      const indiceEncontrado = arr2.indexOf(elemento1);

      // Si no se encuentra, agregarlo a la diferencia
      if (indiceEncontrado === -1) {
        diferencia.push(elemento1);
      }
    }

    // Iterar sobre el segundo arreglo
    for (const elemento2 of arr2) {
      // Buscar el elemento en el primer arreglo
      const indiceEncontrado = arr1.indexOf(elemento2);

      // Si no se encuentra, agregarlo a la diferencia
      if (indiceEncontrado === -1) {
        diferencia.push(elemento2);
      }
    }

    return diferencia;
  }

  submitEvaluation(){
  }

  printSelectedCriteria(event: any){
    console.log(event.source._value)
    this.selectedValues = event.source._value
  }

  onCheckboxChange(option: any,value: any) {
    
    console.log(option)
    /* Si la opcion no tiene ninguna valor entonces lo agrego*/

    if(option.selectedValue == null){
      this.selectedValues.push(
        {
          reviewerCriteriaId: option.reviewerCriteriaId,
          value: value
        }
      )
      this.criteriaList[this.findIndexByAttribute(this.criteriaList,"reviewerCriteriaId",option.reviewerCriteriaId)].selectedValue = value
    }else{
      /* Si la opcion ya carga un valor entonces ya lo he selccionado por lo que valido */
      if(option.selectedValue == value){
        this.selectedValues.splice(
          this.findIndexByAttribute(this.selectedValues,"reviewerCriteriaId",this.selectedValues.reviewerCriteriaId)
        )
        this.criteriaList[
          this.findIndexByAttribute(this.criteriaList,"reviewerCriteriaId",option.reviewerCriteriaId)
        ].selectedValue = null
      }else{
        this.criteriaList[this.findIndexByAttribute(this.criteriaList,"reviewerCriteriaId",option.reviewerCriteriaId)].selectedValue = value
        
      }
    }

    this.allSelected = this.criteriaList.every( (criteriaObject: any) => criteriaObject.selectedValue !== null)
    console.log(this.selectedValues)
    console.log(this.criteriaList)
  }

  findIndexByAttribute<T>(arr: T[], attribute: keyof T, value: any): number {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][attribute] === value) {
        return i;
      }
    }
    return -1;
  }
  

  generarPlanilla(){
    console.log("Genenar Planilla")
    this.graduateWorkService.getGraduateWorkById(this.trabajoDeGrado)
        .pipe(
          switchMap(
            (graduateWorkData) => {
              console.log(graduateWorkData)
              this.graduateWorkData = graduateWorkData
              return this.enterpriseService.getEnterpriseById(this.graduateWorkData.graduateWorkEnterprise)
            }
          ),
          switchMap(
            (enterpriseData) => {
              console.log(enterpriseData)
              this.enterpriseData = enterpriseData
              return this.graduateWorkService.getGraduateWorkStudentData(this.trabajoDeGrado)
            }
          ),
          switchMap(
            (studentData) => {
              console.log(studentData)
              this.studentData = studentData
              if(this.graduateWorkData.graduateWorkType == "INSTRUMENTAL"){
                return this.userService.getUserData(this.graduateWorkData.graduateWorkInCompanyTutor)
              }
              return this.userService.getUserData(this.graduateWorkData.graduateWorkAcademicTutor)
            }
          ),
          switchMap(
            (tutorData) => {
              console.log(tutorData)
              this.tutorData = tutorData
              if(this.graduateWorkData.graduateWorkType == "INSTRUMENTAL"){
                return this.externalService.getExternalById(this.graduateWorkData.graduateWorkInCompanyTutor)
              }
              return this.professorService.getProfessorById(this.graduateWorkData.graduateWorkAcademicTutor)
    
              
            }
          ),
          switchMap(
            (tutorDataDescription) => {
              console.log(tutorDataDescription)
              this.tutorData.tutorDescription = tutorDataDescription
              return this.userService.getUserData(this.revisor)
           
            }
          ),
          switchMap(
            (reviewerData) => {
              this.reviewerData = reviewerData
              let criteriaList: any[] = []
              this.criteriaList.forEach( (criteria: any) => {

                const criterio = {
                  criteriaId: criteria.reviewerCriteriaId,
                  criteriaName: criteria.reviewerCriteriaDescription,
                  maxNote: 0,
                  model: "INFORMATICA",
                  seccionId: -1,
                  selectedValue: criteria.selectedValue
                }
                criteriaList.push(criterio)
                  

              })
              console.log(criteriaList)
              const studentDataFormmatted: any = []
    
              this.studentData.forEach( (student: any) => {
                studentDataFormmatted.push(
                  {
                    nombreAlumno: student.userLastName + ", " + student.userFirstName,
                    cedulaAlumno: student.userDNI, 
                    correo: student.userEmail, 
                    telefono: student.userPhone,
                    empresa: this.enterpriseData.enterpriseName
                  }
                )
              })
    
              const tutorDataFormatted = {
                nombreCompleto: this.tutorData.userLastName + this.tutorData.userFirstName, 
                profesion: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? this.tutorData.tutorDescription.externalPersonnelProfession : this.tutorData.tutorDescription.professorProfession, 
                experiencia: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? this.tutorData.tutorDescription.externalPersonnelWorkExperience : this.tutorData.tutorDescription.professorWorkExperience, 
                cargo: (this.graduateWorkData.graduateWorkType == "INSTRUMENTAL") ? "Falta el cargo en la tabla de Externo" : this.tutorData.tutorDescription.professorRole, 
                correo: this.tutorData.userEmail, 
                telefono: this.tutorData.userPhone
              }
    
              const formData = {
                modalidad: this.graduateWorkData.graduateWorkType, 
                titulo: this.graduateWorkData.graduateWorkTitle,
                nombreEmpresa: this.enterpriseData.enterpriseName, 
                studentData: studentDataFormmatted,
                tutorData: tutorDataFormatted,
                nombreRevisor: this.reviewerData.userLastName + ", " + this.reviewerData.userFirstName, 
                fechaActual: new Date()
              }

              this.formService.printEvaluationForm(this.formService.generateGraduateWorkReviewerEvaluationForm(criteriaList,formData))
              return of("completado")
            }
          )
        )
        .subscribe(
          {
            next: (result) => {
              console.log(result)
              const observables: Observable<any>[] = []
              this.criteriaList.forEach( (criteria: any) => {
                if(criteria.selectedValue == true){
                  observables.push(
                    this.graduateWorkService.approveReviewerEvaluationCriteria(
                      {
                        professorDNI: this.revisor,
                        graduateWorkId: this.trabajoDeGrado,
                        reviewerCriteriaId: criteria.reviewerCriteriaId
                      }
                    )
                  )
                }else{
                  observables.push(
                    this.graduateWorkService.reproveReviewerEvaluationCriteria(
                      {
                        professorDNI: this.revisor,
                        graduateWorkId: this.trabajoDeGrado,
                        reviewerCriteriaId: criteria.reviewerCriteriaId
                      }
                    )
                  )
                }
                
              })

              forkJoin(observables).subscribe({
                next: (result) => [
                  console.log(result)
                ]
              })
              
            }
          }
        )
  }
}
