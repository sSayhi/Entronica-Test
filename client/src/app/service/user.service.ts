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
    const form = new FormData();
    // files.forEach((f) => form.append('files', f, f.name));
    // const body = {Ticket : Ticket,DatetimeLog : DatetimeLog ,files : form}
    return this.http.post(`${environment.apiUrl}/UserSvc/CreateProfile`, file);
  }

  getListData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/UserSvc/GetList`);
  }

  getByUsername(Username : string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/UserSvc/getByUsername`,{username : Username});
  }
  
}
