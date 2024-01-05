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


import { ProfessorGWComponent } from './pages/professor/professor-gw/professor-gw.component'
import { ProfessorReviewerComponent } from './pages/professor/graduatework/professor-reviewer/professor-reviewer.component'
import { ProfessorJuryComponent } from './pages/professor/graduatework/professor-jury/professor-jury.component'
import { ProfessorTutorComponent } from './pages/professor/graduatework/professor-tutor/professor-tutor.component'


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
    path: "graduate-work/professor",
    component: ProfessorGWComponent 
  },
  {
    path: "graduate-work/professorReviewer",
    component: ProfessorReviewerComponent 
  },
  {
    path: "graduate-work/tutor",
    component: ProfessorTutorComponent 
  },
  {
    path: "graduate-work/jury",
    component: ProfessorJuryComponent 
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
    path: "graduate-work/council",
    component: CouncilComponent
  },
  {
    path: "graduate-work/juries",
    component: JuryComponent
  },
  {
    path: "graduate-work/completion",
    component: CompletionComponent
  },
  {
    path: "graduate-work/defenses",
    component: DefenseComponent
  },
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
