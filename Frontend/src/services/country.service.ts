import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countriesUrl = 'https://api.countrystatecity.in/v1/countries';
  private citiesUrl = 'https://api.countrystatecity.in/v1';
  private apiKey = 'c2tUWDUzY1I0M0xMclFHc3NxNnlYVGFUUUZjT0tia1NXRDdVZU5QcA==';

  private countriesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private citiesCache = new Map<string, any[]>();
  public countries$: Observable<any[]> = this.countriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any[]> {
    if (this.countriesSubject.getValue().length > 0) {
     
      return this.countries$;
    } else {
    
      return this.http.get<any[]>(this.countriesUrl, {
        headers: { 'X-CSCAPI-KEY': this.apiKey }
      }).pipe(
        tap(data => this.countriesSubject.next(data))
      );
    }
  }

  getCities(countryIso: string): Observable<any[]> {
    if (this.citiesCache.has(countryIso)) {

      return of(this.citiesCache.get(countryIso)!);
    } else {
      const headers = new HttpHeaders().set('X-CSCAPI-KEY', this.apiKey);
      return this.http.get<any[]>(`${this.citiesUrl}/countries/${countryIso}/cities`, { headers })
        .pipe(tap(cities => this.citiesCache.set(countryIso, cities)));
    }
  }
  
}

