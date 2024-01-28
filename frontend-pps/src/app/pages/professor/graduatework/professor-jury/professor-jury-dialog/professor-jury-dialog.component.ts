import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GraduateworkService } from '../../../../../services/graduatework.service'
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { has } from 'lodash';

interface finalResumeData {
  userDNI: string
  userName: string,
  presidentNote: number,
  principalNote: number,
  tutorNote: number,
  finalNote: number
}

@Component({
  selector: 'app-professor-jury-dialog',
  templateUrl: './professor-jury-dialog.component.html',
  styleUrls: ['./professor-jury-dialog.component.css']
})
export class ProfessorJuryDialogComponent implements OnInit{
  sliderValue: number = 0;
  inputdata: any = null;
  isJuryPresent: boolean | null = null;
  isPresident: boolean = false;
  profesorLocalData: any = null;
  graduateWorkType: string = ''
  limitEdition: number = 0;
  noteSourceRange = [
    {
      minValue: 10,
      maxValue: 22,
      note: 1
    },
    {
      minValue: 23,
      maxValue: 37,
      note: 2
    },
    {
      minValue: 38,
      maxValue: 52,
      note: 3
    },
    {
      minValue: 53,
      maxValue: 67,
      note: 4
    },
    {
      minValue: 68,
      maxValue: 82,
      note: 5
    },
    {
      minValue: 83,
      maxValue: 97,
      note: 6
    },
    {
      minValue: 98,
      maxValue: 112,
      note: 7
    },
    {
      minValue: 113,
      maxValue: 127,
      note: 8
    },
    {
      minValue: 128,
      maxValue: 142,
      note: 9
    },
    {
      minValue: 143,
      maxValue: 157,
      note: 10
    },
    {
      minValue: 158,
      maxValue: 172,
      note: 11
    },
    {
      minValue: 173,
      maxValue: 187,
      note: 12
    },
    {
      minValue: 188,
      maxValue: 202,
      note: 13
    },
    {
      minValue: 203,
      maxValue: 217,
      note: 14
    },
    {
      minValue: 218,
      maxValue: 232,
      note: 15
    },
    {
      minValue: 233,
      maxValue: 247,
      note: 16
    },
    {
      minValue: 248,
      maxValue: 262,
      note: 17
    },
    {
      minValue: 263,
      maxValue: 277,
      note: 18
    },
    {
      minValue: 278,
      maxValue: 292,
      note: 19
    },
    {
      minValue: 293,
      maxValue: 300,
      note: 20
    }
  ];

  displayedColumns: string[] = ['criteria','0','1','2','3','4','5','6'];
  //displayedOralColumns: string[] = ['criteria','0','1','2','3','4','5','6','7','8','9','10','11','12'];
  displayedOralColumns: string[] = ['criteria','points'];
  graduateWorkSource: any = []
  graduateWorkOralSource: any = []
  graduateWorkOralSourceAlt: any = []

  criteriaExperimentalList: any = []
  criteriaOralExperimentalList: any = []

  totalSum: number = 0;
  totalOralSum: number[] = [0,0];
  totalNewSum: number[] = [0,0];
  value = 0;

  firstStudentName: string = ''
  secondStudentName: string = ''
  studentList: any[] = [];
  isGraduateWorkReportComplete: boolean =  false;
  isGraduateWorkOralPresentationComplete: boolean =  false;
  isGraduateWorkOralPresentationAltComplete: boolean =  false;
  isGraduateWorkObservationsComplete: boolean =  true;
  areAllNotesSelected : boolean =  false;
  juryData: any = null;
  tutorSubmitted: boolean = false;
  jurySubmitted: boolean = false;
  hasPresident: boolean = false;
  allNotesSubmitted: boolean = false
  mentionSelected: string = 'NULL'
  displayedFinalColumns: string[] = ['studentName', 'presidentNote','principalNote', 'tutorNote', 'finalNote', 'equivalentNote','actions'];
  firstStudentDifference: number = 0;
  resumeSource: any[] = [

  ]

  resumeSourceAlt: any[] = [

  ]

