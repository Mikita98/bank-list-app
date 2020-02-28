import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IClient} from '../interfaces/clients.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly BASE_URL = 'https://bank-list-app.herokuapp.com';

  constructor(private readonly http: HttpClient) { }

  getClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.BASE_URL);
  }

  createClient(data: IClient): Observable<IClient> {
    return this.http.post<IClient>(this.BASE_URL, data);
  }

  deleteClient(clientId: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${clientId}`);
  }

  updateClient(clientId: string, data: IClient): Observable<IClient> {
    return this.http.put<IClient>(`${this.BASE_URL}/${clientId}`, { data });
  }
}
