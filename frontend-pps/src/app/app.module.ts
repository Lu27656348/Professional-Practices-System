import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatCardModule} from '@angular/material/card'; 
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatTabsModule} from '@angular/material/tabs'; 

import { GraduateworkComponent } from './pages/coordinator/graduatework/graduatework.component';
import { ProposalsComponent } from './pages/coordinator/graduatework/proposals/proposals.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { StudentGWComponent } from './pages/student/student-gw/student-gw.component'

import {MatDialogModule} from '@angular/material/dialog'; 
import {MatDividerModule} from '@angular/material/divider'; 
import {MatCheckboxModule} from '@angular/material/checkbox'; 

import {MatStepperModule} from '@angular/material/stepper';
import { ValidationComponent } from './pages/coordinator/graduatework/proposals/dialogs/validation/validation.component';
import { ReviewersComponent } from './pages/coordinator/graduatework/reviewers/reviewers.component';
import { JuryComponent } from './pages/coordinator/graduatework/jury/jury.component';
import { DefenseComponent } from './pages/coordinator/graduatework/defense/defense.component';
import { CompletionComponent } from './pages/coordinator/graduatework/completion/completion.component';
import { AssignmentComponent } from './pages/coordinator/graduatework/reviewers/dialogs/assignment/assignment.component';
import { ProfessorGWComponent } from './pages/professor/professor-gw/professor-gw.component';
import { ProfessorReviewerComponent } from './pages/professor/graduatework/professor-reviewer/professor-reviewer.component';
import { ProfessorTutorComponent } from './pages/professor/graduatework/professor-tutor/professor-tutor.component';
import { ProfessorJuryComponent } from './pages/professor/graduatework/professor-jury/professor-jury.component';
import { DialogsComponent } from './pages/professor/graduatework/professor-reviewer/dialogs/dialogs.component';
import { CouncilComponent } from './pages/coordinator/graduatework/council/council.component';
import { DialogCouncilComponent } from './pages/coordinator/graduatework/council/dialog-council/dialog-council.component';
import { DialogTutorComponent } from './pages/professor/graduatework/professor-tutor/dialog-tutor/dialog-tutor.component';
import { JuryDialogComponent } from './pages/coordinator/graduatework/jury/jury-dialog/jury-dialog.component';
import { DefenseDialogComponent } from './pages/coordinator/graduatework/defense/defense-dialog/defense-dialog.component'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { ProfessorJuryDialogComponent } from './pages/professor/graduatework/professor-jury/professor-jury-dialog/professor-jury-dialog.component';
import {MatSliderModule} from '@angular/material/slider'; 
import {MatTooltipModule} from '@angular/material/tooltip';
import { FilesComponent } from './pages/coordinator/graduatework/files/files.component'; 
import {MatTreeModule} from '@angular/material/tree'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ResubmittionComponent } from './pages/coordinator/graduatework/proposals/dialogs/resubmittion/resubmittion.component';
import { EvaluationDialogComponent } from './pages/professor/graduatework/professor-reviewer/dialogs/evaluation-dialog/evaluation-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { OutsiderComponent } from './pages/outsider/outsider.component';
import { ExternalJuryComponent } from './pages/outsider/graduatework/external-jury/external-jury.component';
import { ExternalTutorComponent } from './pages/outsider/graduatework/external-tutor/external-tutor.component';
import { NotificacionTutorAcademicoComponent } from './pages/generator/pasantia/notificacion-tutor-academico/notificacion-tutor-academico.component';
import { NotificacionTutorEmpresarialComponent } from './pages/generator/pasantia/notificacion-tutor-empresarial/notificacion-tutor-empresarial.component';
import { PlanillaEvaluacionTutorEmpresarialComponent } from './pages/generator/pasantia/planilla-evaluacion-tutor-empresarial/planilla-evaluacion-tutor-empresarial.component';
import { PlanillaEvaluacionTutorAcademicoComponent } from './pages/generator/pasantia/planilla-evaluacion-tutor-academico/planilla-evaluacion-tutor-academico.component';
import { PropuestaPasantiaComponent } from './pages/coordinator/intership/propuesta-pasantia/propuesta-pasantia.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CorporativeTutorCriteriaComponent } from './pages/coordinator/intership/corporative-tutor-criteria/corporative-tutor-criteria.component';
import { EditCorporativeTutorCriteriaComponent } from './pages/coordinator/intership/corporative-tutor-criteria/dialogs/edit-corporative-tutor-criteria/edit-corporative-tutor-criteria.component';
import { EditCorporativeTutorSeccionComponent } from './pages/coordinator/intership/corporative-tutor-criteria/dialogs/edit-corporative-tutor-seccion/edit-corporative-tutor-seccion.component';
import { CreatePasantiaDialogComponent } from './pages/coordinator/intership/propuesta-pasantia/dialogs/create-pasantia-dialog/create-pasantia-dialog.component';
import { EvaluatePasantiaDialogComponent } from './pages/coordinator/intership/propuesta-pasantia/dialogs/evaluate-pasantia-dialog/evaluate-pasantia-dialog.component';
import { EvaluacionTutoresComponent } from './pages/coordinator/intership/evaluacion-tutores/evaluacion-tutores.component';
import { EntregaInformeFinalComponent } from './pages/coordinator/intership/entrega-informe-final/entrega-informe-final.component';
import { PasantiaCompletadaComponent } from './pages/coordinator/intership/pasantia-completada/pasantia-completada.component';
import { CargarEvaluacionesDialogComponent } from './pages/coordinator/intership/evaluacion-tutores/dialogs/cargar-evaluaciones-dialog/cargar-evaluaciones-dialog.component';
import { EntregaInformeDialogComponent } from './pages/coordinator/intership/entrega-informe-final/dialogs/entrega-informe-dialog/entrega-informe-dialog.component';
import { DesarrolloPasantiaComponent } from './pages/coordinator/intership/desarrollo-pasantia/desarrollo-pasantia.component';
import { StudentPasantiaComponent } from './pages/student/student-pasantia/student-pasantia.component';
import { CatalogComponent } from './pages/coordinator/general/catalog/catalog.component';
import { GeneralFilesComponent } from './pages/coordinator/general/general-files/general-files.component';
import { ProfesorCatalogComponent } from './pages/coordinator/general/catalog/profesor-catalog/profesor-catalog.component';
import { EmpresaCatalogComponent } from './pages/coordinator/general/catalog/empresa-catalog/empresa-catalog.component';
import { ComiteCatalogComponent } from './pages/coordinator/general/catalog/comite-catalog/comite-catalog.component';
import { ConsejoCatalogComponent } from './pages/coordinator/general/catalog/consejo-catalog/consejo-catalog.component';
import { ProfesionalCatalogComponent } from './pages/coordinator/general/catalog/profesional-catalog/profesional-catalog.component';
import { ProfesorDialogComponent } from './pages/coordinator/general/catalog/profesor-catalog/dialogs/profesor-dialog/profesor-dialog.component';
import { ProfesionalDialogComponent } from './pages/coordinator/general/catalog/profesional-catalog/dialogs/profesional-dialog/profesional-dialog.component';
import { EmpresaDialogComponent } from './pages/coordinator/general/catalog/empresa-catalog/dialogs/empresa-dialog/empresa-dialog.component';
import { ComiteDialogComponent } from './pages/coordinator/general/catalog/comite-catalog/dialogs/comite-dialog/comite-dialog.component';
import { ConsejoDialogComponent } from './pages/coordinator/general/catalog/consejo-catalog/dialogs/consejo-dialog/consejo-dialog.component';
import { CrearPropuestaTGDialogComponent } from './pages/coordinator/graduatework/proposals/dialogs/crear-propuesta-tgdialog/crear-propuesta-tgdialog.component';
import { ReviewerEvaluationComponent } from './pages/coordinator/graduatework/reviewer-evaluation/reviewer-evaluation.component';
import { ReviewerEvaluationDialogComponent } from './pages/coordinator/graduatework/reviewer-evaluation/reviewer-evaluation-dialog/reviewer-evaluation-dialog.component';
import { DesarrolloTGComponent } from './pages/coordinator/graduatework/desarrollo-tg/desarrollo-tg.component';
import { DesarrolloTgDialogComponent } from './pages/coordinator/graduatework/desarrollo-tg/desarrollo-tg-dialog/desarrollo-tg-dialog.component';
import { PresentacionComponent } from './pages/coordinator/graduatework/presentacion/presentacion.component';
import { PresentacionDialogComponent } from './pages/coordinator/graduatework/presentacion/presentacion-dialog/presentacion-dialog.component';
import { CompletionDialogComponent } from './pages/coordinator/graduatework/completion/completion-dialog/completion-dialog.component';
import { CompletadasComponent } from './pages/coordinator/graduatework/completadas/completadas.component';
import { AcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/academic-tutor-criteria.component';
import { EditAcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/dialogs/edit-academic-tutor-criteria/edit-academic-tutor-criteria.component';
import { EditAcademicTutorSeccionComponent } from './pages/coordinator/intership/academic-tutor-criteria/dialogs/edit-academic-tutor-seccion/edit-academic-tutor-seccion.component';
//import { AcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/academic-tutor-criteria.component';
//import { EditAcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/edit-academic-tutor-criteria/edit-academic-tutor-criteria.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CreateAcademicTutorCriteriaComponent } from './pages/coordinator/intership/academic-tutor-criteria/dialogs/create-academic-tutor-criteria/create-academic-tutor-criteria.component';
import { CreateAcademicTutorSeccionComponent } from './pages/coordinator/intership/academic-tutor-criteria/dialogs/create-academic-tutor-seccion/create-academic-tutor-seccion.component';
import { CreateCorporateTutorCriteriaComponent } from './pages/coordinator/intership/corporative-tutor-criteria/dialogs/create-corporate-tutor-criteria/create-corporate-tutor-criteria.component'; 
import { CreateCorporateTutorSeccionComponent } from './pages/coordinator/intership/corporative-tutor-criteria/dialogs/create-corporate-tutor-seccion/create-corporate-tutor-seccion.component';
import { CriteriosJuradoOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-oral/criterios-jurado-oral.component';
import { CriteriosJuradoEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-escrito/criterios-jurado-escrito.component';
import { CriteriosTutorEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-escrito/criterios-tutor-escrito.component';
import { CriteriosTutorOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-oral/criterios-tutor-oral.component';
import { CriteriosTutorEmpresarialComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-empresarial/criterios-tutor-empresarial.component';

import { CrearCriterioJuradoOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-oral/dialogs/crear-criterio-jurado-oral/crear-criterio-jurado-oral.component';
import { CrearSeccionJuradoOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-oral/dialogs/crear-seccion-jurado-oral/crear-seccion-jurado-oral.component';
import { EditarSeccionJuradoOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-oral/dialogs/editar-seccion-jurado-oral/editar-seccion-jurado-oral.component';
import { EditarCriterioJuradoOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-oral/dialogs/editar-criterio-jurado-oral/editar-criterio-jurado-oral.component';

import { CrearCriterioJuradoEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-escrito/dialogs/crear-criterio-jurado-escrito/crear-criterio-jurado-escrito.component';
import { CrearSeccionJuradoEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-escrito/dialogs/crear-seccion-jurado-escrito/crear-seccion-jurado-escrito.component';
import { EditarSeccionJuradoEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-escrito/dialogs/editar-seccion-jurado-escrito/editar-seccion-jurado-escrito.component';
import { EditarCriterioJuradoEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-jurado-escrito/dialogs/editar-criterio-jurado-escrito/editar-criterio-jurado-escrito.component';
import { CrearCriterioTutorEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-escrito/dialogs/crear-criterio-tutor-escrito/crear-criterio-tutor-escrito.component';
import { CrearSeccionTutorEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-escrito/dialogs/crear-seccion-tutor-escrito/crear-seccion-tutor-escrito.component';
import { EditarSeccionTutorEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-escrito/dialogs/editar-seccion-tutor-escrito/editar-seccion-tutor-escrito.component';
import { EditarCriterioTutorEscritoComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-escrito/dialogs/editar-criterio-tutor-escrito/editar-criterio-tutor-escrito.component';
import { EditarCriterioTutorOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-oral/dialogs/editar-criterio-tutor-oral/editar-criterio-tutor-oral.component';
import { CrearCriterioTutorOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-oral/dialogs/crear-criterio-tutor-oral/crear-criterio-tutor-oral.component';
import { CrearSeccionTutorOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-oral/dialogs/crear-seccion-tutor-oral/crear-seccion-tutor-oral.component';
import { EditarSeccionTutorOralComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-oral/dialogs/editar-seccion-tutor-oral/editar-seccion-tutor-oral.component';
import { CriteriosProfesorRevisorComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-profesor-revisor/criterios-profesor-revisor.component';
import { CrearCriterioProfesorRevisorComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-profesor-revisor/dialogs/crear-criterio-profesor-revisor/crear-criterio-profesor-revisor.component';
import { EditarCriterioProfesorRevisorComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-profesor-revisor/dialogs/editar-criterio-profesor-revisor/editar-criterio-profesor-revisor.component';
import { CrearCriterioTutorEmpresarialComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-empresarial/crear-criterio-tutor-empresarial/crear-criterio-tutor-empresarial.component';
import { EditarCriterioTutorEmpresarialComponent } from './pages/coordinator/graduatework/criterios-evaluacion/criterios-tutor-empresarial/editar-criterio-tutor-empresarial/editar-criterio-tutor-empresarial.component';
import { PantallaEvaluacionComponent } from './pages/coordinator/intership/pantalla-evaluacion/pantalla-evaluacion.component';
import { PantallaEvaluacionJuradoPresentacionComponent } from './pages/coordinator/graduatework/pantalla-evaluacion-jurado-presentacion/pantalla-evaluacion-jurado-presentacion.component';
import { PantallaEvaluacionJuradoEscritoComponent } from './pages/coordinator/graduatework/pantalla-evaluacion-jurado-escrito/pantalla-evaluacion-jurado-escrito.component';
import { GenerarPlanillaDatosTGComponent } from './pages/student/student-gw/generar-planilla-datos-tg/generar-planilla-datos-tg.component';
import { GenerarPlanillaDatosPComponent } from './pages/student/student-pasantia/generar-planilla-datos-p/generar-planilla-datos-p.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    GraduateworkComponent,
    ProposalsComponent,
    RegistrationComponent,
    StudentGWComponent,
    ValidationComponent,
    ReviewersComponent,
    JuryComponent,
    DefenseComponent,
    CompletionComponent,
    AssignmentComponent,
    ProfessorGWComponent,
    ProfessorReviewerComponent,
    ProfessorTutorComponent,
    ProfessorJuryComponent,
    DialogsComponent,
    CouncilComponent,
    DialogCouncilComponent,
    DialogTutorComponent,
    JuryDialogComponent,
    DefenseDialogComponent,
    ProfessorJuryDialogComponent,
    FilesComponent,
    ResubmittionComponent,
    EvaluationDialogComponent,
    OutsiderComponent,
    ExternalJuryComponent,
    ExternalTutorComponent,
    NotificacionTutorAcademicoComponent,
    NotificacionTutorEmpresarialComponent,
    PlanillaEvaluacionTutorEmpresarialComponent,
    PlanillaEvaluacionTutorAcademicoComponent,
    PropuestaPasantiaComponent,
    SidebarComponent,
    CorporativeTutorCriteriaComponent,
    EditCorporativeTutorCriteriaComponent,
    EditCorporativeTutorSeccionComponent,
    CreatePasantiaDialogComponent,
    EvaluatePasantiaDialogComponent,
    EvaluacionTutoresComponent,
    EntregaInformeFinalComponent,
    PasantiaCompletadaComponent,
    CargarEvaluacionesDialogComponent,
    EntregaInformeDialogComponent,
    DesarrolloPasantiaComponent,
    StudentPasantiaComponent,
    CatalogComponent,
    GeneralFilesComponent,
    ProfesorCatalogComponent,
    EmpresaCatalogComponent,
    ComiteCatalogComponent,
    ConsejoCatalogComponent,
    ProfesionalCatalogComponent,
    ProfesorDialogComponent,
    ProfesionalDialogComponent,
    EmpresaDialogComponent,
    ComiteDialogComponent,
    ConsejoDialogComponent,
    CrearPropuestaTGDialogComponent,
    ReviewerEvaluationComponent,
    ReviewerEvaluationDialogComponent,
    DesarrolloTGComponent,
    DesarrolloTgDialogComponent,
    PresentacionComponent,
    PresentacionDialogComponent,
    CompletionDialogComponent,
    CompletadasComponent,
    AcademicTutorCriteriaComponent,
    EditAcademicTutorCriteriaComponent,
    EditAcademicTutorSeccionComponent,
    CreateAcademicTutorCriteriaComponent,
    CreateAcademicTutorSeccionComponent,
    CreateCorporateTutorCriteriaComponent,
    CreateCorporateTutorSeccionComponent,
    CriteriosJuradoOralComponent,
    CriteriosJuradoEscritoComponent,
    CriteriosTutorEscritoComponent,
    CriteriosTutorOralComponent,
    CriteriosTutorEmpresarialComponent,
    CrearCriterioJuradoOralComponent,
    CrearSeccionJuradoOralComponent,
    EditarSeccionJuradoOralComponent,
    EditarCriterioJuradoOralComponent,
    CrearCriterioJuradoEscritoComponent,
    CrearSeccionJuradoEscritoComponent,
    EditarSeccionJuradoEscritoComponent,
    EditarCriterioJuradoEscritoComponent,
    CrearCriterioTutorEscritoComponent,
    CrearSeccionTutorEscritoComponent,
    EditarSeccionTutorEscritoComponent,
    EditarCriterioTutorEscritoComponent,
    EditarCriterioTutorOralComponent,
    CrearCriterioTutorOralComponent,
    CrearSeccionTutorOralComponent,
    EditarSeccionTutorOralComponent,
    CriteriosProfesorRevisorComponent,
    CrearCriterioProfesorRevisorComponent,
    EditarCriterioProfesorRevisorComponent,
    CrearCriterioTutorEmpresarialComponent,
    EditarCriterioTutorEmpresarialComponent,
    PantallaEvaluacionComponent,
    PantallaEvaluacionJuradoPresentacionComponent,
    PantallaEvaluacionJuradoEscritoComponent,
    GenerarPlanillaDatosTGComponent,
    GenerarPlanillaDatosPComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatDialogModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatTooltipModule,
    MatTreeModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
