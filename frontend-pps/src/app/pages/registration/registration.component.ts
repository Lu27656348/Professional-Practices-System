import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { Subscription,forkJoin,of,pipe,switchMap  } from 'rxjs';

import { RegisterService } from '../../services/register.service'
import { SchoolService } from 'src/app/services/school.service';
import { StudentService } from 'src/app/services/student.service';
import { ProfessorsService } from 'src/app/services/professors.service';

import { RegisterRequest } from '../../interfaces/RegisterRequest'



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  dataBs: any;
  dataService$: Subscription = new Subscription();

  isNextStep : boolean = false;
  formCase : string = "";

  schoolNameSelected: any = null;
  schoolList: any = null;

  selectedDateVar: any = null
  selectedDateValue: any = null;

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
    userDNI: ['',[Validators.required]],
    password: ['',Validators.required],
    userfirstname: ['',Validators.required],
    userlastname: ['',Validators.required],
    useremailucab: ['',Validators.required],
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
    userDNI: ['',[Validators.required]],
    password: ['',Validators.required],
    userfirstname: ['',Validators.required],
    userlastname: ['',Validators.required],
    useremailucab: ['',Validators.required],
  })

  constructor(private formBuilder: FormBuilder, private router: Router, private registerService: RegisterService, private schoolService: SchoolService,private studentService: StudentService, private professorService: ProfessorsService){}

  ngOnInit(): void {

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

  register(){
    console.log("Registrando")
    if(this.registerForm.valid){
      const body = this.registerForm.value;
      console.log(body);
      if(body.useremailucab){
        switch (this.validateEmail(body.useremailucab)) {
          case 'gmail.com':
            console.log("crear usuario foraneo")
            this.formCase = "External"
            break;
          case 'ucab.edu.ve':
            console.log("crear usuario profesor")
            this.formCase = "Professor"
            break;
          case 'est.ucab.edu.ve':
            console.log("crear usuario estudiante")
            this.formCase = "Student"
            break; 
          default:
            console.log("Error en tipo de usuario")
            break;
        }
        
        this.registerService.registration(body as RegisterRequest).subscribe({
          next: (userData) => {
            console.log("next")
            console.log(userData)
            this.router.navigateByUrl("login");
            this.registerForm.reset();
          },
          error: (errorData) => {
            console.log("error")
          }
        });
        

        
      }
      
      /*
    
      */
    }
  }

  registerStudent(){
    if(this.registerForm.valid && this.studentForm.valid){
      const body = this.registerForm.value;
      const studentBody = this.studentForm.value
      console.log(body);
      console.log(studentBody);

      this.registerService.registration(body as RegisterRequest).pipe(
        switchMap( (userData) => {
          console.log(userData)
          return this.studentService.createStudent({
            "studentDNI": userData.userDNI,
            "studentSchoolName": studentBody.studentSchoolName as string,
            "studentSemester": studentBody.studentSemester as string,
            "studentAddress": studentBody.studentAddress as string ,
            "studentOffice": studentBody.studentOffice as string
          })
        }),
      )
      .subscribe({
        next: (studentData) => {
          console.log(studentData)
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

  registerProfessor(){
    if(this.registerForm.valid && this.professorForm.valid){
      const body = this.registerForm.value;
      const professorBody = this.professorForm.value
      console.log(body);
      console.log(professorBody);
      console.log(this.myForm.value.date)

      this.registerService.registration(body as RegisterRequest).pipe(
        switchMap( (userData) => {
          console.log(userData)
          return this.professorService.createProfessors({
            "professorDNI": userData.userDNI,
            "professorSchoolName": professorBody.professorSchoolName as string,
            "professorProfession": "Regular",
            "professorOffice": professorBody.professorOffice as string ,
            "professorWorkExperience": professorBody.professorWorkExperience as string,
            "professorGraduationYear": this.myForm.value.date as Date,
          })
        }),
      )
      .subscribe({
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
        switch (this.validateEmail(body.useremailucab)) {
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
         
      }
      
      /*
    
      */
    }
    this.isNextStep = true;

  }
}
