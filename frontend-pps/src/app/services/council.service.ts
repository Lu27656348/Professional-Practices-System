import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateCouncilRequest } from '../interfaces/requests/CreateCouncilRequest';

@Injectable({
  providedIn: 'root'
})
export class CouncilService {

  constructor(private http: HttpClient) { }

  getCouncils():Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/councils`,{headers});
  }

  getCouncilsBySchool(schoolName: string):Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/councils/school/${schoolName}`,{headers});
  }

  getCouncilById( schoolCouncilId: string ) :Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(`${environment.apiUrl}/councils/${schoolCouncilId}`,{headers});
  }

  createCouncil(councilData: CreateCouncilRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(`${environment.apiUrl}/councils`,councilData,{headers});
  }

  updateCouncil(schoolCouncilId: string, councilData: CreateCouncilRequest){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put(`${environment.apiUrl}/councils/${schoolCouncilId}`,councilData,{headers});
  }

  deleteCouncilById(schoolCouncilId: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${environment.apiUrl}/councils/${schoolCouncilId}`,{headers});
  }

  cargarActaDeConsejo(schoolCouncilId: string, councilFile: File,escuela: string){
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData()
    formData.append('file', councilFile)
    formData.append('consejo', schoolCouncilId)
    formData.append('escuela', escuela)
    return this.http.post(`${environment.amazonS3}/upload/consejo`,formData,{headers});
  }


}
