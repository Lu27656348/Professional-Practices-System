//import { generarPlanillaPropuestaTEG } from '../generator/planilla_propuesta_TEG';

import { academicTutor } from '../interfaces/academicTutor';
import { enterprise } from '../interfaces/enterprise';
import { graduateWork } from '../interfaces/graduateWork';
import { studentApplicant } from '../interfaces/studentApplicant';

export class PlanillaPropuestaTEG{

  private studentData: studentApplicant[] = [];
  private enterpriseData: enterprise;
  private graduateWorkData: graduateWork;
  private academicTutorData: academicTutor;

  public constructor( 
    _enterpriseData: enterprise, 
    _graduateWorkData: graduateWork, 
    _academicTutorData: academicTutor
  ){
    this.graduateWorkData = _graduateWorkData;
    this.enterpriseData = _enterpriseData;
    this.academicTutorData = _academicTutorData;
  };

  public addStudent( newStudent: studentApplicant ) : studentApplicant[] {
    if (this.studentData.length < 2){
      this.studentData.push( newStudent );
      return this.studentData;
    } else {
      alert('No se pueden añadir mas de 2 alumnos por Trabajo de Grado');
    }
    return this.studentData;
  }

  public imprimir(){
    //generarPlanillaPropuestaTEG( this );
  }
}