import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,of } from "rxjs";
import { environment } from 'src/environments/environment';
import { ResponseBlob } from '../interfaces/ResponseBlob';

async function downloadFile(fileName: string) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/root`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName })
    } as RequestInit);

    const blob = await (response as ResponseBlob<Blob>).blob(); // Type assertion for blobBody
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Set desired filename
    link.click();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

async function downloadProposalEvaluationFile(fileName: string) {
  try {
    const response = await fetch(`${environment.amazonS3}/download/proposal/evaluation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName: fileName })
    } as RequestInit);

    const blob = await (response as ResponseBlob<Blob>).blob(); // Type assertion for blobBody
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Set desired filename
    link.click();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  downloadFileFromRoot(fileName: string) : Observable<any> {
    return of(downloadFile(fileName));
  }

  downloadFileProposalEvaluation(fileName: string) : Observable<any> {
    downloadProposalEvaluationFile(fileName)
    return of("exito")
    
  }

  copyFileAndRename(file: File, newName: string): Observable<File> {
    return new Observable((observer) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const newFile = new File([arrayBuffer], newName, { type: file.type });
        observer.next(newFile);
        observer.complete();
      };
  
      reader.onerror = (error) => {
        observer.error(error);
      };
  
      reader.readAsArrayBuffer(file);
    });
  }


}
