import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap, Observable, forkJoin } from 'rxjs';
import { EvaluationFormGeneratorService } from 'src/app/form-generator/services/evaluation-form-generator.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { ProfessorsService } from 'src/app/services/professors.service';
import { RegisterService } from 'src/app/services/register.service';
import { SchoolService } from 'src/app/services/school.service';
import { StudentService } from 'src/app/services/student.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-generar-planilla-datos-p',
  templateUrl: './generar-planilla-datos-p.component.html',
  styleUrls: ['./generar-planilla-datos-p.component.css']
})
export class GenerarPlanillaDatosPComponent {

  empresaList: any = null;
  externalList: any = null;
  enterpriseSelected: boolean = false
  empresaSelected : any = null;
  userData: any = null;

  enterpriseData: any = null;
  externalPersonnelData: any = null;

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private professorService: ProfessorsService,
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private enterpriseService: EnterpriseService,
    private externalService: ExternalPersonnelService,
    private formService: EvaluationFormGeneratorService
  ){
    const localUser = localStorage.getItem('user')
    if(localUser){
      const localUserData = JSON.parse(localUser)
      console.log(localUserData)
      this.userService.getUserData(localUserData.userDNI).subscribe({
        next: (userData) => {
          this.userData = userData
        }
      })
    }
    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseList) => {
        console.log(enterpriseList)
        this.empresaList = enterpriseList
      }
    })

  }

  pasantiaForm = this.formBuilder.group({
    empresaId: ['',Validators.required],
    tutorEmpresarialId: ['',Validators.required],
    fechaInicio: [new Date(),Validators.required],
    fechaFinal: [new Date(),Validators.required]
  })

  onSelectionChange(){
    this.externalService.getExternalPersonnelByEnterpriseId(this.empresaSelected).pipe(
      switchMap(
        (externalList) => {
          console.log(externalList)
          const observables: Observable<any>[] = []
          externalList.forEach( (external: any) => {
            observables.push(this.userService.getUserData(external.externalPersonnelDNI))
          })
          return forkJoin(observables)
        }
      )
      
    ).subscribe({
      next: (externalList) => {
        console.log(externalList)
        this.externalList = externalList
      }
    })
  }

  generarPlanilla(){
    if(this.pasantiaForm.valid){
      console.log("generarPlanilla()")
      console.log(this.pasantiaForm.value)

      this.externalList.forEach ( (tutorEmpresarial : any ) => {
        if(tutorEmpresarial.userDNI == this.pasantiaForm.value.tutorEmpresarialId){
          this.externalPersonnelData = tutorEmpresarial
        }
      })

      this.empresaList.forEach( (empresa : any ) => {
        if( empresa.enterpriseid == this.pasantiaForm.value.empresaId ){
          this.enterpriseData = empresa
        }
      })

      console.log( this.enterpriseData)
      console.log(this.externalPersonnelData)

      const datosAlumno = {
        nombreCompleto: this.userData.userLastName + ", " + this.userData.userFirstName,
        cedula: this.userData.userDNI,
        celular: this.userData.userPhone,
        habitacion: this.userData.userPhone,
        correo: this.userData.userEmail
      }
      const datosEmpresa = {
          nombre: this.enterpriseData.enterpriseName,
          RIF: this.enterpriseData.enterpriseid,
          direccion: this.enterpriseData.enterpriseAddress,
          telefono: this.enterpriseData.enterpriseDescription,
      }
      const datosTutorEmpresarial = {
          nombreCompleto: this.externalPersonnelData.userLastName + ", " + this.externalPersonnelData.userFirstName,
          cedula: this.externalPersonnelData.userDNI,
          celular: this.externalPersonnelData.userPhone,
          correo: this.externalPersonnelData.userEmail,
          profesorUCAB: false,
          esTutor: false
      }

      //const fechaInicio: Date = this.parseVenezuelaDate(this.pasantiaForm.value.fechaInicio as string)
      //const fechaFinal: Date = this.parseVenezuelaDate(this.pasantiaForm.value.fechaFinal as string)

      const fechaInicio = `${this.pasantiaForm.value.fechaInicio?.getDate()} / ${this.pasantiaForm.value.fechaInicio?.getMonth()} / ${this.pasantiaForm.value.fechaInicio?.getFullYear()}`;
      const fechaFinal = `${this.pasantiaForm.value.fechaFinal?.getDate()} / ${this.pasantiaForm.value.fechaFinal?.getMonth()} / ${this.pasantiaForm.value.fechaFinal?.getFullYear()}`;

      console.log(fechaInicio)
      console.log(fechaFinal)

      console.log(typeof fechaInicio)
      console.log(typeof fechaFinal)

      this.formService.printEvaluationForm(
        this.formService.generarPlanillaDatosPasantia(
          datosAlumno,
          datosEmpresa,
          datosTutorEmpresarial,
          fechaInicio,
          fechaFinal
        ),
        "Planilla de Datos de Pasantía"
      )
    }else{
      this._snackBar.open("Debe seleccionar todos los datos","cerrar", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }
    
  }

  parseVenezuelaDate(dateString: string): Date {
    // Split the string into components
    console.log(dateString)
    console.log(typeof dateString)
    const parts = dateString.split(" ");
  
    // Extract year, month (adjust for zero-based indexing), and day
    const year = parseInt(parts[3], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
  
    // Create a Date object with extracted values
    const date = new Date(year, month, day);
  
    // Adjust for Venezuela Timezone offset (GMT-4)
    date.setHours(date.getHours() - 4);
  
    return date;
  }
}
