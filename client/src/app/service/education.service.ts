import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { EducationDTO } from '../models/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  constructor(private http: HttpClient) { }

  createEducation(education: EducationDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/EducationSvc/CreateEducation`, { Education : education });
  }

  updateEducation(education: EducationDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/EducationSvc/UpdateEducation`, education);
  }

  getEducationById(Username: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/EducationSvc/getByUsername`, { UserId : Username });
  }
}
