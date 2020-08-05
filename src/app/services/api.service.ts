import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Conversation } from '../model';
import { Observable } from 'rxjs';
export interface Request {
  body?: any,
  params?: any
}
const API = 'http://localhost:3001/';

@Injectable({ providedIn: 'root' })
export class APIService {

  constructor(
    private http: HttpClient
  ) {
  }

  joinApp(request: Request) {
    return this.http.put(`${API}user`, request.body);
  }

  listUsers(request: Request) {
    return this.http.get(`${API}user`, request.body);
  }

  initiateConversation(request: Request) {
    return this.http.post(`${API}conversation`, request.body);
  }

  conversations(request: Request ) {
    return this.http.get(`${API}conversation`, request);
  }

  messages(request: Request ) {
    return this.http.get(`${API}message/${request.params._id}`, request);
  }
}
