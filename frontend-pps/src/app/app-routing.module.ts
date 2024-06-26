import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./pages/login/login.component"
import { DashboardComponent } from './pages/dashboard/dashboard.component'

import { GraduateworkComponent } from './pages/coordinator/graduatework/graduatework.component'
import { RegistrationComponent } from './pages/registration/registration.component'
import { StudentGWComponent } from './pages/student/student-gw/student-gw.component'

import { ProposalsComponent } from './pages/coordinator/graduatework/proposals/proposals.component';
import { JuryComponent } from './pages/coordinator/graduatework/jury/jury.component';
import { CompletionComponent } from './pages/coordinator/graduatework/completion/completion.component';
import { DefenseComponent } from './pages/coordinator/graduatework/defense/defense.component';
import { ReviewersComponent } from './pages/coordinator/graduatework/reviewers/reviewers.component';
import { CouncilComponent } from './pages/coordinator/graduatework/council/council.component'
import { FilesComponent } from './pages/coordinator/graduatework/files/files.component';

import { PlanillaEvaluacionTutorEmpresarialComponent } from './pages/generator/pasantia/planilla-evaluacion-tutor-empresarial/planilla-evaluacion-tutor-empresarial.component';


import { PropuestaPasantiaComponent } from './pages/coordinator/intership/propuesta-pasantia/propuesta-pasantia.component';
import { CorporativeTutorCriteriaComponent } from './pages/coordinator/intership/corporative-tutor-criteria/corporative-tutor-criteria.component';
import { PasantiaCompletadaComponent } from './pages/coordinator/intership/pasantia-completada/pasantia-completada.component';
import { EvaluacionTutoresComponent } from './pages/coordinator/intership/evaluacion-tutores/evaluacion-tutores.component';
import { EntregaInformeFinalComponent } from './pages/coordinator/intership/entrega-informe-final/entrega-informe-final.component';
import { NotificacionTutorEmpresarialComponent } from './pages/generator/pasantia/notificacion-tutor-empresarial/notificacion-tutor-empresarial.component';
import { NotificacionTutorAcademicoComponent } from './pages/generator/pasantia/notificacion-tutor-academico/notificacion-tutor-academico.component';
import { DesarrolloPasantiaComponent } from './pages/coordinator/intership/desarrollo-pasantia/desarrollo-pasantia.component';
import { PlanillaEvaluacionTutorAcademicoComponent } from './pages/generator/pasantia/planilla-evaluacion-tutor-academico/planilla-evaluacion-tutor-academico.component';
import { StudentPasantiaComponent } from './pages/student/student-pasantia/student-pasantia.component';
import { CatalogComponent } from './pages/coordinator/general/catalog/catalog.component';
import { GeneralFilesComponent } from './pages/coordinator/general/general-files/general-files.component';
import { ProfesorCatalogComponent } from './pages/coordinator/general/catalog/profesor-catalog/profesor-catalog.component';
import { EmpresaCatalogComponent } from './pages/coordinator/general/catalog/empresa-catalog/empresa-catalog.component';
import { ProfesionalCatalogComponent } from './pages/coordinator/general/catalog/profesional-catalog/profesional-catalog.component';
import { ConsejoCatalogComponent } from './pages/coordinator/general/catalog/consejo-catalog/consejo-catalog.component';
import { ComiteCatalogComponent } from './pages/coordinator/general/catalog/comite-catalog/comite-catalog.component';
import { ReviewerEvaluationComponent } from './pages/coordinator/graduatework/reviewer-evaluation/reviewer-evaluation.component';
import { DesarrolloTGComponent } from './pages/coordinator/graduatework/desarrollo-tg/desarrollo-tg.component';
import { PresentacionComponent } from './pages/coordinator/graduatework/presentacion/presentacion.component';
import { CompletadasComponent } from './pages/coordinator/graduatework/completadas/completadas.component';
import { AcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/academic-tutor-criteria.component';
import { ProfessorReviewerComponent } from './pages/professor/graduatework/professor-reviewer/professor-reviewer.component';
import { CriteriosJuradoOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-oral/criterios-jurado-oral.component';
import { CriteriosJuradoEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-escrito/criterios-jurado-escrito.component';
import { CriteriosTutorEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-escrito/criterios-tutor-escrito.component';
import { CriteriosTutorOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-oral/criterios-tutor-oral.component';
import { CriteriosProfesorRevisorComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-profesor-revisor/criterios-profesor-revisor.component';
import { CriteriosTutorEmpresarialComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-empresarial/criterios-tutor-empresarial.component';
import { PantallaEvaluacionComponent } from './pages/coordinator/intership/pantalla-evaluacion/pantalla-evaluacion.component';
import { PantallaEvaluacionJuradoPresentacionComponent } from './pages/coordinator/graduatework/pantalla-evaluacion-jurado-presentacion/pantalla-evaluacion-jurado-presentacion.component';
import { PantallaEvaluacionJuradoEscritoComponent } from './pages/coordinator/graduatework/pantalla-evaluacion-jurado-escrito/pantalla-evaluacion-jurado-escrito.component';
import { GenerarPlanillaDatosTGComponent } from './pages/student/student-gw/generar-planilla-datos-tg/generar-planilla-datos-tg.component';
import { GenerarPlanillaDatosPComponent } from './pages/student/student-pasantia/generar-planilla-datos-p/generar-planilla-datos-p.component';
//import { AcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/academic-tutor-criteria.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegistrationComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "graduate-work/coordinator",
    component: GraduateworkComponent
  },
  {
    path: "graduate-work/student",
    component: StudentGWComponent 
  },
  {
    path: "graduate-work/proposals",
    component: ProposalsComponent
  },
  {
    path: "graduate-work/reviewers",
    component: ReviewersComponent
  },
  {
    path: "graduate-work/reviewers-evaluation",
    component: ReviewerEvaluationComponent
  },
  {
    path: "graduate-work/council",
    component: CouncilComponent
  },
  {
    path: "graduate-work/process",
    component: DesarrolloTGComponent
  },
  {
    path: "graduate-work/juries",
    component: JuryComponent
  },
  {
    path: "graduate-work/defenses",
    component: DefenseComponent
  },
  {
    path: "graduate-work/presentacion",
    component: PresentacionComponent
  },
  {
    path: "graduate-work/completion",
    component: CompletionComponent
  },
  {
    path: "graduate-work/complete",
    component: CompletadasComponent
  },
  {
    path: "graduate-work/files",
    component: FilesComponent
  },
  {
    path: "graduate-work/criteria/corporative/tutor",
    component: CorporativeTutorCriteriaComponent
  },
  {
    path: "graduate-work/criteria/academic/tutor",
    component: CorporativeTutorCriteriaComponent
  },
  /* Configuración de Planillas de Evaluación */
  {
    path: "graduate-work/jurado/presentacion",
    component: CriteriosJuradoOralComponent
  },
  {
    path: "graduate-work/jurado/informe",
    component: CriteriosJuradoEscritoComponent
  },
  {
    path: "graduate-work/tutor/presentacion",
    component: CriteriosTutorOralComponent
  },
  {
    path: "graduate-work/tutor/informe",
    component: CriteriosTutorEscritoComponent
  },
  {
    path: "graduate-work/reviewer/criteria",
    component: CriteriosProfesorRevisorComponent
  },
  {
    path: "graduate-work/corporate/criteria",
    component: CriteriosTutorEmpresarialComponent
  },
  /* Rutas para el proceso de pasantía  */
  {
    path: "intership/coordinator",
    component: PropuestaPasantiaComponent
  },
  {
    path: "intership/process",
    component: DesarrolloPasantiaComponent
  },
  {
    path: "intership/tutors",
    component: EvaluacionTutoresComponent
  },
  {
    path: "intership/completion",
    component: EntregaInformeFinalComponent
  },
  {
    path: "intership/final",
    component: PasantiaCompletadaComponent
  },
  {
    path: "intership/criteria/corporative/tutor",
    component: CorporativeTutorCriteriaComponent
  },
  
  {
    path: "intership/criteria/academic/tutor",
    component: AcademicTutorCriteriaComponent
  },
  
  {
    path: "intership/generator/corporative/tutor/notification",
    component: NotificacionTutorEmpresarialComponent
  },
  {
    path: "intership/generator/academic/tutor/notification",
    component: NotificacionTutorAcademicoComponent
  },
  {
    path: "intership/generator/corporative/tutor/evaluation",
    component: PlanillaEvaluacionTutorEmpresarialComponent
  },
  {
    path: "intership/generator/academic/tutor/evaluation",
    component: PlanillaEvaluacionTutorAcademicoComponent
  },
  /* Pasantia Estudiante */
  {
    path: "intership/student",
    component: StudentPasantiaComponent
  },
  /* Sección General */
  {
    path: "catalogos",
    component: CatalogComponent
  },
  {
    path: "catalogos/profesores",
    component: ProfesorCatalogComponent
  },
  {
    path: "catalogos/empresas",
    component: EmpresaCatalogComponent
  },
  {
    path: "catalogos/profesionales",
    component: ProfesionalCatalogComponent
  },
  {
    path: "catalogos/consejos",
    component: ConsejoCatalogComponent
  },
  {
    path: "catalogos/comites",
    component: ComiteCatalogComponent
  },
  {
    path: "archivos",
    component: GeneralFilesComponent
  },
   /* Generador de Planilla del Revisor */
   {
    path: "generar/planilla/:profesorRevisor/:trabajoDeGrado",
    component: ProfessorReviewerComponent
  },
   /* Generador de Planilla de Tutores de Pasantia */
   {
    path: "generar/planilla/pasantia/:modo/:tutor/:pasantiaId",
    component: PantallaEvaluacionComponent
  },
  /* Generador de Planilla de Jurado de Presentacion Trabajo de Grado */
  {
    path: "generar/planilla/trabajodegrado/presentacion/:modo/:tutor/:graduateWorkId",
    component: PantallaEvaluacionJuradoPresentacionComponent
  },
  /* Generador de Planilla de Jurado de Informe Escrito Trabajo de Grado */
  {
    path: "generar/planilla/trabajodegrado/informe/:modo/:tutor/:graduateWorkId",
    component: PantallaEvaluacionJuradoEscritoComponent
  },
  /* Generador de Planilla de Datos TG */
  {
    path: "graduatework/generar/planilla/datos",
    component: GenerarPlanillaDatosTGComponent
  },
  /* Generador de Planilla de Datos Pasantia */
  {
    path: "intership/generar/planilla/datos",
    component: GenerarPlanillaDatosPComponent
  },
  /* En caso de una ruta no definida */
  {
    path: "**",
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
