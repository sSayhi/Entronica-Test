import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interestsDTO } from '../models/interests';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class InterestsService {

  constructor(private http: HttpClient) { }

  createInterest(interest : interestsDTO,): Observable<any> {
    return this.http.post(`${environment.apiUrl}/InterestsSvc/CreateInterests`, { Interests: interest });
  }

  deleteInterest(interest : interestsDTO): Observable<any> {
    return this.http.put(`${environment.apiUrl}/InterestsSvc/deleteInterests`, { Interests: interest });
  }

  getExperienceById(Username: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/InterestsSvc/getByUsername`, { UserId: Username });
  }
}
