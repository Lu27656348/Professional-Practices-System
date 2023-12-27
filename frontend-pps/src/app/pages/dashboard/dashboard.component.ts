import { Component,OnInit } from '@angular/core';
interface Role {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  showFiller = false;
  isRoleSelected: boolean = false;
  roleSelected: any;
  roles: Role[] = [
    {value: 'Coordinator', viewValue: 'Coordinator'},
    {value: 'Student', viewValue: 'Student'},
    {value: 'Professor', viewValue: 'Professor'},
  ];
  

  ngOnInit(){
    this.roleSelected = null;
    this.isRoleSelected = this.roleSelected != null;
  }

  onSelectionChange(){
    this.isRoleSelected = true;
  }
}
