import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select'; 
import {MatSidenavModule} from '@angular/material/sidenav'; 
import {MatCardModule} from '@angular/material/card'; 

@Component({
  selector: 'app-graduatework',
  templateUrl: './graduatework.component.html',
  styleUrls: ['./graduatework.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,MatSelectModule,MatSidenavModule,MatCardModule],
})
export class GraduateworkComponent {

}
