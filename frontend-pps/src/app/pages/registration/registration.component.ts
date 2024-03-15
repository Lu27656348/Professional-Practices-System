import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription,forkJoin,of,pipe,switchMap  } from 'rxjs';

import { RegisterService } from '../../services/register.service'
import { SchoolService } from 'src/app/services/school.service';
import { StudentService } from 'src/app/services/student.service';
import { ProfessorsService } from 'src/app/services/professors.service';

import { RegisterRequest } from '../../interfaces/RegisterRequest'
import { CreateUserRequest } from 'src/app/interfaces/requests/CreateUserRequest';
import { UsersService } from 'src/app/services/users.service';
import { CreateStudentRequest } from 'src/app/interfaces/CreateStudentRequest';

import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { CreateExternalRequest } from 'src/app/interfaces/requests/CreateExternalRequest';
import { ExternalPersonnelService } from 'src/app/services/external-personnel.service';
import { createProfessorRequest } from 'src/app/interfaces/CreateProfessorRequest';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  formatSelected: string = "V-";
  hide = true;
  hideConfirmation = true;
  dataBs: any;
  dataService$: Subscription = new Subscription();

  isNextStep : boolean = false;
  formCase : string = "";

  schoolNameSelected: any = null;
  schoolList: any = null;

  enterpriseList: any = [];
  enterpriseSelected: any = null;

  selectedDateVar: any = null
  selectedDateValue: any = null;

  emailFormatSelected: string | null = "@est.ucab.edu.ve";

  myForm = new FormGroup({
    date: new FormControl()
  });

  semesterList: string[] = [
    "Primero",
    "Segundo",
    "Tercero",
    "Cuarto",
    "Quinto",
    "Sexto",
    "Septimo",
    "Octavo",
    "Noveno",
    "Decimo"
  ];
  semesterSelected: any = null;

  registerForm = this.formBuilder.group({
    userDNI: ['',[Validators.required,Validators.pattern(/^[0-9]+$/)]],
    password: ['',Validators.required],
    passwordConfirmation: ['',Validators.required],
    userphone: ['',Validators.required],
    userfirstname: ['',Validators.required],
    userlastname: ['',Validators.required],
    useremailucab: ['',Validators.required]
  })

  studentForm = this.formBuilder.group({
    studentSchoolName: ['',[Validators.required]],
    studentSemester: ['',Validators.required],
    studentAddress: ['',Validators.required],
    studentOffice: ['',Validators.required]
  })

  professorForm = this.formBuilder.group({
    professorSchoolName: ['',[Validators.required]],
    professorWorkExperience: ['',Validators.required],
    professorAddress: ['',Validators.required],
    professorOffice: ['',Validators.required]
  })

  externalForm = this.formBuilder.group({
    externalPersonnelEnterpriseId: ['',[Validators.required]],
    externalPersonnelProfession: ['',[Validators.required]],
    externalPersonnelOffice: ['',Validators.required],
    externalPersonnelAddress: ['',Validators.required],
    externalPersonnelWorkExperience: ['',Validators.required]
  })

  constructor(private formBuilder: FormBuilder, private router: Router, private registerService: RegisterService, private schoolService: SchoolService,private studentService: StudentService, private professorService: ProfessorsService,private userService: UsersService, private _snackBar: MatSnackBar, private enterpriseService: EnterpriseService, private externalService: ExternalPersonnelService){}

  ngOnInit(): void {

    this.enterpriseService.getEnterprises().subscribe({
      next: (enterpriseListData) => {
        console.log(enterpriseListData)
        this.enterpriseList = enterpriseListData
      }
    })

    this.schoolService.getSchools().subscribe({
      next: (schoolListData) => {
        console.log(schoolListData)
        this.schoolList = schoolListData
      }
    })
    
  }

  validateEmail(email: string) : string {
    const regex = /@(.*)/;
    const match = email.match(regex);
    const domain = match?.[1];
    return (domain != null ) ? domain : '';
  }

  registerStudent(){
    if(this.registerForm.valid && this.studentForm.valid){

      const body = this.registerForm.value;
      const studentBody = this.studentForm.value
      body.userDNI = this.formatSelected + body.userDNI

      const userData: CreateUserRequest = {
        userDNI: body.userDNI,
	      userPassword: body.password as string, 
	      userFirstName: body.userfirstname as string,
	      userLastName: body.userlastname as string,
	      userEmail: body.useremailucab as string + this.emailFormatSelected as string,
	      userPhone: body.userphone as string,
	      userEmailAlt: null,
        schoolName: studentBody.studentSchoolName as string
      }

      const studentData: CreateStudentRequest = {
        "studentDNI": body.userDNI as string,
        "studentSchoolName": studentBody.studentSchoolName as string,
        "studentSemester": studentBody.studentSemester as string,
        "studentAddress": studentBody.studentAddress as string ,
        "studentOffice": studentBody.studentOffice as string
      }

      console.log(body);
      console.log(studentBody);

      this.userService.createUser(userData as CreateUserRequest).pipe(
        switchMap( (userData) => {
          console.log(userData)
          return this.studentService.createStudent(studentData)
        }),
      )
      .subscribe({
        next: (studentData) => {
          console.log(studentData)
          this.registerForm.reset();
          this.studentForm.reset();
        },
        error: (errorData) => {
          this._snackBar.open(errorData, 'Cerrar', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        complete: () => {
          this.router.navigateByUrl("login");
        }
      });
      
    }
  }

  registerProfessor(){

    if(this.registerForm.valid && this.professorForm.valid){

      const body = this.registerForm.value;
      const professorBody = this.professorForm.value

      const userData: CreateUserRequest = {
        userDNI: this.formatSelected+body.userDNI as string,
	      userPassword: body.password as string, 
	      userFirstName: body.userfirstname as string,
	      userLastName: body.userlastname as string,
	      userEmail: body.useremailucab as string + this.emailFormatSelected as string,
	      userPhone: body.userphone as string,
	      userEmailAlt: null,
        schoolName: professorBody.professorSchoolName as string
      }
      
      const professorData: createProfessorRequest = {
        "professorDNI": userData.userDNI,
        "professorSchoolName": professorBody.professorSchoolName as string,
        "professorProfession": "Regular",
        "professorOffice": professorBody.professorOffice as string ,
        "professorWorkExperience": professorBody.professorWorkExperience as string,
        "professorGraduationYear": this.myForm.value.date as Date,
      }
      
      body.userDNI = this.formatSelected + body.userDNI
      body.useremailucab = body.useremailucab as string + this.emailFormatSelected as string

      console.log(body);
      console.log(professorBody);
      console.log(this.myForm.value.date)

      this.userService.createUser(userData as CreateUserRequest).pipe(
        switchMap( (userData) => {
          console.log(userData)
          return this.professorService.createProfessors(professorData)
        })
      ).subscribe({
        next: (professorData) => {
          console.log(professorData)
          this.registerForm.reset();
          this.studentForm.reset();
          this.router.navigateByUrl("login");
        },
        error: (errorData) => {
          console.log("error")
        }
      });
    }
  }

  registerExternal(){
    if(this.registerForm.valid && this.externalForm.valid){
      const body = this.registerForm.value;
      const externalBody = this.externalForm.value
      console.log(body)
      console.log(externalBody)

      const userData: CreateUserRequest = {
        userDNI: this.formatSelected + body.userDNI as string,
	      userPassword: body.password as string, 
	      userFirstName: body.userfirstname as string,
	      userLastName: body.userlastname as string,
	      userEmail: body.useremailucab as string + this.emailFormatSelected,
	      userPhone: body.userphone as string,
	      userEmailAlt: null,
        schoolName: "Ing. Informatica"
      }
      
      const externalData: CreateExternalRequest = {
        externalPersonnelDNI: this.formatSelected + body.userDNI as string,
        externalPersonnelEnterpriseId: parseInt(externalBody.externalPersonnelEnterpriseId as string),
        externalPersonnelProfession: externalBody.externalPersonnelProfession as string,
        externalPersonnelOffice: externalBody.externalPersonnelOffice as string,
        externalPersonnelGraduationYear: this.myForm.value.date as string,
        externalPersonnelWorkExperience: externalBody.externalPersonnelWorkExperience as string
      }

      this.userService.createUser(userData as CreateUserRequest).pipe(
        switchMap( (userData) => {
          console.log(userData)
          return this.externalService.createExternal(externalData)
        })
      )
      .subscribe({
        next: (externalData) => {
          console.log(externalData)
          this.registerForm.reset();
          this.studentForm.reset();
        },
        error: (errorData) => {
          this._snackBar.open(errorData, 'Cerrar', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        complete: () => {
          this.router.navigateByUrl("login");
        }
      });

      
    }
  }
  selectedDate(date: any) {
    console.log("Selected date:", date.target);
    console.log("Selected date:", this.selectedDateValue);
    console.log(this.myForm.value.date)
    // Store the date for later use
    this.selectedDateValue = this.myForm.value.date;
  }

  nextStep(){
    console.log("nextStep()")
    if(this.registerForm.valid){
      const body = this.registerForm.value;
      console.log(body);
      if(body.useremailucab){
        console.log(body.useremailucab+this.emailFormatSelected)
        this.formCase = 'Student'
        /*
        switch (this.validateEmail(body.useremailucab+this.emailFormatSelected)) {
          case 'gmail.com':
            console.log("crear usuario foraneo")
            this.formCase = 'External'
            break;
          case 'ucab.edu.ve':
            console.log("crear usuario profesor")
            this.formCase = 'Professor'
            break;
          case 'est.ucab.edu.ve':
            console.log("crear usuario estudiante")
            this.formCase = 'Student'
            break; 
          default:
            console.log("Error en tipo de usuario")
            break;
        }
        */
         
      }
      
      /*
    
      */
    }
    this.isNextStep = true;

  }
}
