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

//import { GraduateworkComponent } from './pages/student/graduatework/graduatework.component';
import { IntershipComponent } from './pages/student/intership/intership.component';
import { CommunitaryserviceComponent } from './pages/student/communitaryservice/communitaryservice.component'; 

import { GraduateworkComponent } from './pages/coordinator/graduatework/graduatework.component';
import { ProposalsComponent } from './pages/coordinator/graduatework/proposals/proposals.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    GraduateworkComponent,
    IntershipComponent,
    CommunitaryserviceComponent,
    ProposalsComponent,
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
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
