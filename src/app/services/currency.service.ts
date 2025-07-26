import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// The interface now uses the modern `Record<string, number>` syntax
export interface ExchangeRatesResponse {
  base_code: string;
  rates: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://open.er-api.com/v6/latest/';

  getRates(base: string): Observable<ExchangeRatesResponse> {
    return this.http.get<ExchangeRatesResponse>(`${this.apiUrl}${base}`);
  }
}