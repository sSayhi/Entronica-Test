import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExperienceDTO } from '../models/experience';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor(private http: HttpClient) { }

  createExperience(education: ExperienceDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ExperienceSvc/CreateExperience`, { Experience: education });
  }

  deleteExperience(education: ExperienceDTO): Observable<any> {
    return this.http.put(`${environment.apiUrl}/ExperienceSvc/DeleteExperience`, {Experience : education});
  }

  getExperienceById(Username: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ExperienceSvc/getByUsername`, { UserId : Username });
  }
}
