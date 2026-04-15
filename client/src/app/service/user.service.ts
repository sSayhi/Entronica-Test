import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { UserDTO } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUserProfile(file : FormData ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/UserSvc/CreateProfile`, file);
  }

  editUserProfile(file : FormData ): Observable<any> {
    return this.http.put(`${environment.apiUrl}/UserSvc/UpdateProfile`, file);
  }

  getListData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/UserSvc/GetList`);
  }

  getByUsername(Username : string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/UserSvc/getByUsername`,{username : Username});
  }
  
}
