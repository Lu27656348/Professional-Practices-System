import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor(private httpClient: HttpClient) {}

  findImage(imageName: string): Observable<ArrayBuffer> {
    const url = `../../../assets/${imageName}`;
    return this.httpClient.get(url, { responseType: "arraybuffer" }).pipe(
      catchError((error) => of(null, error)),
      map((buffer) => (buffer ? buffer : null)) // handle null response in case of error
    );
  }
}
