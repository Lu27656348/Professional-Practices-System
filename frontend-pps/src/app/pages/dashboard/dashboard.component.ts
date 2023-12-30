import { Component,OnInit,AfterViewInit,Input, ViewChild  } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component'
import { NavbarService} from '../../services/navbar.service'
import { Subscription } from 'rxjs'

interface Role {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showFiller = false;
  baseUrl: string = "http://localhost:4200";
  isRoleSelected: boolean = false;

  dataBs: any;
  dataService$: Subscription = new Subscription();
  
  constructor(private loginService: LoginService,private router: Router,private userService: UsersService,private dataService: NavbarService){
    this.dataService.getData().subscribe({
      next: (data: any) => {
        this.isRoleSelected = data;
        console.log(this.dataBs)
      },
      error: (error: any) => {
        this.dataBs = '';
        console.log("error")
      }
    })
  }

  ngOnInit(){
  

  }


}
