import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../../services/login.service';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component'
import { NavbarService } from 'src/app/services/navbar.service';

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-graduatework',
  templateUrl: './graduatework.component.html',
  styleUrls: ['./graduatework.component.css']
})


export class GraduateworkComponent implements OnInit{

  roleSelected: any;
  localUser: any;
  data: any = null;
  isRoleSelected: boolean = false;
  roles: string[] = [];
  userName: String = '';
  user: any = {};

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  

  constructor(private loginService: LoginService,private router: Router,private userService: UsersService, private navbarService: NavbarService){
    this.navbarService.changeIsDashBoard();

  }

  ngOnInit(){

    const userString = localStorage.getItem('user')
    const rolesString = localStorage.getItem('roles')
    if(userString && rolesString){
      console.log("LOCAL STORAGE")
      this.localUser = JSON.parse(userString);
      this.user = {...this.localUser.user}
      this.data = {...this.localUser.user}
      const rolesRequest = JSON.parse(rolesString);
      console.log(rolesRequest)
      for (let i = 0; i < rolesRequest.length; i++) {
        this.roles.push(rolesRequest[i]);
      }
      console.log( this.roles)
      this.roleSelected = this.userService.getMode();
      this.isRoleSelected = true;
      console.log(this.localUser.user);
    }else{
      this.router.navigateByUrl("");
    }
  }

  goBack(){
    this.router.navigateByUrl("/dashboard");
  }

}
