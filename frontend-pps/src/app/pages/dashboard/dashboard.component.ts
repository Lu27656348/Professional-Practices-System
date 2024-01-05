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

  roleSelected: string = '';

  dataBs: any;
  dataService$: Subscription = new Subscription();
  
  constructor(private loginService: LoginService,private router: Router,private userService: UsersService,private dataService: NavbarService){
    
    this.dataService.getData().subscribe({
      next: (data: any) => {
        this.isRoleSelected = data;
      },
      error: (error: any) => {
        console.log("error")
      }

      });

      this.dataService.getRole().subscribe({
        next: (data: any) => {
          console.log(data);
          this.roleSelected = data;
        },
        error: (error: any) => {
          console.log("error")
        }
      });

      if (this.roleSelected == '' ){
        console.log("No se ha selecccionado un rol")
      }else{
        console.log("Se selecciono el rol ")
      }

    };

    ngOnInit(){
  
    }

    navigateToGraduateWork(){
      console.log(this.roleSelected)
      this.router.navigateByUrl(`graduate-work/${this.roleSelected.toLowerCase()}`);
    }
    
}
