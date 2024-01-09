import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError, switchMap, catchError  } from "rxjs";
import { UsersService } from './users.service'
import { CreateStudentRequest } from '../interfaces/CreateStudentRequest';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient, private userService: UsersService) { }

  isProcessActive(userDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/graduate-work/validate/user/${userDNI}`,{headers});
  }
  
  createStudent(createStudentRequest: CreateStudentRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8081/students`,createStudentRequest,{headers});
  }

  createProposal(data:any):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`http://localhost:8081/graduate-work/create/proposal`,data,{headers});
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

  upload(file: File, studentDNI: string) : Observable<any> {
    
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);

    console.log(file.name)
    console.log(this.validateProposalFileName(file.name))

    return this.userService.getUserData(studentDNI).pipe(
      switchMap((data: any) => {
        const formattedFileName = `${data.userLastName.split(" ")[0]}${data.userFirstName.split(" ")[0]} PTG.pdf`;
        console.log(formattedFileName)
        if (file.name === formattedFileName && this.validateProposalFileName(file.name)) {
            return this.http.post(`http://localhost:8082/upload`, formData, { headers });
        } else {
          alert("EL ARCHIVO No cumple con el nombre requerido...");
          return throwError(new Error("No cumple con el nombre requerido..."));
        }
      }),
      catchError((error) => {
        return throwError(new Error("No se pudo obtener la información del usuario"));
      })
    );
  }

uploadGraduateWorkFile(file: File, studentDNI: string) : Observable<any> {

  const headers = new HttpHeaders();
  headers.append('Access-Control-Allow-Origin', '*');
  const formData = new FormData();
  formData.append('file', file);

  return this.userService.getUserData(studentDNI).pipe(
    switchMap((data: any) => {
      const formattedFileName = `${data.userLastName}${data.userFirstName} TG.pdf`;
      if (file.name === formattedFileName && this.validateGraduateWorkFileName(file.name)) {
          return this.http.post(`http://localhost:8082/upload/graduatework`, formData, { headers });
      } else {
        alert("EL ARCHIVO No cumple con el nombre requerido...");
        return throwError(new Error("No cumple con el nombre requerido..."));
      }
    }),
    catchError((error) => {
      return throwError(new Error("No se pudo obtener la información del usuario"));
    })
  );
}
  getStudentGraduateWork(studentDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/students/graduate-work/${studentDNI}`,{headers});
  }

  getStudentCoordinator(studentDNI: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`http://localhost:8081/students/coordinator/${studentDNI}`,{headers});
  }

}
