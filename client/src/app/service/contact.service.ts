import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactDTO } from '../models/contact';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  createContact(contact : ContactDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ContactSvc/CreateContact`, {Contact : contact});
  }

  UpdateContact(contact : ContactDTO): Observable<any> {
    return this.http.put(`${environment.apiUrl}/ContactSvc/UpdateContact`, {Contact : contact});
  }

  getContactById(Username : string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ContactSvc/getByUsername`, {username : Username});
  }
}
