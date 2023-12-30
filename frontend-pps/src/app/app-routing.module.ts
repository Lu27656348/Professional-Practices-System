import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./pages/login/login.component"
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { GraduateworkComponent } from './pages/coordinator/graduatework/graduatework.component'
import { ProposalsComponent } from './pages/coordinator/graduatework/proposals/proposals.component'

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: "full"
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "graduate-work",
    component: GraduateworkComponent
  },
  {
    path: "graduate-work/proposals",
    component: ProposalsComponent
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