  editFinalNote: boolean = false;
  jurySelected: any = null;
  juryList: any = null;
  formSelected: any = null
  editNoteTable: boolean = false;
  graduateWorkEditSource: any[] = []
  studentSelected: any = null;
  chargeCriteria: boolean = false
  firstStudentResume: any = null;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private graduateWorkService: GraduateworkService){
    this.inputdata = this.data
    console.log(this.inputdata)

    this.graduateWorkService.getAllNotesValidation(this.inputdata.graduateWorkData.graduateworkid).pipe(
      switchMap(
        (allNotesSubmitted) => {
          this.allNotesSubmitted = allNotesSubmitted
          console.log("Todas las notas estan cargadas -> ", this.allNotesSubmitted)
          return this.graduateWorkService.getHasjuryPresident(this.inputdata.graduateWorkData.graduateworkid);
        }
      ),
      switchMap(
        (hasPresident) => {
          this.hasPresident = hasPresident
          console.log("Ya ha sido seleccionado un presidente -> ", hasPresident);
          return this.graduateWorkService.getGraduateWorkStudentData(this.inputdata.graduateWorkData.graduateworkid)
        }
      ),
      switchMap(
        (studentList) => {
          this.studentList = studentList
          this.firstStudentName = this.studentList[0].userLastName.split(" ")[0] + this.studentList[0].userFirstName.split(" ")[0]
          if(this.studentList.length > 1){
            this.secondStudentName = this.studentList[1].userLastName.split(" ")[0] + this.studentList[1].userFirstName.split(" ")[0]
          }
          return of(studentList)
        }
      )
    ).subscribe({
      next: (result) => {
        console.log(result)
      }
    })
    


    this.graduateWorkType = this.inputdata.graduateWorkData.graduateWorkType
    console.log(this.graduateWorkType)
    this.graduateWorkService.getJuryData(this.inputdata.professorData.userDNI,this.inputdata.graduateWorkData.graduateworkid).pipe(
      switchMap(
        (juryData) => {
          console.log(juryData)
          if(juryData.juryType == 'TUTOR'){
            if(this.graduateWorkType == 'EXPERIMENTAL'){
              this.graduateWorkService.getTutorReportExperimentalCriteria().subscribe({
                next: (criteriaExperimentalList : any)=>{
                  console.log(criteriaExperimentalList)
                  criteriaExperimentalList.forEach( (element: any,index: number) => {
                    criteriaExperimentalList[index].selectedCheckBox = false;
                    criteriaExperimentalList[index].selectedCheckBoxIndex = null;
                  });
                  this.graduateWorkSource = criteriaExperimentalList
                }
              })
        
              this.graduateWorkService.getTutorOraltExperimentalCriteria().subscribe({
                next: (oralCriteriaExperimentalList : any ) => {
                  console.log(oralCriteriaExperimentalList)
                  oralCriteriaExperimentalList.forEach( (element: any,index: number) => {
                    oralCriteriaExperimentalList[index].selectedCheckBox = false;
                    oralCriteriaExperimentalList[index].selectedCheckBoxIndex = null;
                  });
                  this.graduateWorkOralSource = [...oralCriteriaExperimentalList].map(
                    (element, index) => ({
                      ...element,
                      selectedCheckBox: false,
                      selectedCheckBoxIndex: null,
                    })
                  );
                  this.graduateWorkOralSourceAlt = [...oralCriteriaExperimentalList];
                }
              })
            }

          }else{

            if(this.graduateWorkType == 'EXPERIMENTAL'){
              this.graduateWorkService.getJuryReportExperimentalCriteria().subscribe({
                next: (criteriaExperimentalList : any)=>{
                  console.log(criteriaExperimentalList)
                  criteriaExperimentalList.forEach( (element: any,index: number) => {
                    criteriaExperimentalList[index].selectedCheckBox = false;
                    criteriaExperimentalList[index].selectedCheckBoxIndex = null;
                  });
                  this.graduateWorkSource = criteriaExperimentalList
                }
              })
        
              this.graduateWorkService.getJuryOraltExperimentalCriteria().subscribe({
                next: (oralCriteriaExperimentalList : any ) => {
                  console.log(oralCriteriaExperimentalList)
                  oralCriteriaExperimentalList.forEach( (element: any,index: number) => {
                    oralCriteriaExperimentalList[index].selectedCheckBox = false;
                    oralCriteriaExperimentalList[index].selectedCheckBoxIndex = null;
                  });
                  this.graduateWorkOralSource = [...oralCriteriaExperimentalList].map(
                    (element, index) => ({
                      ...element,
                      selectedCheckBox: false,
                      selectedCheckBoxIndex: null,
                    })
                  );
                  this.graduateWorkOralSourceAlt = [...oralCriteriaExperimentalList];
                }
              })
            }

          }
          return of(juryData)
        }
      )
    ).subscribe({
      next: (result) => {
        console.log(result)
      }
    })
    

    const userString = localStorage.getItem('user');
    if(userString){
      const profesorLocalData = JSON.parse(userString);
      console.log(profesorLocalData)
      this.profesorLocalData = profesorLocalData
      this.graduateWorkService.getJuryData(profesorLocalData.userDNI,this.inputdata.graduateWorkData.graduateworkid ).subscribe({
        next: (result) => {
          console.log(result)
          this.juryData = result
          this.graduateWorkService.getHasTutorSubmittedFinalNote(this.juryData.juryDNI,this.inputdata.graduateWorkData.graduateworkid).subscribe({
            next: (result) => {
              console.log(result)
              this.tutorSubmitted = result
            }
          })
          this.graduateWorkService.getHasjurySubmittedFinalNote(this.juryData.juryDNI,this.inputdata.graduateWorkData.graduateworkid).subscribe({
            next: (result) => {
              console.log(result)
              this.jurySubmitted = result
            }
          })
        }
      })
      this.graduateWorkService.getJuryisPresent(profesorLocalData.userDNI,this.inputdata.graduateWorkData.graduateworkid).subscribe(
        {
          next: (isJuryPresent) => {
            console.log(isJuryPresent)
            this.isJuryPresent = isJuryPresent
          }
        }
      )
    }
    
  }

  ngOnInit(){
    this.graduateWorkService.getAllNotesValidation(this.inputdata.graduateWorkData.graduateworkid)
    .pipe(
      switchMap(
        (allNotesSubmitted) => {
          this.allNotesSubmitted = allNotesSubmitted
          return  this.graduateWorkService.getGraduateWorkStudentData(this.inputdata.graduateWorkData.graduateworkid)
        }
      ),
      switchMap(
        (studentList) => {
          this.studentList = studentList
          console.log(this.inputdata.graduateWorkData)
          console.log(this.profesorLocalData)
          return this.graduateWorkService.getJuryOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
        }
      ),
        switchMap(
          (
            (principalOralNote) => {
              console.log("Nota Principal Oral ", principalOralNote)
              this.firstStudentResume = {
                userDNI: this.studentList[0].userDNI,
                userName: this.studentList[0].userLastName + " " + this.studentList[0].userFirstName,
                presidentNote: 0,
                principalNote: principalOralNote,
                tutorNote: 0,
                finalNote: 0,
                nextNote: -1,
                equivalentNote: -1,
                minValueRange: -1,
                maxValueRange: -1
              }
              return this.graduateWorkService.getJuryReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
            }
          )
        ),
        switchMap(
          (principalReportNote) => {
            console.log("Nota Principal Reporte ", principalReportNote)
            this.firstStudentResume.principalNote = this.firstStudentResume.principalNote + principalReportNote;
            return this.graduateWorkService.getTutorOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
          }
        ),
        switchMap(
          (tutorOralNote) => {
            console.log("Nota Tutor Oral ", tutorOralNote)
            this.firstStudentResume.tutorNote = tutorOralNote
            return this.graduateWorkService.getTutorReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
          }
        ),
        switchMap(
          (tutorReportNote) => {
            console.log("Nota Tutor Reporte ", tutorReportNote)
            this.firstStudentResume.tutorNote =  this.firstStudentResume.tutorNote + tutorReportNote
            return this.graduateWorkService.getPresidentOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
          }
        ),
        switchMap(
          (presidentOralNote) => {
            console.log("Nota Presidente Oral ", presidentOralNote)
            this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentOralNote
            return this.graduateWorkService.getPresidentReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
          }
        ),
        switchMap(
          (presidentReportNote) => {
            console.log("Nota Presidente Reporte ", presidentReportNote)
            this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentReportNote
            return of(this.firstStudentResume)
          }
        )
      ).subscribe({
        next: (result) => {
          console.log(result)
          this.firstStudentResume.finalNote = this.firstStudentResume.presidentNote + this.firstStudentResume.tutorNote + this.firstStudentResume.principalNote
          this.firstStudentResume.nextNote = this.identificarNotaSiguiente(this.firstStudentResume.finalNote)
          this.firstStudentResume.equivalentNote = this.identificarNotaEquivalente(this.firstStudentResume.finalNote)
          this.firstStudentResume.minValueRange = this.identificarRangoMinNota(this.firstStudentResume.finalNote)
          this.firstStudentResume.maxValueRange = this.identificarRangoMaxNota(this.firstStudentResume.finalNote)
          this.resumeSource = [this.firstStudentResume]
          console.log(this.resumeSource)
        }
      })
  
  }

