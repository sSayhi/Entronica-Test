import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { SkillDto } from '../models/skill';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private http: HttpClient) {}

  createSkillInfo(Skill: SkillDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/SkillSvc/CreateSkill`, {Skills : Skill});
  }

  getSkilById(Username: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/SkillSvc/getByUsername`, { UserId : Username });
  }
}
