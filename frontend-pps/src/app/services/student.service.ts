import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, switchMap, catchError,of  } from "rxjs";
import { UsersService } from './users.service'
import { CreateStudentRequest } from '../interfaces/CreateStudentRequest';
import { environment } from 'src/environments/environment';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  firstStudentData: any = null;
  secondStudentData: any = null;

  constructor(private http: HttpClient, private userService: UsersService, private documentService: DocumentService) { }

  isProcessActive(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/graduate-work/validate/user/${userDNI}`,{headers});
  }
  
  getStudents() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/students`,{headers});
  }

  getStudentsData() : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/students/list/data`,{headers});
  }

  getStudentsDataExceptOne ( studentDNI: string ) : Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/students/list/data/except/${studentDNI}`,{headers});
  }
  createStudent(createStudentRequest: CreateStudentRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/students`,createStudentRequest,{headers});
  }

  createProposal(data:any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/graduate-work/create/proposal`,data,{headers});
  }

  validateProposalFileName(fileName: string) : Boolean {
    const fileNameWithOutExtension = fileName.slice(0, fileName.lastIndexOf('.pdf'));
    const regexValidator = /^[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+(\s?[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+)?\s(PTG)$/;
    return regexValidator.test(fileNameWithOutExtension);
  }

  validateGraduateWorkFileName(fileName: string) : Boolean {
    const fileNameWithOutExtension = fileName.slice(0, fileName.lastIndexOf('.pdf'));
    const regexValidator = /^[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+(\s?[A-Z]{1}[a-z]+[A-Z]{1}[a-z]+)?\s(TG)$/;
    return regexValidator.test(fileNameWithOutExtension);
  }

  upload(file: File, studentDNI: string, studentDNI2: string | null = null) : Observable<any>{


    if(file){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');

      const params = new HttpParams();


      if(file.type === "application/pdf"){
        if(studentDNI2 === null){
          return this.userService.getUserData(studentDNI).pipe(
            switchMap(
              (data: any) => {
                this.firstStudentData = data

                return of(data)
              }
            ),
            switchMap((data: any) => {
              const formattedFileName = `${data.userLastName.split(" ")[0]}${data.userFirstName.split(" ")[0]} PTG.pdf`;
              console.log(formattedFileName)
              return this.documentService.copyFileAndRename(file,formattedFileName);
  
            }),
            switchMap((newFile: any) => {
              console.log(newFile)
              
              const formData = new FormData();
              formData.append('file', newFile);
              formData.append('userData', JSON.stringify({
                studentDNI: this.firstStudentData.userDNI,
                userFirstName: this.firstStudentData.userFirstName,
                userLastName: this.firstStudentData.userLastName
              }));

              return this.http.post(`${environment.amazonS3}/upload`, formData, { headers });
              
            }),
            catchError((error) => {
              return throwError( () => new Error("No pudo obtener la informacion de usuario"))
            })
  
          )
        }else{
          return this.userService.getUserData(studentDNI).pipe(
            switchMap(
              (firstStudentData: any) => {
                this.firstStudentData = firstStudentData
                return this.userService.getUserData(studentDNI2)
              }
            ),
            switchMap(
              (secondStudentData: any) => {
                this.secondStudentData = secondStudentData
                const formattedFileName = `${this.firstStudentData.userLastName.split(" ")[0]}${this.firstStudentData.userFirstName.split(" ")[0]} ${this.secondStudentData.userLastName.split(" ")[0]}${this.secondStudentData.userFirstName.split(" ")[0]} PTG.pdf`;
                return this.documentService.copyFileAndRename(file,formattedFileName);
              }
            ),
            switchMap((newFile: any) => {
              console.log(newFile)

              const formData = new FormData();
              const userData = [
                {
                  studentDNI: this.firstStudentData.userDNI,
                  userFirstName:  this.firstStudentData.userFirstName.split(" ")[0],
                  userLastName: this.firstStudentData.userLastName.split(" ")[0]
                },
                {
                  studentDNI: this.secondStudentData.userDNI,
                  userFirstName:  this.secondStudentData.userFirstName.split(" ")[0],
                  userLastName: this.secondStudentData.userLastName.split(" ")[0]
                },
            ]
              formData.append('file', newFile);
              formData.append('userData', JSON.stringify(userData)); // Append user data (optional)

        
              return this.http.post(`${environment.amazonS3}/upload/double`, formData, { headers: headers});
            })
          )
          return throwError( () => new Error("Modo de dos usuario no implementado"))
        }
        
      }else{
        return throwError( () => new Error("El archivo debe ser en formato PDF"))
      }
      /*
      if(studentDNI2 === null){
        
        return of(null);
      }else{
        return throwError( () => new Error("Modo con dos estudiantes no implementado"))
      }
      */
    }else{
      return throwError( () => new Error("No cargo un archivo"))
    }


    
   /*
    if(file.type === "application/pdf"){
      const headers = new HttpHeaders();
      headers.append('Access-Control-Allow-Origin', '*');

      if(studentDNI2 === null){

        this.userService.getUserData(studentDNI).pipe(

          switchMap((data: any) => {
            const formattedFileName = `${data.userLastName.split(" ")[0]}${data.userFirstName.split(" ")[0]} PTG.pdf`;
            console.log(formattedFileName)
            return this.documentService.copyFileAndRename(file,formattedFileName);

          }),
          switchMap((newFile: any) => {
            console.log(newFile)
            
            const formData = new FormData();
            formData.append('file', newFile);
            return this.http.post(`${environment.amazonS3}/upload`, formData, { headers });
            
          }),
          catchError((error) => {
            return throwError( () => new Error("No pudo obtener la informacion de usuario"))
          })

        );

      }else{
        return of(null)
      }
      


    }else{
      return throwError( () => new Error("El formato del archivo debe ser PDF"))
    }
    */
    /*
    
    */
    /*
    let formattedFileName;
    let firstStudent : any;
    return this.userService.getUserData(studentDNI).pipe(
      switchMap((data: any) => {
        firstStudent = data
        return this.userService.getUserData(studentDNI2)
      }),
      switchMap((data: any) => {
        let secondStudent = data;
        formattedFileName = `${firstStudent.userLastName.split(" ")[0]}${firstStudent.userFirstName.split(" ")[0]} ${secondStudent.userLastName.split(" ")[0]}${secondStudent.userFirstName.split(" ")[0]} PTG.pdf`;
        console.log(formattedFileName)
        if (file.name === formattedFileName && this.validateProposalFileName(file.name)) {
            return this.http.post(`${environment.amazonS3}/upload`, formData, { headers });
        } else {
          alert("EL ARCHIVO No cumple con el nombre requerido...");
          return throwError(new Error("No cumple con el nombre requerido..."));
        }
      }),
      catchError((error) => {
        return throwError(new Error("No se pudo obtener la información del usuario"));
      })
    );
    */

  }

uploadGraduateWorkFile(file: File, studentData: any) : Observable<any> {

  const headers = new HttpHeaders();
  headers.append('Access-Control-Allow-Origin', '*');
  const formData = new FormData();
  console.log(studentData)
  formData.append('file', file);
  formData.append('studentData', JSON.stringify(studentData));
  return this.http.post(`${environment.amazonS3}/upload/graduatework`, formData, { headers });
}
  getStudentGraduateWork(studentDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/students/graduate-work/${studentDNI}`,{headers});
  }

  getStudentCoordinator(studentDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/students/coordinator/${studentDNI}`,{headers});
  }

}