cargarCriterios(){
  console.log("cargarCriterios")
  console.log(this.formSelected)
  console.log(this.jurySelected)
  this.chargeCriteria = true;
  this.graduateWorkService.getGraduateWorkJuries(this.inputdata.graduateWorkData.graduateworkid).pipe(
    switchMap(
      ((juriesData) => {
        console.log(juriesData)
        return of(juriesData)
      })
    )
  ).subscribe({
    next: (juriesData) => {
      console.log(juriesData)
    }
  })
  if(this.jurySelected == 'PRESIDENT'){
    if(this.formSelected == 'ORAL'){
      this.limitEdition = 40;
      this.graduateWorkService.getGraduateWorkJuryByRol(this.inputdata.graduateWorkData.graduateworkid, 'PRESIDENT')
      .pipe(
        switchMap(
          (juryData: any) => {
            return this.graduateWorkService.getJuryOralEvaluationNote({
              graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
              juryDNI: juryData.juryDNI,
              studentDNI: this.studentSelected
            })
          }
        )
      )
      .subscribe(
        {
          next: (criteriaList) => {
            console.log(criteriaList)
            this.graduateWorkEditSource = [...criteriaList]
            this.graduateWorkEditSource.forEach( (element: any,index: number) => {
              this.graduateWorkEditSource[index].selectedCheckBox = false;
            });
            console.log(this.graduateWorkEditSource)
          }
        }
      )
    }
    if(this.formSelected == 'REPORT'){
      this.limitEdition = 60;
      this.graduateWorkService.getGraduateWorkJuryByRol(this.inputdata.graduateWorkData.graduateworkid, 'PRESIDENT')
      .pipe(
        switchMap(
          (juryData: any) => {
            return this.graduateWorkService.getJuryReportEvaluationNote({
              graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
              juryDNI: juryData.juryDNI,
              studentDNI: this.studentSelected
            })
          }
        )
      )
      .subscribe(
        {
          next: (criteriaList) => {
            console.log(criteriaList)
            this.graduateWorkEditSource = [...criteriaList]
            this.graduateWorkEditSource.forEach( (element: any,index: number) => {
              this.graduateWorkEditSource[index].selectedCheckBox = false;
            });
            console.log(this.graduateWorkEditSource)
          }
        }
      )
    }
  }
  if(this.jurySelected == 'PRINCIPAL'){
    if(this.formSelected == 'ORAL'){
      this.limitEdition = 40;
      this.graduateWorkService.getGraduateWorkJuryByRol(this.inputdata.graduateWorkData.graduateworkid, 'PRINCIPAL')
      .pipe(
        switchMap(
          (juryData: any) => {
            return this.graduateWorkService.getJuryOralEvaluationNote({
              graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
              juryDNI: juryData.juryDNI,
              studentDNI: this.studentSelected
            })
          }
        )
      )
      .subscribe(
        {
          next: (criteriaList) => {
            console.log(criteriaList)
            this.graduateWorkEditSource = [...criteriaList]
            this.graduateWorkEditSource.forEach( (element: any,index: number) => {
              this.graduateWorkEditSource[index].selectedCheckBox = false;
            });
            console.log(this.graduateWorkEditSource)
          }
        }
      )
    }
    if(this.formSelected == 'REPORT'){
      this.limitEdition = 60;
      this.graduateWorkService.getGraduateWorkJuryByRol(this.inputdata.graduateWorkData.graduateworkid, 'PRINCIPAL')
      .pipe(
        switchMap(
          (juryData: any) => {
            return this.graduateWorkService.getJuryReportEvaluationNote({
              graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
              juryDNI: juryData.juryDNI,
              studentDNI: this.studentSelected
            })
          }
        )
      )
      .subscribe(
        {
          next: (criteriaList) => {
            console.log(criteriaList)
            this.graduateWorkEditSource = [...criteriaList]
            this.graduateWorkEditSource.forEach( (element: any,index: number) => {
              this.graduateWorkEditSource[index].selectedCheckBox = false;
            });
            console.log(this.graduateWorkEditSource)
          }
        }
      )
    }
  }
  if(this.jurySelected == 'TUTOR'){
    if(this.formSelected == 'ORAL'){
      this.limitEdition = 40;
      this.graduateWorkService.getGraduateWorkJuryByRol(this.inputdata.graduateWorkData.graduateworkid, 'TUTOR')
      .pipe(
        switchMap(
          (juryData: any) => {
            return this.graduateWorkService.getTutorOralEvaluationNote({
              graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
              juryDNI: juryData.juryDNI,
              studentDNI: this.studentSelected
            })
          }
        )
      )
      .subscribe(
        {
          next: (criteriaList) => {
            console.log(criteriaList)
            this.graduateWorkEditSource = [...criteriaList]
            this.graduateWorkEditSource.forEach( (element: any,index: number) => {
              this.graduateWorkEditSource[index].selectedCheckBox = false;
            });
            console.log(this.graduateWorkEditSource)
          }
        }
      )
    }
    if(this.formSelected == 'REPORT'){
      this.limitEdition = 60;
      this.graduateWorkService.getGraduateWorkJuryByRol(this.inputdata.graduateWorkData.graduateworkid, 'TUTOR')
      .pipe(
        switchMap(
          (juryData: any) => {
            return this.graduateWorkService.getTutorReportEvaluationNote({
              graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
              juryDNI: juryData.juryDNI,
              studentDNI: this.studentSelected
            })
          }
        )
      )
      .subscribe(
        {
          next: (criteriaList) => {
            console.log(criteriaList)
            this.graduateWorkEditSource = [...criteriaList]
            this.graduateWorkEditSource.forEach( (element: any,index: number) => {
              this.graduateWorkEditSource[index].selectedCheckBox = false;
            });
            console.log(this.graduateWorkEditSource)
          }
        }
      )
    }
  }

}
  ngOnChanges() {
    console.log("Seleccionado")
    if(this.formSelected){
      console.log("Seleccionado")
    }
  }

  obtenerValorSlider(event: any){
    console.log(event)
    this.sliderValue = event
  }

  onSliderChange(event: any,element: any){

    const numberValue = Number(event.target.value)
    console.log(numberValue)
    this.graduateWorkOralSource.forEach( (row:any, index: number) => {
      /* Estoy parado en la fila del elemento */
      if(row.criteriaId == element.criteriaId){
        /* Si es primera vez que muevo el slider */
        if(row.selectedCheckBox == false){
          //Sumo los valores
          this.totalOralSum[0] = this.totalOralSum[0] + numberValue;
          //marco que movi el slider
          this.graduateWorkOralSource[index].selectedCheckBox = true;
          //guardo el valor
          this.graduateWorkOralSource[index].selectedCheckBoxIndex = numberValue;
        }else{
          //si ya me habia movido antes
          this.totalOralSum[0] = this.totalOralSum[0] - this.graduateWorkOralSource[index].selectedCheckBoxIndex;
          this.totalOralSum[0] = this.totalOralSum[0] + numberValue;
          this.graduateWorkOralSource[index].selectedCheckBoxIndex = numberValue;
        }
      }
    })
    console.log(this.totalOralSum)
    this.areAllNotesSelected = this.validateAllNotesSelected()
  }

  onSliderNewChange(event: any,element: any){

    const numberValue = Number(event.target.value)
    console.log(numberValue)
    this.graduateWorkEditSource.forEach( (row:any, index: number) => {
      /* Estoy parado en la fila del elemento */
      if(row.criteriaId == element.criteriaId){
        /* Si es primera vez que muevo el slider */
        if(row.selectedCheckBox == false){
          //Sumo los valores
          this.totalNewSum[0] = this.totalNewSum[0] + numberValue;
          //marco que movi el slider
          this.graduateWorkEditSource[index].selectedCheckBox = true;
          //guardo el valor
          this.graduateWorkEditSource[index].evaluationNote = numberValue;
        }else{
          //si ya me habia movido antes
          this.totalNewSum[0] = this.totalNewSum[0] - this.graduateWorkEditSource[index].evaluationNote;
          this.totalNewSum[0] = this.totalNewSum[0] + numberValue;
          this.graduateWorkEditSource[index].evaluationNote = numberValue;
        }
      }
    })
    console.log(this.totalNewSum)
    this.areAllNotesSelected = this.validateAllNotesSelected()

  }
  onSliderChangeAlt(event: any,element: any){
    console.log(event.target.value)
    console.log(element)
    const numberValue = Number(event.target.value)
    this.graduateWorkOralSourceAlt.forEach( (row:any, index: number) => {
      /* Estoy parado en la fila del elemento */
      if(row.criteriaId == element.criteriaId){
        /* Si es primera vez que muevo el slider */
        console.log("estoy en el elemento")
        console.log(row)
        if(row.selectedCheckBox == false){
          console.log("no he seleccionado un valor")
          //Sumo los valores
          this.totalOralSum[1] = this.totalOralSum[1] + numberValue;
          //marco que movi el slider
          this.graduateWorkOralSourceAlt[index].selectedCheckBox = true;
          //guardo el valor
          this.graduateWorkOralSourceAlt[index].selectedCheckBoxIndex = numberValue;
        }else{
          console.log("Tengo un valor previo")
          //si ya me habia movido antes
          if(numberValue > this.graduateWorkOralSourceAlt[index].selectedCheckBoxIndex){
            console.log("Es mas grande")
            //si el valor es mayor que el ultimo valor
            //borro el viejo
            this.totalOralSum[1] = this.totalOralSum[1] - this.graduateWorkOralSourceAlt[index].selectedCheckBoxIndex;
            //agrego el nuevo
            this.totalOralSum[1] = this.totalOralSum[1] + numberValue;
            //guardo el nuevo valor 
            this.graduateWorkOralSourceAlt[index].selectedCheckBoxIndex = numberValue;
          }else{
            console.log("Es menos grande")
            // si el valor es menor
            //borro el viejo
            this.totalOralSum[1] = this.totalOralSum[1] - this.graduateWorkOralSourceAlt[index].selectedCheckBoxIndex;
            this.totalOralSum[1] = this.totalOralSum[1] + numberValue;
            this.graduateWorkOralSourceAlt[index].selectedCheckBoxIndex = numberValue;
          }
        }
      }
    })
    console.log(this.totalOralSum)
    this.areAllNotesSelected = this.validateAllNotesSelected()
  }

  obtenerMencion(){
    console.log(this.mentionSelected)
  }

  designarPresidenteJurado(juryChoice: boolean){
    console.log(juryChoice)
    if(juryChoice){
      this.graduateWorkService.designateJuryPresident(this.profesorLocalData.userDNI,this.inputdata.graduateWorkData.graduateworkid).subscribe(
        {
          next: (isPresent) => {
            console.log(isPresent)
            this.isJuryPresent = isPresent
            this.isPresident = true;
          }
        }
      )
    }else{
      this.graduateWorkService.setJuryisPresent(this.profesorLocalData.userDNI,this.inputdata.graduateWorkData.graduateworkid,true).subscribe(
        {
          next: (isPresent) => {
            console.log(isPresent)
            this.isJuryPresent = isPresent
          }
        }
      )
    }
  }

  sum(value: any,number:number){
    console.log(value)
    
  }
  onCheckboxChange(row: any, checkboxIndex: number) {
    console.log(row)
    console.log(this.graduateWorkSource)
    /* Lo primero que hacemos es ubicar elemento para saber en que fila estamos */
    this.graduateWorkSource.forEach ((elementRow: any, index: number) => {
      if(elementRow.criteriaId == row.criteriaId ){
        console.log("Estamos en el elemento " + index)
        if(this.graduateWorkSource[index].selectedCheckBox == false){
          console.log("No he marcado la fila todavia")
          this.totalSum = this.totalSum + checkboxIndex;
          this.graduateWorkSource[index].selectedCheckBoxIndex = checkboxIndex;
          this.graduateWorkSource[index].selectedCheckBox = true
        }else{
          if(this.graduateWorkSource[index].selectedCheckBoxIndex === checkboxIndex){
            console.log("estoy marcando la casilla anterior")
            this.totalSum = this.totalSum - checkboxIndex;
            this.graduateWorkSource[index].selectedCheckBox = false;
            this.graduateWorkSource[index].selectedCheckBoxIndex = null;
          }else{
            console.log("ya habia marcado la fila y ahora actualizo el valor")
            this.totalSum = this.totalSum - this.graduateWorkSource[index].selectedCheckBoxIndex
            this.totalSum = this.totalSum + checkboxIndex;
            this.graduateWorkSource[index].selectedCheckBoxIndex = checkboxIndex;

          }
          
        }
      }
    })
    this.areAllNotesSelected = this.validateAllNotesSelected()
}

  validateAllNotesSelected() : boolean{
    if(this.studentList.length > 1){
      console.log("ALUMNO DOBLE")
      console.log(this.graduateWorkOralSourceAlt)
      console.log(this.graduateWorkOralSourceAlt.every((row:any)=> row.selectedCheckBox))
      const areAllSelected = this.graduateWorkSource.every((row:any)=> row.selectedCheckBox) && this.graduateWorkOralSource.every((row:any)=> row.selectedCheckBox) && this.graduateWorkOralSourceAlt.every((row:any)=> row.selectedCheckBox)
      return areAllSelected
    }
    const  areAllSelected = this.graduateWorkSource.every((row:any)=> row.selectedCheckBox) && this.graduateWorkOralSource.every((row:any)=> row.selectedCheckBox)
    return areAllSelected
  }

  cargarNotaJurado(){
    console.log(this.graduateWorkSource)
    console.log(this.graduateWorkOralSource)
    console.log("cargarNotaJurado()")
    if(this.juryData.juryType == 'TUTOR'){
      const observables: Observable<any>[] = []
      console.log(this.studentList)
      console.log(this.profesorLocalData)
      console.log(this.inputdata.graduateWorkData)
      this.graduateWorkOralSource.forEach( (element: any) => {
        
        observables.push(
          this.graduateWorkService.addTutorOralEvaluationNote({
            juryDNI: this.profesorLocalData.userDNI,
            studentDNI: this.studentList[0].userDNI,
            graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
            criteriaId: element.criteriaId,
            evaluationNote: element.selectedCheckBoxIndex
          })
        )
        
      })

      this.graduateWorkSource.forEach((element: any) => {
        observables.push(
          this.graduateWorkService.addTutorReportEvaluationNote({
            juryDNI: this.profesorLocalData.userDNI,
            studentDNI: this.studentList[0].userDNI,
            graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
            criteriaId: element.criteriaId,
            evaluationNote: element.selectedCheckBoxIndex
          })
        )
      })

      forkJoin(observables).subscribe({
        next: (result) => {
          console.log(result)
          console.log("cargar notas como jurado del trabajo de grado")
          console.log(this.studentList)
          console.log(this.juryData)
          console.log(this.inputdata.graduateWorkData)
          console.log(this.totalOralSum)
          console.log(this.totalSum)
          const observables: Observable<any>[] = []
          this.studentList.forEach( (student:any, index: number) => {
            observables.push(this.graduateWorkService.setTutorOralFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalOralSum[index]));
            observables.push(this.graduateWorkService.setTutorReportFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalSum));
          })
          forkJoin(observables).subscribe(
            {
              next: (result) => {
                console.log(result)
              },
              complete: () =>{
                window.location.href = window.location.href 
              }
            }
          )
        }
      })
    }else{
      const observables: Observable<any>[] = []
      console.log(this.studentList)
      console.log(this.profesorLocalData)
      console.log(this.inputdata.graduateWorkData)
      this.graduateWorkOralSource.forEach( (element: any) => {
        
        observables.push(
          this.graduateWorkService.addJuryOralEvaluationNote({
            juryDNI: this.profesorLocalData.userDNI,
            studentDNI: this.studentList[0].userDNI,
            graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
            criteriaId: element.criteriaId,
            evaluationNote: element.selectedCheckBoxIndex
          })
        )
        
      })

      this.graduateWorkSource.forEach((element: any) => {
        observables.push(
          this.graduateWorkService.addJuryReportEvaluationNote({
            juryDNI: this.profesorLocalData.userDNI,
            studentDNI: this.studentList[0].userDNI,
            graduateWorkId: this.inputdata.graduateWorkData.graduateworkid,
            criteriaId: element.criteriaId,
            evaluationNote: element.selectedCheckBoxIndex
          })
        )
      })

      forkJoin(observables).subscribe({
        next: (result) => {
          console.log(result)
          console.log("cargar notas como jurado del trabajo de grado")
          console.log(this.studentList)
          console.log(this.juryData)
          console.log(this.inputdata.graduateWorkData)
          console.log(this.totalOralSum)
          console.log(this.totalSum)
          const observables: Observable<any>[] = []
          this.studentList.forEach( (student:any, index: number) => {
            observables.push(this.graduateWorkService.setJuryOralFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalOralSum[index]));
            observables.push(this.graduateWorkService.setJuryReportFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalSum));
          })
          forkJoin(observables).subscribe(
            {
              next: (result) => {
                console.log(result)
              },
              complete: () =>{
                window.location.href = window.location.href 
              }
            }
          )
        }
      })
    }

    /*
    if(this.juryData.juryType == 'TUTOR'){
      console.log("cargar notas como tutor academico del trabajo de grado")
      console.log(this.studentList)
      console.log(this.juryData)
      console.log(this.inputdata.graduateWorkData)
      console.log(this.totalOralSum)
      console.log(this.totalSum)
      //Recordar cargar notas por criterio que conforman nota final
      const observables: Observable<any>[] = []
      this.studentList.forEach( (student:any, index: number) => {
        observables.push(this.graduateWorkService.setTutorOralFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalOralSum[index]));
        observables.push(this.graduateWorkService.setTutorReportFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalSum));
      })
      forkJoin(observables).subscribe(
        {
          next: (result) => {
            console.log(result)
          },
          complete: () =>{
            window.location.href = window.location.href 
          }
        }
      )
    }else{
      console.log("cargar notas como jurado del trabajo de grado")
      console.log(this.studentList)
      console.log(this.juryData)
      console.log(this.inputdata.graduateWorkData)
      console.log(this.totalOralSum)
      console.log(this.totalSum)
      const observables: Observable<any>[] = []
      this.studentList.forEach( (student:any, index: number) => {
        observables.push(this.graduateWorkService.setJuryOralFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalOralSum[index]));
        observables.push(this.graduateWorkService.setJuryReportFinalNote(this.juryData.juryDNI,student.userDNI,this.juryData.graduateWorkId,this.totalSum));
      })
      forkJoin(observables).subscribe(
        {
          next: (result) => {
            console.log(result)
          },
          complete: () =>{
            window.location.href = window.location.href 
          }
        }
      )

    }
    */
  }

  generateFinalNoteResume(){
    console.log(this.studentList)

  }

  imprimirElemento(element: any){
    console.log(element)
  }

  identificarNotaSiguiente( finalNote: number ) : number{
    const matchingRange = this.noteSourceRange.find(
      (noteRange: any) =>
        finalNote >= noteRange.minValue && finalNote <= noteRange.maxValue
    );
  
    return matchingRange
      ? matchingRange.maxValue + 1 - finalNote
      : -1; // Return -1 if no match is found
  }

  identificarNotaEquivalente( finalNote: number ) : number{
    const matchingRange = this.noteSourceRange.find(
      (noteRange: any) =>
        finalNote >= noteRange.minValue && finalNote <= noteRange.maxValue
    );
  
    return matchingRange
      ? matchingRange.note
      : -1; // Return -1 if no match is found
  }

  identificarRangoMinNota( finalNote: number ) : number{
    const matchingRange = this.noteSourceRange.find(
      (noteRange: any) =>
        finalNote >= noteRange.minValue && finalNote <= noteRange.maxValue
    );
  
    return matchingRange
      ? matchingRange.minValue
      : -1; // Return -1 if no match is found
  }

  identificarRangoMaxNota( finalNote: number ) : number{
    const matchingRange = this.noteSourceRange.find(
      (noteRange: any) =>
        finalNote >= noteRange.minValue && finalNote <= noteRange.maxValue
    );
  
    return matchingRange
      ? matchingRange.maxValue
      : -1; // Return -1 if no match is found
  }

  editarJurado(element: any){
    console.log(element)
    this.editFinalNote = true
    this.studentSelected = element.userDNI
    this.graduateWorkService.getGraduateWorkJuries(this.inputdata.graduateWorkData.graduateworkid).subscribe({
      next: (juryList) => {
        console.log(juryList)
        this.juryList = juryList
      }
    })
  }

  cargarNotaFinalJurado(){
    console.log(this.firstStudentResume)
    this.graduateWorkService.chargeFinalNote(this.inputdata.graduateWorkData.graduateworkid,this.firstStudentResume.equivalentNote,this.mentionSelected).subscribe(
      {
        next: (result) => {
          console.log(result)
        },
        complete: () => {
          window.location.href = window.location.href
        }
      }
    );
  }
  cargarNuevasNotas(){
    console.log("cargarNuevasNotas")
    console.log(this.graduateWorkEditSource)
    const observables: Observable<any>[] = [];
    if(this.jurySelected == 'PRESIDENT' || this.jurySelected == 'PRINCIPAL'){
      if(this.formSelected == 'ORAL'){
        this.graduateWorkEditSource.forEach((element: any) => {
          observables.push(this.graduateWorkService.changeJuryOralEvaluationNote({
            juryDNI: element.juryDNI,
            studentDNI: element.studentDNI,
            graduateWorkId: element.graduateWorkId,
            criteriaId: element.criteriaId,
            evaluationNote: element.evaluationNote,
          }))
        })
        forkJoin(observables).subscribe({
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            console.log("actualizamos las tablas")
    
            /* Apagamos la edicion  */
            this.editFinalNote = false
            this.jurySelected = null
            this.formSelected = null
            this.chargeCriteria = false
            this.graduateWorkEditSource = []
            this.totalNewSum = [0,0]
            console.log(this.studentList)
            const observables: Observable<any>[] = []
            this.graduateWorkService.getJuryOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI).pipe(
              switchMap(
                (
                  (principalOralNote) => {
                    this.firstStudentResume = {
                      userDNI: this.studentList[0].userDNI,
                      userName: this.studentList[0].userLastName + " " + this.studentList[0].userFirstName,
                      presidentNote: 0,
                      principalNote: principalOralNote,
                      tutorNote: 0,
                      finalNote: 0,
                      nextNote: -1,
                      equivalentNote: -1,
                      minValueRange: -1,
                      maxValueRange: -1
                    }
                    return this.graduateWorkService.getJuryReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                  }
                )
              ),
              switchMap(
                (principalReportNote) => {
                  this.firstStudentResume.principalNote = this.firstStudentResume.principalNote + principalReportNote;
                  return this.graduateWorkService.getTutorOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorOralNote) => {
                  this.firstStudentResume.tutorNote = tutorOralNote
                  return this.graduateWorkService.getTutorReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorReportNote) => {
                  this.firstStudentResume.tutorNote =  this.firstStudentResume.tutorNote + tutorReportNote
                  return this.graduateWorkService.getPresidentOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentOralNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentOralNote
                  return this.graduateWorkService.getPresidentReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentReportNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentReportNote
                  return of(this.firstStudentResume)
                }
              )
            ).subscribe({
              next: (result) => {
                console.log(result)
                this.firstStudentResume.finalNote = this.firstStudentResume.presidentNote + this.firstStudentResume.tutorNote + this.firstStudentResume.principalNote
                this.firstStudentResume.nextNote = this.identificarNotaSiguiente(this.firstStudentResume.finalNote)
                this.firstStudentResume.equivalentNote = this.identificarNotaEquivalente(this.firstStudentResume.finalNote)
                this.firstStudentResume.minValueRange = this.identificarRangoMinNota(this.firstStudentResume.finalNote)
                this.firstStudentResume.maxValueRange = this.identificarRangoMaxNota(this.firstStudentResume.finalNote)
                this.resumeSource = [this.firstStudentResume]
              }
            })
          }
        })
      }
      if(this.formSelected == 'REPORT'){
        this.graduateWorkEditSource.forEach((element: any) => {
          observables.push(this.graduateWorkService.changeJuryReportEvaluationNote({
            juryDNI: element.juryDNI,
            studentDNI: element.studentDNI,
            graduateWorkId: element.graduateWorkId,
            criteriaId: element.criteriaId,
            evaluationNote: element.evaluationNote,
          }))
        })
        forkJoin(observables).subscribe({
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            console.log("actualizamos las tablas")
    
            /* Apagamos la edicion  */
            this.editFinalNote = false
            this.jurySelected = null
            this.formSelected = null
            this.chargeCriteria = false
            this.graduateWorkEditSource = []
            this.totalNewSum = [0,0]
            console.log(this.studentList)
            this.graduateWorkService.getJuryOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI).pipe(
              switchMap(
                (
                  (principalOralNote) => {
                    this.firstStudentResume = {
                      userDNI: this.studentList[0].userDNI,
                      userName: this.studentList[0].userLastName + " " + this.studentList[0].userFirstName,
                      presidentNote: 0,
                      principalNote: principalOralNote,
                      tutorNote: 0,
                      finalNote: 0,
                      nextNote: -1,
                      equivalentNote: -1,
                      minValueRange: -1,
                      maxValueRange: -1
                    }
                    return this.graduateWorkService.getJuryReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                  }
                )
              ),
              switchMap(
                (principalReportNote) => {
                  this.firstStudentResume.principalNote = this.firstStudentResume.principalNote + principalReportNote;
                  return this.graduateWorkService.getTutorOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorOralNote) => {
                  this.firstStudentResume.tutorNote = tutorOralNote
                  return this.graduateWorkService.getTutorReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorReportNote) => {
                  this.firstStudentResume.tutorNote =  this.firstStudentResume.tutorNote + tutorReportNote
                  return this.graduateWorkService.getPresidentOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentOralNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentOralNote
                  return this.graduateWorkService.getPresidentReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentReportNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentReportNote
                  return of(this.firstStudentResume)
                }
              )
            ).subscribe({
              next: (result) => {
                console.log(result)
                this.firstStudentResume.finalNote = this.firstStudentResume.presidentNote + this.firstStudentResume.tutorNote + this.firstStudentResume.principalNote
                this.firstStudentResume.nextNote = this.identificarNotaSiguiente(this.firstStudentResume.finalNote)
                this.firstStudentResume.equivalentNote = this.identificarNotaEquivalente(this.firstStudentResume.finalNote)
                this.firstStudentResume.minValueRange = this.identificarRangoMinNota(this.firstStudentResume.finalNote)
                this.firstStudentResume.maxValueRange = this.identificarRangoMaxNota(this.firstStudentResume.finalNote)
                this.resumeSource = [this.firstStudentResume]
                console.log(this.resumeSource)
              }
            })
            
          }
        })
      }
    }

    if(this.jurySelected == 'TUTOR'){
      if(this.formSelected == 'ORAL'){
        this.graduateWorkEditSource.forEach((element: any) => {
          observables.push(this.graduateWorkService.changeTutorOralEvaluationNote({
            juryDNI: element.juryDNI,
            studentDNI: element.studentDNI,
            graduateWorkId: element.graduateWorkId,
            criteriaId: element.criteriaId,
            evaluationNote: element.evaluationNote,
          }))
        })
        forkJoin(observables).subscribe({
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            console.log("actualizamos las tablas")
    
            /* Apagamos la edicion  */
            this.editFinalNote = false
            this.jurySelected = null
            this.formSelected = null
            this.chargeCriteria = false
            this.graduateWorkEditSource = []
            this.totalNewSum = [0,0]
            console.log(this.studentList)
            const observables: Observable<any>[] = []
            this.graduateWorkService.getJuryOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI).pipe(
              switchMap(
                (
                  (principalOralNote) => {
                    this.firstStudentResume = {
                      userDNI: this.studentList[0].userDNI,
                      userName: this.studentList[0].userLastName + " " + this.studentList[0].userFirstName,
                      presidentNote: 0,
                      principalNote: principalOralNote,
                      tutorNote: 0,
                      finalNote: 0,
                      nextNote: -1,
                      equivalentNote: -1,
                      minValueRange: -1,
                      maxValueRange: -1
                    }
                    return this.graduateWorkService.getJuryReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                  }
                )
              ),
              switchMap(
                (principalReportNote) => {
                  this.firstStudentResume.principalNote = this.firstStudentResume.principalNote + principalReportNote;
                  return this.graduateWorkService.getTutorOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorOralNote) => {
                  this.firstStudentResume.tutorNote = tutorOralNote
                  return this.graduateWorkService.getTutorReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorReportNote) => {
                  this.firstStudentResume.tutorNote =  this.firstStudentResume.tutorNote + tutorReportNote
                  return this.graduateWorkService.getPresidentOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentOralNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentOralNote
                  return this.graduateWorkService.getPresidentReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentReportNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentReportNote
                  return of(this.firstStudentResume)
                }
              )
            ).subscribe({
              next: (result) => {
                console.log(result)
                this.firstStudentResume.finalNote = this.firstStudentResume.presidentNote + this.firstStudentResume.tutorNote + this.firstStudentResume.principalNote
                this.firstStudentResume.nextNote = this.identificarNotaSiguiente(this.firstStudentResume.finalNote)
                this.firstStudentResume.equivalentNote = this.identificarNotaEquivalente(this.firstStudentResume.finalNote)
                this.firstStudentResume.minValueRange = this.identificarRangoMinNota(this.firstStudentResume.finalNote)
                this.firstStudentResume.maxValueRange = this.identificarRangoMaxNota(this.firstStudentResume.finalNote)
                this.resumeSource = [this.firstStudentResume]
              }
            })
            
          }
        })
      }
      if(this.formSelected == 'REPORT'){
        this.graduateWorkEditSource.forEach((element: any) => {
          observables.push(this.graduateWorkService.changeTutorReportEvaluationNote({
            juryDNI: element.juryDNI,
            studentDNI: element.studentDNI,
            graduateWorkId: element.graduateWorkId,
            criteriaId: element.criteriaId,
            evaluationNote: element.evaluationNote,
          }))
        })
        forkJoin(observables).subscribe({
          next: (result) => {
            console.log(result)
          },
          complete: () => {
            console.log("actualizamos las tablas")
    
            /* Apagamos la edicion  */
            this.editFinalNote = false
            this.jurySelected = null
            this.formSelected = null
            this.chargeCriteria = false
            this.graduateWorkEditSource = []
            this.totalNewSum = [0,0]
            console.log(this.studentList)
            const observables: Observable<any>[] = []
            this.graduateWorkService.getJuryOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI).pipe(
              switchMap(
                (
                  (principalOralNote) => {
                    this.firstStudentResume = {
                      userDNI: this.studentList[0].userDNI,
                      userName: this.studentList[0].userLastName + " " + this.studentList[0].userFirstName,
                      presidentNote: 0,
                      principalNote: principalOralNote,
                      tutorNote: 0,
                      finalNote: 0,
                      nextNote: -1,
                      equivalentNote: -1,
                      minValueRange: -1,
                      maxValueRange: -1
                    }
                    return this.graduateWorkService.getJuryReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                  }
                )
              ),
              switchMap(
                (principalReportNote) => {
                  this.firstStudentResume.principalNote = this.firstStudentResume.principalNote + principalReportNote;
                  return this.graduateWorkService.getTutorOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorOralNote) => {
                  this.firstStudentResume.tutorNote = tutorOralNote
                  return this.graduateWorkService.getTutorReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (tutorReportNote) => {
                  this.firstStudentResume.tutorNote =  this.firstStudentResume.tutorNote + tutorReportNote
                  return this.graduateWorkService.getPresidentOralNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentOralNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentOralNote
                  return this.graduateWorkService.getPresidentReportNotes(this.inputdata.graduateWorkData.graduateworkid, this.studentList[0].userDNI)
                }
              ),
              switchMap(
                (presidentReportNote) => {
                  this.firstStudentResume.presidentNote =  this.firstStudentResume.presidentNote + presidentReportNote
                  return of(this.firstStudentResume)
                }
              )
            ).subscribe({
              next: (result) => {
                console.log(result)
                this.firstStudentResume.finalNote = this.firstStudentResume.presidentNote + this.firstStudentResume.tutorNote + this.firstStudentResume.principalNote
                this.firstStudentResume.nextNote = this.identificarNotaSiguiente(this.firstStudentResume.finalNote)
                this.firstStudentResume.equivalentNote = this.identificarNotaEquivalente(this.firstStudentResume.finalNote)
                this.firstStudentResume.minValueRange = this.identificarRangoMinNota(this.firstStudentResume.finalNote)
                this.firstStudentResume.maxValueRange = this.identificarRangoMaxNota(this.firstStudentResume.finalNote)
                this.resumeSource = [this.firstStudentResume]
              }
            })
            
          }
        })
      }
    }
    
  }
}
