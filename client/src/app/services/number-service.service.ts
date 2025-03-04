import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NumberResponse } from '../models/number-response.model';

@Injectable({
  providedIn: 'root'
})
export class NumberService {
  private apiUrl = 'https://localhost:7195/api/NumberValidation';
 
  constructor(private http: HttpClient) { }
  
  checkNumber(value: string): Observable<NumberResponse> {
    const startTime = performance.now();
    
    console.log(`API call started at: ${new Date().toISOString()}`);
    
    const request = this.http.post<NumberResponse>(`${this.apiUrl}/check`, { value });
    
    request.subscribe({
      next: () => {
        console.log(`API call completed in ${performance.now() - startTime}ms`);
      },
      error: (error) => {
        console.error(`API call failed in ${performance.now() - startTime}ms`);
        console.error(error);
      }
    });
    
    return request;
  }
}