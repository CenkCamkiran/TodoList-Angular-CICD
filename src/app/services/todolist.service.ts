import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { tap, map, catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { URLModel } from '../models/URLModels/URLModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodolistService {
  URLModel: URLModel = new URLModel();

  constructor(private httpClient: HttpClient) {}

  public AddNewTodoItem(Description: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'body',
    };
    return this.httpClient
      .post<any>(
        environment.PostTodoUrl,
        { Description: Description },
        httpOptions
      )
      .pipe(
        map((response) => {
          return response.body;
        }),
        retry(5),
        catchError(this.errorHandel)
      );
  }

  public GetTodoList(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'body',
    };
    return this.httpClient.get<any>(environment.GetTodoUrl, httpOptions).pipe(
      map((response) => {
        return response.body;
      }),
      retry(5),
      catchError(this.errorHandel)
    );
  }

  errorHandel(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError({
      status: error.status,
      message: error.message,
    } as HttpErrorResponse);
  }
}
